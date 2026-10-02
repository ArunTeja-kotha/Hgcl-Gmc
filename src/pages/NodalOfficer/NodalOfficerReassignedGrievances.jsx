import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const NodalOfficerReassignedGrievances = () => {
  const API_BASE_URL =
    "http://localhost:5163/api/GrievanceComplaints";

  const [grievances, setGrievances] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // FETCH GRIEVANCES
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

      /*
       * Reassigned grievances:
       * A grievance is considered reassigned when
       * AssignedTo contains a value.
       *
       * We are keeping the filtering on the frontend
       * because there is currently no dedicated
       * "Reassigned" status in the backend.
       */
      const reassignedGrievances = data.filter(
        (grievance) =>
          grievance.assignedTo !== null &&
          grievance.assignedTo !== undefined &&
          grievance.assignedTo !== ""
      );

      setGrievances(reassignedGrievances);
    } catch (error) {
      console.error(
        "Error fetching reassigned grievances:",
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
            "Failed to fetch reassigned grievances."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------

  useEffect(() => {
    fetchGrievances();
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
  // ASSIGNED USER
  // --------------------------------------------------

  const getAssignedUser = (grievance) => {
    return (
      grievance.assignedToName ||
      grievance.assignedToUserName ||
      grievance.assignedTo ||
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
  // STATUS CLASS
  // --------------------------------------------------

  const getStatusClass = (status) => {
    const normalizedStatus =
      status?.trim();

    switch (normalizedStatus) {
      case "Open":
        return "bg-blue-100 text-blue-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "In Progress":
        return "bg-orange-100 text-orange-700";

      case "Resolved":
        return "bg-green-100 text-green-700";

      case "Closed":
        return "bg-gray-200 text-gray-700";

      case "Reopened":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
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

        const assignedUser =
          getAssignedUser(grievance);

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
            .includes(search) ||

          assignedUser
            .toString()
            .toLowerCase()
            .includes(search)
        );
      }
    );
  }, [grievances, searchTerm]);

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-full p-6">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <p className="text-gray-600">
            Loading reassigned grievances...
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

      {/* PAGE HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#123A63]">
          Reassigned Grievances
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View grievances that have been assigned to a Field User
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* SEARCH BAR */}
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
            placeholder="Search by grievance code, category, sub category, description, status or assigned user..."
            className="w-full rounded-lg border border-[#D5E0EA] bg-white py-3 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-[#2563A6] focus:ring-1 focus:ring-[#2563A6]"
          />

        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-lg border border-[#D5E0EA] bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="min-w-full">

            {/* TABLE HEADER */}
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
                  Assigned To
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium">
                  Status
                </th>

                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium">
                  Created At
                </th>

              </tr>

            </thead>

            {/* TABLE BODY */}
            <tbody>

              {filteredGrievances.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="px-4 py-8 text-center text-sm text-gray-500"
                  >
                    {searchTerm
                      ? "No reassigned grievances match your search."
                      : "No reassigned grievances found."}
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

                        {/* GRIEVANCE CODE */}
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

                        {/* ASSIGNED TO */}
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {getAssignedUser(
                            grievance
                          )}
                        </td>

                        {/* STATUS */}
                        <td className="px-4 py-3">

                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                              status
                            )}`}
                          >
                            {status || "-"}
                          </span>

                        </td>

                        {/* CREATED AT */}
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                          {formatDate(
                            grievance.createdAt
                          )}
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

      {/* RESULT COUNT */}
      <div className="mt-3 text-sm text-gray-500">
        Showing{" "}
        <span className="font-medium text-gray-700">
          {filteredGrievances.length}
        </span>{" "}
        of{" "}
        <span className="font-medium text-gray-700">
          {grievances.length}
        </span>{" "}
        reassigned grievances
      </div>

    </div>
  );
};

export default NodalOfficerReassignedGrievances;