import React, { useEffect, useState } from "react";
import axios from "axios";

import GrievanceSubCategoryTable from "../components/GrievanceSubCategoryTable";
import GrievanceSubCategoryForm from "../components/GrievanceSubCategoryForm";

const SUB_CATEGORY_API =
  "http://localhost:5163/api/GrievanceSubCategory";

const CATEGORY_API =
  "http://localhost:5163/api/GrievanceCategory";

const USER_API =
  "http://localhost:5163/api/User";

const GrievanceSubCategory = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [editingSubCategory, setEditingSubCategory] =
    useState(null);

  const [deletingId, setDeletingId] = useState(null);

  // ============================================
  // TOKEN
  // ============================================

  const token = localStorage.getItem("token");

  const getHeaders = () => {
    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // ============================================
  // GET ALL SUB CATEGORIES
  // ============================================

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get(
        SUB_CATEGORY_API,
        {
          headers: getHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error fetching subcategories:",
        error
      );

      throw error;
    }
  };

  // ============================================
  // GET ALL CATEGORIES
  // ============================================

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        CATEGORY_API,
        {
          headers: getHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error fetching categories:",
        error
      );

      throw error;
    }
  };

  // ============================================
  // GET ALL USERS
  // ============================================

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        USER_API,
        {
          headers: getHeaders(),
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Error fetching users:",
        error
      );

      throw error;
    }
  };

  // ============================================
  // COMBINE DATA
  // ============================================

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        subCategoryData,
        categoryData,
        userData,
      ] = await Promise.all([
        fetchSubCategories(),
        fetchCategories(),
        fetchUsers(),
      ]);

      setCategories(categoryData);
      setUsers(userData);

      // ========================================
      // CATEGORY MAP
      // ========================================

      const categoryMap = {};

      categoryData.forEach((category) => {
        categoryMap[category.categoryId] =
          category.categoryName;
      });

      // ========================================
      // USER MAP
      // ========================================

      const userMap = {};

      userData.forEach((user) => {
        userMap[user.userId] =
          `${user.firstName} ${user.lastName}`;
      });

      // ========================================
      // ADD NAMES TO SUB CATEGORIES
      // ========================================

      const formattedSubCategories =
        subCategoryData.map((subCategory) => ({
          ...subCategory,

          // Category ID → Category Name
          categoryName:
            categoryMap[subCategory.categoryId] ||
            "-",

          // Created By ID → User Name
          createdByName:
            userMap[subCategory.createdBy] ||
            "-",

          // Updated By ID → User Name
          updatedByName:
            subCategory.updatedBy
              ? userMap[subCategory.updatedBy] ||
                "-"
              : "-",
        }));

      setSubCategories(
        formattedSubCategories
      );
    } catch (error) {
      console.error(
        "Error loading grievance subcategory data:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to load grievance subcategory data."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // INITIAL LOAD
  // ============================================

  useEffect(() => {
    loadData();
  }, []);

  // ============================================
  // ADD
  // ============================================

  const handleAdd = () => {
    setEditingSubCategory(null);
    setShowForm(true);
  };

  // ============================================
  // EDIT
  // ============================================

  const handleEdit = (subCategory) => {
    setEditingSubCategory(subCategory);
    setShowForm(true);
  };

  // ============================================
  // DELETE
  // ============================================

  const handleDelete = async (subCategoryId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this grievance subcategory?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(subCategoryId);

      await axios.delete(
        `${SUB_CATEGORY_API}/${subCategoryId}`,
        {
          headers: getHeaders(),
        }
      );

      alert(
        "Grievance subcategory deleted successfully."
      );

      await loadData();
    } catch (error) {
      console.error(
        "Error deleting subcategory:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete grievance subcategory."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ============================================
  // FORM SUCCESS
  // ============================================

  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingSubCategory(null);

    await loadData();
  };

  // ============================================
  // CANCEL
  // ============================================

  const handleCancel = () => {
    setShowForm(false);
    setEditingSubCategory(null);
  };

  // ============================================
  // PAGE
  // ============================================

  return (
    <div className="min-h-full bg-[#F4F8FC] p-6">

      {/* ========================================
          HEADER
      ======================================== */}

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-semibold text-[#123A63]">
            Grievance Sub Categories
          </h1>

          <p className="mt-1 text-sm text-[#64748B]">
            Manage grievance sub categories and
            their corresponding categories.
          </p>
        </div>

        {!showForm && (
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-lg bg-[#2563A6] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1D4F85]"
          >
            + Add Sub Category
          </button>
        )}

      </div>

      {/* ========================================
          FORM
      ======================================== */}

      {showForm && (
        <div className="mb-6">

          <GrievanceSubCategoryForm
            categories={categories}
            editingSubCategory={editingSubCategory}
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
          />

        </div>
      )}

      {/* ========================================
          LOADING
      ======================================== */}

      {loading ? (

        <div className="rounded-xl border border-[#D5E0EA] bg-white p-10 text-center">

          <p className="text-[#64748B]">
            Loading grievance subcategories...
          </p>

        </div>

      ) : (

        /* ======================================
           TABLE
        ====================================== */

        <GrievanceSubCategoryTable
          subCategories={subCategories}
          deletingId={deletingId}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

      )}

    </div>
  );
};

export default GrievanceSubCategory;