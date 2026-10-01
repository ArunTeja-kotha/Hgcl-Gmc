import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5163/api/Department";

const DepartmentForm = ({ editingDepartment, onSuccess, onCancel }) => {
  const [departmentName, setDepartmentName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditMode = Boolean(editingDepartment);

  useEffect(() => {
    if (editingDepartment) {
      setDepartmentName(editingDepartment.departmentName || "");
    } else {
      setDepartmentName("");
    }

    setError("");
  }, [editingDepartment]);

  const handleChange = (e) => {
    const value = e.target.value
      .replace(/[^A-Za-z\s]/g, "")
      .replace(/\s+/g, " ")
      .replace(/^\s+/, "");

    setDepartmentName(value);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = departmentName.trim();

    if (!name) {
      setError("Department name is required.");
      return;
    }

    if (name.length < 2) {
      setError("Department name must contain at least 2 characters.");
      return;
    }

    if (name.length > 100) {
      setError("Department name cannot exceed 100 characters.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      if (isEditMode) {
        await axios.put(
          `${API_URL}/${editingDepartment.departmentId}`,
          {
            departmentName: name,
          },
          config
        );
      } else {
        await axios.post(
          API_URL,
          {
            departmentName: name,
          },
          config
        );
      }

      onSuccess();
    } catch (error) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 401) {
        setError("You are not authorized.");
      } else if (error.response?.status === 403) {
        setError("You do not have permission for this operation.");
      } else {
        setError(
          isEditMode
            ? "Failed to update department."
            : "Failed to create department."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#123A63]">
            {isEditMode ? "Edit Department" : "Add Department"}
          </h2>

          <p className="mt-1 text-sm text-[#64748B]">
            {isEditMode
              ? "Update department details"
              : "Enter department details"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-[#1F2937]">
              Department Name
            </label>

            <input
              type="text"
              value={departmentName}
              onChange={handleChange}
              placeholder="Enter department name"
              maxLength={100}
              className={`w-full rounded-lg border px-4 py-2.5 text-sm outline-none ${
                error
                  ? "border-red-500"
                  : "border-[#D5E0EA] focus:border-[#2563A6]"
              }`}
            />

            {error && (
              <p className="mt-1 text-xs text-red-600">
                {error}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="rounded-lg border border-[#D5E0EA] px-5 py-2.5 text-sm font-medium text-[#64748B] hover:bg-[#F4F8FC]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#2563A6] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1D4F85] disabled:opacity-50"
            >
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update Department"
                : "Create Department"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentForm;