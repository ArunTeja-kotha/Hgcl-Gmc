import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5163";

const AssignGrievance = ({
  grievanceId,
  departmentId,
  onAssigned,
}) => {
  const [fieldUsers, setFieldUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [assigning, setAssigning] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // ============================================================
  // GET ALL FIELD USERS AND FILTER BY DEPARTMENT
  // ============================================================

  useEffect(() => {
    const fetchFieldUsers = async () => {
      if (!departmentId) {
        setFieldUsers([]);
        setError(
          "Department is not available for this grievance."
        );
        return;
      }

      if (!token) {
        setError("Authentication token not found.");
        return;
      }

      try {
        setLoadingUsers(true);
        setError("");
        setMessage("");

        const response = await axios.get(
          `${API_BASE_URL}/api/User/field-users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const allFieldUsers = response.data || [];

        console.log("All Field Users:", allFieldUsers);

        console.log(
          "Selected Grievance Department ID:",
          departmentId
        );

        // --------------------------------------------------------
        // FRONTEND FILTER
        // Only users belonging to the grievance department
        // --------------------------------------------------------

        const filteredUsers = allFieldUsers.filter(
          (user) =>
            Number(user.departmentId) ===
            Number(departmentId)
        );

        console.log(
          "Field Users for Selected Department:",
          filteredUsers
        );

        setFieldUsers(filteredUsers);
      } catch (err) {
        console.error(
          "Error fetching Field Users:",
          err
        );

        setFieldUsers([]);

        setError(
          err.response?.data?.message ||
            "Failed to load Field Users."
        );
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchFieldUsers();
  }, [departmentId, token]);

  // ============================================================
  // ASSIGN GRIEVANCE
  // ============================================================

  const handleAssign = async () => {
    setMessage("");
    setError("");

    if (!grievanceId) {
      setError("Grievance ID is required.");
      return;
    }

    if (!selectedUser) {
      setError("Please select a Field User.");
      return;
    }

    try {
      setAssigning(true);

      const response = await axios.put(
        `${API_BASE_URL}/api/UserGrievances/${grievanceId}/assign`,
        {
          assignedTo: selectedUser,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(
        response.data?.message ||
          "Grievance assigned successfully."
      );

      setSelectedUser("");

      if (onAssigned) {
        onAssigned(response.data);
      }
    } catch (err) {
      console.error(
        "Error assigning grievance:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to assign grievance."
      );
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="w-full">

      {/* ======================================================
          FIELD USER
      ======================================================= */}

      <div className="mb-5">
        <label className="mb-2 block text-sm font-medium text-[#123A63]">
          Field User
        </label>

        <select
          value={selectedUser}
          onChange={(e) =>
            setSelectedUser(e.target.value)
          }
          disabled={
            loadingUsers ||
            assigning ||
            fieldUsers.length === 0
          }
          className="w-full rounded-lg border border-[#D5E0EA] bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#2563A6]"
        >
          <option value="">
            {loadingUsers
              ? "Loading Field Users..."
              : fieldUsers.length === 0
              ? "No Field Users available for this department"
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
      </div>

      {/* ======================================================
          ERROR MESSAGE
      ======================================================= */}

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* ======================================================
          SUCCESS MESSAGE
      ======================================================= */}

      {message && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
          {message}
        </div>
      )}

      {/* ======================================================
          ASSIGN BUTTON
      ======================================================= */}

      <button
        type="button"
        onClick={handleAssign}
        disabled={
          assigning ||
          loadingUsers ||
          !selectedUser
        }
        className="w-full rounded-lg bg-[#2563A6] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#1D4F85] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {assigning
          ? "Assigning..."
          : "Assign Grievance"}
      </button>
    </div>
  );
};

export default AssignGrievance;