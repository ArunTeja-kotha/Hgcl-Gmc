import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

import Table from "../../components/table";

const TmsComplaints = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch grievances from backend
  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://localhost:5163/api/GrievanceComplaints/registeredGrievances",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setGrievances(response.data);
      } catch (error) {
        console.error("Failed to fetch grievances:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load grievances."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchGrievances();
  }, []);

  /*
   * Category ID 3 = Toll / FASTag
   *
   * Only Toll / FASTag grievances
   * are displayed in the TMS module.
   */
  const tmsGrievances = useMemo(() => {
    return grievances.filter(
      (grievance) => grievance.categoryId === 3
    );
  }, [grievances]);

  // Filters
  const formik = useFormik({
    initialValues: {
      grievanceId: "",
      grievanceCode: "",
      status: "",
    },

    validationSchema: Yup.object({
      grievanceId: Yup.string().matches(
        /^[0-9]*$/,
        "Grievance ID must contain numbers only."
      ),

      grievanceCode: Yup.string(),
    }),

    onSubmit: () => {},
  });

  // Apply filters
  const filteredGrievances = useMemo(() => {
    return tmsGrievances.filter((grievance) => {
      // Grievance Code filter
      if (
        formik.values.grievanceCode &&
        !grievance.grievanceCode
          ?.toLowerCase()
          .includes(
            formik.values.grievanceCode.toLowerCase()
          )
      ) {
        return false;
      }

      // Status filter
      if (
        formik.values.status &&
        grievance.status !== formik.values.status
      ) {
        return false;
      }

      return true;
    });
  }, [
    tmsGrievances,
    formik.values.grievanceId,
    formik.values.grievanceCode,
    formik.values.status,
  ]);

  // Handle Edit
  const handleEdit = (grievance) => {
    console.log("Edit grievance:", grievance);

    // Edit functionality will be added here
  };

  // AG Grid columns
  const columnDefs = useMemo(
    () => [
      {
        headerName: "S.No",
        valueGetter: (params) =>
          params.node.rowIndex + 1,
        width: 80,
        sortable: false,
        filter: false,
      },

      {
        field: "grievanceCode",
        headerName: "Grievance Code",
        minWidth: 170,
      },

      {
        field: "categoryId",
        headerName: "Category",
        minWidth: 100,
      },

      {
        field: "subCategoryId",
        headerName: "Sub Category",
        minWidth: 130,
      },

      {
        field: "description",
        headerName: "Description",
        flex: 2,
        minWidth: 250,
        wrapText: true,
        autoHeight: true,
      },

      {
        field: "createdAt",
        headerName: "Created Date",
        minWidth: 180,

        valueFormatter: (params) => {
          if (!params.value) {
            return "";
          }

          return new Date(
            params.value
          ).toLocaleString("en-IN");
        },
      },

      {
        field: "status",
        headerName: "Status",
        minWidth: 130,
      },

      {
        field: "assignedTo",
        headerName: "Assigned To",
        minWidth: 120,
      },

      {
        field: "assignedAt",
        headerName: "Assigned Date",
        minWidth: 180,

        valueFormatter: (params) => {
          if (!params.value) {
            return "";
          }

          return new Date(
            params.value
          ).toLocaleString("en-IN");
        },
      },

      // Action column
      {
        headerName: "Action",
        minWidth: 110,
        maxWidth: 130,
        sortable: false,
        filter: false,

        cellRenderer: (params) => (
          <button
            type="button"
            onClick={() => handleEdit(params.data)}
            className="rounded-md border border-[#2563A6] bg-[#EAF3FB] px-4 py-1.5 text-sm font-medium text-[#123A63] transition-all duration-200 hover:bg-[#2563A6] hover:text-white hover:shadow-md"
          >
            Edit
          </button>
        ),
      },
    ],
    []
  );

  // Default AG Grid configuration
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  // Summary counts
  const totalCount = tmsGrievances.length;

  const openCount = tmsGrievances.filter(
    (grievance) => grievance.status === "Open"
  ).length;

  const inProgressCount = tmsGrievances.filter(
    (grievance) => grievance.status === "In Progress"
  ).length;

  const resolvedCount = tmsGrievances.filter(
    (grievance) => grievance.status === "Resolved"
  ).length;

  const closedCount = tmsGrievances.filter(
    (grievance) => grievance.status === "Closed"
  ).length;

  // Loading state
  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-gray-600">
          Loading TMS grievances...
        </p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6">

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#123A63]">
          TMS Grievances
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Toll / FASTag related grievances
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* Total */}
        <div className="rounded-xl border border-[#D5E1EC] bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Grievances
          </p>

          <p className="mt-2 text-2xl font-bold text-[#123A63]">
            {totalCount}
          </p>
        </div>

        {/* Open */}
        <div className="rounded-xl border border-[#D5E1EC] bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Open
          </p>

          <p className="mt-2 text-2xl font-bold text-[#123A63]">
            {openCount}
          </p>
        </div>

        {/* In Progress */}
        <div className="rounded-xl border border-[#D5E1EC] bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            In Progress
          </p>

          <p className="mt-2 text-2xl font-bold text-[#123A63]">
            {inProgressCount}
          </p>
        </div>

        {/* Resolved */}
        <div className="rounded-xl border border-[#D5E1EC] bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Resolved
          </p>

          <p className="mt-2 text-2xl font-bold text-[#123A63]">
            {resolvedCount}
          </p>
        </div>

      </div>

      {/* Filters */}
      <form
        onSubmit={formik.handleSubmit}
        className="mb-6 rounded-xl border border-[#D5E1EC] bg-white p-5 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

          {/* Grievance Code */}
          <div>
            <label
              htmlFor="grievanceCode"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Grievance Code
            </label>

            <input
              id="grievanceCode"
              name="grievanceCode"
              type="text"
              placeholder="Enter grievance code"
              value={formik.values.grievanceCode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm uppercase outline-none focus:border-[#2563A6] focus:ring-2 focus:ring-[#B9D8F2]"
            />
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Status
            </label>

            <select
              id="status"
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-[#2563A6] focus:ring-2 focus:ring-[#B9D8F2]"
            >
              <option value="">
                All Statuses
              </option>

              <option value="Open">
                Open
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Resolved">
                Resolved
              </option>

              <option value="Closed">
                Closed
              </option>
            </select>
          </div>

          {/* Clear */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => formik.resetForm()}
              className="h-10 w-full rounded-md border border-gray-300 px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>

        </div>
      </form>

      {/* Table */}
      <div className="rounded-xl border border-[#D5E1EC] bg-white p-4 shadow-sm">

        <Table
          rowData={filteredGrievances}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          height="500px"
        />

      </div>

    </div>
  );
};

export default TmsComplaints;