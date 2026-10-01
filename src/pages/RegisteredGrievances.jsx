import React, { useEffect, useState } from "react";
import axios from "axios";
import RegisteredGrievancesTable from "../components/RegisteredGrievanceTable";

const GRIEVANCE_API =
  "http://localhost:5163/api/GrievanceComplaints/registeredGrievances";

const CATEGORY_API =
  "http://localhost:5163/api/GrievanceCategory";

const SUB_CATEGORY_API =
  "http://localhost:5163/api/GrievanceSubCategory";

const RegisteredGrievances = () => {
  const [grievances, setGrievances] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [
        grievancesResponse,
        categoriesResponse,
        subCategoriesResponse,
      ] = await Promise.all([
        axios.get(GRIEVANCE_API, { headers }),
        axios.get(CATEGORY_API, { headers }),
        axios.get(SUB_CATEGORY_API, { headers }),
      ]);

      const grievanceData = grievancesResponse.data;
      const categoryData = categoriesResponse.data;
      const subCategoryData = subCategoriesResponse.data;

      // Category ID -> Category Name
      const categoryMap = {};

      categoryData.forEach((category) => {
        categoryMap[category.categoryId] =
          category.categoryName;
      });

      // Sub Category ID -> Sub Category Name
      const subCategoryMap = {};

      subCategoryData.forEach((subCategory) => {
        subCategoryMap[subCategory.subCategoryId] =
          subCategory.subCategoryName;
      });

      // Add names to grievance data
      const updatedGrievances = grievanceData.map(
        (grievance) => ({
          ...grievance,

          categoryName:
            categoryMap[grievance.categoryId] || "-",

          subCategoryName:
            subCategoryMap[grievance.subCategoryId] || "-",
        })
      );

      setGrievances(updatedGrievances);
      setCategories(categoryData);
      setSubCategories(subCategoryData);
    } catch (error) {
      console.error(
        "Error fetching registered grievances:",
        error
      );

      if (error.response?.status === 401) {
        setError(
          "You are not authorized to view grievances."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to load registered grievances."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-full bg-[#F4F8FC] p-6">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-semibold text-[#123A63]">
            Registered Grievances
          </h1>

          <p className="mt-1 text-sm text-[#64748B]">
            View all currently registered grievances.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchData}
          disabled={loading}
          className="rounded-lg bg-[#2563A6] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#1D4F85] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>

      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="rounded-xl border border-[#D5E0EA] bg-white p-10 text-center">
          <p className="text-[#64748B]">
            Loading registered grievances...
          </p>
        </div>
      ) : (
        <RegisteredGrievancesTable
          grievances={grievances}
        />
      )}

    </div>
  );
};

export default RegisteredGrievances;