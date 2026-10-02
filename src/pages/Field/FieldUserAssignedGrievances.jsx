import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5163/api/GrievanceComplaints";

const FieldUserAssignedGrievances = () => {
const [grievances, setGrievances] = useState([]);
const [loading, setLoading] = useState(true);
const [updatingId, setUpdatingId] = useState(null);
const [error, setError] = useState("");

const token = localStorage.getItem("token");

const fetchAssignedGrievances = async () => {
try {
setLoading(true);
setError("");


  const response = await axios.get(`${API_URL}/assigned`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  setGrievances(response.data || []);
} catch (err) {
  console.error("Error fetching assigned grievances:", err);

  setError(
    err.response?.data?.message ||
      "Failed to load assigned grievances."
  );
} finally {
  setLoading(false);
}


};

useEffect(() => {
fetchAssignedGrievances();
}, []);

const updateStatus = async (grievanceId, status) => {
try {
setUpdatingId(grievanceId);
setError("");

  await axios.put(
    `${API_URL}/${grievanceId}/status`,
    {
      status: status,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  await fetchAssignedGrievances();
} catch (err) {
  console.error("Error updating grievance status:", err);

  setError(
    err.response?.data?.message ||
      "Failed to update grievance status."
  );
} finally {
  setUpdatingId(null);
}

};

const getNextStatus = (currentStatus) => {
const status = currentStatus?.trim();


if (status === "Pending") {
  return "In Progress";
}

if (status === "In Progress") {
  return "Resolved";
}

return null;


};

if (loading) {
return ( <div className="p-6"> <h2 className="text-xl font-semibold text-gray-800">
Assigned Grievances </h2>


    <p className="mt-4 text-gray-500">
      Loading grievances...
    </p>
  </div>
);


}

return ( <div className="p-6"> <div className="mb-6"> <h2 className="text-2xl font-semibold text-gray-800">
Assigned Grievances </h2>


    <p className="mt-1 text-sm text-gray-500">
      Grievances assigned to you
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
        No grievances are currently assigned to you.
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

            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-600">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">
          {grievances.map((grievance) => {
            const nextStatus = getNextStatus(grievance.status);

            return (
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
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      grievance.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : grievance.status === "In Progress"
                        ? "bg-blue-100 text-blue-800"
                        : grievance.status === "Resolved"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {grievance.status || "-"}
                  </span>
                </td>

                <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                  {grievance.createdAt
                    ? new Date(
                        grievance.createdAt
                      ).toLocaleString()
                    : "-"}
                </td>

                <td className="whitespace-nowrap px-4 py-4 text-center">
                  {nextStatus ? (
                    <button
                      type="button"
                      disabled={
                        updatingId === grievance.grievanceId
                      }
                      onClick={() =>
                        updateStatus(
                          grievance.grievanceId,
                          nextStatus
                        )
                      }
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {updatingId === grievance.grievanceId
                        ? "Updating..."
                        : `Mark ${nextStatus}`}
                    </button>
                  ) : grievance.status === "Resolved" ? (
                    <span className="text-sm font-medium text-green-600">
                      Resolved
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">
                      -
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )}
</div>

);
};

export default FieldUserAssignedGrievances;
