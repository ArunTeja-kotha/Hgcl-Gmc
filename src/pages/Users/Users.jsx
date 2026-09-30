import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import UserForm from "./UserForm";

const Users = () => {
  // ==========================================
  // STATE
  // ==========================================

  const [users, setUsers] = useState([]);

  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [status, setStatus] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // ==========================================
  // GET ALL USERS
  // ==========================================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5163/api/User",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);

      if (error.response?.status === 401) {
        setError("Unauthorized. Please login again.");
      } else if (error.response?.status === 403) {
        setError("You do not have permission to view users.");
      } else {
        setError("Failed to load users.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GET ROLES
  // ==========================================

  const fetchRoles = async () => {
    try {
      setRolesLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5163/api/Roles",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);

      if (error.response?.status === 401) {
        setError("Unauthorized. Please login again.");
      } else if (error.response?.status === 403) {
        setError("You do not have permission to view roles.");
      } else {
        setError("Failed to load roles.");
      }
    } finally {
      setRolesLoading(false);
    }
  };

  // ==========================================
  // LOAD USERS AND ROLES
  // ==========================================

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // ==========================================
  // CREATE USER
  // ==========================================

  const handleCreate = () => {
    setEditingUser(null);
    setShowUserForm(true);
  };

  // ==========================================
  // EDIT USER
  // GET USER BY ID
  // ==========================================

  const handleEdit = async (userId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `http://localhost:5163/api/User/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Store selected user
      setEditingUser(response.data);

      // Open UserForm
      setShowUserForm(true);
    } catch (error) {
      console.error("Error fetching user:", error);

      const message =
        error.response?.data?.message ||
        "Failed to load user details.";

      alert(message);
    }
  };

  // ==========================================
  // DELETE USER
  // DELETE /api/User/{id}
  // ==========================================

  const handleDelete = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `http://localhost:5163/api/User/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("User deleted successfully.");

      // Reload users
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);

      const message =
        error.response?.data?.message ||
        "Failed to delete user.";

      alert(message);
    }
  };

  // ==========================================
  // FORM SUCCESS
  // CREATE / UPDATE
  // ==========================================

  const handleFormSuccess = () => {
    setShowUserForm(false);
    setEditingUser(null);

    // Reload users
    fetchUsers();
  };

  // ==========================================
  // FORM CANCEL
  // ==========================================

  const handleFormCancel = () => {
    setShowUserForm(false);
    setEditingUser(null);
  };

  // ==========================================
  // FILTER USERS
  // ==========================================

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const fullName =
        `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();

      const searchValue = search.toLowerCase();

      // Search by name OR email
      const matchesSearch =
        fullName.includes(searchValue) ||
        (user.email || "").toLowerCase().includes(searchValue);

      // Filter by role
      const matchesRole =
        role === "All" ||
        String(user.roleId) === String(role);

      // Filter by status
      const matchesStatus =
        status === "All" ||
        (status === "Active" && user.isActive) ||
        (status === "Inactive" && !user.isActive);

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [users, search, role, status]);

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-[#F4F8FC] p-6">

      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-2xl font-semibold text-[#1F2937]">
            User Management
          </h1>

          <p className="text-sm text-[#64748B] mt-1">
            Manage system users and their access
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="
            bg-[#123A63]
            hover:bg-[#1D4F85]
            text-white
            px-5
            py-2.5
            rounded-md
            text-sm
            font-medium
          "
        >
          + Create User
        </button>

      </div>

      {/* ==========================================
          ERROR MESSAGE
      ========================================== */}

      {error && (
        <div className="
          bg-red-50
          border
          border-red-200
          text-red-700
          px-4
          py-3
          rounded-md
          mb-5
        ">
          {error}
        </div>
      )}

      {/* ==========================================
          USER FORM
      ========================================== */}

      {showUserForm && (
        <UserForm
          editingUser={editingUser}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}

      {/* ==========================================
          FILTERS
      ========================================== */}

      <div className="
        bg-white
        border
        border-[#D5E0EA]
        rounded-lg
        p-4
        mb-5
      ">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* SEARCH */}

          <div>
            <label className="
              block
              text-sm
              font-medium
              text-[#1F2937]
              mb-1
            ">
              Search
            </label>

            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                border
                border-[#D5E0EA]
                rounded-md
                px-3
                py-2
                text-sm
                outline-none
                focus:border-[#2563A6]
              "
            />
          </div>

          {/* ROLE */}

          <div>
            <label className="
              block
              text-sm
              font-medium
              text-[#1F2937]
              mb-1
            ">
              Role
            </label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={rolesLoading}
              className="
                w-full
                border
                border-[#D5E0EA]
                rounded-md
                px-3
                py-2
                text-sm
                outline-none
                focus:border-[#2563A6]
                disabled:bg-gray-100
              "
            >
              <option value="All">
                {rolesLoading
                  ? "Loading roles..."
                  : "All Roles"}
              </option>

              {roles.map((roleItem) => (
                <option
                  key={roleItem.roleId}
                  value={roleItem.roleId}
                >
                  {roleItem.roleName}
                </option>
              ))}
            </select>
          </div>

          {/* STATUS */}

          <div>
            <label className="
              block
              text-sm
              font-medium
              text-[#1F2937]
              mb-1
            ">
              Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="
                w-full
                border
                border-[#D5E0EA]
                rounded-md
                px-3
                py-2
                text-sm
                outline-none
                focus:border-[#2563A6]
              "
            >
              <option value="All">
                All Status
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>
          </div>

        </div>
      </div>

      {/* ==========================================
          USERS TABLE
      ========================================== */}

      <div className="
        bg-white
        border
        border-[#D5E0EA]
        rounded-lg
        overflow-hidden
      ">

        {/* TABLE HEADER */}

        <div className="
          px-5
          py-4
          border-b
          border-[#D5E0EA]
        ">

          <h2 className="
            text-lg
            font-semibold
            text-[#1F2937]
          ">
            Users
          </h2>

          <p className="
            text-sm
            text-[#64748B]
            mt-1
          ">
            {loading
              ? "Loading..."
              : `${filteredUsers.length} user(s) found`}
          </p>

        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            {/* TABLE HEAD */}

            <thead className="bg-[#E8F2FB]">

              <tr>

                <th className="
                  text-left
                  px-5
                  py-3
                  font-semibold
                ">
                  ID
                </th>

                <th className="
                  text-left
                  px-5
                  py-3
                  font-semibold
                ">
                  Name
                </th>

                <th className="
                  text-left
                  px-5
                  py-3
                  font-semibold
                ">
                  Email
                </th>

                <th className="
                  text-left
                  px-5
                  py-3
                  font-semibold
                ">
                  Phone
                </th>

                <th className="
                  text-left
                  px-5
                  py-3
                  font-semibold
                ">
                  Role
                </th>

                <th className="
                  text-left
                  px-5
                  py-3
                  font-semibold
                ">
                  Department ID
                </th>

                <th className="
                  text-left
                  px-5
                  py-3
                  font-semibold
                ">
                  Status
                </th>

                <th className="
                  text-left
                  px-5
                  py-3
                  font-semibold
                ">
                  Actions
                </th>

              </tr>

            </thead>

            {/* TABLE BODY */}

            <tbody>

              {/* LOADING */}

              {loading ? (

                <tr>

                  <td
                    colSpan="8"
                    className="
                      text-center
                      py-10
                      text-[#64748B]
                    "
                  >
                    Loading users...
                  </td>

                </tr>

              ) : filteredUsers.length > 0 ? (

                /* USERS */

                filteredUsers.map((user) => {

                  const userRole = roles.find(
                    (roleItem) =>
                      Number(roleItem.roleId) ===
                      Number(user.roleId)
                  );

                  return (
                    <tr
                      key={user.userId}
                      className="
                        border-t
                        border-[#D5E0EA]
                        hover:bg-[#F4F8FC]
                      "
                    >

                      {/* ID */}

                      <td className="px-5 py-3">
                        {user.userId}
                      </td>

                      {/* NAME */}

                      <td className="
                        px-5
                        py-3
                        font-medium
                      ">
                        {user.firstName}{" "}
                        {user.lastName}
                      </td>

                      {/* EMAIL */}

                      <td className="
                        px-5
                        py-3
                        text-[#64748B]
                      ">
                        {user.email}
                      </td>

                      {/* PHONE */}

                      <td className="px-5 py-3">
                        {user.phoneNumber}
                      </td>

                      {/* ROLE */}

                      <td className="px-5 py-3">

                        {userRole
                          ? userRole.roleName
                          : "-"}

                      </td>

                      {/* DEPARTMENT */}

                      <td className="px-5 py-3">
                        {user.departmentId ?? "-"}
                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-3">

                        <span
                          className={`
                            inline-flex
                            px-2.5
                            py-1
                            rounded-full
                            text-xs
                            font-medium
                            ${
                              user.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }
                          `}
                        >
                          {user.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td className="px-5 py-3">

                        <div className="flex gap-3">

                          {/* EDIT */}

                          <button
                            onClick={() =>
                              handleEdit(user.userId)
                            }
                            className="
                              text-[#2563A6]
                              hover:underline
                            "
                          >
                            Edit
                          </button>

                          {/* DELETE */}

                          <button
                            onClick={() =>
                              handleDelete(user.userId)
                            }
                            className="
                              text-red-600
                              hover:underline
                            "
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })

              ) : (

                /* NO USERS */

                <tr>

                  <td
                    colSpan="8"
                    className="
                      text-center
                      py-10
                      text-[#64748B]
                    "
                  >
                    No users found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default Users;