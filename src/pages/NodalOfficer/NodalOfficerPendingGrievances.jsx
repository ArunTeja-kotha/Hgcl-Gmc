import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const NodalOfficerPendingGrievances = () => {
  const API_BASE_URL =
    "http://localhost:5163/api/GrievanceComplaints";

  const USERS_API_URL =
    "http://localhost:5163/api/Users";

  const [grievances, setGrievances] = useState([]);
  const [fieldUsers, setFieldUsers] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [fieldUsersLoading, setFieldUsersLoading] = useState(false);

  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [selectedFieldUser, setSelectedFieldUser] = useState("");

  const [reassigning, setReassigning] = useState(false);

  // --------------------------------------------------
  // FETCH PENDING GRIEVANCES
  // --------------------------------------------------

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication token not found.");
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/registeredGrievances`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data || [];

      // Only Pending grievances
      const pendingGrievances = data.filter(
        (grievance) =>
          grievance.status?.trim() === "Pending"
      );

      setGrievances(pendingGrievances);
    } catch (error) {
      console.error(
        "Error fetching pending grievances:",
        error
      );

      if (error.response?.status === 401) {
        setError("Unauthorized. Please login again.");
      } else if (error.response?.status === 403) {
        setError(
          "You do not have permission to view grievances."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to fetch pending grievances."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // FETCH FIELD USERS
  // --------------------------------------------------

  const fetchFieldUsers = async () => {
    try {
      setFieldUsersLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      const response = await axios.get(
        USERS_API_URL,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const users = response.data || [];

      const filteredUsers = users.filter(
        (user) => {
          const role =
            user.roleName ||
            user.role ||
            "";

          return (
            role.trim().toLowerCase() ===
            "field user"
          );
        }
      );

      setFieldUsers(filteredUsers);
    } catch (error) {
      console.error(
        "Error fetching field users:",
        error
      );

      setActionError(
        error.response?.data?.message ||
          "Failed to load Field Users."
      );
    } finally {
      setFieldUsersLoading(false);
    }
  };

  // --------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------

  useEffect(() => {
    fetchGrievances();
    fetchFieldUsers();
  }, []);

  // --------------------------------------------------
  // CATEGORY NAME
  // --------------------------------------------------

  const getCategoryName = (grievance) => {
    return (
      grievance.categoryName ||
      grievance.category ||
      "-"
    );
  };

  // --------------------------------------------------
  // SUB CATEGORY NAME
  // --------------------------------------------------

  const getSubCategoryName = (grievance) => {
    return (
      grievance.subCategoryName ||
      grievance.subCategory ||
      "-"
    );
  };

  // --------------------------------------------------
  // FORMAT DATE
  // --------------------------------------------------

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString();
  };

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const filteredGrievances = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    if (!search) {
      return grievances;
    }

    return grievances.filter(
      (grievance) => {
        const grievanceCode =
          grievance.grievanceCode || "";

        const categoryName =
          getCategoryName(grievance);

        const subCategoryName =
          getSubCategoryName(grievance);

        const description =
          grievance.description || "";

        const status =
          grievance.status || "";

        return (
          grievanceCode
            .toString()
            .toLowerCase()
            .includes(search) ||

          categoryName
            .toString()
            .toLowerCase()
            .includes(search) ||

          subCategoryName
            .toString()
            .toLowerCase()
            .includes(search) ||

          description
            .toString()
            .toLowerCase()
            .includes(search) ||

          status
            .toString()
            .toLowerCase()
            .includes(search)
        );
      }
    );
  }, [grievances, searchTerm]);

  // --------------------------------------------------
  // OPEN REASSIGN MODAL
  // --------------------------------------------------

  const handleReassignClick = (
    grievance
  ) => {
    setActionError("");

    setSelectedGrievance(grievance);

    setSelectedFieldUser(
      grievance.assignedTo
        ? grievance.assignedTo.toString()
        : ""
    );
  };

  // --------------------------------------------------
  // CLOSE REASSIGN MODAL
  // --------------------------------------------------

  const closeReassignModal = () => {
    if (reassigning) {
      return;
    }

    setSelectedGrievance(null);
    setSelectedFieldUser("");
    setActionError("");
  };

  // --------------------------------------------------
  // REASSIGN
  // --------------------------------------------------

  const handleReassign = async () => {
    try {
      setActionError("");

      if (!selectedGrievance) {
        return;
      }

      if (!selectedFieldUser) {
        setActionError(
          "Please select a Field User."
        );
        return;
      }

      const token =
        localStorage.getItem("token");

      if (!token) {
        setActionError(
          "Authentication token not found."
        );
        return;
      }

      setReassigning(true);

      const selectedUser =
        fieldUsers.find(
          (user) =>
            (
              user.userId ??
              user.id
            ).toString() ===
            selectedFieldUser.toString()
        );

      if (!selectedUser) {
        setActionError(
          "Selected Field User was not found."
        );
        return;
      }

      const firstName =
        selectedUser.firstName || "";

      const lastName =
        selectedUser.lastName || "";

      const fullName =
        `${firstName} ${lastName}`.trim();

      if (!fullName) {
        setActionError(
          "Selected Field User does not have a valid name."
        );
        return;
      }

      await axios.post(
        `${API_BASE_URL}/${selectedGrievance.grievanceId}/assign`,
        {
          assignedTo: fullName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedGrievance(null);
      setSelectedFieldUser("");

      await fetchGrievances();
    } catch (error) {
      console.error(
        "Error reassigning grievance:",
        error
      );

      setActionError(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to reassign grievance."
      );
    } finally {
      setReassigning(false);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-full p-6">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <p className="text-gray-600">
            Loading pending grievances...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-full p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#123A63]">
          Pending Grievances
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View all pending grievances
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* ACTION ERROR */}
      {actionError && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      {/* SEARCH */}
      <div className="mb-5 rounded-lg border border-[#D5E0EA] bg-white p-4 shadow-sm">
        <div className="relative">

          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            placeholder="Search by grievance code, category, sub category, description or status..."
            className="w-full rounded-lg border border-[#D5E0EA] bg-white py-3 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-[#2563A6] focus:ring-1 focus:ring-[#2563A6]"
          />

        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-lg border border-[#D5E0EA] bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="min-w-full">

            {/* HEADER */}
            <thead className="bg-[#123A63] text-white">

              <tr>

                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium">
                  Grievance Code
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium">
                  Category
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium">
                  Sub Category
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium">
                  Description
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium">
                  Status
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium">
                  Created At
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium">
                  Action
                </th>

              </tr>

            </thead>

            {/* BODY */}
            <tbody>

              {filteredGrievances.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="px-4 py-8 text-center text-sm text-gray-500"
                  >
                    {searchTerm
                      ? "No pending grievances match your search."
                      : "No pending grievances found."}
                  </td>

                </tr>

              ) : (

                filteredGrievances.map(
                  (grievance) => {

                    const status =
                      grievance.status?.trim();

                    return (

                      <tr
                        key={
                          grievance.grievanceId
                        }
                        className="border-b border-[#D5E0EA] last:border-b-0 hover:bg-[#F4F8FC]"
                      >

                        {/* CODE */}
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-[#123A63]">
                          {grievance.grievanceCode ||
                            "-"}
                        </td>

                        {/* CATEGORY */}
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {getCategoryName(
                            grievance
                          )}
                        </td>

                        {/* SUB CATEGORY */}
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {getSubCategoryName(
                            grievance
                          )}
                        </td>

                        {/* DESCRIPTION */}
                        <td className="max-w-xs px-4 py-3 text-sm text-gray-700">
                          <div className="line-clamp-2">
                            {grievance.description ||
                              "-"}
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="px-4 py-3">

                          <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                            {status || "Pending"}
                          </span>

                        </td>

                        {/* DATE */}
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                          {formatDate(
                            grievance.createdAt
                          )}
                        </td>

                        {/* ACTION */}
                        <td className="px-4 py-3">

                          <button
                            type="button"
                            onClick={() =>
                              handleReassignClick(
                                grievance
                              )
                            }
                            className="rounded-md bg-[#2563A6] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#1D4F85]"
                          >
                            Reassign
                          </button>

                        </td>

                      </tr>

                    );
                  }
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* COUNT */}
      <div className="mt-3 text-sm text-gray-500">
        Showing{" "}
        <span className="font-medium text-gray-700">
          {filteredGrievances.length}
        </span>{" "}
        of{" "}
        <span className="font-medium text-gray-700">
          {grievances.length}
        </span>{" "}
        pending grievances
      </div>

      {/* ================================================== */}
      {/* REASSIGN MODAL */}
      {/* ================================================== */}

      {selectedGrievance && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">

            {/* MODAL HEADER */}
            <div className="border-b border-[#D5E0EA] px-6 py-4">

              <h2 className="text-lg font-semibold text-[#123A63]">
                Reassign Grievance
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {selectedGrievance.grievanceCode ||
                  "-"}
              </p>

            </div>

            {/* MODAL BODY */}
            <div className="px-6 py-5">

              <label className="mb-2 block text-sm font-medium text-gray-700">
                Select Field User
              </label>

              <select
                value={selectedFieldUser}
                onChange={(e) =>
                  setSelectedFieldUser(
                    e.target.value
                  )
                }
                disabled={fieldUsersLoading}
                className="w-full rounded-lg border border-[#D5E0EA] bg-white px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#2563A6] focus:ring-1 focus:ring-[#2563A6]"
              >

                <option value="">
                  {fieldUsersLoading
                    ? "Loading Field Users..."
                    : "Select Field User"}
                </option>

                {fieldUsers.map((user) => {

                  const userId =
                    user.userId ??
                    user.id;

                  const firstName =
                    user.firstName || "";

                  const lastName =
                    user.lastName || "";

                  const fullName =
                    `${firstName} ${lastName}`.trim();

                  return (
                    <option
                      key={userId}
                      value={userId}
                    >
                      {fullName ||
                        user.email ||
                        `User ${userId}`}
                    </option>
                  );

                })}

              </select>

              {fieldUsers.length === 0 &&
                !fieldUsersLoading && (
                  <p className="mt-2 text-xs text-red-600">
                    No Field Users found.
                  </p>
                )}

            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 border-t border-[#D5E0EA] px-6 py-4">

              <button
                type="button"
                onClick={
                  closeReassignModal
                }
                disabled={reassigning}
                className="rounded-md border border-[#D5E0EA] bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleReassign}
                disabled={
                  reassigning ||
                  !selectedFieldUser
                }
                className="rounded-md bg-[#2563A6] px-4 py-2 text-sm font-medium text-white hover:bg-[#1D4F85] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {reassigning
                  ? "Reassigning..."
                  : "Reassign"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default NodalOfficerPendingGrievances;