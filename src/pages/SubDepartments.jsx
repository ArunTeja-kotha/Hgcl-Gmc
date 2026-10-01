import React, { useEffect, useState } from "react";
import axios from "axios";
import SubDepartmentForm from "../components/SubDepartmentForm";

const API_URL = "http://localhost:5163/api/SubDepartment";
const DEPARTMENT_API_URL = "http://localhost:5163/api/Department";
const USER_API_URL = "http://localhost:5163/api/User";

const SubDepartments = () => {
  const [subdepartments, setSubdepartments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingSubDepartment, setEditingSubDepartment] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(DEPARTMENT_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDepartments(response.data);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      setError("Failed to load departments.");
    }
  };

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

  const fetchSubdepartments = async (userList = users) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const subdepartmentsWithNames = response.data.map(
        (subdepartment) => {
          const createdByUser = userList.find(
            (user) =>
              Number(user.userId) ===
              Number(subdepartment.createdBy)
          );

          const updatedByUser = userList.find(
            (user) =>
              Number(user.userId) ===
              Number(subdepartment.updatedBy)
          );

          return {
            ...subdepartment,
            createdByName: createdByUser
              ? `${createdByUser.firstName} ${createdByUser.lastName}`
              : null,
            updatedByName: updatedByUser
              ? `${updatedByUser.firstName} ${updatedByUser.lastName}`
              : null,
          };
        }
      );

      setSubdepartments(subdepartmentsWithNames);
    } catch (error) {
      console.error(
        "Failed to fetch subdepartments:",
        error
      );

      setError("Failed to load subdepartments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        await fetchDepartments();

        const userList = await fetchUsers();

        await fetchSubdepartments(userList);
      } catch (error) {
        console.error("Failed to load data:", error);
        setError("Failed to load data.");
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getDepartmentName = (departmentId) => {
    const department = departments.find(
      (departmentItem) =>
        Number(departmentItem.departmentId) ===
        Number(departmentId)
    );

    return department
      ? department.departmentName
      : "-";
  };

  const filteredSubdepartments = subdepartments.filter(
    (subdepartment) => {
      const departmentName = getDepartmentName(
        subdepartment.departmentId
      );

      const searchValue = search.toLowerCase();

      return (
        subdepartment.subdepartmentName
          ?.toLowerCase()
          .includes(searchValue) ||
        departmentName
          ?.toLowerCase()
          .includes(searchValue) ||
        subdepartment.createdByName
          ?.toLowerCase()
          .includes(searchValue) ||
        subdepartment.updatedByName
          ?.toLowerCase()
          .includes(searchValue)
      );
    }
  );

  const handleAdd = () => {
    setEditingSubDepartment(null);
    setShowForm(true);
    setError("");
  };

  const handleEdit = (subdepartment) => {
    setEditingSubDepartment(subdepartment);
    setShowForm(true);
    setError("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this subdepartment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userList = users;

      await fetchSubdepartments(userList);
    } catch (error) {
      console.error("Failed to delete subdepartment:", error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 401) {
        setError("You are not authorized.");
      } else if (error.response?.status === 403) {
        setError(
          "You do not have permission to delete this subdepartment."
        );
      } else {
        setError("Failed to delete subdepartment.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleSuccess = async () => {
    setShowForm(false);
    setEditingSubDepartment(null);
    setError("");

    const userList = users.length
      ? users
      : await fetchUsers();

    await fetchSubdepartments(userList);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSubDepartment(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] p-6">
      <div className="rounded-xl border border-[#D5E0EA] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#D5E0EA] px-6 py-5">
          <div>
            <h1 className="text-2xl font-semibold text-[#123A63]">
              Sub Departments
            </h1>

            <p className="mt-1 text-sm text-[#64748B]">
              Manage sub departments
            </p>
          </div>

          <button
            onClick={handleAdd}
            className="rounded-lg bg-[#2563A6] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1D4F85]"
          >
            Add Sub Department
          </button>
        </div>

        <div className="border-b border-[#D5E0EA] px-6 py-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sub departments..."
            className="w-full rounded-lg border border-[#D5E0EA] px-4 py-2.5 text-sm outline-none focus:border-[#2563A6] focus:ring-1 focus:ring-[#2563A6]"
          />
        </div>

        {error && (
          <div className="mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="px-6 py-10 text-center text-sm text-[#64748B]">
            Loading sub departments...
          </div>
        ) : filteredSubdepartments.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-[#64748B]">
            No sub departments found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#D5E0EA] bg-[#E8F2FB]">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#123A63]">
                    Department
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#123A63]">
                    Sub Department
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
                {filteredSubdepartments.map(
                  (subdepartment) => (
                    <tr
                      key={subdepartment.subdepartmentId}
                      className="border-b border-[#D5E0EA] last:border-b-0"
                    >
                      <td className="px-6 py-4 text-sm text-[#1F2937]">
                        {getDepartmentName(
                          subdepartment.departmentId
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-[#1F2937]">
                        {subdepartment.subdepartmentName}
                      </td>

                      <td className="px-6 py-4 text-sm text-[#64748B]">
                        {subdepartment.createdByName ?? "-"}
                      </td>

                      <td className="px-6 py-4 text-sm text-[#64748B]">
                        {subdepartment.updatedByName ?? "-"}
                      </td>

                      <td className="px-6 py-4 text-sm text-[#64748B]">
                        {subdepartment.updatedAt
                          ? new Date(
                              subdepartment.updatedAt
                            ).toLocaleString()
                          : "-"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            subdepartment.isActive
                              ? "bg-green-50 text-[#4F8A63]"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {subdepartment.isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              handleEdit(subdepartment)
                            }
                            className="rounded-lg border border-[#2563A6] px-4 py-2 text-sm font-medium text-[#2563A6] hover:bg-[#E8F2FB]"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                subdepartment.subdepartmentId
                              )
                            }
                            disabled={
                              deletingId ===
                              subdepartment.subdepartmentId
                            }
                            className="rounded-lg border border-red-600 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId ===
                            subdepartment.subdepartmentId
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <SubDepartmentForm
          editingSubDepartment={editingSubDepartment}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default SubDepartments;