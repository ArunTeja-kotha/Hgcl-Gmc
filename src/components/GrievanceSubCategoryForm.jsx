import React, { useEffect, useState } from "react";
import axios from "axios";

const SUB_CATEGORY_API =
  "http://localhost:5163/api/GrievanceSubCategory";

const GrievanceSubCategoryForm = ({
  categories,
  editingSubCategory,
  onSuccess,
  onCancel,
}) => {
  const [subCategoryName, setSubCategoryName] =
    useState("");

  const [categoryId, setCategoryId] =
    useState("");

  const [loading, setLoading] = useState(false);

  // ============================================
  // LOAD EDIT DATA
  // ============================================

  useEffect(() => {
    if (editingSubCategory) {
      setSubCategoryName(
        editingSubCategory.subCategoryName || ""
      );

      setCategoryId(
        editingSubCategory.categoryId
          ? String(editingSubCategory.categoryId)
          : ""
      );
    } else {
      setSubCategoryName("");
      setCategoryId("");
    }
  }, [editingSubCategory]);

  // ============================================
  // SUBMIT
  // ============================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subCategoryName.trim()) {
      alert("Please enter sub category name.");
      return;
    }

    if (!categoryId) {
      alert("Please select a category.");
      return;
    }

    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const requestData = {
      subCategoryName: subCategoryName.trim(),
      categoryId: Number(categoryId),
    };

    try {
      setLoading(true);

      // ========================================
      // UPDATE
      // ========================================

      if (editingSubCategory) {
        await axios.put(
          `${SUB_CATEGORY_API}/${editingSubCategory.subCategoryId}`,
          requestData,
          {
            headers,
          }
        );

        alert(
          "Grievance subcategory updated successfully."
        );
      }

      // ========================================
      // CREATE
      // ========================================

      else {
        await axios.post(
          SUB_CATEGORY_API,
          requestData,
          {
            headers,
          }
        );

        alert(
          "Grievance subcategory created successfully."
        );
      }

      // ========================================
      // IMPORTANT
      // ========================================

      if (typeof onSuccess === "function") {
        await onSuccess();
      }

    } catch (error) {
      console.error(
        "Error saving grievance subcategory:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to save grievance subcategory."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-[#D5E0EA] bg-white p-6">

      {/* ========================================
          FORM HEADER
      ======================================== */}

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#123A63]">
          {editingSubCategory
            ? "Edit Grievance Sub Category"
            : "Add Grievance Sub Category"}
        </h2>

        <p className="mt-1 text-sm text-[#64748B]">
          {editingSubCategory
            ? "Update the grievance sub category details."
            : "Enter the details to create a new grievance sub category."}
        </p>
      </div>

      {/* ========================================
          FORM
      ======================================== */}

      <form onSubmit={handleSubmit}>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {/* ====================================
              CATEGORY
          ==================================== */}

          <div>
            <label className="mb-2 block text-sm font-medium text-[#1F2937]">
              Category
            </label>

            <select
              value={categoryId}
              onChange={(e) =>
                setCategoryId(e.target.value)
              }
              className="w-full rounded-lg border border-[#D5E0EA] bg-white px-4 py-2.5 text-sm text-[#1F2937] outline-none focus:border-[#2563A6] focus:ring-1 focus:ring-[#2563A6]"
            >
              <option value="">
                Select Category
              </option>

              {categories?.map((category) => (
                <option
                  key={category.categoryId}
                  value={category.categoryId}
                >
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* ====================================
              SUB CATEGORY NAME
          ==================================== */}

          <div>
            <label className="mb-2 block text-sm font-medium text-[#1F2937]">
              Sub Category Name
            </label>

            <input
              type="text"
              value={subCategoryName}
              onChange={(e) =>
                setSubCategoryName(e.target.value)
              }
              placeholder="Enter sub category name"
              className="w-full rounded-lg border border-[#D5E0EA] bg-white px-4 py-2.5 text-sm text-[#1F2937] outline-none placeholder:text-[#94A3B8] focus:border-[#2563A6] focus:ring-1 focus:ring-[#2563A6]"
            />
          </div>

        </div>

        {/* ========================================
            BUTTONS
        ======================================== */}

        <div className="mt-6 flex justify-end gap-3">

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-[#D5E0EA] bg-white px-5 py-2.5 text-sm font-medium text-[#64748B] transition hover:bg-[#F4F8FC] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-[#2563A6] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1D4F85] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : editingSubCategory
              ? "Update"
              : "Save"}
          </button>

        </div>

      </form>
    </div>
  );
};

export default GrievanceSubCategoryForm;