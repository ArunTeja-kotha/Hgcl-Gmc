import React, { useEffect, useState } from "react";
import axios from "axios";

const WebUserGrievances = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [closingId, setClosingId] = useState(null);
  const [error, setError] = useState("");

  const API_BASE_URL = "http://localhost:5163/api/GrievanceComplaints";

  // =========================================================
  // FETCH ALL REGISTERED GRIEVANCES
  // =========================================================
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

      setGrievances(response.data || []);
    } catch (error) {
      console.error("Error fetching grievances:", error);

      if (error.response?.status === 401) {
        setError("Unauthorized. Please login again.");
      } else if (error.response?.status === 403) {
        setError("You do not have permission to view grievances.");
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to fetch grievances."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // CLOSE GRIEVANCE
  // =========================================================
  const handleCloseGrievance = async (grievanceId) => {
    const confirmClose = window.confirm(
      "Are you sure you want to close this grievance?"
    );

    if (!confirmClose) {
      return;
    }

    try {
      setClosingId(grievanceId);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Authentication token not found.");
        return;
      }

      const response = await axios.put(
        `${API_BASE_URL}/${grievanceId}/close`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        response.data?.message ||
          "Grievance closed successfully."
      );

      // Refresh the grievance list
      await fetchGrievances();
    } catch (error) {
      console.error("Error closing grievance:", error);

      alert(
        error.response?.data?.message ||
          "Failed to close grievance."
      );
    } finally {
      setClosingId(null);
    }
  };

  // =========================================================
  // LOAD DATA
  // =========================================================
  useEffect(() => {
    fetchGrievances();
  }, []);

  // =========================================================
  // STATUS DISPLAY
  // =========================================================
  const getStatusClass = (status) => {
    const normalizedStatus = status?.trim();

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

  // =========================================================
  // DATE FORMAT
  // =========================================================
  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString();
  };

  // =========================================================
  // CATEGORY NAME
  // =========================================================
  const getCategoryName = (grievance) => {
    return (
      grievance.categoryName ||
      grievance.category ||
      grievance.categoryId ||
      "-"
    );
  };

  // =========================================================
  // SUB CATEGORY NAME
  // =========================================================
  const getSubCategoryName = (grievance) => {
    return (
      grievance.subCategoryName ||
      grievance.subCategory ||
      grievance.subCategoryId ||
      "-"
    );
  };

  // =========================================================
  // LOADING
  // =========================================================
  if (loading) {
    return (
      <div className="p-6">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <p className="text-gray-600">
            Loading grievances...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================
  return (
    <div className="min-h-full p-6">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#123A63]">
          All Grievances
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View and manage registered grievances
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-hidden rounded-lg border border-[#D5E0EA] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-[#123A63] text-white">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium">
                  S.No
                </th>

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

                <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-medium">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {grievances.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-8 text-center text-sm text-gray-500"
                  >
                    No grievances found.
                  </td>
                </tr>
              ) : (
                grievances.map((grievance, index) => {
                  const status =
                    grievance.status?.trim();

                  return (
                    <tr
                      key={grievance.grievanceId}
                      className="border-b border-[#D5E0EA] last:border-b-0 hover:bg-[#F4F8FC]"
                    >
                      {/* S.NO */}
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {index + 1}
                      </td>

                      {/* GRIEVANCE CODE */}
                      <td className="px-4 py-3 text-sm font-medium text-[#123A63]">
                        {grievance.grievanceCode || "-"}
                      </td>

                      {/* CATEGORY */}
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {getCategoryName(grievance)}
                      </td>

                      {/* SUB CATEGORY */}
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {getSubCategoryName(grievance)}
                      </td>

                      {/* DESCRIPTION */}
                      <td className="max-w-xs px-4 py-3 text-sm text-gray-700">
                        <div className="line-clamp-2">
                          {grievance.description || "-"}
                        </div>
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

                      {/* CREATED DATE */}
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                        {formatDate(grievance.createdAt)}
                      </td>

                      {/* ACTION */}
                      <td className="px-4 py-3 text-center">
                        {status === "Resolved" ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleCloseGrievance(
                                grievance.grievanceId
                              )
                            }
                            disabled={
                              closingId ===
                              grievance.grievanceId
                            }
                            className="rounded-md bg-[#123A63] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#1D4F85] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {closingId ===
                            grievance.grievanceId
                              ? "Closing..."
                              : "Close"}
                          </button>
                        ) : status === "Closed" ? (
                          <span className="text-xs font-medium text-gray-500">
                            Closed
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">
                            -
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WebUserGrievances;