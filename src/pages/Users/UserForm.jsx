import React, { useEffect, useState } from "react";

import axios from "axios";

const UserForm = ({ editingUser, onSuccess, onCancel }) => {
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [subdepartments, setSubdepartments] = useState([]);
  const [plazas, setPlazas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSubdepartments, setLoadingSubdepartments] = useState(false);
  const [loadingPlazas, setLoadingPlazas] = useState(false);
  const [errors, setErrors] = useState({});

  const emptyForm = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    roleId: "",
    departmentId: "",
    subdepartmentId: "",
    plazaId: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const isEditMode = Boolean(editingUser);

  // --------------------------------------------------
  // LOAD ROLES AND DEPARTMENTS
  // --------------------------------------------------

  useEffect(() => {
    loadRoles();
    loadDepartments();
  }, []);

  // --------------------------------------------------
  // LOAD EDITING USER DATA
  // --------------------------------------------------

  useEffect(() => {
    if (!editingUser) {
      setFormData(emptyForm);
      setSubdepartments([]);
      setPlazas([]);
      setErrors({});
      return;
    }

    const departmentId = editingUser.departmentId
      ? String(editingUser.departmentId)
      : "";

    const roleId = editingUser.roleId
      ? String(editingUser.roleId)
      : "";

    const subdepartmentId = editingUser.subdepartmentId
      ? String(editingUser.subdepartmentId)
      : "";

    const plazaId = editingUser.plazaId
      ? String(editingUser.plazaId)
      : "";

    setFormData({
      firstName: editingUser.firstName || "",
      lastName: editingUser.lastName || "",
      email: editingUser.email || "",
      phoneNumber: editingUser.phoneNumber || "",
      password: "",
      roleId,
      departmentId,
      subdepartmentId,
      plazaId,
    });

    setErrors({});

    if (departmentId) {
      loadSubdepartments(departmentId);
    } else {
      setSubdepartments([]);
    }
  }, [editingUser]);

  // --------------------------------------------------
  // LOAD ROLES
  // --------------------------------------------------

  const loadRoles = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5163/api/Roles",
        authConfig
      );

      setRoles(response.data);
    } catch (error) {
      console.error("Error loading roles:", error);
    }
  };

  // --------------------------------------------------
  // LOAD DEPARTMENTS
  // --------------------------------------------------

  const loadDepartments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5163/api/Department",
        authConfig
      );

      setDepartments(response.data);
    } catch (error) {
      console.error("Error loading departments:", error);
    }
  };

  // --------------------------------------------------
  // LOAD PLAZAS
  // --------------------------------------------------

  const loadPlazas = async () => {
    setLoadingPlazas(true);

    try {
      const response = await axios.get(
        "http://192.168.1.37:8000/Plazas/"
      );

      setPlazas(response.data);
    } catch (error) {
      console.error("Error loading plazas:", error);
      setPlazas([]);
    } finally {
      setLoadingPlazas(false);
    }
  };

  // --------------------------------------------------
  // LOAD SUBDEPARTMENTS BASED ON DEPARTMENT
  // --------------------------------------------------

  const loadSubdepartments = async (departmentId) => {
    if (!departmentId) {
      setSubdepartments([]);
      return;
    }

    setLoadingSubdepartments(true);

    try {
      const response = await axios.get(
        `http://localhost:5163/api/SubDepartment/by-department/${departmentId}`,
        authConfig
      );

      setSubdepartments(response.data);
    } catch (error) {
      console.error("Error loading subdepartments:", error);
      setSubdepartments([]);
    } finally {
      setLoadingSubdepartments(false);
    }
  };

  // --------------------------------------------------
  // SELECTED ROLE
  // --------------------------------------------------

  const selectedRole = roles.find(
    (role) => Number(role.roleId) === Number(formData.roleId)
  );

  const isTmsUser =
    selectedRole?.roleName?.trim().toLowerCase() === "tms user";

  // ADDED: CHECK SUPER ADMINISTRATOR
  const isSuperAdminUser =
    selectedRole?.roleName?.trim().toLowerCase() ===
    "super administrator";

  // --------------------------------------------------
  // LOAD PLAZAS WHEN TMS USER IS SELECTED
  // --------------------------------------------------

  useEffect(() => {
    if (isTmsUser) {
      loadPlazas();
    } else {
      setPlazas([]);

      setFormData((prev) => ({
        ...prev,
        plazaId: "",
      }));
    }
  }, [isTmsUser]);

  // --------------------------------------------------
  // SANITIZATION
  // --------------------------------------------------

  const sanitizeName = (value) => {
    return value
      .replace(/[^A-Za-z\s]/g, "")
      .replace(/\s+/g, " ")
      .replace(/^\s+/, "");
  };

  const sanitizeEmail = (value) => {
    return value.replace(/\s/g, "").toLowerCase();
  };

  const sanitizePhone = (value) => {
    return value.replace(/\D/g, "").slice(0, 10);
  };

  const sanitizePassword = (value) => {
    return value.replace(/\s/g, "");
  };

  // --------------------------------------------------
  // HANDLE CHANGE
  // --------------------------------------------------

  const handleChange = async (e) => {
    const { name, value } = e.target;

    let sanitizedValue = value;

    if (name === "firstName" || name === "lastName") {
      sanitizedValue = sanitizeName(value);
    }

    if (name === "email") {
      sanitizedValue = sanitizeEmail(value);
    }

    if (name === "phoneNumber") {
      sanitizedValue = sanitizePhone(value);
    }

    if (name === "password") {
      sanitizedValue = sanitizePassword(value);
    }

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    // ----------------------------------------------
    // ROLE CHANGE
    // ----------------------------------------------

    if (name === "roleId") {
      setFormData((prev) => ({
        ...prev,
        roleId: value,
        plazaId: "",
      }));

      return;
    }

    // ----------------------------------------------
    // DEPARTMENT CHANGE
    // ----------------------------------------------

    if (name === "departmentId") {
      setFormData((prev) => ({
        ...prev,
        departmentId: value,
        subdepartmentId: "",
      }));

      setErrors((prev) => ({
        ...prev,
        departmentId: "",
        subdepartmentId: "",
      }));

      setSubdepartments([]);

      if (!value) {
        return;
      }

      await loadSubdepartments(value);

      return;
    }

    // ----------------------------------------------
    // NORMAL FIELD
    // ----------------------------------------------

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));
  };

  // --------------------------------------------------
  // VALIDATION
  // --------------------------------------------------

  const validateForm = () => {
    const newErrors = {};

    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const email = formData.email.trim();
    const phoneNumber = formData.phoneNumber.trim();
    const password = formData.password;

    // First Name

    if (!firstName) {
      newErrors.firstName = "First name is required.";
    } else if (firstName.length < 2) {
      newErrors.firstName =
        "First name must contain at least 2 characters.";
    } else if (firstName.length > 50) {
      newErrors.firstName =
        "First name cannot exceed 50 characters.";
    } else if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(firstName)) {
      newErrors.firstName =
        "First name should contain only letters and single spaces.";
    }

    // Last Name

    if (!lastName) {
      newErrors.lastName = "Last name is required.";
    } else if (lastName.length < 2) {
      newErrors.lastName =
        "Last name must contain at least 2 characters.";
    } else if (lastName.length > 50) {
      newErrors.lastName =
        "Last name cannot exceed 50 characters.";
    } else if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(lastName)) {
      newErrors.lastName =
        "Last name should contain only letters and single spaces.";
    }

    // Email

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (email.length > 100) {
      newErrors.email =
        "Email cannot exceed 100 characters.";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)
    ) {
      newErrors.email =
        "Please enter a valid email address.";
    }

    // Phone

    if (!phoneNumber) {
      newErrors.phoneNumber =
        "Phone number is required.";
    } else if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      newErrors.phoneNumber =
        "Phone number must be a valid 10-digit Indian mobile number.";
    }

    // Password - Create only

    if (!isEditMode) {
      if (!password) {
        newErrors.password = "Password is required.";
      } else if (password.length < 8) {
        newErrors.password =
          "Password must contain at least 8 characters.";
      } else if (password.length > 100) {
        newErrors.password =
          "Password cannot exceed 100 characters.";
      } else if (!/[A-Z]/.test(password)) {
        newErrors.password =
          "Password must contain at least one uppercase letter.";
      } else if (!/[a-z]/.test(password)) {
        newErrors.password =
          "Password must contain at least one lowercase letter.";
      } else if (!/[0-9]/.test(password)) {
        newErrors.password =
          "Password must contain at least one number.";
      }
    }

    // Role

    if (!formData.roleId) {
      newErrors.roleId = "Please select a role.";
    }

    // Department

    if (!formData.departmentId) {
      newErrors.departmentId =
        "Please select a department.";
    }

    // Subdepartment

    if (!formData.subdepartmentId) {
      newErrors.subdepartmentId =
        "Please select a subdepartment.";
    }

    // Plaza only for TMS User

    if (isTmsUser && !formData.plazaId) {
      newErrors.plazaId =
        "Please select a plaza.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const basePayload = {
        firstName: sanitizeName(formData.firstName).trim(),
        lastName: sanitizeName(formData.lastName).trim(),
        email: sanitizeEmail(formData.email).trim(),
        phoneNumber: sanitizePhone(formData.phoneNumber).trim(),
        roleId: Number(formData.roleId),
        departmentId: Number(formData.departmentId),
        subdepartmentId: Number(
          formData.subdepartmentId
        ),
        plazaId: isTmsUser
          ? Number(formData.plazaId)
          : null,
      };

      // ----------------------------------------------
      // CREATE
      // ----------------------------------------------

      if (!isEditMode) {
        const createPayload = {
          ...basePayload,
          password: sanitizePassword(
            formData.password
          ),
        };

        await axios.post(
          "http://localhost:5163/api/User",
          createPayload,
          authConfig
        );

        alert("User created successfully.");
      }

      // ----------------------------------------------
      // UPDATE
      // ----------------------------------------------

      else {
        await axios.put(
          `http://localhost:5163/api/User/${editingUser.userId}`,
          basePayload,
          authConfig
        );

        alert("User updated successfully.");
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(
        isEditMode
          ? "Error updating user:"
          : "Error creating user:",
        error
      );

      console.error(
        "Backend response:",
        error.response?.data
      );

      const backendErrors =
        error.response?.data?.errors;

      if (backendErrors) {
        const validationMessages =
          Object.values(backendErrors)
            .flat()
            .join("\n");

        alert(validationMessages);
      } else {
        const message =
          error.response?.data?.message ||
          error.response?.data?.detail ||
          error.response?.data?.title ||
          (isEditMode
            ? "Failed to update user."
            : "Failed to create user.");

        alert(message);
      }
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* HEADER */}

        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-[#123A63]">
            {isSuperAdminUser
              ? "Protected User"
              : isEditMode
              ? "Edit User"
              : "Create User"}
          </h2>

          <button
            type="button"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        {/* --------------------------------------------------
            SUPER ADMINISTRATOR PROTECTED VIEW
        -------------------------------------------------- */}

        {isSuperAdminUser ? (
          <div className="p-8 text-center">

            <div className="text-4xl mb-4">
              🔒
            </div>

            <h3 className="text-lg font-semibold text-[#123A63]">
              Protected User
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              The Super Administrator account is protected
              and cannot be edited or deleted.
            </p>

            <button
              type="button"
              onClick={onCancel}
              className="mt-6 px-5 py-2 bg-[#123A63] text-white rounded-md hover:bg-[#1D4F85]"
            >
              Close
            </button>

          </div>
        ) : (

          /* --------------------------------------------------
             EXISTING USER FORM
          -------------------------------------------------- */

          <form
            onSubmit={handleSubmit}
            className="p-6"
          >
            <div className="grid grid-cols-2 gap-4">

              {/* FIRST NAME */}

              <div>
                <label className="block text-sm font-medium mb-1">
                  First Name
                </label>

                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  maxLength={50}
                  className={`w-full border rounded-md px-3 py-2 ${
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
                <label className="block text-sm font-medium mb-1">
                  Last Name
                </label>

                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  maxLength={50}
                  className={`w-full border rounded-md px-3 py-2 ${
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

              {/* EMAIL */}

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  maxLength={100}
                  className={`w-full border rounded-md px-3 py-2 ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />

                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* PHONE */}

              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number
                </label>

                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  inputMode="numeric"
                  maxLength={10}
                  className={`w-full border rounded-md px-3 py-2 ${
                    errors.phoneNumber
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />

                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* PASSWORD */}

              {!isEditMode && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    maxLength={100}
                    placeholder="Enter password"
                    className={`w-full border rounded-md px-3 py-2 ${
                      errors.password
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />

                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
              )}

              {/* ROLE */}

              <div>
                <label className="block text-sm font-medium mb-1">
                  Role
                </label>

                <select
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-3 py-2 ${
                    errors.roleId
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">
                    Select Role
                  </option>

                  {roles.map((role) => (
                    <option
                      key={role.roleId}
                      value={role.roleId}
                    >
                      {role.roleName}
                    </option>
                  ))}
                </select>

                {errors.roleId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.roleId}
                  </p>
                )}
              </div>

              {/* DEPARTMENT */}

              <div>
                <label className="block text-sm font-medium mb-1">
                  Department
                </label>

                <select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleChange}
                  className={`w-full border rounded-md px-3 py-2 ${
                    errors.departmentId
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">
                    Select Department
                  </option>

                  {departments.map((department) => (
                    <option
                      key={department.departmentId}
                      value={department.departmentId}
                    >
                      {department.departmentName}
                    </option>
                  ))}
                </select>

                {errors.departmentId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.departmentId}
                  </p>
                )}
              </div>

              {/* SUBDEPARTMENT */}

              <div>
                <label className="block text-sm font-medium mb-1">
                  Subdepartment
                </label>

                <select
                  name="subdepartmentId"
                  value={formData.subdepartmentId}
                  onChange={handleChange}
                  disabled={
                    !formData.departmentId ||
                    loadingSubdepartments
                  }
                  className={`w-full border rounded-md px-3 py-2 disabled:bg-gray-100 ${
                    errors.subdepartmentId
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">
                    {!formData.departmentId
                      ? "Select Department First"
                      : loadingSubdepartments
                      ? "Loading Subdepartments..."
                      : subdepartments.length === 0
                      ? "No Subdepartments Found"
                      : "Select Subdepartment"}
                  </option>

                  {subdepartments.map((subdepartment) => (
                    <option
                      key={subdepartment.subdepartmentId}
                      value={subdepartment.subdepartmentId}
                    >
                      {subdepartment.subdepartmentName}
                    </option>
                  ))}
                </select>

                {errors.subdepartmentId && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.subdepartmentId}
                  </p>
                )}
              </div>

              {/* PLAZA */}

              {isTmsUser && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Plaza
                  </label>

                  <select
                    name="plazaId"
                    value={formData.plazaId}
                    onChange={handleChange}
                    disabled={loadingPlazas}
                    className={`w-full border rounded-md px-3 py-2 disabled:bg-gray-100 ${
                      errors.plazaId
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <option value="">
                      {loadingPlazas
                        ? "Loading Plazas..."
                        : plazas.length === 0
                        ? "No Plazas Found"
                        : "Select Plaza"}
                    </option>

                    {plazas.map((plaza) => (
                      <option
                        key={plaza.Plaza_id}
                        value={plaza.Plaza_id}
                      >
                        {plaza.Plaza_name}
                      </option>
                    ))}
                  </select>

                  {errors.plazaId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.plazaId}
                    </p>
                  )}
                </div>
              )}

            </div>

            {/* BUTTONS */}

            <div className="flex justify-end gap-3 mt-6">

              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[#123A63] text-white rounded-md hover:bg-[#1D4F85] disabled:opacity-50"
              >
                {loading
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                  ? "Update User"
                  : "Create User"}
              </button>

            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserForm;