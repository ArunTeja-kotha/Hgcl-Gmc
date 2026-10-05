import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5163/api";

const GRIEVANCE_API = `${API_BASE_URL}/GrievanceComplaints`;

// Category ID → Category Name
const categoryMap = {
  1: "Emergency / Safety Hazard",
  2: "Traffic and Incident",
  3: "Toll / FASTag",
  4: "Street Lighting",
  5: "Road Maintenance",
  6: "Drainage and Flooding",
  7: "Encroachment",
  8: "Cleanliness / Landscaping",
};

const WebUserGrievances = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Fetch grievances only
      const response = await axios.get(
        `${GRIEVANCE_API}/registeredGrievances`,
        config
      );

      console.log("REGISTERED GRIEVANCES:", response.data);

      const grievanceData = response.data || [];

      const mappedGrievances = grievanceData.map(
        (grievance) => ({
          ...grievance,

          // Convert Category ID to Category Name
          categoryName:
            categoryMap[grievance.categoryId] || "-",

          // Sub Category will be mapped once
          // the Sub Category ID → Name data is available
          subCategoryName:
            grievance.subCategoryName ||
            grievance.subCategory ||
            grievance.subCategoryId ||
            "-",
        })
      );

      setGrievances(mappedGrievances);
    } catch (error) {
      console.error(
        "Error fetching grievances:",
        error
      );

      setGrievances([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async (grievanceId) => {
    const confirmClose = window.confirm(
      "Are you sure you want to close this grievance?"
    );

    if (!confirmClose) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${GRIEVANCE_API}/${grievanceId}/close`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Grievance closed successfully.");

      fetchGrievances();
    } catch (error) {
      console.error(
        "Error closing grievance:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to close grievance."
      );
    }
  };

  // Search + Sort
  const filteredGrievances = grievances
    .filter((grievance) => {
      const search = searchTerm
        .toLowerCase()
        .trim();

      if (!search) {
        return true;
      }

      return (
        grievance.grievanceCode
          ?.toLowerCase()
          .includes(search) ||
        grievance.categoryName
          ?.toString()
          .toLowerCase()
          .includes(search) ||
        grievance.subCategoryName
          ?.toString()
          .toLowerCase()
          .includes(search) ||
        grievance.description
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

      let valueA;
      let valueB;

      if (sortBy === "categoryName") {
        valueA = a.categoryName;
        valueB = b.categoryName;
      } else if (sortBy === "subCategoryName") {
        valueA = a.subCategoryName;
        valueB = b.subCategoryName;
      } else if (sortBy === "createdAt") {
        valueA = a.createdAt
          ? new Date(a.createdAt).getTime()
          : 0;

        valueB = b.createdAt
          ? new Date(b.createdAt).getTime()
          : 0;
      } else {
        valueA = a[sortBy];
        valueB = b[sortBy];
      }

      if (typeof valueA === "string") {
        valueA = valueA.toLowerCase();
      }

      if (typeof valueB === "string") {
        valueB = valueB.toLowerCase();
      }

      if (valueA < valueB) {
        return sortOrder === "asc" ? -1 : 1;
      }

      if (valueA > valueB) {
        return sortOrder === "asc" ? 1 : -1;
      }

      return 0;
    });

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-blue-100 text-blue-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "in progress":
        return "bg-orange-100 text-orange-700";

      case "resolved":
        return "bg-green-100 text-green-700";

      case "closed":
        return "bg-gray-100 text-gray-700";

      case "reopened":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6">

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#123A63]">
          My Grievances
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View and manage your assigned grievances.
        </p>
      </div>

      {/* Search and Sort */}
      <div className="mb-5 rounded-xl border border-[#D5E0EA] bg-white p-4">

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

          {/* Search */}
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-[#123A63]">
              Search
            </label>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              placeholder="Search grievance code, category, sub category, description or status..."
              className="w-full rounded-lg border border-[#D5E0EA] px-4 py-2.5 text-sm text-[#1F2937] outline-none focus:border-[#2563A6]"
            />
          </div>

          {/* Sort By */}
          <div>
            <label className="mb-1 block text-sm font-medium text-[#123A63]">
              Sort By
            </label>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
              className="w-full rounded-lg border border-[#D5E0EA] px-4 py-2.5 text-sm text-[#1F2937] outline-none focus:border-[#2563A6]"
            >
              <option value="">
                Select
              </option>

              <option value="grievanceCode">
                Grievance Code
              </option>

              <option value="categoryName">
                Category
              </option>

              <option value="subCategoryName">
                Sub Category
              </option>

              <option value="status">
                Status
              </option>

              <option value="createdAt">
                Created At
              </option>
            </select>
          </div>

          {/* Order */}
          <div>
            <label className="mb-1 block text-sm font-medium text-[#123A63]">
              Order
            </label>

            <select
              value={sortOrder}
              onChange={(e) =>
                setSortOrder(e.target.value)
              }
              className="w-full rounded-lg border border-[#D5E0EA] px-4 py-2.5 text-sm text-[#1F2937] outline-none focus:border-[#2563A6]"
            >
              <option value="asc">
                Ascending
              </option>

              <option value="desc">
                Descending
              </option>
            </select>
          </div>
        </div>

        {/* Clear */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setSortBy("");
              setSortOrder("asc");
            }}
            className="rounded-lg border border-[#2563A6] px-5 py-2.5 text-sm font-medium text-[#2563A6] transition hover:bg-[#E8F2FB]"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#D5E0EA] bg-white">

        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading grievances...
          </div>
        ) : filteredGrievances.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No grievances found.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[1100px] text-left text-sm">

              <thead className="bg-[#F4F8FC]">
                <tr>

                  <th className="px-5 py-3 font-semibold text-[#123A63]">
                    S.No
                  </th>

                  <th className="px-5 py-3 font-semibold text-[#123A63]">
                    Grievance Code
                  </th>

                  <th className="px-5 py-3 font-semibold text-[#123A63]">
                    Category
                  </th>

                  <th className="px-5 py-3 font-semibold text-[#123A63]">
                    Sub Category
                  </th>

                  <th className="px-5 py-3 font-semibold text-[#123A63]">
                    Description
                  </th>

                  <th className="px-5 py-3 font-semibold text-[#123A63]">
                    Status
                  </th>

                  <th className="px-5 py-3 font-semibold text-[#123A63]">
                    Created At
                  </th>

                  <th className="px-5 py-3 font-semibold text-[#123A63]">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>
                {filteredGrievances.map(
                  (grievance, index) => (
                    <tr
                      key={grievance.grievanceId}
                      className="border-t border-[#E5EAF0] hover:bg-[#F8FAFC]"
                    >

                      <td className="px-5 py-3 text-gray-700">
                        {index + 1}
                      </td>

                      <td className="px-5 py-3 font-medium text-[#123A63]">
                        {grievance.grievanceCode || "-"}
                      </td>

                      <td className="px-5 py-3 text-gray-700">
                        {grievance.categoryName || "-"}
                      </td>

                      <td className="px-5 py-3 text-gray-700">
                        {grievance.subCategoryName || "-"}
                      </td>

                      <td className="max-w-[300px] px-5 py-3 text-gray-700">
                        <div className="truncate">
                          {grievance.description || "-"}
                        </div>
                      </td>

                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                            grievance.status
                          )}`}
                        >
                          {grievance.status || "-"}
                        </span>
                      </td>

                      <td className="px-5 py-3 text-gray-700">
                        {grievance.createdAt
                          ? new Date(
                              grievance.createdAt
                            ).toLocaleString()
                          : "-"}
                      </td>

                      <td className="px-5 py-3">

                        {grievance.status
                          ?.toLowerCase() ===
                        "resolved" ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleClose(
                                grievance.grievanceId
                              )
                            }
                            className="rounded-lg border border-green-600 px-4 py-2 text-sm font-medium text-green-600 hover:bg-green-50"
                          >
                            Close
                          </button>
                        ) : grievance.status
                            ?.toLowerCase() ===
                          "closed" ? (
                          <span className="text-sm font-medium text-gray-500">
                            Closed
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">
                            -
                          </span>
                        )}

                      </td>

                    </tr>
                  )
                )}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebUserGrievances;