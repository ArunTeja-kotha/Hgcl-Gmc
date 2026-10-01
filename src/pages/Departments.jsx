import React, { useEffect, useState } from "react";
import axios from "axios";
import DepartmentForm from "../components/DepartmentForm";

const API_URL = "http://localhost:5163/api/Department";
const USER_API_URL = "http://localhost:5163/api/User";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
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

  const fetchDepartments = async (userList = users) => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const departmentsWithNames = response.data.map(
        (department) => {
          const createdByUser = userList.find(
            (user) =>
              Number(user.userId) ===
              Number(department.createdBy)
          );

          const updatedByUser = userList.find(
            (user) =>
              Number(user.userId) ===
              Number(department.updatedBy)
          );

          return {
            ...department,
            createdByName: createdByUser
              ? `${createdByUser.firstName} ${createdByUser.lastName}`
              : null,
            updatedByName: updatedByUser
              ? `${updatedByUser.firstName} ${updatedByUser.lastName}`
              : null,
          };
        }
      );

      setDepartments(departmentsWithNames);
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        setError(
          "You are not authorized to view departments."
        );
      } else if (error.response?.status === 403) {
        setError(
          "You do not have permission to view departments."
        );
      } else {
        setError("Failed to load departments.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");

      const userList = await fetchUsers();

      await fetchDepartments(userList);
    };

    loadData();
  }, []);

  const handleAdd = () => {
    setEditingDepartment(null);
    setShowDepartmentForm(true);
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setShowDepartmentForm(true);
  };

  const handleDelete = async (departmentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this department?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(departmentId);

      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `${API_URL}/${departmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchDepartments(users);

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
        alert(
          "You do not have permission to delete this department."
        );
      } else {
        alert("Failed to delete department.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleFormSuccess = async () => {
    setShowDepartmentForm(false);
    setEditingDepartment(null);

    await fetchDepartments(users);
  };

  const handleFormCancel = () => {
    setShowDepartmentForm(false);
    setEditingDepartment(null);
  };

  const filteredDepartments = departments.filter(
    (department) =>
      department.departmentName
        ?.toLowerCase()
        .includes(search.toLowerCase())
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
            Department Management
          </h1>

          <p className="mt-1 text-sm text-[#64748B]">
            Manage departments
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="rounded-lg bg-[#2563A6] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1D4F85]"
        >
          Add Department
        </button>
      </div>

      <div className="mb-5 rounded-xl border border-[#D5E0EA] bg-white p-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search department..."
          className="w-full rounded-lg border border-[#D5E0EA] px-4 py-2.5 text-sm outline-none focus:border-[#2563A6]"
        />
      </div>

      {loading && (
        <div className="rounded-xl border border-[#D5E0EA] bg-white p-8 text-center text-[#64748B]">
          Loading departments...
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
            <table className="w-full min-w-225">
              <thead>
                <tr className="border-b border-[#D5E0EA] bg-[#E8F2FB]">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#123A63]">
                    Department Name
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
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#123A63]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredDepartments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-sm text-[#64748B]"
                    >
                      No departments found.
                    </td>
                  </tr>
                ) : (
                  filteredDepartments.map((department) => (
                    <tr
                      key={department.departmentId}
                      className="border-b border-[#D5E0EA] last:border-b-0"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-[#1F2937]">
                        {department.departmentName}
                      </td>

                      <td className="px-6 py-4 text-sm text-[#64748B]">
                        {department.createdByName ?? "-"}
                      </td>

                      <td className="px-6 py-4 text-sm text-[#64748B]">
                        {department.updatedByName ?? "-"}
                      </td>

                      <td className="px-6 py-4 text-sm text-[#64748B]">
                        {formatDateTime(department.updatedAt)}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            department.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {department.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              handleEdit(department)
                            }
                            className="rounded-lg border border-[#2563A6] px-4 py-2 text-sm font-medium text-[#2563A6] hover:bg-[#E8F2FB]"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                department.departmentId
                              )
                            }
                            disabled={
                              deletingId ===
                              department.departmentId
                            }
                            className="rounded-lg border border-red-600 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            {deletingId ===
                            department.departmentId
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showDepartmentForm && (
        <DepartmentForm
          editingDepartment={editingDepartment}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default Departments;