import React, { useEffect, useState } from "react";
import axios from "axios";
import RoleForm from "../components/RolesForm";

const API_URL = "http://localhost:5163/api/Roles";
const USER_API_URL = "http://localhost:5163/api/User";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(USER_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch users:", error);
      return [];
    }
  };

  const fetchRoles = async (userList = users) => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const rolesWithNames = response.data.map((role) => {
        const createdByUser = userList.find(
          (user) => Number(user.userId) === Number(role.createdBy)
        );

        const updatedByUser = userList.find(
          (user) => Number(user.userId) === Number(role.updatedBy)
        );

        return {
          ...role,
          createdByName: createdByUser
            ? `${createdByUser.firstName} ${createdByUser.lastName}`
            : null,
          updatedByName: updatedByUser
            ? `${updatedByUser.firstName} ${updatedByUser.lastName}`
            : null,
        };
      });

      setRoles(rolesWithNames);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        setError("You are not authorized to view roles.");
      } else if (error.response?.status === 403) {
        setError("You do not have permission to view roles.");
      } else {
        setError("Failed to load roles.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const userList = await fetchUsers();
      await fetchRoles(userList);
    };

    loadData();
  }, []);

  const handleAdd = () => {
    setEditingRole(null);
    setShowRoleForm(true);
  };

  const handleEdit = (role) => {
    if (role.roleName === "Super Administrator") {
      return;
    }

    setEditingRole(role);
    setShowRoleForm(true);
  };

  const handleDelete = async (roleId, roleName) => {
    if (roleName === "Super Administrator") {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this role?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(roleId);

      const token = localStorage.getItem("token");

      const response = await axios.delete(`${API_URL}/${roleId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchRoles(users);

      if (response.data?.message) {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else if (error.response?.status === 401) {
        alert("You are not authorized.");
      } else if (error.response?.status === 403) {
        alert("You do not have permission to delete this role.");
      } else {
        alert("Failed to delete role.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleFormSuccess = async () => {
    setShowRoleForm(false);
    setEditingRole(null);
    await fetchRoles(users);
  };

  const handleFormCancel = () => {
    setShowRoleForm(false);
    setEditingRole(null);
  };

  const filteredRoles = roles.filter((role) =>
    role.roleName?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDateTime = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#123A63]">
            Role Management
          </h1>

          <p className="mt-1 text-sm text-[#64748B]">
            Manage system roles
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="rounded-lg bg-[#2563A6] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1D4F85]"
        >
          Add Role
        </button>
      </div>

      <div className="mb-5 rounded-xl border border-[#D5E0EA] bg-white p-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search role..."
          className="w-full rounded-lg border border-[#D5E0EA] px-4 py-2.5 text-sm outline-none focus:border-[#2563A6]"
        />
      </div>

      {loading && (
        <div className="rounded-xl border border-[#D5E0EA] bg-white p-8 text-center text-[#64748B]">
          Loading roles...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-hidden rounded-xl border border-[#D5E0EA] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-250">
              <thead>
                <tr className="border-b border-[#D5E0EA] bg-[#E8F2FB]">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#123A63]">
                    Role Name
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#123A63]">
                    Created By
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#123A63]">
                    Updated By
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#123A63]">
                    Updated At
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#123A63]">
                    Active
                  </th>

                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#123A63]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredRoles.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-sm text-[#64748B]"
                    >
                      No roles found.
                    </td>
                  </tr>
                ) : (
                  filteredRoles.map((role) => (
                    <tr
                      key={role.roleId}
                      className="border-b border-[#D5E0EA] last:border-b-0"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-[#1F2937]">
                        {role.roleName}
                      </td>

                      <td className="px-6 py-4 text-sm text-[#64748B]">
                        {role.createdByName ?? "-"}
                      </td>

                      <td className="px-6 py-4 text-sm text-[#64748B]">
                        {role.updatedByName ?? "-"}
                      </td>

                      <td className="px-6 py-4 text-sm text-[#64748B]">
                        {formatDateTime(role.updatedAt)}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            role.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {role.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        {role.roleName === "Super Administrator" ? (
                          <span className="text-sm font-medium text-[#64748B]">
                            Protected
                          </span>
                        ) : (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(role)}
                              className="rounded-lg border border-[#2563A6] px-4 py-2 text-sm font-medium text-[#2563A6] hover:bg-[#E8F2FB]"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(role.roleId, role.roleName)
                              }
                              disabled={deletingId === role.roleId}
                              className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                              {deletingId === role.roleId
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showRoleForm && (
        <RoleForm
          editingRole={editingRole}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default Roles;

