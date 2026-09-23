import React from "react";

import loginBackground from "../../assets/gmclogin.png";

const Login = () => {
  return (
<div
  className="
    min-h-screen
    w-full
    flex
    items-center
    bg-cover
    bg-center
    bg-no-repeat
    pl-[55%]
  "
  style={{
    backgroundImage: `url(${loginBackground})`,
  }}
>
      <div
        className="
          w-full max-w-[400px]
          p-[40px]
          rounded-[14px]
          border border-[#c9d9e8]
         bg-[rgba(242,247,252,0.99)]
          shadow-[0_14px_40px_rgba(18,58,99,0.20)]
          backdrop-blur-[8px]
        "
      >
        {/* Header */}
        <div className="text-center mb-7">
          <h1 className="text-[25px] font-bold text-[#17365d]">
            Grievance Management System
          </h1>

          <p className="mt-2 text-[14px] text-[#6b7280]">
            Hyderabad Growth Corridor Limited
          </p>
        </div>

        {/* Login Form */}
        <form className="space-y-5">

          {/* Email / User ID */}
          <div>
            <label
              htmlFor="email"
              className="
                block mb-2
                text-[14px]
                font-medium
                text-[#374151]
              "
            >
              Email / User ID
            </label>

            <input
              type="text"
              id="email"
              name="email"
              placeholder="Enter your Email / User ID"
              className="
                block w-full h-[44px] box-border
                px-[13px]
                rounded-[7px]
                border border-[#9fb3c6]
                bg-white
                text-[14px]
                text-[#1f2937]
                outline-none

                placeholder:text-[#9aa8b6]
                placeholder:opacity-100

                hover:border-[#7f98ae]

                focus:border-[#2563a6]
                focus:shadow-[0_0_0_3px_rgba(37,99,166,0.10)]
              "
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="
                block mb-2
                text-[14px]
                font-medium
                text-[#374151]
              "
            >
              Password
            </label>

            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your Password"
                className="
                  block w-full h-[44px] box-border
                  px-[13px] pr-[60px]
                  rounded-[7px]
                  border border-[#9fb3c6]
                  bg-white
                  text-[14px]
                  text-[#1f2937]
                  outline-none

                  placeholder:text-[#9aa8b6]
                  placeholder:opacity-100

                  hover:border-[#7f98ae]

                  focus:border-[#2563a6]
                  focus:shadow-[0_0_0_3px_rgba(37,99,166,0.10)]
                "
              />

              {/* Show Password UI */}
              <button
                type="button"
                className="
                  absolute
                  right-[12px]
                  top-1/2
                  -translate-y-1/2
                  text-[13px]
                  font-medium
                  text-[#2563a6]
                  bg-transparent
                  border-0
                  cursor-pointer
                "
              >
                Show
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <button
              type="button"
              className="
                text-[13px]
                font-medium
                text-[#2563a6]
                hover:text-[#1d4f85]
                hover:underline
                bg-transparent
                border-0
                cursor-pointer
              "
            >
              Forgot Password?
            </button>
          </div>

          {/* Sign In */}
          <button
            type="button"
            className="
              w-full
              h-[44px]
              rounded-[7px]
              bg-[#2563a6]
              text-white
              text-[14px]
              font-semibold
              transition
              duration-200
              hover:bg-[#1d4f85]
              active:scale-[0.99]
              cursor-pointer
            "
          >
            Sign In
          </button>

        </form>

        {/* Register */}
        <div className="mt-6 text-center">
          <span className="text-[13px] text-[#6b7280]">
            Don't have an account?
          </span>

          <button
            type="button"
            className="
              ml-1
              text-[13px]
              font-semibold
              text-[#2563a6]
              hover:text-[#1d4f85]
              hover:underline
              bg-transparent
              border-0
              cursor-pointer
            "
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;