import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5163/api/GrievanceCategory";

const GrievanceCategoryForm = ({
  editingCategory,
  onSuccess,
  onCancel,
}) => {

  const [formData, setFormData] = useState({
    categoryName: "",
    priority: "",
    responseTat: "",
    resolutionTat: "",
    escalation1: "",
    escalation2: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==============================
  // LOAD EDIT DATA
  // ==============================
  useEffect(() => {

    if (editingCategory) {

      setFormData({
        categoryName: editingCategory.categoryName || "",
        priority: editingCategory.priority || "",
        responseTat: editingCategory.responseTat || "",
        resolutionTat: editingCategory.resolutionTat || "",
        escalation1: editingCategory.escalation1 || "",
        escalation2: editingCategory.escalation2 || "",
      });

    } else {

      setFormData({
        categoryName: "",
        priority: "",
        responseTat: "",
        resolutionTat: "",
        escalation1: "",
        escalation2: "",
      });

    }

  }, [editingCategory]);

  // ==============================
  // HANDLE INPUT CHANGE
  // ==============================
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

  };

  // ==============================
  // SUBMIT
  // ==============================
  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      // ADD
      let url = API_URL;
      let method = "POST";

      // EDIT
      if (editingCategory) {
        url = `${API_URL}/${editingCategory.categoryId}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method: method,

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(formData),
      });

      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {

        let message = "Something went wrong";

        if (data?.message) {
          message = data.message;
        } else if (data?.title) {
          message = data.title;
        }

        throw new Error(message);
      }

      // Tell parent that save was successful
      onSuccess();

    } catch (error) {

      console.error("Error saving category:", error);

      setError(error.message);

    } finally {

      setLoading(false);

    }

  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">

        {/* ==============================
            HEADER
        ============================== */}

        <div className="flex items-center justify-between border-b border-[#D5E0EA] px-6 py-4">

          <div>

            <h2 className="text-xl font-semibold text-[#123A63]">
              {editingCategory
                ? "Edit Grievance Category"
                : "Add Grievance Category"}
            </h2>

            <p className="mt-1 text-sm text-[#64748B]">
              {editingCategory
                ? "Update grievance category details"
                : "Enter grievance category details"}
            </p>

          </div>

          <button
            type="button"
            onClick={onCancel}
            className="text-2xl text-gray-500 hover:text-gray-700"
          >
            ×
          </button>

        </div>

        {/* ==============================
            FORM
        ============================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >

          {/* ERROR */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* CATEGORY NAME */}
          <div>

            <label className="mb-1 block text-sm font-medium text-[#1F2937]">
              Category Name
            </label>

            <input
              type="text"
              name="categoryName"
              value={formData.categoryName}
              onChange={handleChange}
              placeholder="Enter category name"
              required
              className="w-full rounded-lg border border-[#D5E0EA] px-4 py-2.5 outline-none focus:border-[#2563A6]"
            />

          </div>

          {/* PRIORITY */}
          <div>

            <label className="mb-1 block text-sm font-medium text-[#1F2937]">
              Priority
            </label>

            <input
              type="text"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              placeholder="Enter priority"
              required
              className="w-full rounded-lg border border-[#D5E0EA] px-4 py-2.5 outline-none focus:border-[#2563A6]"
            />

          </div>

          {/* RESPONSE TAT */}
          <div>

            <label className="mb-1 block text-sm font-medium text-[#1F2937]">
              Response TAT
            </label>

            <input
              type="text"
              name="responseTat"
              value={formData.responseTat}
              onChange={handleChange}
              placeholder="Enter response TAT"
              required
              className="w-full rounded-lg border border-[#D5E0EA] px-4 py-2.5 outline-none focus:border-[#2563A6]"
            />

          </div>

          {/* RESOLUTION TAT */}
          <div>

            <label className="mb-1 block text-sm font-medium text-[#1F2937]">
              Resolution TAT
            </label>

            <input
              type="text"
              name="resolutionTat"
              value={formData.resolutionTat}
              onChange={handleChange}
              placeholder="Enter resolution TAT"
              required
              className="w-full rounded-lg border border-[#D5E0EA] px-4 py-2.5 outline-none focus:border-[#2563A6]"
            />

          </div>

          {/* ESCALATION 1 */}
          <div>

            <label className="mb-1 block text-sm font-medium text-[#1F2937]">
              Escalation 1
            </label>

            <input
              type="text"
              name="escalation1"
              value={formData.escalation1}
              onChange={handleChange}
              placeholder="Enter escalation 1"
              className="w-full rounded-lg border border-[#D5E0EA] px-4 py-2.5 outline-none focus:border-[#2563A6]"
            />

          </div>

          {/* ESCALATION 2 */}
          <div>

            <label className="mb-1 block text-sm font-medium text-[#1F2937]">
              Escalation 2
            </label>

            <input
              type="text"
              name="escalation2"
              value={formData.escalation2}
              onChange={handleChange}
              placeholder="Enter escalation 2"
              className="w-full rounded-lg border border-[#D5E0EA] px-4 py-2.5 outline-none focus:border-[#2563A6]"
            />

          </div>

          {/* ==============================
              BUTTONS
          ============================== */}

          <div className="flex justify-end gap-3 border-t border-[#D5E0EA] pt-5">

            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="rounded-lg border border-[#D5E0EA] px-5 py-2.5 text-sm font-medium text-[#1F2937] hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#2563A6] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#1D4F85] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : editingCategory
                ? "Update Category"
                : "Create Category"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default GrievanceCategoryForm;