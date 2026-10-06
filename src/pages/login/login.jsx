import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";

import loginBackground from "../../assets/gmclogin.png";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ============================================
  // Decode JWT Token
  // ============================================
  const getTokenData = (token) => {
    try {
      const payload = token.split(".")[1];

      if (!payload) {
        throw new Error("Invalid JWT token");
      }

      const decodedPayload = JSON.parse(
        atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
      );

      console.log("JWT Payload:", decodedPayload);

      // ============================================
      // Get Role
      // ============================================
      const rawRole =
        decodedPayload.role ||
        decodedPayload[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];

      // ============================================
      // Get User Name
      // ============================================
      const userName =
        decodedPayload[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        ] || decodedPayload.name;

      // ============================================
      // Normalize Role
      // ============================================
      const normalizedRole =
        typeof rawRole === "string"
          ? rawRole.trim()
          : null;

      // ============================================
      // Citizen JWT
      // ============================================
      const finalRole =
        normalizedRole ||
        (decodedPayload.AccountType === "Citizen"
          ? "Citizen"
          : null);

      console.log("Raw Role:", rawRole);
      console.log("Normalized Role:", normalizedRole);
      console.log("Final Role:", finalRole);
      console.log("User Name:", userName);

      return {
        role: finalRole,
        userName: userName || null,
      };
    } catch (error) {
      console.error("Unable to decode JWT:", error);

      return {
        role: null,
        userName: null,
      };
    }
  };

  // ============================================
  // Handle Login
  // ============================================
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      console.log("Login started...");

      // ============================================
      // Login API
      // ============================================
      const response = await axios.post(
        "http://localhost:5163/api/Auth/login",
        {
          email: email,
          password: password,
        }
      );

      console.log("Login successful:", response.data);

      // ============================================
      // Get Token
      // ============================================
      const token = response.data?.token;

      if (!token) {
        console.error("Token was not received.");

        alert(
          "Login failed. Authentication token was not received."
        );

        return;
      }

      // ============================================
      // Store Token
      // ============================================
      localStorage.setItem("token", token);

      console.log("Token stored successfully.");

      // ============================================
      // Decode Token
      // ============================================
      const { role, userName } = getTokenData(token);

      console.log("Logged in role:", role);
      console.log("Logged in user name:", userName);

      // ============================================
      // Validate Role
      // ============================================
      if (!role) {
        console.error("No valid role found in JWT.");

        localStorage.removeItem("role");
        localStorage.removeItem("userName");

        alert(
          "Login successful, but user role was not found."
        );

        return;
      }

      // ============================================
      // Store Role
      // ============================================
      localStorage.setItem("role", role);

      // ============================================
      // Store User Name
      // ============================================
      if (userName) {
        localStorage.setItem("userName", userName);
      } else {
        localStorage.removeItem("userName");
      }

      // ============================================
      // Normalize Role Before Navigation
      // ============================================
      const normalizedRole = role.trim();

      console.log("=================================");
      console.log("ROLE BEFORE NAVIGATION:", role);
      console.log("NORMALIZED ROLE:", normalizedRole);
      console.log(
        "CURRENT URL:",
        window.location.pathname
      );
      console.log("=================================");

      // ============================================
      // Navigate Based on Role
      // ============================================
      switch (normalizedRole) {
        // ============================================
        // SUPER ADMINISTRATOR
        // ============================================
        case "Super Administrator":
          console.log(
            "SUPER ADMINISTRATOR CONDITION MATCHED"
          );

          navigate("/users", {
            replace: true,
          });

          break;

        // ============================================
        // WEB ADMINISTRATOR
        // ============================================
        case "Web Administrator":
          console.log(
            "WEB ADMINISTRATOR CONDITION MATCHED"
          );

          navigate("/users", {
            replace: true,
          });

          break;

        // ============================================
        // TMS USER
        // ============================================
        case "TMS User":
          console.log(
            "TMS USER CONDITION MATCHED"
          );

          navigate("/tms/grievances", {
            replace: true,
          });

          break;

        // ============================================
        // WEB USER
        // ============================================
        case "Web User":
          console.log(
            "WEB USER CONDITION MATCHED"
          );

          console.log(
            "Navigating to /webuser/grievances"
          );

          navigate("/webuser/grievances", {
            replace: true,
          });

          break;

        // ============================================
        // NODAL OFFICER
        // ============================================
        case "Nodal Officer":
          console.log(
            "NODAL OFFICER CONDITION MATCHED"
          );

          navigate("/nodal/grievances", {
            replace: true,
          });

          break;

        // ============================================
        // FIELD USER
        // ============================================
        case "Field User":
          console.log(
            "FIELD USER CONDITION MATCHED"
          );

          console.log(
            "Navigating to /field/grievances/assigned"
          );

          navigate("/field/grievances/assigned", {
            replace: true,
          });

          break;

        // ============================================
        // CITIZEN
        // ============================================
        case "Citizen":
          console.log(
            "CITIZEN CONDITION MATCHED"
          );

          navigate("/citizen/grievances/my", {
            replace: true,
          });

          break;

        // ============================================
        // UNKNOWN ROLE
        // ============================================
        default:
          console.warn(
            "UNKNOWN ROLE:",
            normalizedRole
          );

          alert(
            `Login successful, but no page is configured for role: ${normalizedRole}`
          );

          break;
      }
    } catch (error) {
      console.error("Login failed:", error);

      if (error.response) {
        console.error(
          "Status:",
          error.response.status
        );

        console.error(
          "Response:",
          error.response.data
        );

        alert(
          error.response.data?.message ||
            "Invalid email or password."
        );
      } else {
        console.error(
          "Network Error:",
          error.message
        );

        alert(
          "Unable to connect to the server."
        );
      }
    }
  };

  return (
    <div
      className="
        min-h-screen
        w-full
        flex
        items-center
        justify-end
        bg-cover
        bg-center
        bg-no-repeat
        px-10
      "
      style={{
        backgroundImage: `url(${loginBackground})`,
      }}
    >
      <div
        className="
          w-full
          max-w-md
          mr-10
          p-10
          rounded-xl
          border
          border-slate-300
          bg-slate-50
          shadow-xl
        "
      >
        {/* ============================================
            Header
        ============================================ */}
        <div className="text-center mb-7">
          <h1 className="text-2xl font-bold text-blue-950">
            Grievance Management System
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Hyderabad Growth Corridor Limited
          </p>
        </div>

        {/* ============================================
            Login Form
        ============================================ */}
        <form
          className="space-y-5"
          onSubmit={handleLogin}
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="
                block
                mb-2
                text-sm
                font-medium
                text-gray-700
              "
            >
              Email / User ID
            </label>

            <input
              type="text"
              id="email"
              name="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your Email / User ID"
              className="
                block
                w-full
                h-11
                box-border
                px-3
                rounded-md
                border
                border-slate-400
                bg-white
                text-sm
                text-gray-800
                outline-none
                placeholder:text-slate-400
                hover:border-slate-500
                focus:border-blue-600
                focus:ring-2
                focus:ring-blue-100
              "
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="
                block
                mb-2
                text-sm
                font-medium
                text-gray-700
              "
            >
              Password
            </label>

            <div className="relative">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                id="password"
                name="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your Password"
                className="
                  block
                  w-full
                  h-11
                  box-border
                  px-3
                  pr-16
                  rounded-md
                  border
                  border-slate-400
                  bg-white
                  text-sm
                  text-gray-800
                  outline-none
                  placeholder:text-slate-400
                  hover:border-slate-500
                  focus:border-blue-600
                  focus:ring-2
                  focus:ring-blue-100
                "
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-xs
                  font-medium
                  text-blue-600
                  bg-transparent
                  border-0
                  cursor-pointer
                  hover:text-blue-800
                "
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="
              w-full
              h-11
              rounded-md
              bg-[#2563A6]
              text-white
              text-sm
              font-semibold
              transition
              duration-200
              hover:bg-[#1D4F85]
              active:scale-95
              cursor-pointer
            "
          >
            Log In
          </button>
        </form>

        {/* Register */}
        <div className="mt-6 text-center">
          <p
            className="
              text-center
              text-sm
              text-[#64748B]
              px-6
            "
          >
            Don't have an account?{" "}

            <Link
              to="/register"
              className="
                font-semibold
                text-[#2563A6]
                hover:text-[#1D4F85]
              "
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
