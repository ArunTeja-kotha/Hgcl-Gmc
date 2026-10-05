import React, { useEffect, useState } from "react";
import GrievanceCategoryTable from "../components/GrievanceCategoryTable";
import GrievanceCategoryForm from "../components/GrievanceCategoryForm";

const API_URL = "http://localhost:5163/api/GrievanceCategory";

const GrievanceCategory = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [deletingId, setDeletingId] = useState(null);

const filteredCategories = categories.filter((category) =>
  category.categoryName
    ?.toLowerCase()
    .includes(searchTerm.toLowerCase())
);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch grievance categories");
      }

      const data = await response.json();

      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // LOAD DATA WHEN PAGE OPENS
  // ==============================
  useEffect(() => {
    fetchCategories();
  }, []);

  // ==============================
  // ADD CATEGORY
  // ==============================
  const handleAdd = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  // ==============================
  // EDIT CATEGORY
  // ==============================
  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  // ==============================
  // DELETE CATEGORY
  // ==============================
  const handleDelete = async (categoryId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(categoryId);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/${categoryId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        let errorMessage = "Failed to delete category";

        try {
          const data = await response.json();

          if (data?.message) {
            errorMessage = data.message;
          }
        } catch {
          // Response was not JSON
        }

        throw new Error(errorMessage);
      }

      // Refresh table after delete
      await fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      setError(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  // ==============================
  // FORM SUCCESS
  // ==============================
  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingCategory(null);

    await fetchCategories();
  };

  // ==============================
  // FORM CANCEL
  // ==============================
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC] p-6">

      {/* PAGE HEADER */}
      <div className="mb-6 flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-semibold text-[#123A63]">
            Grievance Categories
          </h1>

          <p className="mt-1 text-sm text-[#64748B]">
            Manage grievance categories
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="rounded-lg bg-[#2563A6] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1D4F85]"
        >
          + Add Category
        </button>

      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* FILTER */}
<div className="mb-4 rounded-xl border border-[#D5E0EA] bg-white p-4">
  <div className="flex items-end gap-4">

    <div className="flex-1">
      <label className="mb-1 block text-sm font-medium text-[#123A63]">
        Search Category
      </label>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search category name..."
        className="w-full rounded-lg border border-[#D5E0EA] px-4 py-2.5 text-sm text-[#1F2937] outline-none focus:border-[#2563A6]"
      />
    </div>

    <button
      type="button"
      onClick={() => setSearchTerm("")}
      className="rounded-lg border border-[#2563A6] px-5 py-2.5 text-sm font-medium text-[#2563A6] transition hover:bg-[#E8F2FB]"
    >
      Clear
    </button>

  </div>
</div>
      {loading ? (
        <div className="rounded-xl border border-[#D5E0EA] bg-white p-8 text-center text-[#64748B]">
          Loading categories...
        </div>
      ) : (
        <GrievanceCategoryTable
          categories={filteredCategories}
          deletingId={deletingId}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* ADD / EDIT FORM */}
      {showForm && (
        <GrievanceCategoryForm
          editingCategory={editingCategory}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}

    </div>
  );
};

export default GrievanceCategory;