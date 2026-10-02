import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import Toast from "../../components/toast";

const TmsRegisterComplaints = () => {
  const navigate = useNavigate();
  const [subCategories, setSubCategories] = useState([]);
  const [plazas, setPlazas] = useState([]);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [loadingPlazas, setLoadingPlazas] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success") => {
    setToast({
      message,
      type,
    });
  };

  const closeToast = () => {
    setToast({
      message: "",
      type: "success",
    });
  };

  const formik = useFormik({
    initialValues: {
      categoryId: 3,
      subCategoryId: "",
      plazaId: "",
      vehicleNumber: "",
      vehicleType: "",
      description: "",
      citizenImage1: null,
      citizenImage2: null,
      anonymousFlag: true,
    },

    validationSchema: Yup.object({
      subCategoryId: Yup.string().required(
        "Please select a sub category."
      ),

      plazaId: Yup.string().required(
        "Please select a toll plaza."
      ),

      vehicleNumber: Yup.string()
        .trim()
        .required(
          "Please enter the vehicle number."
        ),

      vehicleType: Yup.string()
        .trim()
        .required(
          "Please enter the vehicle type."
        ),

      description: Yup.string()
        .trim()
        .required(
          "Please enter the grievance description."
        ),
    }),

    onSubmit: async (values) => {
      try {
        setRegisterLoading(true);

        const token = localStorage.getItem("token");

        if (!token) {
          showToast(
            "User is not authenticated.",
            "error"
          );
          return;
        }

        const formData = new FormData();

        formData.append(
          "CategoryId",
          String(values.categoryId)
        );

        formData.append(
          "SubCategoryId",
          String(values.subCategoryId)
        );

        formData.append(
          "PlazaId",
          String(values.plazaId)
        );

        formData.append(
          "VehicleNumber",
          values.vehicleNumber.trim()
        );

        formData.append(
          "VehicleType",
          values.vehicleType.trim()
        );

        formData.append(
          "Description",
          values.description.trim()
        );

        formData.append(
          "AnonymousFlag",
          "true"
        );

        if (values.citizenImage1) {
          formData.append(
            "CitizenImage1",
            values.citizenImage1
          );
        }

        if (values.citizenImage2) {
          formData.append(
            "CitizenImage2",
            values.citizenImage2
          );
        }

        const response = await axios.post(
          "http://localhost:5163/api/GrievanceComplaints",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        showToast(
          `Grievance ${response.data.grievanceCode} registered successfully.`,
          "success"
        );

        formik.resetForm({
          values: {
            categoryId: 3,
            subCategoryId: "",
            plazaId: "",
            vehicleNumber: "",
            vehicleType: "",
            description: "",
            citizenImage1: null,
            citizenImage2: null,
            anonymousFlag: true,
          },
        });

        setTimeout(() => {
          navigate("/tms/grievances");
        }, 1500);
      } catch (error) {
        console.error(
          "Failed to register TMS grievance:",
          error
        );

        showToast(
          error.response?.data?.message ||
            "Failed to register grievance.",
          "error"
        );
      } finally {
        setRegisterLoading(false);
      }
    },
  });

  const fetchSubCategories = async () => {
    try {
      setLoadingSubCategories(true);

      const token = localStorage.getItem("token");

      if (!token) {
        showToast(
          "User is not authenticated.",
          "error"
        );
        return;
      }

      const response = await axios.get(
        "http://localhost:5163/api/GrievanceSubCategory",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      const tmsSubCategories = data.filter(
        (item) =>
          Number(item.categoryId) === 3
      );

      setSubCategories(tmsSubCategories);
    } catch (error) {
      console.error(
        "Failed to fetch sub categories:",
        error
      );

      showToast(
        error.response?.data?.message ||
          "Failed to load sub categories.",
        "error"
      );
    } finally {
      setLoadingSubCategories(false);
    }
  };

  const fetchPlazas = async () => {
    try {
      setLoadingPlazas(true);

      const response = await axios.get(
        "http://192.168.1.37:8000/Plazas/"
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];

      const activePlazas = data.filter(
        (plaza) =>
          plaza.is_active !== false
      );

      setPlazas(activePlazas);
    } catch (error) {
      console.error(
        "Failed to fetch toll plazas:",
        error
      );

      showToast(
        "Failed to load toll plazas.",
        "error"
      );
    } finally {
      setLoadingPlazas(false);
    }
  };

  useEffect(() => {
    fetchSubCategories();
    fetchPlazas();
  }, []);

  const handleClear = () => {
    closeToast();

    formik.resetForm({
      values: {
        categoryId: 3,
        subCategoryId: "",
        plazaId: "",
        vehicleNumber: "",
        vehicleType: "",
        description: "",
        citizenImage1: null,
        citizenImage2: null,
        anonymousFlag: true,
      },
    });
  };

  return (
    <div className="min-h-full bg-[#F4F8FC] p-6">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#123A63]">
          Register TMS Grievance
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Register a Toll / FASTag related grievance.
        </p>
      </div>

      <div className="rounded-xl border border-[#D5E1EC] bg-white shadow-sm">
        <div className="border-b border-[#E1E8EF] px-6 py-4">
          <h2 className="text-lg font-semibold text-[#123A63]">
            Grievance Details
          </h2>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="p-6"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#294B68]">
                Sub Category
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <select
                name="subCategoryId"
                value={formik.values.subCategoryId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full rounded-lg border border-[#C9D9E8] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#123A63]"
              >
                <option value="">
                  {loadingSubCategories
                    ? "Loading..."
                    : "Select Sub Category"}
                </option>

                {subCategories.map(
                  (subCategory) => (
                    <option
                      key={
                        subCategory.subCategoryId
                      }
                      value={
                        subCategory.subCategoryId
                      }
                    >
                      {
                        subCategory.subCategoryName
                      }
                    </option>
                  )
                )}
              </select>

              {formik.touched.subCategoryId &&
                formik.errors.subCategoryId && (
                  <p className="mt-1 text-xs text-red-500">
                    {
                      formik.errors
                        .subCategoryId
                    }
                  </p>
                )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#294B68]">
                Toll Plaza
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <select
                name="plazaId"
                value={formik.values.plazaId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full rounded-lg border border-[#C9D9E8] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#123A63]"
              >
                <option value="">
                  {loadingPlazas
                    ? "Loading..."
                    : "Select Toll Plaza"}
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

              {formik.touched.plazaId &&
                formik.errors.plazaId && (
                  <p className="mt-1 text-xs text-red-500">
                    {formik.errors.plazaId}
                  </p>
                )}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#294B68]">
                Vehicle Number
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <input
                type="text"
                name="vehicleNumber"
                value={formik.values.vehicleNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter vehicle number"
                className="w-full rounded-lg border border-[#C9D9E8] bg-white px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#123A63]"
              />

              {formik.touched.vehicleNumber &&
                formik.errors.vehicleNumber && (
                  <p className="mt-1 text-xs text-red-500">
                    {
                      formik.errors
                        .vehicleNumber
                    }
                  </p>
                )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#294B68]">
                Vehicle Type
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <input
                type="text"
                name="vehicleType"
                value={formik.values.vehicleType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter vehicle type"
                className="w-full rounded-lg border border-[#C9D9E8] bg-white px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#123A63]"
              />

              {formik.touched.vehicleType &&
                formik.errors.vehicleType && (
                  <p className="mt-1 text-xs text-red-500">
                    {
                      formik.errors
                        .vehicleType
                    }
                  </p>
                )}
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-[#294B68]">
              Description
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <textarea
              name="description"
              rows={5}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter grievance description"
              className="w-full resize-none rounded-lg border border-[#C9D9E8] bg-white px-3 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-[#123A63]"
            />

            {formik.touched.description &&
              formik.errors.description && (
                <p className="mt-1 text-xs text-red-500">
                  {
                    formik.errors
                      .description
                  }
                </p>
              )}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#294B68]">
                Attachment 1
              </label>

              <input
                type="file"
                name="citizenImage1"
                accept="image/*"
                onChange={(event) => {
                  formik.setFieldValue(
                    "citizenImage1",
                    event.currentTarget.files[0] ||
                      null
                  );
                }}
                className="w-full rounded-lg border border-[#C9D9E8] bg-white px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#294B68]">
                Attachment 2
              </label>

              <input
                type="file"
                name="citizenImage2"
                accept="image/*"
                onChange={(event) => {
                  formik.setFieldValue(
                    "citizenImage2",
                    event.currentTarget.files[0] ||
                      null
                  );
                }}
                className="w-full rounded-lg border border-[#C9D9E8] bg-white px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-[#E1E8EF] pt-5">
            <button
              type="button"
              onClick={handleClear}
              disabled={registerLoading}
              className="rounded-lg border border-[#C9D9E8] bg-white px-5 py-2.5 text-sm font-medium text-[#294B68] transition hover:bg-[#F4F8FC] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Clear
            </button>

            <button
              type="submit"
              disabled={registerLoading}
              className="rounded-lg bg-[#123A63] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#0E2F50] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {registerLoading
                ? "Registering..."
                : "Register Grievance"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TmsRegisterComplaints;