import React, { useEffect, useState } from "react";
 
// =====================================================
// API URL
// =====================================================
 
const API_BASE_URL =
  "http://192.168.1.41:5163/api";
 
 
// =====================================================
// COMPONENT
// =====================================================
 
const CitizenGrievanceTracking = () => {
 
  // =====================================================
  // STATES
  // =====================================================
 
  const [grievances, setGrievances] =
    useState([]);
 
  const [categories, setCategories] =
    useState([]);
 
  const [subcategories, setSubcategories] =
    useState([]);
 
  const [loading, setLoading] =
    useState(true);
 
  const [error, setError] =
    useState("");
 
  const [reopeningId, setReopeningId] =
    useState(null);
 
 
  // =====================================================
  // GET CITIZEN ID FROM JWT
  // =====================================================
 
  const getCitizenIdFromToken = () => {
 
    try {
 
      // =================================================
      // GET TOKEN
      // =================================================
 
      const token =
        localStorage.getItem("token");
 
      if (!token) {
 
        console.error(
          "JWT token not found"
        );
 
        return null;
      }
 
 
      // =================================================
      // SPLIT JWT
      // =================================================
 
      const tokenParts =
        token.split(".");
 
      if (tokenParts.length !== 3) {
 
        throw new Error(
          "Invalid JWT token"
        );
      }
 
 
      // =================================================
      // DECODE PAYLOAD
      // =================================================
 
      const payload =
        JSON.parse(
          atob(
            tokenParts[1]
              .replace(/-/g, "+")
              .replace(/_/g, "/")
          )
        );
 
 
      console.log(
        "JWT Payload:",
        payload
      );
 
 
      // =================================================
      // GET CITIZEN ID
      // =================================================
 
      const citizenId =
        payload[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];
 
 
      console.log(
        "Citizen ID from JWT:",
        citizenId
      );
 
 
      return citizenId;
 
    } catch (error) {
 
      console.error(
        "Error reading JWT:",
        error
      );
 
      return null;
 
    }
 
  };
 
 
  // =====================================================
  // FETCH GRIEVANCES
  // =====================================================
 
  useEffect(() => {
 
    const fetchGrievances =
      async () => {
 
        try {
 
          setLoading(true);
          setError("");
 
 
          // =================================================
          // GET TOKEN
          // =================================================
 
          const token =
            localStorage.getItem("token");
 
 
          if (!token) {
 
            alert(
              "Your session has expired. Please login again."
            );
 
            window.location.href = "/";
 
            return;
 
          }
 
 
          // =================================================
          // GET CITIZEN ID
          // =================================================
 
          const citizenId =
            getCitizenIdFromToken();
 
 
          if (!citizenId) {
 
            throw new Error(
              "Citizen ID not found"
            );
 
          }
 
 
          console.log(
            "Citizen ID:",
            citizenId
          );
 
 
          // =================================================
          // GET MY GRIEVANCES
          // =================================================
 
          const response =
            await fetch(
              `${API_BASE_URL}/GrievanceComplaints/myGrievances`,
              {
                method: "GET",
 
                headers: {
 
                  Authorization:
                    `Bearer ${token}`,
 
                  Accept:
                    "application/json",
 
                },
 
              }
            );
 
 
          // =================================================
          // TOKEN EXPIRED
          // =================================================
 
          if (
            response.status === 401
          ) {
 
            localStorage.removeItem(
              "token"
            );
 
            alert(
              "Your session has expired. Please login again."
            );
 
            window.location.href = "/";
 
            return;
 
          }
 
 
          // =================================================
          // CHECK RESPONSE
          // =================================================
 
          if (!response.ok) {
 
            const errorText =
              await response.text();
 
 
            console.error(
              "Grievance API Error:",
              errorText
            );
 
 
            throw new Error(
              `Failed to fetch grievances: ${response.status}`
            );
 
          }
 
 
          // =================================================
          // GET RESPONSE
          // =================================================
 
          const data =
            await response.json();
 
 
          console.log(
            "Grievance API Response:",
            data
          );
 
 
          // =================================================
          // PROCESS RESPONSE
          // =================================================
 
          let grievanceData = [];
 
 
          if (Array.isArray(data)) {
 
            grievanceData =
              data;
 
          } else if (
            Array.isArray(data.data)
          ) {
 
            grievanceData =
              data.data;
 
          } else if (
            Array.isArray(data.items)
          ) {
 
            grievanceData =
              data.items;
 
          } else if (
            Array.isArray(data.results)
          ) {
 
            grievanceData =
              data.results;
 
          } else if (data) {
 
            grievanceData =
              [data];
 
          }
 
 
          console.log(
            "Processed Grievances:",
            grievanceData
          );
 
 
          setGrievances(
            grievanceData
          );
 
 
          // =================================================
          // FETCH CATEGORY DATA
          // =================================================
 
          await fetchCategories(
            token
          );
 
 
          // =================================================
          // GET UNIQUE CATEGORY IDS
          // =================================================
 
          const categoryIds =
            [
              ...new Set(
                grievanceData
                  .map(
                    (grievance) =>
                      grievance.categoryId ??
                      grievance.category_id ??
                      grievance.CategoryId ??
                      grievance.Category_ID
                  )
                  .filter(
                    (id) =>
                      id !== null &&
                      id !== undefined
                  )
              )
            ];
 
 
          console.log(
            "Category IDs:",
            categoryIds
          );
 
 
          // =================================================
          // FETCH SUBCATEGORIES
          // =================================================
 
          for (
            const categoryId
            of categoryIds
          ) {
 
            await fetchSubcategories(
              categoryId
            );
 
          }
 
 
        } catch (error) {
 
          console.error(
            "Error fetching grievances:",
            error
          );
 
 
          setError(
            "Unable to load your grievances."
          );
 
 
        } finally {
 
          setLoading(false);
 
        }
 
      };
 
 
    fetchGrievances();
 
  }, []);
 
 
  // =====================================================
  // FETCH CATEGORIES
  // =====================================================
 
  const fetchCategories =
    async (token) => {
 
      try {
 
        const response =
          await fetch(
            `${API_BASE_URL}/GrievanceCategory`,
            {
              method: "GET",
 
              headers: {
 
                Authorization:
                  `Bearer ${token}`,
 
                Accept:
                  "application/json",
 
              },
 
            }
          );
 
 
        if (!response.ok) {
 
          throw new Error(
            "Failed to fetch categories"
          );
 
        }
 
 
        const data =
          await response.json();
 
 
        console.log(
          "Category API Response:",
          data
        );
 
 
        setCategories(
          Array.isArray(data)
            ? data
            : data.data ?? []
        );
 
 
      } catch (error) {
 
        console.error(
          "Error fetching categories:",
          error
        );
 
      }
 
    };
 
 
  // =====================================================
  // FETCH SUBCATEGORIES
  // =====================================================
 
  const fetchSubcategories =
    async (categoryId) => {
 
      try {
 
        const response =
          await fetch(
            `${API_BASE_URL}/GrievanceSubCategory/by-category/${categoryId}`
          );
 
 
        if (!response.ok) {
 
          throw new Error(
            `Failed to fetch subcategories for category ${categoryId}`
          );
 
        }
 
 
        const data =
          await response.json();
 
 
        console.log(
          `Subcategory API Response for category ${categoryId}:`,
          data
        );
 
 
        const newSubcategories =
          Array.isArray(data)
            ? data
            : data.data ?? [];
 
 
        // =================================================
        // ADD TO EXISTING SUBCATEGORIES
        // =================================================
 
        setSubcategories(
          (previous) => {
 
            const combined = [
              ...previous,
              ...newSubcategories
            ];
 
 
            // Remove duplicates
 
            const unique =
              combined.filter(
                (
                  item,
                  index,
                  array
                ) => {
 
                  const id =
                    item.subCategoryId ??
                    item.subcategoryId ??
                    item.sub_category_id ??
                    item.id ??
                    item.Id;
 
 
                  return (
                    index ===
                    array.findIndex(
                      (other) => {
 
                        const otherId =
                          other.subCategoryId ??
                          other.subcategoryId ??
                          other.sub_category_id ??
                          other.id ??
                          other.Id;
 
 
                        return (
                          String(
                            otherId
                          ) ===
                          String(id)
                        );
 
                      }
                    )
                  );
 
                }
              );
 
 
            return unique;
 
          }
        );
 
 
      } catch (error) {
 
        console.error(
          "Error fetching subcategories:",
          error
        );
 
      }
 
    };
 
 
  // =====================================================
  // GET CATEGORY NAME
  // =====================================================
 
  const getCategoryName =
    (grievance) => {
 
      // =================================================
      // IF NAME ALREADY EXISTS
      // =================================================
 
      const directName =
        grievance.categoryName ??
        grievance.category_name ??
        grievance.category;
 
 
      if (
        directName &&
        typeof directName === "string"
      ) {
 
        return directName;
 
      }
 
 
      // =================================================
      // GET CATEGORY ID
      // =================================================
 
      const categoryId =
        grievance.categoryId ??
        grievance.category_id ??
        grievance.CategoryId ??
        grievance.Category_ID;
 
 
      // =================================================
      // FIND CATEGORY
      // =================================================
 
      const categoryObject =
        categories.find(
          (item) => {
 
            const id =
              item.categoryId ??
              item.category_id ??
              item.CategoryId ??
              item.id ??
              item.Id;
 
 
            return (
              String(id) ===
              String(categoryId)
            );
 
          }
        );
 
 
      // =================================================
      // RETURN CATEGORY NAME
      // =================================================
 
      return (
        categoryObject?.categoryName ??
        categoryObject?.category_name ??
        categoryObject?.CategoryName ??
        categoryObject?.name ??
        categoryObject?.Name ??
        "N/A"
      );
 
    };
 
 
  // =====================================================
  // GET SUBCATEGORY NAME
  // =====================================================
 
  const getSubcategoryName =
    (grievance) => {
 
      // =================================================
      // IF NAME ALREADY EXISTS
      // =================================================
 
      const directName =
        grievance.subCategoryName ??
        grievance.subcategoryName ??
        grievance.sub_category_name ??
        grievance.subcategory;
 
 
      if (
        directName &&
        typeof directName === "string"
      ) {
 
        return directName;
 
      }
 
 
      // =================================================
      // GET SUBCATEGORY ID
      // =================================================
 
      const subcategoryId =
        grievance.subCategoryId ??
        grievance.subcategoryId ??
        grievance.sub_category_id ??
        grievance.subcategory_id ??
        grievance.SubCategoryId ??
        grievance.SubcategoryId;
 
 
      // =================================================
      // FIND SUBCATEGORY
      // =================================================
 
      const subcategoryObject =
        subcategories.find(
          (item) => {
 
            const id =
              item.subCategoryId ??
              item.subcategoryId ??
              item.sub_category_id ??
              item.id ??
              item.Id;
 
 
            return (
              String(id) ===
              String(subcategoryId)
            );
 
          }
        );
 
 
      // =================================================
      // RETURN SUBCATEGORY NAME
      // =================================================
 
      return (
        subcategoryObject?.subCategoryName ??
        subcategoryObject?.subcategoryName ??
        subcategoryObject?.sub_category_name ??
        subcategoryObject?.SubCategoryName ??
        subcategoryObject?.name ??
        subcategoryObject?.Name ??
        "N/A"
      );
 
    };
 
 
  // =====================================================
  // GET STATUS CSS CLASS
  // =====================================================
 
  const getStatusClass =
    (status) => {
 
      const currentStatus =
        status?.toLowerCase();
 
 
      if (
        currentStatus === "resolved" ||
        currentStatus === "completed" ||
        currentStatus === "closed"
      ) {
 
        return "bg-green-100 text-green-700";
 
      }
 
 
      if (
        currentStatus === "in progress" ||
        currentStatus === "processing"
      ) {
 
        return "bg-blue-100 text-blue-700";
 
      }
 
 
      if (
        currentStatus === "pending"
      ) {
 
        return "bg-yellow-100 text-yellow-700";
 
      }
 
 
      if (
        currentStatus === "rejected"
      ) {
 
        return "bg-red-100 text-red-700";
 
      }
 
 
      if (
        currentStatus === "open"
      ) {
 
        return "bg-gray-100 text-gray-700";
 
      }
 
 
      return "bg-gray-100 text-gray-700";
 
    };
 
 
  // =====================================================
  // REOPEN GRIEVANCE
  // =====================================================
 
  const handleReopen =
    async (grievance) => {
 
      try {
 
        // =================================================
        // GET TOKEN
        // =================================================
 
        const token =
          localStorage.getItem("token");
 
 
        if (!token) {
 
          alert(
            "Your session has expired. Please login again."
          );
 
          window.location.href = "/";
 
          return;
 
        }
 
 
        // =================================================
        // GET GRIEVANCE ID
        // =================================================
 
        const grievanceId =
          grievance.grievance_id ??
          grievance.Grievance_id ??
          grievance.grievanceId ??
          grievance.GrievanceId ??
          grievance.id ??
          grievance.Id;
 
 
        console.log(
          "Reopen Grievance ID:",
          grievanceId
        );
 
 
        // =================================================
        // CHECK ID
        // =================================================
 
        if (
          grievanceId === null ||
          grievanceId === undefined
        ) {
 
          alert(
            "Grievance ID not found."
          );
 
          return;
 
        }
 
 
        // =================================================
        // CONFIRM
        // =================================================
 
        const confirmed =
          window.confirm(
            "Are you sure you want to reopen this grievance?"
          );
 
 
        if (!confirmed) {
 
          return;
 
        }
 
 
        // =================================================
        // SHOW LOADING FOR THIS BUTTON
        // =================================================
 
        setReopeningId(
          grievanceId
        );
 
 
        // =================================================
        // REOPEN API
        //
        // Swagger:
        // PUT /api/GrievanceComplaints/
        //     myGrievances/{grievanceId}/reopen
        // =================================================
 
        const response =
          await fetch(
            `${API_BASE_URL}/GrievanceComplaints/myGrievances/${grievanceId}/reopen`,
            {
              method: "PUT",
 
              headers: {
 
                Authorization:
                  `Bearer ${token}`,
 
                Accept:
                  "application/json",
 
              },
 
            }
          );
 
 
        // =================================================
        // TOKEN EXPIRED
        // =================================================
 
        if (
          response.status === 401
        ) {
 
          localStorage.removeItem(
            "token"
          );
 
          alert(
            "Your session has expired. Please login again."
          );
 
          window.location.href = "/";
 
          return;
 
        }
 
 
        // =================================================
        // CHECK RESPONSE
        // =================================================
 
        if (!response.ok) {
 
          const errorText =
            await response.text();
 
 
          console.error(
            "Reopen API Status:",
            response.status
          );
 
 
          console.error(
            "Reopen API Error:",
            errorText
          );
 
 
          throw new Error(
            `Failed to reopen grievance: ${response.status}`
          );
 
        }
 
 
        // =================================================
        // SUCCESS
        // =================================================
 
        alert(
          "Grievance reopened successfully!"
        );
 
 
        // =================================================
        // UPDATE ONLY THIS GRIEVANCE
        // =================================================
 
        setGrievances(
          (previous) =>
            previous.map(
              (item) => {
 
                const itemId =
                  item.grievance_id ??
                  item.Grievance_id ??
                  item.grievanceId ??
                  item.GrievanceId ??
                  item.id ??
                  item.Id;
 
 
                if (
                  String(itemId) ===
                  String(grievanceId)
                ) {
 
                  return {
                    ...item,
                    status: "Open",
                  };
 
                }
 
 
                return item;
 
              }
            )
        );
 
 
      } catch (error) {
 
        console.error(
          "Error reopening grievance:",
          error
        );
 
 
        alert(
          "Failed to reopen grievance. Please try again."
        );
 
 
      } finally {
 
        setReopeningId(
          null
        );
 
      }
 
    };
 
 
  // =====================================================
  // LOADING
  // =====================================================
 
  if (loading) {
 
    return (
 
      <div className="w-full min-h-full bg-gray-100 p-4">
 
        <div className="w-full bg-white rounded-xl shadow-sm p-10 flex justify-center">
 
          <p className="text-gray-500">
 
            Loading grievances...
 
          </p>
 
        </div>
 
      </div>
 
    );
 
  }
 
 
  // =====================================================
  // ERROR
  // =====================================================
 
  if (error) {
 
    return (
 
      <div className="w-full min-h-full bg-gray-100 p-4">
 
        <div className="w-full bg-white rounded-xl shadow-sm p-10 text-center">
 
          <p className="text-red-500">
 
            {error}
 
          </p>
 
        </div>
 
      </div>
 
    );
 
  }
 
 
  // =====================================================
  // UI
  // =====================================================
 
  return (
 
    <div className="w-full min-h-full bg-gray-100 p-4">
 
      {/* =================================================
          MAIN CARD
      ================================================= */}
 
      <div className="w-full bg-white rounded-xl shadow-sm p-6 md:p-8">
 
 
        {/* =================================================
            HEADER
        ================================================= */}
 
        <div className="text-center mb-8">
 
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
 
            Grievance Status
 
          </h1>
 
 
          <p className="text-sm text-gray-500 mt-2">
 
            Track the status of your registered grievances
 
          </p>
 
        </div>
 
 
        {/* =================================================
            NO GRIEVANCES
        ================================================= */}
 
        {grievances.length === 0 ? (
 
          <div className="text-center py-12">
 
            <p className="text-gray-500">
 
              No grievances found.
 
            </p>
 
          </div>
 
        ) : (
 
          /* =================================================
             GRIEVANCE LIST
          ================================================= */
 
          <div className="space-y-5">
 
            {grievances.map(
              (grievance, index) => {
 
                // =================================================
                // GRIEVANCE ID
                // =================================================
 
                const grievanceId =
                  grievance.grievance_id ??
                  grievance.Grievance_id ??
                  grievance.grievanceId ??
                  grievance.GrievanceId ??
                  grievance.id ??
                  grievance.Id;
 
 
                // =================================================
                // GRIEVANCE CODE
                // =================================================
 
                const grievanceCode =
                  grievance.grievance_code ??
                  grievance.Grievance_code ??
                  grievance.grievanceCode ??
                  grievance.GrievanceCode ??
                  "N/A";
 
 
                // =================================================
                // CATEGORY
                // =================================================
 
                const category =
                  getCategoryName(
                    grievance
                  );
 
 
                // =================================================
                // SUBCATEGORY
                // =================================================
 
                const subcategory =
                  getSubcategoryName(
                    grievance
                  );
 
 
                // =================================================
                // DESCRIPTION
                // =================================================
 
                const description =
                  grievance.description ??
                  "N/A";
 
 
                // =================================================
                // STATUS
                // =================================================
 
                const status =
                  grievance.status ??
                  "Unknown";
 
 
                // =================================================
                // CHECK CLOSED
                // =================================================
 
                const isClosed =
                  status?.toLowerCase() ===
                  "closed";
 
 
                return (
 
                  <div
                    key={
                      grievanceId ??
                      index
                    }
                    className="border border-gray-200 rounded-xl p-5 hover:shadow-sm transition"
                  >
 
 
                    {/* =================================================
                        GRIEVANCE CODE + STATUS
                    ================================================= */}
 
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
 
 
                      {/* GRIEVANCE CODE */}
 
                      <div>
 
                        <p className="text-xs text-gray-500">
 
                          Grievance Code
 
                        </p>
 
 
                        <p className="text-lg font-semibold text-gray-800 mt-1">
 
                          {grievanceCode}
 
                        </p>
 
                      </div>
 
 
                      {/* =================================================
                          STATUS + REOPEN
                      ================================================= */}
 
                      <div className="flex flex-col items-end gap-3">
 
 
                        {/* STATUS */}
 
                        <span
                          className={`inline-flex px-4 py-2 rounded-full text-xs font-semibold ${getStatusClass(
                            status
                          )}`}
                        >
 
                          {status}
 
                        </span>
 
 
                        {/* =================================================
                            REOPEN BUTTON
                        ================================================= */}
 
                        {isClosed && (
 
                          <button
                            type="button"
                            onClick={() =>
                              handleReopen(
                                grievance
                              )
                            }
                            disabled={
                              reopeningId !== null
                            }
                            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                          >
 
                            {String(
                              reopeningId
                            ) ===
                            String(
                              grievanceId
                            )
                              ? "Reopening..."
                              : "Reopen"}
 
                          </button>
 
                        )}
 
                      </div>
 
                    </div>
 
 
                    {/* =================================================
                        CATEGORY + SUBCATEGORY
                    ================================================= */}
 
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
 
 
                      {/* CATEGORY */}
 
                      <div>
 
                        <p className="text-xs text-gray-500">
 
                          Category
 
                        </p>
 
 
                        <p className="text-sm font-medium text-gray-800 mt-1">
 
                          {category}
 
                        </p>
 
                      </div>
 
 
                      {/* SUBCATEGORY */}
 
                      <div>
 
                        <p className="text-xs text-gray-500">
 
                          Subcategory
 
                        </p>
 
 
                        <p className="text-sm font-medium text-gray-800 mt-1">
 
                          {subcategory}
 
                        </p>
 
                      </div>
 
                    </div>
 
 
                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}
 
                    <div className="mt-5">
 
                      <p className="text-xs text-gray-500">
 
                        Description
 
                      </p>
 
 
                      <div className="mt-1 bg-gray-50 border border-gray-200 rounded-lg p-4">
 
                        <p className="text-sm text-gray-700">
 
                          {description}
 
                        </p>
 
                      </div>
 
                    </div>
 
 
                  </div>
 
                );
 
              }
            )}
 
          </div>
 
        )}
 
      </div>
 
    </div>
 
  );
 
};
 
export default CitizenGrievanceTracking;
 
