import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import registrationBackground from "../../assets/gmcregistration.png";

// Validation
const validationSchema = Yup.object({
  firstName: Yup.string()
    .required("First name is required")
    .matches(/^[A-Za-z]+$/, "Only letters are allowed")
    .min(2, "Minimum 2 characters")
    .max(30, "Maximum 30 characters"),

  lastName: Yup.string()
    .required("Last name is required")
    .matches(/^[A-Za-z]+$/, "Only letters are allowed")
    .min(2, "Minimum 2 characters")
    .max(30, "Maximum 30 characters"),

  email: Yup.string()
    .required("Email is required")
    .email("Enter a valid email address"),

  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),

  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>_\-\\[\]\/`~;'=+]/,
      "Must contain at least one special character"
    ),
});

function Register() {
  // Initial form values
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  };

  // Form submit
  const handleSubmit = (values) => {
    console.log("Form submitted:", values);
  };

  return (
    <div className="relative min-h-screen w-full">

      {/* Full Screen Background Image */}
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${registrationBackground})`,
        }}
      ></div>

      {/* Form Container */}
      <div className="relative z-10 min-h-screen w-full flex items-center justify-end pr-24 py-6">

        {/* Registration Card */}
        <div className="w-full max-w-md bg-[#FFFFFF] rounded-2xl shadow-2xl p-3">

          {/* Heading */}
          <div className="text-center mb-3">
            <h1 className="text-md font-bold text-[#123A63]">
              Registration
            </h1>

            <p className="mt-2 text-[#64748B]">
              Register your account to get started
            </p>
          </div>

          {/* Formik */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form className="space-y-3">

              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block mb-2 text-sm font-medium text-[#1F2937]"
                >
                  First Name
                </label>

                <Field
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Enter your first name"
                  className="w-full px-4 py-3 border border-[#D5E0EA] rounded-lg text-[#1F2937] outline-none focus:border-[#2563A6] focus:ring-2 focus:ring-[#B9D8F2]"
                />

                <ErrorMessage
                  name="firstName"
                  component="div"
                  className="mt-1 text-sm text-[#C94A4A]"
                />
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block mb-2 text-sm font-medium text-[#1F2937]"
                >
                  Last Name
                </label>

                <Field
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Enter your last name"
                  className="w-full px-4 py-3 border border-[#D5E0EA] rounded-lg text-[#1F2937] outline-none focus:border-[#2563A6] focus:ring-2 focus:ring-[#B9D8F2]"
                />

                <ErrorMessage
                  name="lastName"
                  component="div"
                  className="mt-1 text-sm text-[#C94A4A]"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-[#1F2937]"
                >
                  Email
                </label>

                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-[#D5E0EA] rounded-lg text-[#1F2937] outline-none focus:border-[#2563A6] focus:ring-2 focus:ring-[#B9D8F2]"
                />

                <ErrorMessage
                  name="email"
                  component="div"
                  className="mt-1 text-sm text-[#C94A4A]"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phone"
                  className="block mb-2 text-sm font-medium text-[#1F2937]"
                >
                  Phone Number
                </label>

                <Field
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter your 10-digit phone number"
                  maxLength="10"
                  className="w-full px-4 py-3 border border-[#D5E0EA] rounded-lg text-[#1F2937] outline-none focus:border-[#2563A6] focus:ring-2 focus:ring-[#B9D8F2]"
                />

                <ErrorMessage
                  name="phone"
                  component="div"
                  className="mt-1 text-sm text-[#C94A4A]"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-[#1F2937]"
                >
                  Password
                </label>

                <Field
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-[#D5E0EA] rounded-lg text-[#1F2937] outline-none focus:border-[#2563A6] focus:ring-2 focus:ring-[#B9D8F2]"
                />

                <ErrorMessage
                  name="password"
                  component="div"
                  className="mt-1 text-sm text-[#C94A4A]"
                />
              </div>

              {/* Register Button */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#2563A6] text-[#FFFFFF] font-semibold rounded-lg hover:bg-[#1D4F85] transition duration-200"
              >
                Register
              </button>

            </Form>
          </Formik>

        </div>
      </div>
    </div>
  );
}

export default Register;