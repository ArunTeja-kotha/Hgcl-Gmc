import React, { useEffect, useState } from "react";
import axios from "axios";

import RegisteredGrievancesTable from "../components/RegisteredGrievanceTable";

const API_BASE = "http://localhost:5163/api";

const GRIEVANCE_API =
  `${API_BASE}/GrievanceComplaints/registeredGrievances`;

const CATEGORY_API =
  `${API_BASE}/GrievanceCategory`;

const SUB_CATEGORY_API =
  `${API_BASE}/GrievanceSubCategory`;

const FIELD_USERS_API =
  `${API_BASE}/User/field-users`;

const ASSIGN_API =
  `${API_BASE}/GrievanceComplaints`;

const RegisteredGrievances = () => {
  const [grievances, setGrievances] = useState([]);

  // ==============================
  // FILTER / SORT
  // ==============================

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const [fieldUsers, setFieldUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fieldUsersLoading, setFieldUsersLoading] =
    useState(false);
  const [error, setError] = useState("");
  const [assignError, setAssignError] = useState("");

  const [selectedGrievance, setSelectedGrievance] =
    useState(null);

  const [selectedFieldUser, setSelectedFieldUser] =
    useState("");

  const [assigning, setAssigning] = useState(false);

  // =========================================================
  // FILTERED + SORTED GRIEVANCES
  // =========================================================

  const filteredGrievances = grievances
    .filter((grievance) => {
      const search = searchTerm.toLowerCase();

      return (
        grievance.grievanceCode
          ?.toLowerCase()
          .includes(search) ||

        grievance.categoryName
          ?.toLowerCase()
          .includes(search) ||

        grievance.subCategoryName
          ?.toLowerCase()
          .includes(search) ||

        grievance.status
          ?.toLowerCase()
          .includes(search)
      );
    })
    .sort((a, b) => {
      if (!sortBy) {
        return 0;
      }

      let valueA = a[sortBy];
      let valueB = b[sortBy];

      // Sort Created Date properly
      if (sortBy === "createdAt") {
        valueA = valueA
          ? new Date(valueA).getTime()
          : 0;

        valueB = valueB
          ? new Date(valueB).getTime()
          : 0;
      } else {
        valueA = String(valueA ?? "").toLowerCase();
        valueB = String(valueB ?? "").toLowerCase();
      }

      if (valueA < valueB) {
        return sortOrder === "asc" ? -1 : 1;
      }

      if (valueA > valueB) {
        return sortOrder === "asc" ? 1 : -1;
      }

      return 0;
    });

  // =========================================================
  // GET LOGGED-IN ROLE
  // =========================================================

  const storedRole = localStorage.getItem("role");

  const normalizedRole = storedRole
    ?.replace(/\s+/g, " ")
    .trim();

  const canAssign =
    normalizedRole === "Web Administrator" ||
    normalizedRole === "Web User";

  // =========================================================
  // FETCH GRIEVANCES
  // =========================================================

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [
        grievancesResponse,
        categoriesResponse,
        subCategoriesResponse,
      ] = await Promise.all([
        axios.get(GRIEVANCE_API, { headers }),
        axios.get(CATEGORY_API, { headers }),
        axios.get(SUB_CATEGORY_API, { headers }),
      ]);

      const grievanceData =
        grievancesResponse.data || [];

      const categoryData =
        categoriesResponse.data || [];

      const subCategoryData =
        subCategoriesResponse.data || [];

      // =====================================================
      // CATEGORY MAP
      // =====================================================

      const categoryMap = {};

      categoryData.forEach((category) => {
        categoryMap[category.categoryId] =
          category.categoryName;
      });

      // =====================================================
      // SUB CATEGORY MAP
      // =====================================================

      const subCategoryMap = {};

      subCategoryData.forEach((subCategory) => {
        subCategoryMap[
          subCategory.subCategoryId
        ] = subCategory.subCategoryName;
      });

      // =====================================================
      // ADD CATEGORY / SUBCATEGORY NAMES
      // =====================================================

      const updatedGrievances =
        grievanceData.map((grievance) => ({
          ...grievance,

          categoryName:
            categoryMap[grievance.categoryId] ||
            "-",

          subCategoryName:
            subCategoryMap[
              grievance.subCategoryId
            ] || "-",
        }));

      setGrievances(updatedGrievances);
    } catch (err) {
      console.error(
        "Error fetching registered grievances:",
        err
      );

      if (err.response?.status === 401) {
        setError(
          "You are not authorized to view grievances."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to load registered grievances."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FETCH FIELD USERS
  // =========================================================

  const fetchFieldUsers = async () => {
    try {
      setFieldUsersLoading(true);
      setAssignError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        FIELD_USERS_API,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFieldUsers(response.data || []);
    } catch (err) {
      console.error(
        "Error fetching Field Users:",
        err
      );

      setAssignError(
        err.response?.data?.message ||
          "Failed to load Field Users."
      );
    } finally {
      setFieldUsersLoading(false);
    }
  };

  // =========================================================
  // OPEN ASSIGN MODAL
  // =========================================================

  const handleOpenAssign = (grievance) => {
    setSelectedGrievance(grievance);
    setSelectedFieldUser("");
    setAssignError("");

    fetchFieldUsers();
  };

  // =========================================================
  // CLOSE ASSIGN MODAL
  // =========================================================

  const handleCloseAssign = () => {
    if (assigning) return;

    setSelectedGrievance(null);
    setSelectedFieldUser("");
    setAssignError("");
  };

  // =========================================================
  // ASSIGN GRIEVANCE
  // =========================================================

  const handleAssign = async () => {
    if (!selectedFieldUser) {
      setAssignError(
        "Please select a Field User."
      );
      return;
    }

    if (!selectedGrievance) {
      return;
    }

    try {
      setAssigning(true);
      setAssignError("");

      const token = localStorage.getItem("token");

      await axios.post(
        `${ASSIGN_API}/${selectedGrievance.grievanceId}/assign`,
        {
          assignedTo: selectedFieldUser,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Close modal
      setSelectedGrievance(null);
      setSelectedFieldUser("");

      // Refresh list
      await fetchGrievances();
    } catch (err) {
      console.error(
        "Error assigning grievance:",
        err
      );

      setAssignError(
        err.response?.data?.message ||
          "Failed to assign grievance."
      );
    } finally {
      setAssigning(false);
    }
  };

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const handleClearFilters = () => {
    setSearchTerm("");
    setSortBy("");
    setSortOrder("asc");
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchGrievances();
  }, []);

  return (
    <div className="min-h-full bg-[#F4F8FC] p-6">

      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-semibold text-[#123A63]">
            All Grievances
          </h1>

          <p className="mt-1 text-sm text-[#64748B]">
            View all registered grievances.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchGrievances}
          disabled={loading}
          className="rounded-lg bg-[#2563A6] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1D4F85] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>

      </div>

      {/* =====================================================
          ERROR
          ===================================================== */}

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* =====================================================
          FILTER / SORT
          ===================================================== */}

      {!loading && (
        <div className="mb-4 rounded-xl border border-[#D5E0EA] bg-white p-4">

          <div className="flex flex-wrap items-end gap-4">

            {/* SEARCH */}

            <div className="min-w-60 flex-1">
              <label className="mb-1 block text-sm font-medium text-[#123A63]">
                Search Grievances
              </label>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                placeholder="Search grievance code, category, subcategory or status..."
                className="w-full rounded-lg border border-[#D5E0EA] px-4 py-2.5 text-sm text-[#1F2937] outline-none focus:border-[#2563A6]"
              />
            </div>

            {/* SORT BY */}

            <div className="w-48">
              <label className="mb-1 block text-sm font-medium text-[#123A63]">
                Sort By
              </label>

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value)
                }
                className="w-full rounded-lg border border-[#D5E0EA] bg-white px-3 py-2.5 text-sm text-[#123A63] outline-none focus:border-[#2563A6]"
              >
                <option value="">
                  Default
                </option>

                <option value="grievanceCode">
                  Grievance Code
                </option>

                <option value="categoryName">
                  Category
                </option>

                <option value="subCategoryName">
                  Subcategory
                </option>

                <option value="status">
                  Status
                </option>

                <option value="createdAt">
                  Created Date
                </option>
              </select>
            </div>

            {/* SORT ORDER */}

            <div className="w-40">
              <label className="mb-1 block text-sm font-medium text-[#123A63]">
                Order
              </label>

              <select
                value={sortOrder}
                onChange={(e) =>
                  setSortOrder(e.target.value)
                }
                className="w-full rounded-lg border border-[#D5E0EA] bg-white px-3 py-2.5 text-sm text-[#123A63] outline-none focus:border-[#2563A6]"
              >
                <option value="asc">
                  Ascending
                </option>

                <option value="desc">
                  Descending
                </option>
              </select>
            </div>

            {/* CLEAR */}

            <button
              type="button"
              onClick={handleClearFilters}
              className="rounded-lg border border-[#2563A6] px-5 py-2.5 text-sm font-medium text-[#2563A6] transition hover:bg-[#E8F2FB]"
            >
              Clear
            </button>

          </div>

        </div>
      )}

      {/* =====================================================
          GRIEVANCE TABLE
          ===================================================== */}

      {loading ? (

        <div className="rounded-xl border border-[#D5E0EA] bg-white p-10 text-center">

          <p className="text-[#64748B]">
            Loading grievances...
          </p>

        </div>

      ) : (

        <RegisteredGrievancesTable
          grievances={filteredGrievances}
          onAssign={handleOpenAssign}
          canAssign={canAssign}
        />

      )}

      {/* =====================================================
          ASSIGN MODAL
          ===================================================== */}

      {selectedGrievance && canAssign && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">

            {/* Modal Header */}

            <div className="border-b border-[#D5E0EA] px-6 py-4">

              <h2 className="text-lg font-semibold text-[#123A63]">
                Assign Grievance
              </h2>

              <p className="mt-1 text-sm text-[#64748B]">
                Grievance Code:{" "}

                <span className="font-medium text-[#123A63]">
                  {selectedGrievance.grievanceCode ||
                    "-"}
                </span>
              </p>

            </div>

            {/* Modal Body */}

            <div className="px-6 py-5">

              <label className="mb-2 block text-sm font-medium text-[#123A63]">
                Field User
              </label>

              <select
                value={selectedFieldUser}
                onChange={(e) =>
                  setSelectedFieldUser(
                    e.target.value
                  )
                }
                disabled={
                  fieldUsersLoading ||
                  assigning
                }
                className="w-full rounded-lg border border-[#D5E0EA] bg-white px-3 py-2.5 text-sm text-[#123A63] outline-none focus:border-[#2563A6]"
              >

                <option value="">
                  {fieldUsersLoading
                    ? "Loading Field Users..."
                    : "Select Field User"}
                </option>

                {fieldUsers.map((user) => {

                  const fullName =
                    `${user.firstName || ""} ${
                      user.lastName || ""
                    }`.trim();

                  return (
                    <option
                      key={user.userId}
                      value={fullName}
                    >
                      {fullName}
                    </option>
                  );
                })}

              </select>

              {/* Assignment Error */}

              {assignError && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {assignError}
                </div>
              )}

            </div>

            {/* Modal Footer */}

            <div className="flex justify-end gap-3 border-t border-[#D5E0EA] px-6 py-4">

              <button
                type="button"
                onClick={handleCloseAssign}
                disabled={assigning}
                className="rounded-lg border border-[#D5E0EA] bg-white px-4 py-2 text-sm font-medium text-[#475569] hover:bg-[#F4F8FC] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAssign}
                disabled={
                  assigning ||
                  fieldUsersLoading ||
                  !selectedFieldUser
                }
                className="rounded-lg bg-[#2563A6] px-5 py-2 text-sm font-medium text-white hover:bg-[#1D4F85] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {assigning
                  ? "Assigning..."
                  : "Assign"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default RegisteredGrievances;