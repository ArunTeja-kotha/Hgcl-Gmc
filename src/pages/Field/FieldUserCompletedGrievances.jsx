import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
  "http://localhost:5163/api/GrievanceComplaints";

const FieldUserCompletedGrievances = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchCompletedGrievances = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_URL}/assigned`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const completedGrievances = (
        response.data || []
      ).filter(
        (grievance) =>
          grievance.status?.trim() === "Resolved"
      );

      setGrievances(completedGrievances);
    } catch (err) {
      console.error(
        "Error fetching completed grievances:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load completed grievances."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedGrievances();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Completed Grievances
        </h2>

        <p className="mt-4 text-gray-500">
          Loading grievances...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Completed Grievances
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Grievances resolved by you
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {grievances.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
          <p className="text-gray-500">
            No completed grievances found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Grievance Code
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Category
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Sub Category
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Description
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Status
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Created At
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {grievances.map((grievance) => (
                <tr
                  key={grievance.grievanceId}
                  className="hover:bg-gray-50"
                >
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-800">
                    {grievance.grievanceCode || "-"}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-700">
                    {grievance.categoryName ||
                      grievance.category ||
                      "-"}
                  </td>

                  <td className="px-4 py-4 text-sm text-gray-700">
                    {grievance.subCategoryName ||
                      grievance.subCategory ||
                      "-"}
                  </td>

                  <td className="max-w-xs px-4 py-4 text-sm text-gray-700">
                    <div className="line-clamp-2">
                      {grievance.description || "-"}
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-4 py-4">
                    <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                      {grievance.status}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                    {grievance.createdAt
                      ? new Date(
                          grievance.createdAt
                        ).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FieldUserCompletedGrievances;
