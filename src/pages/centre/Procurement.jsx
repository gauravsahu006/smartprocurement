import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Droplets,
  Scale,
  Search,
  UserRound,
  CreditCard,
  CircleDollarSign,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

const steps = [
  {
    id: "weighing",
    title: "Weighing",
    description: "Enter actual procured quantity",
  },
  {
    id: "quality",
    title: "Quality Check",
    description: "Check moisture and quality",
  },
  {
    id: "payment",
    title: "Payment",
    description: "Create and confirm payment",
  },
  {
    id: "complete",
    title: "Complete",
    description: "Complete procurement",
  },
];

// =========================================================
// INDIA DATE
// =========================================================

function getIndiaDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(new Date());
}

// =========================================================
// INDIA DAY -> UTC RANGE
// =========================================================

function getIndiaDayUtcRange() {
  const indiaDate = getIndiaDate();

  const start = new Date(
    `${indiaDate}T00:00:00+05:30`
  );

  const end = new Date(
    `${indiaDate}T23:59:59.999+05:30`
  );

  return {
    indiaDate,
    startUtc: start.toISOString(),
    endUtc: end.toISOString(),
  };
}

// =========================================================
// STEP
// =========================================================

function getStepFromProcurement(status, payment) {
  const normalizedStatus = status?.toLowerCase();

  switch (normalizedStatus) {
    case "processing":
    case "weighing":
      return "weighing";

    case "quality_check":
    case "quality":
      return "quality";

    case "accepted":
    case "payment":
      return payment?.status === "successful"
        ? "complete"
        : "payment";

    case "completed":
    case "rejected":
      return "complete";

    default:
      return "weighing";
  }
}

// =========================================================
// MAIN COMPONENT
// =========================================================

function Procurement() {
  const [farmers, setFarmers] = useState([]);
  const [selectedFarmer, setSelectedFarmer] =
    useState(null);

  const [search, setSearch] = useState("");
  const [activeStep, setActiveStep] =
    useState("weighing");

  const [actualQuantity, setActualQuantity] =
    useState("");

  const [moisture, setMoisture] =
    useState("");

  const [quality, setQuality] =
    useState("good");

  const [remarks, setRemarks] =
    useState("");

  const [rate, setRate] = useState("");

  const [payment, setPayment] =
    useState(null);

  const [transactionId, setTransactionId] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [todayBookings, setTodayBookings] =
    useState([]);

  // =========================================================
  // STEP ACCESS
  // =========================================================

  const getCurrentStepIndex = () => {
    if (!selectedFarmer) return 0;

    const status = selectedFarmer.status?.toLowerCase();

    if (status === "processing" || status === "weighing") {
      return 0;
    }

    if (status === "quality_check" || status === "quality") {
      return 1;
    }

    if (status === "accepted" || status === "payment") {
      return payment?.status === "successful" ? 3 : 2;
    }

    if (status === "completed" || status === "rejected") {
      return 3;
    }

    return 0;
  };

  const canOpenStep = (stepId) => {
    if (!selectedFarmer) return false;

    const stepIndex = steps.findIndex(
      (step) => step.id === stepId
    );

    return stepIndex <= getCurrentStepIndex();
  };

  // =========================================================
  // FETCH PROCUREMENT DATA
  // =========================================================

  const fetchProcurements = async (
    preserveSelectedId = null
  ) => {
    try {
      setLoading(true);
      setError("");

      // -------------------------------------------------------
      // GET LOGGED IN STAFF
      // -------------------------------------------------------

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        throw new Error(
          "Centre staff is not logged in."
        );
      }

      console.log(
        "Procurement staff:",
        user
      );

      // -------------------------------------------------------
      // GET STAFF ASSIGNMENT
      // -------------------------------------------------------

      const {
        data: staffAssignment,
        error: staffError,
      } = await supabase
        .from("centre_staff")
        .select("centre_id")
        .eq("user_id", user.id)
        .single();

      if (staffError) {
        throw staffError;
      }

      if (!staffAssignment?.centre_id) {
        throw new Error(
          "Staff is not assigned to any centre."
        );
      }

      const centreId =
        staffAssignment.centre_id;

      console.log(
        "Procurement staff centre:",
        centreId
      );

      // -------------------------------------------------------
      // INDIA DATE + UTC RANGE
      // -------------------------------------------------------

      const {
        indiaDate,
        startUtc,
        endUtc,
      } = getIndiaDayUtcRange();

      console.log(
        "Procurement today India:",
        indiaDate
      );

      console.log(
        "Procurement UTC range:",
        startUtc,
        endUtc
      );

      // =======================================================
      // TODAY'S BOOKINGS
      // =======================================================

      const {
        data: bookingData,
        error: bookingError,
      } = await supabase
        .from("bookings")
        .select(`
          id,
          farmer_id,
          centre_id,
          slot_id,
          crop_id,
          token_number,
          status,
          booking_date,
          created_at
        `)
        .eq("centre_id", centreId)
        .eq("booking_date", indiaDate)
        .order("token_number", {
          ascending: true,
        });

      if (bookingError) {
        throw bookingError;
      }

      console.log(
        "Today's centre bookings:",
        bookingData
      );

      setTodayBookings(
        bookingData || []
      );

      // =======================================================
      // TODAY'S PROCUREMENTS
      // =======================================================

      const {
        data: procurementData,
        error: procurementError,
      } = await supabase
        .from("procurements")
        .select("*")
        .eq("centre_id", centreId)
        .gte("created_at", startUtc)
        .lt("created_at", endUtc)
        .order("created_at", {
          ascending: false,
        });

      if (procurementError) {
        throw procurementError;
      }

      console.log(
        "Today's procurements:",
        procurementData
      );

      // =======================================================
      // NO PROCUREMENT
      // =======================================================

      if (
        !procurementData ||
        procurementData.length === 0
      ) {
        console.log(
          "Bookings exist, but no procurement has started yet."
        );

        setFarmers([]);
        setSelectedFarmer(null);
        setPayment(null);
        setActualQuantity("");
        setRate("");
        setMoisture("");
        setRemarks("");
        setTransactionId("");
        setActiveStep("weighing");

        return;
      }

      // =======================================================
      // COLLECT IDS
      // =======================================================

      const farmerIds = [
        ...new Set(
          procurementData
            .map(
              (item) => item.farmer_id
            )
            .filter(Boolean)
        ),
      ];

      const cropIds = [
        ...new Set(
          procurementData
            .map(
              (item) => item.crop_id
            )
            .filter(Boolean)
        ),
      ];

      const bookingIds = [
        ...new Set(
          procurementData
            .map(
              (item) => item.booking_id
            )
            .filter(Boolean)
        ),
      ];

      const procurementIds =
        procurementData.map(
          (item) => item.id
        );

      // =======================================================
      // PROFILES
      // =======================================================

      let profileData = [];

      if (farmerIds.length > 0) {
        const {
          data,
          error,
        } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", farmerIds);

        if (error) {
          console.error(
            "Profile fetch error:",
            error
          );
        } else {
          profileData = data || [];
        }
      }

      // =======================================================
      // CROPS
      // =======================================================

      let cropData = [];

      if (cropIds.length > 0) {
        const {
          data,
          error,
        } = await supabase
          .from("crops")
          .select("id, name")
          .in("id", cropIds);

        if (error) {
          console.error(
            "Crop fetch error:",
            error
          );
        } else {
          cropData = data || [];
        }
      }

      // =======================================================
      // BOOKINGS
      // =======================================================

      let selectedBookingData = [];

      if (bookingIds.length > 0) {
        const {
          data,
          error,
        } = await supabase
          .from("bookings")
          .select(`
            id,
            token_number,
            booking_date,
            status
          `)
          .in("id", bookingIds);

        if (error) {
          console.error(
            "Booking fetch error:",
            error
          );
        } else {
          selectedBookingData =
            data || [];
        }
      }

      // =======================================================
      // WEIGHMENTS
      // =======================================================

      let weighmentData = [];

      if (procurementIds.length > 0) {
        const {
          data,
          error,
        } = await supabase
          .from("weighments")
          .select("*")
          .in(
            "procurement_id",
            procurementIds
          )
          .order("weighed_at", {
            ascending: false,
          });

        if (error) {
          console.error(
            "Weighment fetch error:",
            error
          );
        } else {
          weighmentData =
            data || [];
        }
      }

      // =======================================================
      // QUALITY
      // =======================================================

      let qualityData = [];

      if (procurementIds.length > 0) {
        const {
          data,
          error,
        } = await supabase
          .from("quality_checks")
          .select("*")
          .in(
            "procurement_id",
            procurementIds
          )
          .order("checked_at", {
            ascending: false,
          });

        if (error) {
          console.error(
            "Quality fetch error:",
            error
          );
        } else {
          qualityData =
            data || [];
        }
      }

      // =======================================================
      // PAYMENTS
      // =======================================================

      let paymentData = [];

      if (procurementIds.length > 0) {
        const {
          data,
          error,
        } = await supabase
          .from("payments")
          .select("*")
          .in(
            "procurement_id",
            procurementIds
          )
          .order("created_at", {
            ascending: false,
          });

        if (error) {
          console.error(
            "Payment fetch error:",
            error
          );
        } else {
          paymentData =
            data || [];
        }
      }

      // =======================================================
      // ENRICH DATA
      // =======================================================

      const enriched =
        procurementData.map(
          (procurement) => {
            const profile =
              profileData.find(
                (item) =>
                  item.id ===
                  procurement.farmer_id
              );

            const crop =
              cropData.find(
                (item) =>
                  item.id ===
                  procurement.crop_id
              );

            const booking =
              selectedBookingData.find(
                (item) =>
                  item.id ===
                  procurement.booking_id
              );

            const weighment =
              weighmentData.find(
                (item) =>
                  item.procurement_id ===
                  procurement.id
              );

            const qualityCheck =
              qualityData.find(
                (item) =>
                  item.procurement_id ===
                  procurement.id
              );

            const paymentRecord =
              paymentData.find(
                (item) =>
                  item.procurement_id ===
                  procurement.id
              );

            return {
              ...procurement,

              token:
                booking?.token_number
                  ? `#${booking.token_number}`
                  : `#${procurement.id}`,

              farmer:
                profile?.full_name ||
                "Unknown Farmer",

              crop:
                crop?.name ||
                "Unknown Crop",

              quantity: Number(
                weighment?.quantity ??
                  paymentRecord?.quantity ??
                  0
              ),

              bookedQuantity: Number(
                weighment?.quantity ??
                  paymentRecord?.quantity ??
                  0
              ),

              currentQuantity: Number(
                weighment?.quantity ??
                  paymentRecord?.quantity ??
                  0
              ),

              rate: Number(
                paymentRecord?.rate_per_quintal ??
                  0
              ),

              weighment:
                weighment || null,

              quality_check:
                qualityCheck || null,

              payment:
                paymentRecord || null,
            };
          }
        );

      console.log(
        "Enriched procurements:",
        enriched
      );

      setFarmers(enriched);

      // =======================================================
      // SELECT PROCUREMENT
      // =======================================================

      let selected = null;

      if (preserveSelectedId) {
        selected =
          enriched.find(
            (item) =>
              item.id ===
              preserveSelectedId
          );
      }

      if (
        !selected &&
        selectedFarmer?.id
      ) {
        selected =
          enriched.find(
            (item) =>
              item.id ===
              selectedFarmer.id
          );
      }

      if (!selected) {
        selected =
          enriched.find(
            (item) =>
              item.status === "processing" ||
              item.status === "weighing"
          ) ||
          enriched.find(
            (item) =>
              item.status ===
              "quality_check"
          ) ||
          enriched.find(
            (item) =>
              item.status ===
              "accepted"
          ) ||
          enriched.find(
            (item) =>
              item.status ===
              "completed"
          ) ||
          enriched[0];
      }

      if (selected) {
        setSelectedFarmer(
          selected
        );

        // -----------------------------------------------------
        // WEIGHMENT
        // -----------------------------------------------------

        setActualQuantity(
          selected.quantity
            ? String(
                selected.quantity
              )
            : ""
        );

        // -----------------------------------------------------
        // QUALITY
        // -----------------------------------------------------

        if (
          selected.quality_check
        ) {
          setMoisture(
            selected
              .quality_check
              .moisture != null
              ? String(
                  selected
                    .quality_check
                    .moisture
                )
              : ""
          );

          setQuality(
            selected
              .quality_check
              .quality ||
              "good"
          );

          setRemarks(
            selected
              .quality_check
              .remarks ||
              ""
          );
        } else {
          setMoisture("");
          setQuality("good");
          setRemarks("");
        }

        // -----------------------------------------------------
        // PAYMENT
        // -----------------------------------------------------

        setRate(
          selected.rate
            ? String(
                selected.rate
              )
            : ""
        );

        setPayment(
          selected.payment ||
            null
        );

        setTransactionId(
          selected.payment
            ?.transaction_id ||
            ""
        );

        // -----------------------------------------------------
        // STEP
        // -----------------------------------------------------

        setActiveStep(
          getStepFromProcurement(
            selected.status,
            selected.payment
          )
        );
      }
    } catch (err) {
      console.error(
        "Procurement fetch error:",
        err
      );

      setError(
        err.message ||
          "Failed to load procurement data."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchProcurements();
  }, []);

  // =========================================================
  // FILTER
  // =========================================================

  const filteredFarmers =
    useMemo(() => {
      const value =
        search
          .toLowerCase()
          .trim();

      if (!value) {
        return farmers;
      }

      return farmers.filter(
        (farmer) =>
          farmer.farmer
            ?.toLowerCase()
            .includes(value) ||
          farmer.token
            ?.toLowerCase()
            .includes(value) ||
          farmer.crop
            ?.toLowerCase()
            .includes(value)
      );
    }, [farmers, search]);

  // =========================================================
  // SELECT FARMER
  // =========================================================

  const selectFarmer = (
    farmer
  ) => {
    setSelectedFarmer(
      farmer
    );

    setActualQuantity(
      farmer.quantity
        ? String(
            farmer.quantity
          )
        : ""
    );

    setRate(
      farmer.rate
        ? String(farmer.rate)
        : ""
    );

    if (
      farmer.quality_check
    ) {
      setMoisture(
        farmer
          .quality_check
          .moisture != null
          ? String(
              farmer
                .quality_check
                .moisture
            )
          : ""
      );

      setQuality(
        farmer
          .quality_check
          .quality ||
          "good"
      );

      setRemarks(
        farmer
          .quality_check
          .remarks ||
          ""
      );
    } else {
      setMoisture("");
      setQuality("good");
      setRemarks("");
    }

    setPayment(
      farmer.payment ||
        null
    );

    setTransactionId(
      farmer.payment
        ?.transaction_id ||
        ""
    );

    setMessage("");
    setError("");

    setActiveStep(
      getStepFromProcurement(
        farmer.status,
        farmer.payment
      )
    );
  };

  // =========================================================
  // 1. WEIGHMENT
  // =========================================================

  const completeWeighing =
    async () => {
      if (!selectedFarmer) {
        setError(
          "Please select a farmer."
        );
        return;
      }

      const weighingStage =
        selectedFarmer.status === "processing" ||
        selectedFarmer.status === "weighing";

      if (!weighingStage) {
        setError(
          `Weighment is not available. Current procurement stage: ${selectedFarmer.status}.`
        );
        return;
      }

      if (
        !actualQuantity ||
        Number(actualQuantity) <= 0
      ) {
        setError(
          "Please enter a valid quantity."
        );
        return;
      }

      try {
        setActionLoading(true);
        setError("");
        setMessage("");

        console.log(
          "Recording weighment:",
          selectedFarmer.id,
          actualQuantity
        );

        const {
          data,
          error: rpcError,
        } = await supabase.rpc(
          "record_weighment",
          {
            p_procurement_id:
              selectedFarmer.id,

            p_quantity:
              Number(
                actualQuantity
              ),

            p_unit:
              "quintal",

            p_notes:
              "Recorded from Centre Procurement Panel",
          }
        );

        if (rpcError) {
          throw rpcError;
        }

        console.log(
          "Weighment result:",
          data
        );

        setMessage(
          "Weighment completed successfully."
        );

        await fetchProcurements(
          selectedFarmer.id
        );
      } catch (err) {
        console.error(
          "Weighment failed:",
          err
        );

        setError(
          err.message ||
            "Failed to record weighment."
        );
      } finally {
        setActionLoading(false);
      }
    };

  // =========================================================
  // 2. QUALITY
  // =========================================================

  const completeQualityCheck =
    async () => {
      if (!selectedFarmer) {
        setError(
          "Please select a farmer."
        );
        return;
      }

      const qualityStage =
        selectedFarmer.status === "quality_check" ||
        selectedFarmer.status === "quality";

      if (!qualityStage) {
        setError(
          `Quality check is not available. Current procurement stage: ${selectedFarmer.status}.`
        );
        return;
      }

      if (
        moisture === "" ||
        Number(moisture) < 0 ||
        Number(moisture) > 100
      ) {
        setError(
          "Please enter valid moisture between 0 and 100."
        );
        return;
      }

      if (!quality) {
        setError(
          "Please select a quality."
        );
        return;
      }

      try {
        setActionLoading(true);
        setError("");
        setMessage("");

        const {
          data,
          error: rpcError,
        } = await supabase.rpc(
          "record_quality_check",
          {
            p_procurement_id:
              selectedFarmer.id,

            p_quality:
              quality,

            p_moisture:
              Number(moisture),

            p_remarks:
              remarks ||
              "Quality checked from Centre Procurement Panel",
          }
        );

        if (rpcError) {
          throw rpcError;
        }

        console.log(
          "Quality result:",
          data
        );

        setMessage(
          "Quality check completed successfully."
        );

        await fetchProcurements(
          selectedFarmer.id
        );
      } catch (err) {
        console.error(
          "Quality check failed:",
          err
        );

        setError(
          err.message ||
            "Failed to record quality check."
        );
      } finally {
        setActionLoading(false);
      }
    };

  // =========================================================
  // 3. CREATE PAYMENT
  // =========================================================

  const createPayment =
    async () => {
      if (!selectedFarmer) {
        setError(
          "Please select a farmer."
        );
        return;
      }

      if (
        selectedFarmer.status !==
        "accepted"
      ) {
        setError(
          `Payment is not available. Current procurement stage: ${selectedFarmer.status}.`
        );
        return;
      }

      if (
        !actualQuantity ||
        Number(actualQuantity) <= 0
      ) {
        setError(
          "Valid quantity is required before payment."
        );
        return;
      }

      if (
        !rate ||
        Number(rate) <= 0
      ) {
        setError(
          "Please enter a valid rate per quintal."
        );
        return;
      }

      try {
        setActionLoading(true);
        setError("");
        setMessage("");

        console.log(
          "Creating payment:",
          selectedFarmer.id,
          rate
        );

        const {
          data,
          error: rpcError,
        } = await supabase.rpc(
          "create_payment",
          {
            p_procurement_id:
              selectedFarmer.id,

            p_rate_per_quintal:
              Number(rate),
          }
        );

        if (rpcError) {
          throw rpcError;
        }

        console.log(
          "Payment created:",
          data
        );

        const paymentData =
          Array.isArray(data)
            ? data[0]
            : data;

        setPayment(
          paymentData || null
        );

        setMessage(
          "Payment created successfully."
        );

        await fetchProcurements(
          selectedFarmer.id
        );
      } catch (err) {
        console.error(
          "Payment creation failed:",
          err
        );

        setError(
          err.message ||
            "Failed to create payment."
        );
      } finally {
        setActionLoading(false);
      }
    };

  // =========================================================
  // 4. MARK PAYMENT SUCCESSFUL
  // =========================================================

  const markPaymentSuccessful =
    async () => {
      if (!payment?.id) {
        setError(
          "Payment record not found."
        );
        return;
      }

      if (
        !transactionId.trim()
      ) {
        setError(
          "Please enter a transaction ID."
        );
        return;
      }

      try {
        setActionLoading(true);
        setError("");
        setMessage("");

        console.log(
          "Marking payment successful:",
          payment.id,
          transactionId
        );

        const {
          data,
          error: rpcError,
        } = await supabase.rpc(
          "mark_payment_successful",
          {
            p_payment_id:
              payment.id,

            p_transaction_id:
              transactionId.trim(),
          }
        );

        if (rpcError) {
          throw rpcError;
        }

        console.log(
          "Payment successful result:",
          data
        );

        setMessage(
          "Payment marked as successful."
        );

        await fetchProcurements(
          selectedFarmer.id
        );
      } catch (err) {
        console.error(
          "Payment confirmation failed:",
          err
        );

        setError(
          err.message ||
            "Failed to confirm payment."
        );
      } finally {
        setActionLoading(false);
      }
    };

  // =========================================================
  // 5. COMPLETE PROCUREMENT
  // =========================================================

  const completeProcurement =
    async () => {
      if (!selectedFarmer) {
        setError(
          "Please select a farmer."
        );
        return;
      }

      if (
        selectedFarmer.status !==
        "accepted"
      ) {
        setError(
          `Procurement cannot be completed at the current stage: ${selectedFarmer.status}.`
        );
        return;
      }

      if (!payment?.id) {
        setError(
          "Payment record not found."
        );
        return;
      }

      if (
        payment.status !==
        "successful"
      ) {
        setError(
          "Payment must be successful before completing procurement."
        );
        return;
      }

      try {
        setActionLoading(true);
        setError("");
        setMessage("");

        console.log(
          "Completing procurement:",
          selectedFarmer.id
        );

        const {
          data,
          error: rpcError,
        } = await supabase.rpc(
          "complete_procurement",
          {
            p_procurement_id:
              selectedFarmer.id,
          }
        );

        if (rpcError) {
          throw rpcError;
        }

        console.log(
          "Complete procurement result:",
          data
        );

        setMessage(
          `Procurement completed for ${selectedFarmer.token}.`
        );

        await fetchProcurements(
          selectedFarmer.id
        );
      } catch (err) {
        console.error(
          "Complete procurement failed:",
          err
        );

        setError(
          err.message ||
            "Failed to complete procurement."
        );
      } finally {
        setActionLoading(false);
      }
    };

  // =========================================================
  // CALCULATIONS
  // =========================================================

  const totalAmount =
    Number(actualQuantity || 0) *
    Number(rate || 0);

  const completedCount =
    farmers.filter(
      (farmer) =>
        farmer.status ===
        "completed"
    ).length;

  const pendingCount =
    farmers.filter(
      (farmer) =>
        farmer.status !==
        "completed"
    ).length;

  const totalQuantity =
    farmers.reduce(
      (total, farmer) =>
        total +
        Number(
          farmer.quantity || 0
        ),
      0
    );

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-5 sm:px-6 lg:px-7">
        <h1 className="text-lg font-extrabold text-blue-950 sm:text-xl">
          Procurement
        </h1>

        <div className="mt-5 rounded-lg border border-slate-200 bg-white p-6 text-center text-xs text-slate-500">
          Loading procurement data...
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-5 sm:px-6 lg:px-7">

      {/* HEADER */}

      <div>
        <h1 className="text-lg font-extrabold text-blue-950 sm:text-xl">
          Procurement
        </h1>

        <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
          Manage weighing, quality, payment and procurement completion
        </p>
      </div>

      {/* ERROR */}

      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-[10px] font-semibold text-red-700">
          <span>{error}</span>

          <button
            onClick={() =>
              setError("")
            }
            className="ml-auto text-sm"
          >
            ×
          </button>
        </div>
      )}

      {/* SUCCESS */}

      {message && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-100 bg-green-50 px-4 py-3 text-[10px] font-semibold text-green-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />

          <span>{message}</span>

          <button
            onClick={() =>
              setMessage("")
            }
            className="ml-auto text-sm"
          >
            ×
          </button>
        </div>
      )}

      {/* =====================================================
          NO PROCUREMENT
          ===================================================== */}

      {farmers.length === 0 ? (
        <div className="mt-5">

          <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">

            <ClipboardCheck className="mx-auto h-8 w-8 text-slate-300" />

            <h2 className="mt-3 text-sm font-extrabold text-blue-950">
              No active procurements
            </h2>

            <p className="mx-auto mt-1 max-w-md text-[10px] leading-4 text-slate-500">
              Today's bookings are available,
              but procurement has not started yet.
              Call a farmer from Queue Management
              and press Start Processing.
            </p>

            {todayBookings.length > 0 && (
              <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-4">

                <p className="text-[9px] font-bold text-blue-900">
                  Today's Bookings
                </p>

                <div className="mt-3 space-y-2">

                  {todayBookings.map(
                    (booking) => (
                      <div
                        key={
                          booking.id
                        }
                        className="flex items-center justify-between rounded-md bg-white px-3 py-2"
                      >

                        <div className="flex items-center gap-2">

                          <span className="text-[10px] font-extrabold text-green-700">
                            #
                            {
                              booking.token_number
                            }
                          </span>

                          <span className="text-[9px] font-semibold text-blue-950">
                            Booking #
                            {
                              booking.id
                            }
                          </span>

                        </div>

                        <StatusBadge
                          status={
                            booking.status
                          }
                        />

                      </div>
                    )
                  )}

                </div>
              </div>
            )}

          </div>
        </div>
      ) : (
        <>
          {/* =================================================
              FARMER + PROCESS
              ================================================= */}

          <section className="mt-5 grid gap-4 lg:grid-cols-[0.85fr_1.65fr]">

            {/* FARMER LIST */}

            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <h2 className="text-[11px] font-extrabold text-blue-950">
                    Today's Farmers
                  </h2>

                  <p className="mt-0.5 text-[8px] text-slate-500">
                    Select a farmer to process
                  </p>
                </div>

                <UserRound className="h-4 w-4 text-green-700" />

              </div>

              {/* SEARCH */}

              <div className="relative mt-4">

                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search farmer or token..."
                  className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pl-9 pr-3 text-[9px] outline-none focus:border-green-600 focus:bg-white"
                />

              </div>

              {/* FARMERS */}

              <div className="mt-3 space-y-2">

                {filteredFarmers.map(
                  (farmer) => {
                    const isSelected =
                      selectedFarmer?.id ===
                      farmer.id;

                    return (
                      <button
                        key={
                          farmer.id
                        }
                        onClick={() =>
                          selectFarmer(
                            farmer
                          )
                        }
                        className={`w-full rounded-lg border p-3 text-left transition ${
                          isSelected
                            ? "border-green-300 bg-green-50"
                            : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"
                        }`}
                      >

                        <div className="flex items-center justify-between gap-2">

                          <div className="flex items-center gap-2">

                            <span className="text-[10px] font-extrabold text-green-700">
                              {
                                farmer.token
                              }
                            </span>

                            <span className="text-[9px] font-bold text-blue-950">
                              {
                                farmer.farmer
                              }
                            </span>

                          </div>

                          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />

                        </div>

                        <div className="mt-1 flex items-center justify-between">

                          <span className="text-[8px] text-slate-500">
                            {
                              farmer.crop
                            }
                          </span>

                          <StatusBadge
                            status={
                              farmer.status
                            }
                          />

                        </div>

                      </button>
                    );
                  }
                )}

              </div>
            </div>

            {/* =================================================
                PROCESS
                ================================================= */}

            {selectedFarmer && (
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">

                {/* SELECTED FARMER */}

                <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>

                    <div className="flex items-center gap-2">

                      <span className="rounded-md bg-green-50 px-2 py-1 text-[9px] font-extrabold text-green-700">
                        {
                          selectedFarmer.token
                        }
                      </span>

                      <h2 className="text-xs font-extrabold text-blue-950">
                        {
                          selectedFarmer.farmer
                        }
                      </h2>

                    </div>

                    <p className="mt-1 text-[9px] text-slate-500">
                      {
                        selectedFarmer.crop
                      }
                    </p>

                  </div>

                  <StatusBadge
                    status={
                      selectedFarmer.status
                    }
                  />

                </div>

                {/* STEPS */}

                <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">

                  {steps.map((step, index) => {
                    const currentIndex = getCurrentStepIndex();
                    const isActive = activeStep === step.id;
                    const isDone = index < currentIndex;
                    const isAccessible = canOpenStep(step.id);

                    return (
                      <button
                        key={step.id}
                        type="button"
                        disabled={!isAccessible}
                        onClick={() => {
                          if (!isAccessible) return;
                          setActiveStep(step.id);
                          setError("");
                          setMessage("");
                        }}
                        className={`relative rounded-lg border p-3 text-left transition ${
                          isActive
                            ? "border-green-300 bg-green-50 shadow-sm"
                            : isDone
                            ? "border-green-200 bg-green-50/50 hover:border-green-300"
                            : "border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed"
                        } ${
                          isAccessible && !isActive
                            ? "cursor-pointer hover:bg-green-50"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-extrabold ${
                              isActive || isDone
                                ? "bg-green-700 text-white"
                                : "bg-slate-200 text-slate-500"
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : (
                              index + 1
                            )}
                          </div>

                          <div className="min-w-0">
                            <p
                              className={`text-[8px] font-bold ${
                                isActive || isDone
                                  ? "text-green-700"
                                  : "text-slate-500"
                              }`}
                            >
                              {step.title}
                            </p>

                            <p className="mt-0.5 text-[7px] text-slate-400">
                              {step.description}
                            </p>
                          </div>
                        </div>

                        {isActive && (
                          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-green-600" />
                        )}
                      </button>
                    );
                  })}

                </div>

                {/* =================================================
                    WEIGHING
                    ================================================= */}

                {activeStep ===
                  "weighing" && (
                  <div className="mt-5">

                    <div className="flex items-center gap-2">

                      <Scale className="h-4 w-4 text-green-700" />

                      <div>

                        <h3 className="text-[11px] font-extrabold text-blue-950">
                          Weighing
                        </h3>

                        <p className="text-[8px] text-slate-500">
                          Enter the actual quantity received
                        </p>

                      </div>

                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">

                      <InfoBox
                        label="Farmer"
                        value={
                          selectedFarmer.farmer
                        }
                      />

                      <InfoBox
                        label="Crop"
                        value={
                          selectedFarmer.crop
                        }
                      />

                    </div>

                    <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">

                      <label className="text-[8px] font-semibold text-green-700">
                        Actual Quantity
                      </label>

                      <div className="relative mt-2">

                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={
                            actualQuantity
                          }
                          onChange={(
                            event
                          ) =>
                            setActualQuantity(
                              event.target
                                .value
                            )
                          }
                          className="h-10 w-full rounded-md border border-green-200 bg-white pr-12 pl-3 text-xs font-bold outline-none focus:border-green-600"
                        />

                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                          Qtl
                        </span>

                      </div>

                    </div>

                    <button
                      onClick={
                        completeWeighing
                      }
                      disabled={
                        actionLoading
                      }
                      className="mt-4 w-full rounded-md bg-green-700 py-2.5 text-[10px] font-bold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {actionLoading
                        ? "Saving..."
                        : "Confirm Weight"}
                    </button>

                  </div>
                )}

                {/* =================================================
                    QUALITY
                    ================================================= */}

                {activeStep ===
                  "quality" && (
                  <div className="mt-5">

                    <div className="flex items-center gap-2">

                      <ClipboardCheck className="h-4 w-4 text-green-700" />

                      <div>

                        <h3 className="text-[11px] font-extrabold text-blue-950">
                          Quality Check
                        </h3>

                        <p className="text-[8px] text-slate-500">
                          Verify moisture and quality
                        </p>

                      </div>

                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">

                      <div className="rounded-lg border border-slate-200 p-3">

                        <div className="flex items-center gap-2">

                          <Droplets className="h-4 w-4 text-blue-600" />

                          <label className="text-[9px] font-bold text-slate-600">
                            Moisture Percentage
                          </label>

                        </div>

                        <div className="relative mt-2">

                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="100"
                            value={
                              moisture
                            }
                            onChange={(
                              event
                            ) =>
                              setMoisture(
                                event.target
                                  .value
                              )
                            }
                            className="h-10 w-full rounded-md border border-slate-200 pr-8 pl-3 text-xs outline-none focus:border-green-600"
                          />

                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                            %
                          </span>

                        </div>

                      </div>

                      <div className="rounded-lg border border-slate-200 p-3">

                        <label className="text-[9px] font-bold text-slate-600">
                          Quality
                        </label>

                        <select
                          value={
                            quality
                          }
                          onChange={(
                            event
                          ) =>
                            setQuality(
                              event.target
                                .value
                            )
                          }
                          className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-xs outline-none focus:border-green-600"
                        >

                          <option value="good">
                            Good
                          </option>

                          <option value="average">
                            Average
                          </option>

                          <option value="poor">
                            Poor
                          </option>

                        </select>

                      </div>

                    </div>

                    <div className="mt-3">

                      <label className="text-[9px] font-bold text-slate-600">
                        Remarks
                      </label>

                      <textarea
                        value={
                          remarks
                        }
                        onChange={(
                          event
                        ) =>
                          setRemarks(
                            event.target
                              .value
                          )
                        }
                        rows={3}
                        placeholder="Enter quality remarks..."
                        className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-[9px] outline-none focus:border-green-600"
                      />

                    </div>

                    <div className="mt-4 rounded-lg bg-blue-50 p-3">

                      <p className="text-[8px] font-bold text-blue-900">
                        Quality Result
                      </p>

                      <p className="mt-1 text-[9px] text-blue-800">

                        {moisture === ""
                          ? "Enter moisture percentage to evaluate the quality."
                          : Number(
                              moisture
                            ) <= 13
                          ? "Moisture is within the preferred range."
                          : "Moisture is above the preferred range. Verify quality carefully."}

                      </p>

                    </div>

                    <button
                      onClick={
                        completeQualityCheck
                      }
                      disabled={
                        actionLoading
                      }
                      className="mt-4 w-full rounded-md bg-green-700 py-2.5 text-[10px] font-bold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {actionLoading
                        ? "Saving..."
                        : "Complete Quality Check"}
                    </button>

                  </div>
                )}

                {/* =================================================
                    PAYMENT
                    ================================================= */}

                {activeStep ===
                  "payment" && (
                  <div className="mt-5">

                    <div className="flex items-center gap-2">

                      <CreditCard className="h-4 w-4 text-green-700" />

                      <div>

                        <h3 className="text-[11px] font-extrabold text-blue-950">
                          Payment
                        </h3>

                        <p className="text-[8px] text-slate-500">
                          Create and confirm farmer payment
                        </p>

                      </div>

                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">

                      <InfoBox
                        label="Quantity"
                        value={`${actualQuantity} Qtl`}
                      />

                      <div className="rounded-lg border border-green-200 bg-green-50 p-3">

                        <label className="text-[8px] font-semibold text-green-700">
                          Rate per Quintal
                        </label>

                        <div className="relative mt-2">

                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                            ₹
                          </span>

                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={
                              rate
                            }
                            onChange={(
                              event
                            ) =>
                              setRate(
                                event.target
                                  .value
                              )
                            }
                            className="h-10 w-full rounded-md border border-green-200 bg-white pl-8 pr-3 text-xs font-bold outline-none focus:border-green-600"
                          />

                        </div>

                      </div>

                    </div>

                    <div className="mt-4 rounded-lg bg-green-50 p-4">

                      <div className="flex items-center gap-2">

                        <CircleDollarSign className="h-4 w-4 text-green-700" />

                        <p className="text-[8px] font-bold text-green-700">
                          Total Payment Amount
                        </p>

                      </div>

                      <p className="mt-1 text-2xl font-extrabold text-green-700">
                        ₹
                        {totalAmount.toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </p>

                    </div>

                    {!payment ? (
                      <button
                        onClick={
                          createPayment
                        }
                        disabled={
                          actionLoading
                        }
                        className="mt-4 w-full rounded-md bg-green-700 py-2.5 text-[10px] font-bold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        {actionLoading
                          ? "Creating Payment..."
                          : "Create Payment"}
                      </button>
                    ) : (
                      <div className="mt-4">

                        <div className="rounded-lg border border-green-200 bg-green-50 p-4">

                          <p className="text-[8px] font-bold text-green-700">
                            Payment Created
                          </p>

                          <p className="mt-1 text-[10px] font-extrabold text-blue-950">
                            Payment ID:{" "}
                            {
                              payment.id
                            }
                          </p>

                          <p className="mt-1 text-[9px] text-slate-600">
                            Quantity:{" "}
                            {Number(
                              payment.quantity ||
                                actualQuantity ||
                                0
                            )}{" "}
                            Qtl
                          </p>

                          <p className="mt-1 text-[9px] text-slate-600">
                            Rate: ₹
                            {Number(
                              payment.rate_per_quintal ||
                                rate ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}{" "}
                            / Qtl
                          </p>

                          <p className="mt-1 text-[9px] text-slate-600">
                            Amount: ₹
                            {Number(
                              payment.total_amount ||
                                totalAmount ||
                                0
                            ).toLocaleString(
                              "en-IN",
                              {
                                minimumFractionDigits: 2,
                              }
                            )}
                          </p>

                          <p className="mt-1 text-[9px] text-slate-600">
                            Status:{" "}
                            {
                              payment.status
                            }
                          </p>

                        </div>

                        {payment.status !==
                          "successful" && (
                          <>

                            <div className="mt-4">

                              <label className="text-[9px] font-bold text-slate-600">
                                Transaction ID
                              </label>

                              <input
                                type="text"
                                value={
                                  transactionId
                                }
                                onChange={(
                                  event
                                ) =>
                                  setTransactionId(
                                    event.target
                                      .value
                                  )
                                }
                                placeholder="e.g. TXN-001"
                                className="mt-2 h-10 w-full rounded-md border border-slate-200 px-3 text-xs outline-none focus:border-green-600"
                              />

                            </div>

                            <button
                              onClick={
                                markPaymentSuccessful
                              }
                              disabled={
                                actionLoading
                              }
                              className="mt-4 w-full rounded-md bg-green-700 py-2.5 text-[10px] font-bold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                              {actionLoading
                                ? "Confirming..."
                                : "Mark Payment Successful"}
                            </button>

                          </>
                        )}

                        {payment.status ===
                          "successful" && (
                          <div className="mt-4">

                            <div className="flex items-center justify-center gap-2 rounded-md bg-green-100 py-3 text-[10px] font-bold text-green-700">

                              <CheckCircle2 className="h-4 w-4" />

                              Payment Successful

                            </div>

                            <button
                              onClick={() =>
                                setActiveStep(
                                  "complete"
                                )
                              }
                              className="mt-4 w-full rounded-md bg-green-700 py-2.5 text-[10px] font-bold text-white hover:bg-green-800"
                            >
                              Continue to Complete Procurement
                            </button>

                          </div>
                        )}

                      </div>
                    )}

                  </div>
                )}

                {/* =================================================
                    COMPLETE
                    ================================================= */}

                {activeStep ===
                  "complete" && (
                  <div className="mt-5">

                    <div className="flex items-center gap-2">

                      <CheckCircle2 className="h-4 w-4 text-green-700" />

                      <div>

                        <h3 className="text-[11px] font-extrabold text-blue-950">
                          Complete Procurement
                        </h3>

                        <p className="text-[8px] text-slate-500">
                          Review final details
                        </p>

                      </div>

                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">

                      <InfoBox
                        label="Farmer"
                        value={
                          selectedFarmer.farmer
                        }
                      />

                      <InfoBox
                        label="Token"
                        value={
                          selectedFarmer.token
                        }
                      />

                      <InfoBox
                        label="Crop"
                        value={
                          selectedFarmer.crop
                        }
                      />

                      <InfoBox
                        label="Final Quantity"
                        value={
                          actualQuantity
                            ? `${actualQuantity} Quintal`
                            : "—"
                        }
                      />

                      <InfoBox
                        label="Quality"
                        value={
                          quality
                        }
                      />

                      <InfoBox
                        label="Rate"
                        value={
                          rate
                            ? `₹${Number(
                                rate
                              ).toLocaleString(
                                "en-IN"
                              )} / Qtl`
                            : "—"
                        }
                      />

                    </div>

                    <div className="mt-4 rounded-lg bg-green-50 p-4">

                      <p className="text-[8px] font-bold text-green-700">
                        Total Procurement Amount
                      </p>

                      <p className="mt-1 text-2xl font-extrabold text-green-700">
                        ₹
                        {totalAmount.toLocaleString(
                          "en-IN",
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )}
                      </p>

                    </div>

                    {selectedFarmer.status ===
                    "completed" ? (
                      <div className="mt-4 flex items-center justify-center gap-2 rounded-md bg-green-100 py-3 text-[10px] font-bold text-green-700">

                        <CheckCircle2 className="h-4 w-4" />

                        Procurement Completed

                      </div>
                    ) : selectedFarmer.status ===
                      "rejected" ? (
                      <div className="mt-4 flex items-center justify-center gap-2 rounded-md bg-red-100 py-3 text-[10px] font-bold text-red-700">

                        Procurement Rejected

                      </div>
                    ) : (
                      <button
                        onClick={
                          completeProcurement
                        }
                        disabled={
                          actionLoading ||
                          payment?.status !==
                            "successful"
                        }
                        className="mt-4 w-full rounded-md bg-green-700 py-2.5 text-[10px] font-bold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                      >
                        {actionLoading
                          ? "Completing..."
                          : "Complete Procurement"}
                      </button>
                    )}

                  </div>
                )}

              </div>
            )}

          </section>

          {/* =================================================
              SUMMARY
              ================================================= */}

          <section className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">

            <SummaryCard
              label="Farmers Today"
              value={
                farmers.length
              }
            />

            <SummaryCard
              label="Completed"
              value={
                completedCount
              }
            />

            <SummaryCard
              label="Pending"
              value={
                pendingCount
              }
            />

            <SummaryCard
              label="Total Quantity"
              value={`${totalQuantity} Qtl`}
            />

          </section>

          {/* =================================================
              INFO
              ================================================= */}

          <div className="mt-4 flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">

            <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />

            <div>

              <p className="text-[9px] font-bold text-blue-900">
                Procurement Process
              </p>

              <p className="mt-0.5 text-[8px] leading-4 text-blue-800">
                Follow the sequence:
                Weighing → Quality Check →
                Payment → Complete Procurement.
                All validations are handled by
                the Supabase backend.
              </p>

            </div>

          </div>
        </>
      )}

    </div>
  );
}

// =========================================================
// STATUS BADGE
// =========================================================

function StatusBadge({
  status,
}) {
  const normalized =
    status?.toLowerCase();

  const styles = {
    processing:
      "bg-blue-50 text-blue-700",

    weighing:
      "bg-blue-50 text-blue-700",

    quality_check:
      "bg-yellow-50 text-yellow-700",

    completed:
      "bg-green-50 text-green-700",

    accepted:
      "bg-green-50 text-green-700",

    rejected:
      "bg-red-50 text-red-700",

    pending:
      "bg-slate-100 text-slate-600",

    confirmed:
      "bg-blue-50 text-blue-700",

    called:
      "bg-purple-50 text-purple-700",
  };

  const label =
    normalized ===
    "processing"
      ? "Processing"
      : normalized ===
        "weighing"
      ? "Weighing"
      : normalized ===
        "quality_check"
      ? "Quality Check"
      : normalized ===
        "completed"
      ? "Completed"
      : normalized ===
        "accepted"
      ? "Accepted"
      : normalized ===
        "rejected"
      ? "Rejected"
      : normalized ===
        "confirmed"
      ? "Confirmed"
      : normalized ===
        "called"
      ? "Called"
      : "Pending";

  return (
    <span
      className={`rounded-full px-2 py-1 text-[7px] font-bold ${
        styles[normalized] ||
        "bg-slate-100 text-slate-600"
      }`}
    >
      {label}
    </span>
  );
}

// =========================================================
// INFO BOX
// =========================================================

function InfoBox({
  label,
  value,
}) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">

      <p className="text-[8px] font-semibold text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-[10px] font-extrabold text-blue-950">
        {value || "—"}
      </p>

    </div>
  );
}

// =========================================================
// SUMMARY CARD
// =========================================================

function SummaryCard({
  label,
  value,
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">

      <p className="text-[9px] font-semibold text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-xl font-extrabold text-blue-950">
        {value}
      </p>

    </div>
  );
}

export default Procurement;