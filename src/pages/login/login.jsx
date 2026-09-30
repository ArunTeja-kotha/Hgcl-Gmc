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
  // Get Role / Account Type from JWT Token
  // ============================================
  const getRoleFromToken = (token) => {
    try {
      const payload = token.split(".")[1];

      const decodedPayload = JSON.parse(
        atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
      );

      console.log("JWT Payload:", decodedPayload);

      // --------------------------------------------
      // 1. Check normal role claim
      // --------------------------------------------
      const role =
        decodedPayload.role ||
        decodedPayload[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];

      if (role) {
        return role;
      }

      // --------------------------------------------
      // 2. Citizen JWT does not have Role claim
      //    So check AccountType
      // --------------------------------------------
      if (decodedPayload.AccountType === "Citizen") {
        return "Citizen";
      }

      return null;
    } catch (error) {
      console.error("Unable to decode JWT:", error);
      return null;
    }
  };

  // ============================================
  // Login
  // ============================================
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
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
      const token = response.data.token;

      // Store JWT token
      localStorage.setItem("token", token);

      // ============================================
      // Get Role / Account Type from JWT
      // ============================================
      const role = getRoleFromToken(token);

      console.log("Logged in role:", role);

      // ============================================
      // Store Role
      // ============================================
      if (role) {
        localStorage.setItem("role", role);
      } else {
        localStorage.removeItem("role");
        console.warn("No role or account type found in JWT.");
      }

      // ============================================
      // Navigate to Dashboard
      // ============================================
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);

      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Response:", error.response.data);

        alert(
          error.response.data?.message ||
            "Invalid email or password."
        );
      } else {
        console.error("Network Error:", error.message);

        alert("Unable to connect to the server.");
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
        {/* ================= Header ================= */}

        <div className="text-center mb-7">
          <h1 className="text-2xl font-bold text-blue-950">
            Grievance Management System
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Hyderabad Growth Corridor Limited
          </p>
        </div>

        {/* ================= Login Form ================= */}

        <form
          className="space-y-5"
          onSubmit={handleLogin}
        >
          {/* ================= Email ================= */}

          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Email / User ID
            </label>

            <input
              type="text"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          {/* ================= Password ================= */}

          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                onClick={() => setShowPassword(!showPassword)}
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

          {/* ================= Login Button ================= */}

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

        {/* ================= Register ================= */}

        <div className="mt-6 text-center">
          <p className="text-center text-sm text-[#64748B] px-6">
            Don't have an account?{" "}

            <Link
              to="/register"
              className="font-semibold text-[#2563A6] hover:text-[#1D4F85]"
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