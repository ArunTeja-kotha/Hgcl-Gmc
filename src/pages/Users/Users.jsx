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
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchDepartments();
  }, []);

  const handleCreate = () => {
    setEditingUser(null);
    setShowUserForm(true);
  };

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
      console.error("Error fetching user:", error);

      const message =
        error.response?.data?.message ||
        "Failed to load user details.";

      alert(message);
    }
  };

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

      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);

      const message =
        error.response?.data?.message ||
        "Failed to delete user.";

      alert(message);
    }
  };

  const handleFormSuccess = () => {
    setShowUserForm(false);
    setEditingUser(null);
    fetchUsers();
  };

  const handleFormCancel = () => {
    setShowUserForm(false);
    setEditingUser(null);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const fullName =
        `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();

      const searchValue = search.toLowerCase();

      const matchesSearch =
        fullName.includes(searchValue) ||
        (user.email || "").toLowerCase().includes(searchValue);

      const matchesRole =
        role === "All" ||
        String(user.roleId) === String(role);

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

  return (
    <div className="min-h-screen bg-[#F4F8FC] p-6">
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
          className="bg-[#123A63] hover:bg-[#1D4F85] text-white px-5 py-2.5 rounded-md text-sm font-medium"
        >
          + Create User
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-5">
          {error}
        </div>
      )}

      {showUserForm && (
        <UserForm
          editingUser={editingUser}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}

      <div className="bg-white border border-[#D5E0EA] rounded-lg p-4 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#1F2937] mb-1">
              Search
            </label>

            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-[#D5E0EA] rounded-md px-3 py-2 text-sm outline-none focus:border-[#2563A6]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1F2937] mb-1">
              Role
            </label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={rolesLoading}
              className="w-full border border-[#D5E0EA] rounded-md px-3 py-2 text-sm outline-none focus:border-[#2563A6] disabled:bg-gray-100"
            >
              <option value="All">
                {rolesLoading ? "Loading roles..." : "All Roles"}
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

          <div>
            <label className="block text-sm font-medium text-[#1F2937] mb-1">
              Status
            </label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-[#D5E0EA] rounded-md px-3 py-2 text-sm outline-none focus:border-[#2563A6]"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#D5E0EA] rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-[#D5E0EA]">
          <h2 className="text-lg font-semibold text-[#1F2937]">
            Users
          </h2>

          <p className="text-sm text-[#64748B] mt-1">
            {loading
              ? "Loading..."
              : `${filteredUsers.length} user(s) found`}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#E8F2FB]">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">
                  Name
                </th>

                <th className="text-left px-5 py-3 font-semibold">
                  Email
                </th>

                <th className="text-left px-5 py-3 font-semibold">
                  Phone
                </th>

                <th className="text-left px-5 py-3 font-semibold">
                  Role
                </th>

                <th className="text-left px-5 py-3 font-semibold">
                  Department
                </th>

                <th className="text-left px-5 py-3 font-semibold">
                  Status
                </th>

                <th className="text-left px-5 py-3 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-10 text-[#64748B]"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const userRole = roles.find(
                    (roleItem) =>
                      Number(roleItem.roleId) ===
                      Number(user.roleId)
                  );

                  const department = departments.find(
                    (departmentItem) =>
                      Number(departmentItem.departmentId) ===
                      Number(user.departmentId)
                  );

                  return (
                    <tr
                      key={user.userId}
                      className="border-t border-[#D5E0EA] hover:bg-[#F4F8FC]"
                    >
                      <td className="px-5 py-3 font-medium">
                        {user.firstName} {user.lastName}
                      </td>

                      <td className="px-5 py-3 text-[#64748B]">
                        {user.email}
                      </td>

                      <td className="px-5 py-3">
                        {user.phoneNumber}
                      </td>

                      <td className="px-5 py-3">
                        {userRole
                          ? userRole.roleName
                          : "-"}
                      </td>

                      <td className="px-5 py-3">
                        {department
                          ? department.departmentName
                          : "-"}
                      </td>

                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
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

                      <td className="px-5 py-3">
                       <div className="flex gap-2">
                            <div className="flex justify-end gap-2">
  <button
    onClick={() => handleEdit(user.userId)}
    className="rounded-lg border border-[#2563A6] px-4 py-2 text-sm font-medium text-[#2563A6] hover:bg-[#E8F2FB]"
  >
    Edit
  </button>

  <button
    onClick={() => handleDelete(user.userId)}
    className="rounded-lg border border-red-600 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
  >
    Delete
  </button>
</div>

</div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-10 text-[#64748B]"
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