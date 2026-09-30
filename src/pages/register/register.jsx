import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import registrationBackground from "../../assets/gmcregistration.png";

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

  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit phone number"),

  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(
      /[!@#$%^&*(),.?":{}|<>\_\-\\[\]\/`~;'=+]/,
      "Must contain at least one special character"
    ),
});

function Register() {
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  };

  const handleSubmit = async (values) => {
    console.log("FORM SUBMITTED:", values);

    try {
      const response = await axios.post(
        "http://localhost:5163/api/citizens/register",
        values
      );

      console.log("Registration successful:", response.data);

      alert("Registration successful!");
    } catch (error) {
      console.error("Registration failed:", error);

      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Full Response:", error.response.data);
        if (error.response.data?.errors) {
          console.error(
            "Validation Errors:",
            error.response.data.errors
          );

          Object.entries(error.response.data.errors).forEach(
            ([field, messages]) => {
              console.error(`${field}:`, messages);
            }
          );
        }
        if (error.response.data?.message) {
          console.error(
            "Backend Message:",
            error.response.data.message
          );
        }
      } else {
        console.error("Network Error:", error.message);
      }
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div
        className="fixed inset-0 h-full w-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${registrationBackground})`,
        }}
      ></div>

      <div className="relative z-8 ml-auto mr-15 flex w-full max-w-sm items-center justify-center pt-7">
        <div className="w-full rounded-2xl bg-white p-10 shadow-2xl">

          <div className="mb-2 text-center">
            <h1 className="text-2xl font-bold text-blue-950">
              Registration
            </h1>

            <p className="mt-1 text-sm text-[#64748B]">
              Register your account to get started
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form className="space-y-0">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-1 block text-sm font-medium text-[#1F2937]"
                >
                  First Name
                </label>

                <Field
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Enter your first name"
                  className="w-full rounded-lg border border-[#D5E0EA] px-3 py-1.5 text-sm text-[#1F2937] outline-none focus:border-[#2563A6] focus:ring-2 focus:ring-[#B9D8F2]"
                />

                <div className="h-3">
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-[11px] text-[#C94A4A]"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="mb-1 block text-sm font-medium text-[#1F2937]"
                >
                  Last Name
                </label>

                <Field
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Enter your last name"
                  className="w-full rounded-lg border border-[#D5E0EA] px-3 py-1.5 text-sm text-[#1F2937] outline-none focus:border-[#2563A6] focus:ring-2 focus:ring-[#B9D8F2]"
                />

                <div className="h-3">
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-[11px] text-[#C94A4A]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-[#1F2937]"
                >
                  Email
                </label>

                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-[#D5E0EA] px-3 py-1.5 text-sm text-[#1F2937] outline-none focus:border-[#2563A6] focus:ring-2 focus:ring-[#B9D8F2]"
                />

                <div className="h-3">
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-[11px] text-[#C94A4A]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-1 block text-sm font-medium text-[#1F2937]"
                >
                  Phone Number
                </label>

                <Field
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Enter your 10-digit phone number"
                  maxLength="10"
                  className="w-full rounded-lg border border-[#D5E0EA] px-3 py-1.5 text-sm text-[#1F2937] outline-none focus:border-[#2563A6] focus:ring-2 focus:ring-[#B9D8F2]"
                />

                <div className="h-3">
                  <ErrorMessage
                    name="phoneNumber"
                    component="div"
                    className="text-[11px] text-[#C94A4A]"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-[#1F2937]"
                >
                  Password
                </label>

                <Field
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-[#D5E0EA] px-3 py-1.5 text-sm text-[#1F2937] outline-none focus:border-[#2563A6] focus:ring-2 focus:ring-[#B9D8F2]"
                />

                <div className="h-3">
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-[11px] text-[#C94A4A]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-[#2563A6] px-4 py-1.5 font-semibold text-white transition duration-200 hover:bg-[#1D4F85]"
              >
                Register
              </button>

              <p className="pt-1 text-center text-sm text-[#64748B]">
                Already have an account?{" "}

                <Link
                  to="/"
                  className="font-semibold text-[#2563A6] hover:text-[#1D4F85]"
                >
                  Login
                </Link>
              </p>

            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default Register;
