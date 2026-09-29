import {Link} from "react-router-dom";
import React, { useState } from "react";
import loginBackground from "../../assets/gmclogin.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

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
        <div className="text-center mb-7">
          <h1 className="text-2xl font-bold text-blue-950">
            Grievance Management System
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Hyderabad Growth Corridor Limited
          </p>
        </div>
        <form className="space-y-5">
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
          {/* Sign In */}
          <button
            type="button"
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
            Sign In
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-center text-sm text-[#64748B] px-6"> Don't have an account?{" "} 
                <Link to="/register" className="font-semibold text-[#2563A6] hover:text-[#1D4F85]" > 
                Register 
                </Link>
                 </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
