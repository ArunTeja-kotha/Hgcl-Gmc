import React, { useEffect, useState } from "react";
 
// =====================================================
// API URLs
// =====================================================
 
const API_BASE_URL =
  "http://192.168.1.41:5163/api";
 
const PLAZA_API_URL =
  "http://127.0.0.1:8000/Plazas/";
 
// =====================================================
// COMPONENT
// =====================================================
 
const GrievanceRegistration = () => {
 
  // =====================================================
  // STATES
  // =====================================================
 
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [plazas, setPlazas] = useState([]);
 
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [plaza, setPlaza] = useState("");
 
  const [vehicleNumber, setVehicleNumber] =
    useState("");
 
  const [vehicleType, setVehicleType] =
    useState("");
 
  const [description, setDescription] =
    useState("");
 
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
 
  const [errors, setErrors] = useState({});
 
  const [loadingCategories, setLoadingCategories] =
    useState(false);
 
  const [
    loadingSubcategories,
    setLoadingSubcategories,
  ] = useState(false);
 
  const [loadingPlazas, setLoadingPlazas] =
    useState(false);
 
  const [submitting, setSubmitting] =
    useState(false);
 
 
  // =====================================================
  // FETCH CATEGORIES
  // =====================================================
 
  useEffect(() => {
 
    const fetchCategories = async () => {
 
      try {
 
        setLoadingCategories(true);
 
        const response = await fetch(
          `${API_BASE_URL}/GrievanceCategory`
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
 
        setCategories(data);
 
      } catch (error) {
 
        console.error(
          "Error fetching categories:",
          error
        );
 
      } finally {
 
        setLoadingCategories(false);
 
      }
 
    };
 
    fetchCategories();
 
  }, []);
 
 
  // =====================================================
  // FETCH PLAZAS
  // =====================================================
 
  useEffect(() => {
 
    const fetchPlazas = async () => {
 
      try {
 
        setLoadingPlazas(true);
 
        const response = await fetch(
          PLAZA_API_URL
        );
 
        if (!response.ok) {
 
          throw new Error(
            "Failed to fetch plazas"
          );
 
        }
 
        const data =
          await response.json();
 
        console.log(
          "Plaza API Response:",
          data
        );
 
        let plazaData = [];
 
        if (Array.isArray(data)) {
 
          plazaData = data;
 
        } else if (
          Array.isArray(data.data)
        ) {
 
          plazaData = data.data;
 
        } else if (
          Array.isArray(data.items)
        ) {
 
          plazaData = data.items;
 
        } else if (
          Array.isArray(data.results)
        ) {
 
          plazaData = data.results;
 
        }
 
        console.log(
          "Processed Plaza Data:",
          plazaData
        );
 
        setPlazas(plazaData);
 
      } catch (error) {
 
        console.error(
          "Error fetching plazas:",
          error
        );
 
        setPlazas([]);
 
      } finally {
 
        setLoadingPlazas(false);
 
      }
 
    };
 
    fetchPlazas();
 
  }, []);
 
 
  // =====================================================
  // CATEGORY CHANGE
  // =====================================================
 
  const handleCategoryChange = async (e) => {
 
    const selectedCategoryId =
      e.target.value;
 
    // Set category
 
    setCategory(
      selectedCategoryId
    );
 
    // Clear subcategory
 
    setSubcategory("");
    setSubcategories([]);
 
    // Clear plaza
 
    setPlaza("");
 
    // Clear vehicle number
 
    setVehicleNumber("");
 
    // Clear vehicle type
 
    setVehicleType("");
 
    // Clear errors
 
    setErrors((previous) => ({
      ...previous,
      category: "",
      subcategory: "",
      plaza: "",
      vehicleNumber: "",
      vehicleType: "",
    }));
 
    // If category is empty
 
    if (!selectedCategoryId) {
 
      return;
 
    }
 
    // =================================================
    // FETCH SUBCATEGORIES
    // =================================================
 
    try {
 
      setLoadingSubcategories(true);
 
      const response = await fetch(
        `${API_BASE_URL}/GrievanceSubCategory/by-category/${selectedCategoryId}`
      );
 
      if (!response.ok) {
 
        throw new Error(
          "Failed to fetch subcategories"
        );
 
      }
 
      const data =
        await response.json();
 
      console.log(
        "Subcategory API Response:",
        data
      );
 
      setSubcategories(data);
 
    } catch (error) {
 
      console.error(
        "Error fetching subcategories:",
        error
      );
 
      setSubcategories([]);
 
    } finally {
 
      setLoadingSubcategories(false);
 
    }
 
  };
 
 
  // =====================================================
  // FIND SELECTED CATEGORY
  // =====================================================
 
  const selectedCategory =
    categories.find(
      (item) =>
        String(item.categoryId) ===
        String(category)
    );
 
 
  // =====================================================
  // CHECK TOLL / FASTAG
  // =====================================================
 
  const isTollFastTag =
    selectedCategory?.categoryName
      ?.toLowerCase()
      .includes("toll");
 
 
  // =====================================================
  // FORM VALIDATION
  // =====================================================
 
  const validateForm = () => {
 
    const newErrors = {};
 
    // =================================================
    // CATEGORY
    // =================================================
 
    if (!category) {
 
      newErrors.category =
        "Please select category";
 
    }
 
    // =================================================
    // SUBCATEGORY
    // =================================================
 
    if (!subcategory) {
 
      newErrors.subcategory =
        "Please select subcategory";
 
    }
 
    // =================================================
    // PLAZA
    // Required only for Toll / FASTag
    // =================================================
 
    if (
      isTollFastTag &&
      !plaza
    ) {
 
      newErrors.plaza =
        "Please select plaza";
 
    }
 
    // =================================================
    // VEHICLE NUMBER
    // Required only for Toll / FASTag
    // =================================================
 
    if (
      isTollFastTag &&
      !vehicleNumber.trim()
    ) {
 
      newErrors.vehicleNumber =
        "Please enter vehicle number";
 
    }
 
    // =================================================
    // VEHICLE TYPE
    // Required only for Toll / FASTag
    // =================================================
 
    if (
      isTollFastTag &&
      !vehicleType.trim()
    ) {
 
      newErrors.vehicleType =
        "Please enter vehicle type";
 
    }
 
    // =================================================
    // DESCRIPTION
    // =================================================
 
    if (!description.trim()) {
 
      newErrors.description =
        "Please enter description";
 
    }
 
    // =================================================
    // IMAGE 1
    // =================================================
 
    if (!image1) {
 
      newErrors.image1 =
        "Please upload image 1";
 
    }
 
    setErrors(newErrors);
 
    return (
      Object.keys(newErrors).length === 0
    );
 
  };
 
 
  // =====================================================
  // SUBMIT GRIEVANCE
  // =====================================================
 
  const handleSubmit = async (e) => {
 
    e.preventDefault();
 
    // =================================================
    // VALIDATE
    // =================================================
 
    if (!validateForm()) {
 
      return;
 
    }
 
    try {
 
      setSubmitting(true);
 
      // =================================================
      // GET TOKEN FROM LOGIN
      // =================================================
 
      const token =
        localStorage.getItem("token");
 
      if (!token) {
 
        alert(
          "Session expired. Please login again."
        );
 
        window.location.href = "/";
 
        return;
 
      }
 
      // =================================================
      // CREATE FORMDATA
      // =================================================
 
      const formData =
        new FormData();
 
 
      // =================================================
      // CATEGORY
      // =================================================
 
      formData.append(
        "categoryId",
        category
      );
 
 
      // =================================================
      // SUBCATEGORY
      // =================================================
 
      formData.append(
        "subcategoryId",
        subcategory
      );
 
 
      // =================================================
      // PLAZA
      // Only for Toll / FASTag
      // =================================================
 
      if (
        isTollFastTag &&
        plaza
      ) {
 
        formData.append(
          "plazaId",
          plaza
        );
 
      }
 
 
      // =================================================
      // VEHICLE NUMBER
      // Only for Toll / FASTag
      // =================================================
 
      if (
        isTollFastTag &&
        vehicleNumber.trim()
      ) {
 
        formData.append(
          "vehicleNumber",
          vehicleNumber.trim()
        );
 
      }
 
 
      // =================================================
      // VEHICLE TYPE
      // Only for Toll / FASTag
      // =================================================
 
      if (
        isTollFastTag &&
        vehicleType.trim()
      ) {
 
        formData.append(
          "vehicletype",
          vehicleType.trim()
        );
 
      }
 
 
      // =================================================
      // DESCRIPTION
      // =================================================
 
      formData.append(
        "description",
        description.trim()
      );
 
 
      // =================================================
      // IMAGE 1
      // =================================================
 
      if (image1) {
 
        formData.append(
          "citizenImage1",
          image1
        );
 
      }
 
 
      // =================================================
      // IMAGE 2
      // =================================================
 
      if (image2) {
 
        formData.append(
          "citizenImage2",
          image2
        );
 
      }
 
 
      // =================================================
      // LOG DATA
      // =================================================
 
      console.log(
        "Submitting grievance..."
      );
 
      console.log(
        "Category:",
        category
      );
 
      console.log(
        "Subcategory:",
        subcategory
      );
 
      console.log(
        "Plaza:",
        plaza
      );
 
      console.log(
        "Vehicle Number:",
        vehicleNumber
      );
 
      console.log(
        "Vehicle Type:",
        vehicleType
      );
 
      console.log(
        "Description:",
        description
      );
 
      console.log(
        "Image 1:",
        image1
      );
 
      console.log(
        "Image 2:",
        image2
      );
 
 
      // =================================================
      // POST GRIEVANCE API
      // =================================================
 
      const response =
        await fetch(
          `${API_BASE_URL}/GrievanceComplaints`,
          {
            method: "POST",
 
            headers: {
 
              Authorization:
                `Bearer ${token}`,
 
            },
 
            body:
              formData,
 
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
          "Grievance API Status:",
          response.status
        );
 
        console.error(
          "Grievance API Error:",
          errorText
        );
 
        throw new Error(
          `API returned ${response.status}`
        );
 
      }
 
 
      // =================================================
      // GET RESPONSE
      // =================================================
 
      const result =
        await response.json();
 
      console.log(
        "Grievance API Response:",
        result
      );
 
 
      // =================================================
      // SUCCESS
      // =================================================
 
      alert(
        "Grievance registered successfully!"
      );
 
 
      // =================================================
      // RESET FORM
      // =================================================
 
      setCategory("");
 
      setSubcategory("");
 
      setPlaza("");
 
      setVehicleNumber("");
 
      setVehicleType("");
 
      setSubcategories([]);
 
      setDescription("");
 
      setImage1(null);
 
      setImage2(null);
 
      setErrors({});
 
 
    } catch (error) {
 
      console.error(
        "Error submitting grievance:",
        error
      );
 
      alert(
        "Failed to register grievance. Please try again."
      );
 
    } finally {
 
      setSubmitting(false);
 
    }
 
  };
 
 
  // =====================================================
  // IMAGE 1 CHANGE
  // =====================================================
 
  const handleImage1Change = (e) => {
 
    const file =
      e.target.files?.[0];
 
    setImage1(
      file || null
    );
 
    setErrors((previous) => ({
      ...previous,
      image1: "",
    }));
 
  };
 
 
  // =====================================================
  // IMAGE 2 CHANGE
  // =====================================================
 
  const handleImage2Change = (e) => {
 
    const file =
      e.target.files?.[0];
 
    setImage2(
      file || null
    );
 
  };
 
 
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
            HEADING
        ================================================= */}
 
        <div className="text-center mb-8">
 
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
 
            Register Grievance
 
          </h1>
 
          <p className="text-sm text-gray-500 mt-2">
 
            Please provide the details below to
            register your grievance
 
          </p>
 
        </div>
 
 
        {/* =================================================
            FORM
        ================================================= */}
 
        <form
          onSubmit={handleSubmit}
          className="w-full"
        >
 
 
          {/* =================================================
              CATEGORY + SUBCATEGORY
          ================================================= */}
 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 
 
            {/* CATEGORY */}
 
            <div>
 
              <label className="block text-sm font-medium text-gray-700 mb-2">
 
                Category
 
                <span className="text-red-500 ml-1">
                  *
                </span>
 
              </label>
 
              <select
                value={category}
                onChange={
                  handleCategoryChange
                }
                className={`w-full h-12 border rounded-lg px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
 
                <option value="">
 
                  {loadingCategories
                    ? "Loading categories..."
                    : "Select Category"}
 
                </option>
 
                {categories.map(
                  (item) => (
 
                    <option
                      key={
                        item.categoryId
                      }
                      value={
                        item.categoryId
                      }
                    >
 
                      {
                        item.categoryName
                      }
 
                    </option>
 
                  )
                )}
 
              </select>
 
              {errors.category && (
 
                <p className="text-red-500 text-xs mt-1">
 
                  {errors.category}
 
                </p>
 
              )}
 
            </div>
 
 
            {/* SUBCATEGORY */}
 
            <div>
 
              <label className="block text-sm font-medium text-gray-700 mb-2">
 
                Subcategory
 
                <span className="text-red-500 ml-1">
                  *
                </span>
 
              </label>
 
              <select
                value={subcategory}
                onChange={(e) => {
 
                  setSubcategory(
                    e.target.value
                  );
 
                  setErrors(
                    (previous) => ({
                      ...previous,
                      subcategory: "",
                    })
                  );
 
                }}
                disabled={!category}
                className={`w-full h-12 border rounded-lg px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${
                  errors.subcategory
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              >
 
                <option value="">
 
                  {!category
                    ? "Select category first"
                    : loadingSubcategories
                    ? "Loading subcategories..."
                    : "Select Subcategory"}
 
                </option>
 
                {subcategories.map(
                  (item, index) => {
 
                    const subcategoryId =
                      item.subCategoryId ??
                      item.subcategoryId ??
                      item.sub_category_id ??
                      item.id ??
                      item.Id;
 
                    const subcategoryName =
                      item.subCategoryName ??
                      item.subcategoryName ??
                      item.sub_category_name ??
                      item.name ??
                      item.Name;
 
                    return (
 
                      <option
                        key={
                          subcategoryId ??
                          index
                        }
                        value={
                          subcategoryId
                        }
                      >
 
                        {
                          subcategoryName
                        }
 
                      </option>
 
                    );
 
                  }
                )}
 
              </select>
 
              {errors.subcategory && (
 
                <p className="text-red-500 text-xs mt-1">
 
                  {
                    errors.subcategory
                  }
 
                </p>
 
              )}
 
            </div>
 
          </div>
 
 
          {/* =================================================
              PLAZA + VEHICLE NUMBER + VEHICLE TYPE
              ONLY FOR TOLL / FASTAG
          ================================================= */}
 
          {isTollFastTag && (
 
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
 
 
              {/* =================================================
                  PLAZA
              ================================================= */}
 
              <div>
 
                <label className="block text-sm font-medium text-gray-700 mb-2">
 
                  Plaza
 
                  <span className="text-red-500 ml-1">
                    *
                  </span>
 
                </label>
 
                <select
                  value={plaza}
                  onChange={(e) => {
 
                    setPlaza(
                      e.target.value
                    );
 
                    setErrors(
                      (previous) => ({
                        ...previous,
                        plaza: "",
                      })
                    );
 
                  }}
                  className={`w-full h-12 border rounded-lg px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.plaza
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
 
                  <option value="">
 
                    {loadingPlazas
                      ? "Loading plazas..."
                      : "Select Plaza"}
 
                  </option>
 
                  {plazas.map(
                    (item, index) => {
 
                      const plazaId =
                        item.plazaId ??
                        item.PlazaId ??
                        item.PLAZA_ID ??
                        item.Plaza_id ??
                        item.plaza_id ??
                        item.id ??
                        item.Id;
 
                      const plazaName =
                        item.plazaName ??
                        item.PlazaName ??
                        item.PLAZA_NAME ??
                        item.Plaza_name ??
                        item.plaza_name ??
                        item.name ??
                        item.Name;
 
                      return (
 
                        <option
                          key={
                            plazaId ??
                            index
                          }
                          value={
                            plazaId
                          }
                        >
 
                          {
                            plazaName
                          }
 
                        </option>
 
                      );
 
                    }
                  )}
 
                </select>
 
                {errors.plaza && (
 
                  <p className="text-red-500 text-xs mt-1">
 
                    {errors.plaza}
 
                  </p>
 
                )}
 
              </div>
 
 
              {/* =================================================
                  VEHICLE NUMBER
              ================================================= */}
 
              <div>
 
                <label className="block text-sm font-medium text-gray-700 mb-2">
 
                  Vehicle Number
 
                  <span className="text-red-500 ml-1">
                    *
                  </span>
 
                </label>
 
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => {
 
                    setVehicleNumber(
                      e.target.value.toUpperCase()
                    );
 
                    setErrors(
                      (previous) => ({
                        ...previous,
                        vehicleNumber: "",
                      })
                    );
 
                  }}
                  placeholder="Enter vehicle number"
                  className={`w-full h-12 border rounded-lg px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.vehicleNumber
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
 
                {errors.vehicleNumber && (
 
                  <p className="text-red-500 text-xs mt-1">
 
                    {
                      errors.vehicleNumber
                    }
 
                  </p>
 
                )}
 
              </div>
 
 
              {/* =================================================
                  VEHICLE TYPE
              ================================================= */}
 
              <div>
 
                <label className="block text-sm font-medium text-gray-700 mb-2">
 
                  Vehicle Type
 
                  <span className="text-red-500 ml-1">
                    *
                  </span>
 
                </label>
 
                <input
                  type="text"
                  value={vehicleType}
                  onChange={(e) => {
 
                    setVehicleType(
                      e.target.value
                    );
 
                    setErrors(
                      (previous) => ({
                        ...previous,
                        vehicleType: "",
                      })
                    );
 
                  }}
                  placeholder="Enter vehicle type"
                  className={`w-full h-12 border rounded-lg px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.vehicleType
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
 
                {errors.vehicleType && (
 
                  <p className="text-red-500 text-xs mt-1">
 
                    {
                      errors.vehicleType
                    }
 
                  </p>
 
                )}
 
              </div>
 
            </div>
 
          )}
 
 
          {/* =================================================
              DESCRIPTION
          ================================================= */}
 
          <div className="mt-6">
 
            <label className="block text-sm font-medium text-gray-700 mb-2">
 
              Description
 
              <span className="text-red-500 ml-1">
                *
              </span>
 
            </label>
 
            <textarea
              value={description}
              onChange={(e) => {
 
                setDescription(
                  e.target.value
                );
 
                setErrors(
                  (previous) => ({
                    ...previous,
                    description: "",
                  })
                );
 
              }}
              placeholder="Enter your grievance description"
              rows={5}
              className={`w-full border rounded-lg px-4 py-3 text-sm bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
 
            {errors.description && (
 
              <p className="text-red-500 text-xs mt-1">
 
                {
                  errors.description
                }
 
              </p>
 
            )}
 
          </div>
 
 
          {/* =================================================
              IMAGE 1 + IMAGE 2
          ================================================= */}
 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
 
 
            {/* IMAGE 1 */}
 
            <div>
 
              <label className="block text-sm font-medium text-gray-700 mb-2">
 
                Image 1
 
                <span className="text-red-500 ml-1">
                  *
                </span>
 
              </label>
 
              <input
                type="file"
                accept="image/*"
                onChange={
                  handleImage1Change
                }
                className={`w-full border rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.image1
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
 
              {errors.image1 && (
 
                <p className="text-red-500 text-xs mt-1">
 
                  {errors.image1}
 
                </p>
 
              )}
 
              {image1 && (
 
                <div className="mt-3">
 
                  <img
                    src={
                      URL.createObjectURL(
                        image1
                      )
                    }
                    alt="Preview 1"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
 
                </div>
 
              )}
 
            </div>
 
 
            {/* IMAGE 2 */}
 
            <div>
 
              <label className="block text-sm font-medium text-gray-700 mb-2">
 
                Image 2
 
                <span className="text-gray-400 ml-1">
                  (Optional)
                </span>
 
              </label>
 
              <input
                type="file"
                accept="image/*"
                onChange={
                  handleImage2Change
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
 
              {image2 && (
 
                <div className="mt-3">
 
                  <img
                    src={
                      URL.createObjectURL(
                        image2
                      )
                    }
                    alt="Preview 2"
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
 
                </div>
 
              )}
 
            </div>
 
          </div>
 
 
          {/* =================================================
              ADD GRIEVANCE BUTTON
          ================================================= */}
 
          <div className="flex justify-end mt-8">
 
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
 
              {submitting
                ? "Submitting..."
                : "Add Grievance"}
 
            </button>
 
          </div>
 
        </form>
 
      </div>
 
    </div>
 
  );
 
};
 
export default GrievanceRegistration;
 