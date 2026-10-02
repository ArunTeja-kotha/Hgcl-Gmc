import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import UserForm from "./UserForm";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [rolesLoading, setRolesLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [status, setStatus] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // ============================================================
  // LOGGED-IN USER ROLE
  // ============================================================

  const storedRole = localStorage.getItem("role");

  const loggedInRole = storedRole
    ?.replace(/\s+/g, " ")
    .trim();

  // Only Super Administrator can delete users
  const isSuperAdmin =
    loggedInRole === "Super Administrator";

  // ============================================================
  // FETCH USERS
  // ============================================================

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
      console.error(
        "Error fetching users:",
        error
      );

      if (error.response?.status === 401) {
        setError(
          "Unauthorized. Please login again."
        );
      } else if (error.response?.status === 403) {
        setError(
          "You do not have permission to view users."
        );
      } else {
        setError("Failed to load users.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // FETCH ROLES
  // ============================================================

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
      console.error(
        "Error fetching roles:",
        error
      );

      if (error.response?.status === 401) {
        setError(
          "Unauthorized. Please login again."
        );
      } else if (error.response?.status === 403) {
        setError(
          "You do not have permission to view roles."
        );
      } else {
        setError("Failed to load roles.");
      }
    } finally {
      setRolesLoading(false);
    }
  };

  // ============================================================
  // FETCH DEPARTMENTS
  // ============================================================

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5163/api/Department",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDepartments(response.data);
    } catch (error) {
      console.error(
        "Error fetching departments:",
        error
      );
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchDepartments();
  }, []);

  // ============================================================
  // CREATE USER
  // ============================================================

  const handleCreate = () => {
    setEditingUser(null);
    setShowUserForm(true);
  };

  // ============================================================
  // EDIT USER
  // ============================================================

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

      setEditingUser(response.data);
      setShowUserForm(true);
    } catch (error) {
      console.error(
        "Error fetching user:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Failed to load user details.";

      alert(message);
    }
  };

  // ============================================================
  // DELETE USER
  // ============================================================

  const handleDelete = async (userId) => {
    // Extra frontend protection
    if (!isSuperAdmin) {
      alert(
        "Only Super Administrator can delete users."
      );
      return;
    }

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

      fetchUsers();
    } catch (error) {
      console.error(
        "Error deleting user:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Failed to delete user.";

      alert(message);
    }
  };

  // ============================================================
  // FORM SUCCESS
  // ============================================================

  const handleFormSuccess = () => {
    setShowUserForm(false);
    setEditingUser(null);

    fetchUsers();
  };

  // ============================================================
  // FORM CANCEL
  // ============================================================

  const handleFormCancel = () => {
    setShowUserForm(false);
    setEditingUser(null);
  };

  // ============================================================
  // FILTER USERS
  // ============================================================

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const fullName =
        `${user.firstName || ""} ${
          user.lastName || ""
        }`.toLowerCase();

      const searchValue =
        search.toLowerCase();

      const matchesSearch =
        fullName.includes(searchValue) ||
        (user.email || "")
          .toLowerCase()
          .includes(searchValue);

      const matchesRole =
        role === "All" ||
        String(user.roleId) === String(role);

      const matchesStatus =
        status === "All" ||
        (status === "Active" &&
          user.isActive) ||
        (status === "Inactive" &&
          !user.isActive);

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [users, search, role, status]);

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen bg-[#F4F8FC] p-6">

      {/* ======================================================
          HEADER
      ======================================================= */}

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-semibold text-[#1F2937]">
            User Management
          </h1>

          <p className="mt-1 text-sm text-[#64748B]">
            Manage system users and their access
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="rounded-md bg-[#123A63] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1D4F85]"
        >
          + Create User
        </button>

      </div>

      {/* ======================================================
          ERROR
      ======================================================= */}

      {error && (
        <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {/* ======================================================
          USER FORM
      ======================================================= */}

      {showUserForm && (
        <UserForm
          editingUser={editingUser}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}

      {/* ======================================================
          FILTERS
      ======================================================= */}

      <div className="mb-5 rounded-lg border border-[#D5E0EA] bg-white p-4">

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* Search */}

          <div>
            <label className="mb-1 block text-sm font-medium text-[#1F2937]">
              Search
            </label>

            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-md border border-[#D5E0EA] px-3 py-2 text-sm outline-none focus:border-[#2563A6]"
            />
          </div>

          {/* Role */}

          <div>
            <label className="mb-1 block text-sm font-medium text-[#1F2937]">
              Role
            </label>

            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
              disabled={rolesLoading}
              className="w-full rounded-md border border-[#D5E0EA] px-3 py-2 text-sm outline-none focus:border-[#2563A6] disabled:bg-gray-100"
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

          {/* Status */}

          <div>
            <label className="mb-1 block text-sm font-medium text-[#1F2937]">
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="w-full rounded-md border border-[#D5E0EA] px-3 py-2 text-sm outline-none focus:border-[#2563A6]"
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

      {/* ======================================================
          USERS TABLE
      ======================================================= */}

      <div className="overflow-hidden rounded-lg border border-[#D5E0EA] bg-white">

        {/* Table Header */}

        <div className="border-b border-[#D5E0EA] px-5 py-4">

          <h2 className="text-lg font-semibold text-[#1F2937]">
            Users
          </h2>

          <p className="mt-1 text-sm text-[#64748B]">
            {loading
              ? "Loading..."
              : `${filteredUsers.length} user(s) found`}
          </p>

        </div>

        {/* Table */}

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-[#E8F2FB]">

              <tr>

                <th className="px-5 py-3 text-left font-semibold">
                  Name
                </th>

                <th className="px-5 py-3 text-left font-semibold">
                  Email
                </th>

                <th className="px-5 py-3 text-left font-semibold">
                  Phone
                </th>

                <th className="px-5 py-3 text-left font-semibold">
                  Role
                </th>

                <th className="px-5 py-3 text-left font-semibold">
                  Department
                </th>

                <th className="px-5 py-3 text-left font-semibold">
                  Status
                </th>

                <th className="px-5 py-3 text-left font-semibold">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td
                    colSpan="7"
                    className="py-10 text-center text-[#64748B]"
                  >
                    Loading users...
                  </td>
                </tr>

              ) : filteredUsers.length > 0 ? (

                filteredUsers.map((user) => {

                  const userRole =
                    roles.find(
                      (roleItem) =>
                        Number(
                          roleItem.roleId
                        ) ===
                        Number(
                          user.roleId
                        )
                    );

                  const department =
                    departments.find(
                      (departmentItem) =>
                        Number(
                          departmentItem.departmentId
                        ) ===
                        Number(
                          user.departmentId
                        )
                    );

                  return (
                    <tr
                      key={user.userId}
                      className="border-t border-[#D5E0EA] hover:bg-[#F4F8FC]"
                    >

                      {/* Name */}

                      <td className="px-5 py-3 font-medium">
                        {user.firstName}{" "}
                        {user.lastName}
                      </td>

                      {/* Email */}

                      <td className="px-5 py-3 text-[#64748B]">
                        {user.email}
                      </td>

                      {/* Phone */}

                      <td className="px-5 py-3">
                        {user.phoneNumber}
                      </td>

                      {/* Role */}

                      <td className="px-5 py-3">
                        {userRole
                          ? userRole.roleName
                          : "-"}
                      </td>

                      {/* Department */}

                      <td className="px-5 py-3">
                        {department
                          ? department.departmentName
                          : "-"}
                      </td>

                      {/* Status */}

                      <td className="px-5 py-3">

                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            user.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {user.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>

                      </td>

                      {/* Actions */}

                      <td className="px-5 py-3">

                        <div className="flex gap-2">

                          {/* Edit - available */}

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                user.userId
                              )
                            }
                            className="rounded-lg border border-[#2563A6] px-4 py-2 text-sm font-medium text-[#2563A6] hover:bg-[#E8F2FB]"
                          >
                            Edit
                          </button>

                          {/* Delete - Super Admin ONLY */}

                          {isSuperAdmin && (
                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  user.userId
                                )
                              }
                              className="rounded-lg border border-red-600 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          )}

                        </div>

                      </td>

                    </tr>
                  );
                })

              ) : (

                <tr>
                  <td
                    colSpan="7"
                    className="py-10 text-center text-[#64748B]"
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