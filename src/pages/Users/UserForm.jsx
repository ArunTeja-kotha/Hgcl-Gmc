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

  // ==========================================
  // CHECK EDIT MODE
  // ==========================================

  const isEditMode = Boolean(editingUser);

  // ==========================================
  // LOAD INITIAL DATA
  // ==========================================

  useEffect(() => {
    loadRoles();
    loadDepartments();
  }, []);

  // ==========================================
  // LOAD EDIT USER DATA
  // ==========================================

  useEffect(() => {
    if (!editingUser) {
      // Create mode
      setFormData(emptyForm);
      setSubdepartments([]);
      setPlazas([]);
      return;
    }

    // Edit mode
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

    // Load subdepartments for existing department
    if (departmentId) {
      loadSubdepartments(departmentId);
    } else {
      setSubdepartments([]);
    }
  }, [editingUser]);

  // ==========================================
  // LOAD ROLES
  // ==========================================

  const loadRoles = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5163/api/Roles",
        authConfig
      );

      console.log("ROLES API RESPONSE:", response.data);

      setRoles(response.data);
    } catch (error) {
      console.error("Error loading roles:", error);
    }
  };

  // ==========================================
  // LOAD DEPARTMENTS
  // ==========================================

  const loadDepartments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5163/api/Department",
        authConfig
      );

      console.log("DEPARTMENT API RESPONSE:", response.data);

      setDepartments(response.data);
    } catch (error) {
      console.error("Error loading departments:", error);
    }
  };

  // ==========================================
  // LOAD PLAZAS
  // ==========================================

  const loadPlazas = async () => {
    setLoadingPlazas(true);

    try {
      const response = await axios.get(
        "http://192.168.1.37:8000/Plazas/"
      );

      console.log("PLAZA API RESPONSE:", response.data);

      setPlazas(response.data);
    } catch (error) {
      console.error("Error loading plazas:", error);

      if (error.response) {
        console.error(
          "Plaza API response:",
          error.response.data
        );
      } else if (error.request) {
        console.error(
          "Plaza API request was sent but no response received."
        );
      } else {
        console.error(
          "Plaza API request error:",
          error.message
        );
      }

      setPlazas([]);
    } finally {
      setLoadingPlazas(false);
    }
  };

  // ==========================================
  // LOAD SUBDEPARTMENTS
  // ==========================================

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

      console.log(
        "Subdepartments for Department:",
        departmentId,
        response.data
      );

      setSubdepartments(response.data);
    } catch (error) {
      console.error(
        "Error loading subdepartments:",
        error
      );

      setSubdepartments([]);
    } finally {
      setLoadingSubdepartments(false);
    }
  };

  // ==========================================
  // FIND SELECTED ROLE
  // ==========================================

  const selectedRole = roles.find(
    (role) =>
      Number(role.roleId) === Number(formData.roleId)
  );

  // ==========================================
  // CHECK TMS USER
  // ==========================================

  const isTmsUser =
    selectedRole?.roleName?.toLowerCase() === "tms user";

  // ==========================================
  // LOAD PLAZAS ONLY FOR TMS USER
  // ==========================================

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

  // ==========================================
  // HANDLE INPUT CHANGES
  // ==========================================

  const handleChange = async (e) => {
    const { name, value } = e.target;

    // ========================================
    // ROLE CHANGED
    // ========================================

    if (name === "roleId") {
      setFormData((prev) => ({
        ...prev,
        roleId: value,
        plazaId: "",
      }));

      return;
    }

    // ========================================
    // DEPARTMENT CHANGED
    // ========================================

    if (name === "departmentId") {
      setFormData((prev) => ({
        ...prev,
        departmentId: value,
        subdepartmentId: "",
      }));

      setSubdepartments([]);

      if (!value) {
        return;
      }

      await loadSubdepartments(value);

      return;
    }

    // ========================================
    // OTHER FIELDS
    // ========================================

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ========================================
    // VALIDATE ROLE
    // ========================================

    if (!formData.roleId) {
      alert("Please select a role.");
      return;
    }

    // ========================================
    // VALIDATE DEPARTMENT
    // ========================================

    if (!formData.departmentId) {
      alert("Please select a department.");
      return;
    }

    // ========================================
    // VALIDATE SUBDEPARTMENT
    // ========================================

    if (!formData.subdepartmentId) {
      alert("Please select a subdepartment.");
      return;
    }

    // ========================================
    // VALIDATE PLAZA ONLY FOR TMS USER
    // ========================================

    if (isTmsUser && !formData.plazaId) {
      alert("Please select a plaza.");
      return;
    }

    // ========================================
    // PASSWORD REQUIRED ONLY FOR CREATE
    // ========================================

    if (!isEditMode && !formData.password.trim()) {
      alert("Please enter a password.");
      return;
    }

    setLoading(true);

    try {
      // ======================================
      // BASE PAYLOAD
      // ======================================

      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),

        roleId: Number(formData.roleId),

        departmentId: Number(formData.departmentId),

        subdepartmentId: Number(
          formData.subdepartmentId
        ),

        // Plaza only belongs to TMS User
        plazaId: isTmsUser
          ? Number(formData.plazaId)
          : null,
      };

      // ======================================
      // PASSWORD
      // ======================================

      if (!isEditMode) {
        payload.password = formData.password;
      } else if (formData.password.trim() !== "") {
        payload.password = formData.password;
      }

      console.log(
        isEditMode
          ? "UPDATE USER PAYLOAD:"
          : "CREATE USER PAYLOAD:",
        payload
      );

      // ======================================
      // CREATE USER
      // POST
      // ======================================

      if (!isEditMode) {
        await axios.post(
          "http://localhost:5163/api/User",
          payload,
          authConfig
        );

        alert("User created successfully.");
      }

      // ======================================
      // UPDATE USER
      // PUT
      // ======================================

      else {
        await axios.put(
          `http://localhost:5163/api/User/${editingUser.userId}`,
          payload,
          authConfig
        );

        alert("User updated successfully.");
      }

      // ======================================
      // SUCCESS
      // ======================================

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

      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        (isEditMode
          ? "Failed to update user."
          : "Failed to create user.");

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RETURN UI
  // ==========================================

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        className="
          bg-white
          rounded-lg
          shadow-xl
          w-full
          max-w-2xl
          max-h-[90vh]
          overflow-y-auto
        "
      >
        {/* ======================================
            HEADER
        ====================================== */}

        <div
          className="
            flex
            justify-between
            items-center
            px-6
            py-4
            border-b
          "
        >
          <h2
            className="
              text-xl
              font-semibold
              text-[#123A63]
            "
          >
            {isEditMode ? "Edit User" : "Create User"}
          </h2>

          <button
            type="button"
            onClick={onCancel}
            className="
              text-gray-500
              hover:text-gray-700
              text-xl
            "
          >
            ✕
          </button>
        </div>

        {/* ======================================
            FORM
        ====================================== */}

        <form
          onSubmit={handleSubmit}
          className="p-6"
        >
          <div className="grid grid-cols-2 gap-4">

            {/* FIRST NAME */}

            <div>
              <label
                className="
                  block
                  text-sm
                  font-medium
                  mb-1
                "
              >
                First Name
              </label>

              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="
                  w-full
                  border
                  rounded-md
                  px-3
                  py-2
                "
              />
            </div>

            {/* LAST NAME */}

            <div>
              <label
                className="
                  block
                  text-sm
                  font-medium
                  mb-1
                "
              >
                Last Name
              </label>

              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="
                  w-full
                  border
                  rounded-md
                  px-3
                  py-2
                "
              />
            </div>

            {/* EMAIL */}

            <div>
              <label
                className="
                  block
                  text-sm
                  font-medium
                  mb-1
                "
              >
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="
                  w-full
                  border
                  rounded-md
                  px-3
                  py-2
                "
              />
            </div>

            {/* PHONE */}

            <div>
              <label
                className="
                  block
                  text-sm
                  font-medium
                  mb-1
                "
              >
                Phone Number
              </label>

              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="
                  w-full
                  border
                  rounded-md
                  px-3
                  py-2
                "
              />
            </div>

            {/* PASSWORD */}

            <div>
              <label
                className="
                  block
                  text-sm
                  font-medium
                  mb-1
                "
              >
                Password

                {isEditMode && (
                  <span
                    className="
                      text-xs
                      text-gray-500
                      ml-2
                    "
                  >
                    (Leave blank to keep current)
                  </span>
                )}
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!isEditMode}
                placeholder={
                  isEditMode
                    ? "Enter new password only if changing"
                    : "Enter password"
                }
                className="
                  w-full
                  border
                  rounded-md
                  px-3
                  py-2
                "
              />
            </div>

            {/* ROLE */}

            <div>
              <label
                className="
                  block
                  text-sm
                  font-medium
                  mb-1
                "
              >
                Role
              </label>

              <select
                name="roleId"
                value={formData.roleId}
                onChange={handleChange}
                required
                className="
                  w-full
                  border
                  rounded-md
                  px-3
                  py-2
                "
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
            </div>

            {/* DEPARTMENT */}

            <div>
              <label
                className="
                  block
                  text-sm
                  font-medium
                  mb-1
                "
              >
                Department
              </label>

              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleChange}
                required
                className="
                  w-full
                  border
                  rounded-md
                  px-3
                  py-2
                "
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
            </div>

            {/* SUBDEPARTMENT */}

            <div>
              <label
                className="
                  block
                  text-sm
                  font-medium
                  mb-1
                "
              >
                Subdepartment
              </label>

              <select
                name="subdepartmentId"
                value={formData.subdepartmentId}
                onChange={handleChange}
                required
                disabled={
                  !formData.departmentId ||
                  loadingSubdepartments
                }
                className="
                  w-full
                  border
                  rounded-md
                  px-3
                  py-2
                  disabled:bg-gray-100
                "
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

                {subdepartments.map(
                  (subdepartment) => (
                    <option
                      key={
                        subdepartment.subdepartmentId
                      }
                      value={
                        subdepartment.subdepartmentId
                      }
                    >
                      {
                        subdepartment.subdepartmentName
                      }
                    </option>
                  )
                )}
              </select>
            </div>

            {/* PLAZA - ONLY TMS USER */}

            {isTmsUser && (
              <div>
                <label
                  className="
                    block
                    text-sm
                    font-medium
                    mb-1
                  "
                >
                  Plaza
                </label>

                <select
                  name="plazaId"
                  value={formData.plazaId}
                  onChange={handleChange}
                  required
                  disabled={loadingPlazas}
                  className="
                    w-full
                    border
                    rounded-md
                    px-3
                    py-2
                    disabled:bg-gray-100
                  "
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
              </div>
            )}
          </div>

          {/* ======================================
              BUTTONS
          ====================================== */}

          <div
            className="
              flex
              justify-end
              gap-3
              mt-6
            "
          >
            <button
              type="button"
              onClick={onCancel}
              className="
                px-4
                py-2
                border
                rounded-md
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                px-4
                py-2
                bg-[#123A63]
                text-white
                rounded-md
                hover:bg-[#1D4F85]
                disabled:opacity-50
              "
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
      </div>
    </div>
  );
};

export default UserForm;