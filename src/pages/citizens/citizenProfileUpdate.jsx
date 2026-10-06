import React, { useEffect, useState } from "react";
 
// =====================================================
// API URL
// =====================================================
 
const API_BASE_URL =
  "http://192.168.1.41:5163/api";
 
// =====================================================
// COMPONENT
// =====================================================
 
const CitizenProfileUpdate = () => {
 
  // =====================================================
  // STATES
  // =====================================================
 
  const [citizenId, setCitizenId] =
    useState("");
 
  const [firstName, setFirstName] =
    useState("");
 
  const [lastName, setLastName] =
    useState("");
 
  const [loading, setLoading] =
    useState(true);
 
  const [updating, setUpdating] =
    useState(false);
 
  const [errors, setErrors] =
    useState({});
 
 
  // =====================================================
  // GET CITIZEN ID FROM JWT
  // =====================================================
 
  const getCitizenIdFromToken = () => {
 
    try {
 
      // Get token from login
      const token =
        localStorage.getItem("token");
 
      if (!token) {
 
        console.error(
          "JWT token not found"
        );
 
        return null;
      }
 
      // JWT contains:
      // Header.Payload.Signature
 
      const tokenParts =
        token.split(".");
 
      if (tokenParts.length !== 3) {
 
        throw new Error(
          "Invalid JWT token"
        );
      }
 
      // Decode payload
 
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
 
      // Get citizen ID from nameidentifier
 
      const id =
        payload[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];
 
      console.log(
        "Citizen ID from JWT:",
        id
      );
 
      return id;
 
    } catch (error) {
 
      console.error(
        "Error reading JWT:",
        error
      );
 
      return null;
    }
  };
 
 
  // =====================================================
  // FETCH CITIZEN PROFILE
  // =====================================================
 
  useEffect(() => {
 
    const fetchCitizenProfile =
      async () => {
 
        try {
 
          setLoading(true);
 
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
          // GET CITIZEN ID FROM TOKEN
          // =================================================
 
          const id =
            getCitizenIdFromToken();
 
          if (!id) {
 
            throw new Error(
              "Citizen ID not found in token"
            );
          }
 
          setCitizenId(id);
 
          console.log(
            "Citizen ID:",
            id
          );
 
          // =================================================
          // GET CITIZEN PROFILE
          // =================================================
 
          // const response =
          //   await fetch(
          //     `${API_BASE_URL}/Citizens/${id}`,
          //     {
          //       method: "GET",
 
          //       headers: {
 
          //         Authorization:
          //           `Bearer ${token}`,
 
          //         Accept:
          //           "application/json",
 
          //       },
 
          //     }
          //   );
 
          // =================================================
          // TOKEN EXPIRED
          // =================================================
 
          if (response.status === 401) {
 
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
              "Citizen API Error:",
              errorText
            );
 
            throw new Error(
              `Failed to fetch citizen profile: ${response.status}`
            );
          }
 
          // =================================================
          // GET RESPONSE
          // =================================================
 
          const data =
            await response.json();
 
          console.log(
            "Citizen Profile Response:",
            data
          );
 
          // =================================================
          // SET FIRST NAME
          // =================================================
 
          setFirstName(
            data.firstName ??
            data.firstName ??
            ""
          );
 
          // =================================================
          // SET LAST NAME
          // =================================================
 
          setLastName(
            data.lastName ??
            data.lastName ??
            ""
          );
 
        } catch (error) {
 
          console.error(
            "Error loading citizen profile:",
            error
          );
 
        } finally {
 
          setLoading(false);
 
        }
 
      };
 
    fetchCitizenProfile();
 
  }, []);
 
 
  // =====================================================
  // VALIDATION
  // =====================================================
 
  const validateForm = () => {
 
    const newErrors = {};
 
    // =================================================
    // FIRST NAME
    // =================================================
 
    if (!firstName.trim()) {
 
      newErrors.firstName =
        "Please enter first name";
 
    }
 
    // =================================================
    // LAST NAME
    // =================================================
 
    if (!lastName.trim()) {
 
      newErrors.lastName =
        "Please enter last name";
 
    }
 
    setErrors(newErrors);
 
    return (
      Object.keys(newErrors).length === 0
    );
  };
 
 
  // =====================================================
  // UPDATE PROFILE
  // =====================================================
 
  const handleUpdate = async (e) => {
 
    e.preventDefault();
 
    // =================================================
    // VALIDATE
    // =================================================
 
    if (!validateForm()) {
 
      return;
    }
 
    try {
 
      setUpdating(true);
 
      // =================================================
      // GET CURRENT LOGIN TOKEN
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
      // UPDATE DATA
      // ONLY FIRST NAME + LAST NAME
      // =================================================
 
      const updateData = {
 
        firstName:
          firstName.trim(),
 
        lastName:
          lastName.trim(),
 
      };
 
      console.log(
        "Profile Update Data:",
        updateData
      );
 
      // =================================================
      // UPDATE PROFILE API
      // =================================================
 
      const response =
        await fetch(
          `${API_BASE_URL}/Citizen/profile`,
          {
            method: "PUT",
 
            headers: {
 
              Authorization:
                `Bearer ${token}`,
 
              "Content-Type":
                "application/json",
 
              Accept:
                "application/json",
 
            },
 
            body:
              JSON.stringify(
                updateData
              ),
 
          }
        );
 
      // =================================================
      // TOKEN EXPIRED / UNAUTHORIZED
      // =================================================
 
      if (response.status === 401) {
 
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
          "Update Profile API Error:",
          errorText
        );
 
        throw new Error(
          `Profile update failed: ${response.status}`
        );
      }
 
      // =================================================
      // RESPONSE
      // =================================================
 
      const result =
        await response.json();
 
      console.log(
        "Updated Profile:",
        result
      );
 
      // =================================================
      // UPDATE FRONTEND VALUES
      // =================================================
 
      setFirstName(
        result.firstName ??
        result.firstName ??
        firstName
      );
 
      setLastName(
        result.lastName ??
        result.lastName ??
        lastName
      );
 
      // =================================================
      // SUCCESS
      // =================================================
 
      alert(
        "Profile updated successfully!"
      );
 
    } catch (error) {
 
      console.error(
        "Error updating profile:",
        error
      );
 
      alert(
        "Failed to update profile. Please try again."
      );
 
    } finally {
 
      setUpdating(false);
 
    }
 
  };
 
 
  // =====================================================
  // LOADING
  // =====================================================
 
  if (loading) {
 
    return (
 
      <div className="w-full min-h-full bg-gray-100 p-4">
 
        <div className="w-full bg-white rounded-xl shadow-sm p-10 flex justify-center items-center">
 
          <p className="text-gray-500">
 
            Loading profile...
 
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
 
            Citizen Profile
 
          </h1>
 
          <p className="text-sm text-gray-500 mt-2">
 
            View and update your profile information
 
          </p>
 
        </div>
 
 
        {/* =================================================
            FORM
        ================================================= */}
 
        <form
          onSubmit={handleUpdate}
          className="w-full"
        >
 
          {/* =================================================
              CITIZEN ID
          ================================================= */}
 
          {/* <div>
 
            <label className="block text-sm font-medium text-gray-700 mb-2">
 
              Citizen ID
 
            </label>
 
            <input
              type="text"
              value={citizenId}
              disabled
              className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
            />
 
          </div>
 */}
 
          {/* =================================================
              FIRST NAME + LAST NAME
          ================================================= */}
 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
 
            {/* FIRST NAME */}
 
            <div>
 
              <label className="block text-sm font-medium text-gray-700 mb-2">
 
                First Name
 
                <span className="text-red-500 ml-1">
                  *
                </span>
 
              </label>
 
              <input
                type="text"
                value={firstName}
                onChange={(e) => {
 
                  setFirstName(
                    e.target.value
                  );
 
                  setErrors(
                    (previous) => ({
                      ...previous,
                      firstName: "",
                    })
                  );
 
                }}
                placeholder="Enter first name"
                className={`w-full h-12 border rounded-lg px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.firstName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
 
              {errors.firstName && (
 
                <p className="text-red-500 text-xs mt-1">
 
                  {errors.firstName}
 
                </p>
 
              )}
 
            </div>
 
 
            {/* LAST NAME */}
 
            <div>
 
              <label className="block text-sm font-medium text-gray-700 mb-2">
 
                Last Name
 
                <span className="text-red-500 ml-1">
                  *
                </span>
 
              </label>
 
              <input
                type="text"
                value={lastName}
                onChange={(e) => {
 
                  setLastName(
                    e.target.value
                  );
 
                  setErrors(
                    (previous) => ({
                      ...previous,
                      lastName: "",
                    })
                  );
 
                }}
                placeholder="Enter last name"
                className={`w-full h-12 border rounded-lg px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.lastName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
 
              {errors.lastName && (
 
                <p className="text-red-500 text-xs mt-1">
 
                  {errors.lastName}
 
                </p>
 
              )}
 
            </div>
 
          </div>
 
 
          {/* =================================================
              UPDATE BUTTON
          ================================================= */}
 
          <div className="flex justify-end mt-8">
 
            <button
              type="submit"
              disabled={updating}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
 
              {updating
                ? "Updating..."
                : "Update Profile"}
 
            </button>
 
          </div>
 
        </form>
 
      </div>
 
    </div>
 
  );
};
 
export default CitizenProfileUpdate;
 