import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import Toast from "../../components/toast";
import Table from "../../components/table";

const TmsComplaints = () => {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [users, setUsers] = useState([]);
  const [assignableUsers, setAssignableUsers] = useState([]);
  const [plazas, setPlazas] = useState([]);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [showAssignmentPopup, setShowAssignmentPopup] =
    useState(false);

  const [selectedGrievance, setSelectedGrievance] =
    useState(null);

  const [selectedUser, setSelectedUser] = useState(null);

  const [showEditPopup, setShowEditPopup] =
    useState(false);

  const [editStatus, setEditStatus] = useState("");
  const [editAssignedUser, setEditAssignedUser] =
    useState(null);

  const [editInitialStatus, setEditInitialStatus] =
    useState("");

  const [
    editInitialAssignedUserId,
    setEditInitialAssignedUserId,
  ] = useState(null);

  const [editLoading, setEditLoading] =
    useState(false);

  const [assignmentLoading, setAssignmentLoading] =
    useState(false);

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

  const fetchGrievances = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        showToast(
          "User is not authenticated.",
          "error"
        );
        return;
      }

      const response = await axios.get(
        "http://localhost:5163/api/GrievanceComplaints/registeredGrievances",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setGrievances(
        Array.isArray(response.data)
          ? response.data
          : response.data?.data || []
      );
    } catch (error) {
      console.error(
        "Failed to fetch grievances:",
        error
      );

      showToast(
        error.response?.data?.message ||
          "Failed to load grievances.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoriesAndSubCategories =
    async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          showToast(
            "User is not authenticated.",
            "error"
          );
          return;
        }

        const [
          categoriesResponse,
          subCategoriesResponse,
        ] = await Promise.all([
          axios.get(
            "http://localhost:5163/api/GrievanceCategory",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),

          axios.get(
            "http://localhost:5163/api/GrievanceSubCategory",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

        const categoriesData =
          Array.isArray(categoriesResponse.data)
            ? categoriesResponse.data
            : categoriesResponse.data?.data || [];

        const subCategoriesData =
          Array.isArray(
            subCategoriesResponse.data
          )
            ? subCategoriesResponse.data
            : subCategoriesResponse.data?.data || [];

        setCategories(categoriesData);
        setSubCategories(subCategoriesData);
      } catch (error) {
        console.error(
          "Failed to fetch categories/sub categories:",
          error
        );

        showToast(
          error.response?.data?.message ||
            "Failed to load categories and sub categories.",
          "error"
        );
      }
    };

  const fetchAssignmentUsers = async () => {
    try {
      setAssignmentLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        showToast(
          "User is not authenticated.",
          "error"
        );
        return false;
      }

      const [
        usersResponse,
        plazasResponse,
      ] = await Promise.all([
        axios.get(
          "http://localhost:5163/api/User",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),

        axios.get(
          "http://192.168.1.37:8000/Plazas/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ),
      ]);

      const usersData = Array.isArray(
        usersResponse.data
      )
        ? usersResponse.data
        : usersResponse.data?.data || [];

      const plazasData = Array.isArray(
        plazasResponse.data
      )
        ? plazasResponse.data
        : plazasResponse.data?.data || [];

      const usersWithPlaza = usersData
        .filter(
          (user) =>
            user.plazaId !== null &&
            user.plazaId !== undefined &&
            user.isActive === true
        )
        .map((user) => {
          const plaza = plazasData.find(
            (plazaItem) =>
              Number(plazaItem.Plaza_id) ===
              Number(user.plazaId)
          );

          return {
            ...user,
            plazaName:
              plaza?.Plaza_name ||
              "Unknown Plaza",
          };
        })
        .filter(
          (user) =>
            user.plazaName !== "Unknown Plaza"
        );

      setUsers(usersData);
      setAssignableUsers(usersWithPlaza);
      setPlazas(plazasData);

      return {
        users: usersData,
        assignableUsers: usersWithPlaza,
        plazas: plazasData,
      };
    } catch (error) {
      console.error(
        "Failed to fetch users/plazas:",
        error
      );

      showToast(
        error.response?.data?.message ||
          "Failed to load users and plazas.",
        "error"
      );

      return false;
    } finally {
      setAssignmentLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
    fetchCategoriesAndSubCategories();
    fetchAssignmentUsers();
  }, []);

  const tmsGrievances = useMemo(() => {
    return grievances.filter(
      (grievance) =>
        Number(grievance.categoryId) === 3
    );
  }, [grievances]);

  const formik = useFormik({
    initialValues: {
      grievanceCode: "",
      status: "",
    },

    validationSchema: Yup.object({
      grievanceCode: Yup.string(),
      status: Yup.string(),
    }),

    onSubmit: () => {},
  });

  const filteredGrievances = useMemo(() => {
    return tmsGrievances.filter(
      (grievance) => {
        if (
          formik.values.grievanceCode &&
          !grievance.grievanceCode
            ?.toLowerCase()
            .includes(
              formik.values.grievanceCode.toLowerCase()
            )
        ) {
          return false;
        }

        if (
          formik.values.status &&
          grievance.status !==
            formik.values.status
        ) {
          return false;
        }

        return true;
      }
    );
  }, [
    tmsGrievances,
    formik.values.grievanceCode,
    formik.values.status,
  ]);

  const getPlazaName = (plazaId) => {
    if (
      plazaId === null ||
      plazaId === undefined ||
      plazaId === ""
    ) {
      return "";
    }

    const plaza = plazas.find(
      (item) =>
        Number(item.Plaza_id) ===
        Number(plazaId)
    );

    return (
      plaza?.Plaza_name ||
      `Plaza ${plazaId}`
    );
  };

  const getUserName = (userId) => {
    if (
      userId === null ||
      userId === undefined ||
      userId === ""
    ) {
      return "";
    }

    const user = users.find(
      (item) =>
        Number(item.userId) ===
        Number(userId)
    );

    if (!user) {
      return `User ${userId}`;
    }

    return `${user.firstName || ""} ${
      user.lastName || ""
    }`.trim();
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "";
    }

    if (
      imagePath.startsWith("http://") ||
      imagePath.startsWith("https://")
    ) {
      return imagePath;
    }

    const cleanPath = imagePath
      .replace(/^\/+/, "")
      .replace(/^wwwroot\//i, "");

    return `http://localhost:5163/${cleanPath}`;
  };

  const handleAccept = async (grievance) => {
    try {
      setSelectedGrievance(grievance);
      setSelectedUser(null);

      const loaded =
        await fetchAssignmentUsers();

      if (!loaded) {
        setSelectedGrievance(null);
        return;
      }

      setShowAssignmentPopup(true);
    } catch (error) {
      console.error(
        "Failed to open assignment popup:",
        error
      );

      showToast(
        error.response?.data?.message ||
          "Failed to load users for assignment.",
        "error"
      );
    }
  };

  const handleConfirmAssignment =
    async () => {
      try {
        if (!selectedGrievance) {
          showToast(
            "Grievance details are not available.",
            "error"
          );
          return;
        }

        if (!selectedUser) {
          showToast(
            "Please select a user.",
            "error"
          );
          return;
        }

        const token =
          localStorage.getItem("token");

        if (!token) {
          showToast(
            "User is not authenticated.",
            "error"
          );
          return;
        }

        setActionLoading(
          `accept-${selectedGrievance.grievanceId}`
        );

        await axios.put(
          `http://localhost:5163/api/UserGrievances/${selectedGrievance.grievanceId}/assignto`,
          {
            assignedTo: Number(
              selectedUser.userId
            ),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        await axios.put(
          `http://localhost:5163/api/UserGrievances/${selectedGrievance.grievanceId}/status`,
          {
            status: "In Progress",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        showToast(
          `Grievance ${selectedGrievance.grievanceCode} assigned to ${selectedUser.firstName} ${selectedUser.lastName} successfully.`,
          "success"
        );

        setShowAssignmentPopup(false);
        setSelectedGrievance(null);
        setSelectedUser(null);

        await fetchGrievances();
      } catch (error) {
        console.error(
          "Failed to assign grievance:",
          error
        );

        showToast(
          error.response?.data?.message ||
            "Failed to assign grievance.",
          "error"
        );
      } finally {
        setActionLoading(null);
      }
    };

  const handleCloseAssignmentPopup =
    () => {
      if (actionLoading !== null) {
        return;
      }

      setShowAssignmentPopup(false);
      setSelectedGrievance(null);
      setSelectedUser(null);
    };

  const handleEdit = async (grievance) => {
    try {
      setSelectedGrievance(grievance);

      const data =
        await fetchAssignmentUsers();

      if (!data) {
        return;
      }

      const currentStatus =
        grievance.status || "";

      const currentAssignedUserId =
        grievance.assignedTo ?? null;

      const assignedUser =
        data.users.find(
          (user) =>
            Number(user.userId) ===
            Number(currentAssignedUserId)
        ) || null;

      setEditStatus(currentStatus);
      setEditInitialStatus(currentStatus);

      setEditInitialAssignedUserId(
        currentAssignedUserId
      );

      setEditAssignedUser(assignedUser);

      setShowEditPopup(true);
    } catch (error) {
      console.error(
        "Failed to open edit popup:",
        error
      );

      showToast(
        error.response?.data?.message ||
          "Failed to load users for editing.",
        "error"
      );
    }
  };

  const editStatusChanged =
    editStatus !== editInitialStatus;

  const editAssignedUserChanged =
    Number(editAssignedUser?.userId || 0) !==
    Number(editInitialAssignedUserId || 0);

  const editHasChanges =
    editStatusChanged ||
    editAssignedUserChanged;

  const handleConfirmEdit =
    async () => {
      try {
        if (!selectedGrievance) {
          showToast(
            "Grievance details are not available.",
            "error"
          );
          return;
        }

        if (!editHasChanges) {
          showToast(
            "Please change at least one field.",
            "error"
          );
          return;
        }

        if (
          editAssignedUserChanged &&
          !editAssignedUser
        ) {
          showToast(
            "Please select a TMS user.",
            "error"
          );
          return;
        }

        const token =
          localStorage.getItem("token");

        if (!token) {
          showToast(
            "User is not authenticated.",
            "error"
          );
          return;
        }

        setEditLoading(true);

        if (editStatusChanged) {
          await axios.put(
            `http://localhost:5163/api/UserGrievances/${selectedGrievance.grievanceId}/status`,
            {
              status: editStatus,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }

        if (editAssignedUserChanged) {
          await axios.put(
            `http://localhost:5163/api/UserGrievances/${selectedGrievance.grievanceId}/assignto`,
            {
              assignedTo: Number(
                editAssignedUser.userId
              ),
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }

        showToast(
          `Grievance ${selectedGrievance.grievanceCode} updated successfully.`,
          "success"
        );

        setShowEditPopup(false);
        setSelectedGrievance(null);
        setEditStatus("");
        setEditAssignedUser(null);
        setEditInitialStatus("");
        setEditInitialAssignedUserId(null);

        await fetchGrievances();
      } catch (error) {
        console.error(
          "Failed to update grievance:",
          error
        );

        showToast(
          error.response?.data?.message ||
            "Failed to update grievance.",
          "error"
        );
      } finally {
        setEditLoading(false);
      }
    };

  const handleCloseEditPopup = () => {
    if (editLoading) {
      return;
    }

    setShowEditPopup(false);
    setSelectedGrievance(null);
    setEditStatus("");
    setEditAssignedUser(null);
    setEditInitialStatus("");
    setEditInitialAssignedUserId(null);
  };

  const handleResolve = async (
    grievance
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        showToast(
          "User is not authenticated.",
          "error"
        );
        return;
      }

      setActionLoading(
        `resolve-${grievance.grievanceId}`
      );

      await axios.put(
        `http://localhost:5163/api/UserGrievances/${grievance.grievanceId}/status`,
        {
          status: "Resolved",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showToast(
        `Grievance ${grievance.grievanceCode} resolved successfully.`,
        "success"
      );

      await fetchGrievances();
    } catch (error) {
      console.error(
        "Failed to resolve grievance:",
        error
      );

      showToast(
        error.response?.data?.message ||
          "Failed to resolve grievance.",
        "error"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: "S.No",
        valueGetter: (params) =>
          params.node.rowIndex + 1,
        width: 80,
        sortable: false,
        filter: false,
      },

      {
        field: "grievanceCode",
        headerName: "Grievance Code",
        minWidth: 170,
      },

      {
        field: "categoryId",
        headerName: "Category",
        minWidth: 180,
        valueGetter: (params) => {
          const categoryId =
            params.data?.categoryId;

          if (
            categoryId === null ||
            categoryId === undefined
          ) {
            return "";
          }

          const category =
            categories.find(
              (item) =>
                Number(item.categoryId) ===
                Number(categoryId)
            );

          return (
            category?.categoryName || ""
          );
        },
      },

      {
        field: "subCategoryId",
        headerName: "Sub Category",
        minWidth: 180,
        valueGetter: (params) => {
          const subCategoryId =
            params.data?.subCategoryId;

          if (
            subCategoryId === null ||
            subCategoryId === undefined
          ) {
            return "";
          }

          const subCategory =
            subCategories.find(
              (item) =>
                Number(
                  item.subCategoryId
                ) ===
                Number(subCategoryId)
            );

          return (
            subCategory?.subCategoryName ||
            ""
          );
        },
      },

      {
        field: "plazaId",
        headerName: "Toll Plaza",
        minWidth: 180,
        valueGetter: (params) =>
          getPlazaName(
            params.data?.plazaId
          ),
      },

      {
        field: "vehicleNumber",
        headerName: "Vehicle Number",
        minWidth: 160,
      },

      {
        field: "vehicleType",
        headerName: "Vehicle Type",
        minWidth: 150,
      },

      {
        field: "description",
        headerName: "Description",
        flex: 2,
        minWidth: 250,
        wrapText: true,
        autoHeight: true,
      },

      {
        field: "citizenImage1",
        headerName: "Image 1",
        minWidth: 100,
        sortable: false,
        filter: false,
        cellRenderer: (params) => {
          const image =
            getImageUrl(
              params.data?.citizenImage1
            );

          if (!image) {
            return (
              <span className="text-sm text-gray-400">
                No Image
              </span>
            );
          }

          return (
            <a
              href={image}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={image}
                alt="Complaint"
                className="h-10 w-10 rounded-md border border-gray-200 object-cover"
              />
            </a>
          );
        },
      },

      {
        field: "citizenImage2",
        headerName: "Image 2",
        minWidth: 100,
        sortable: false,
        filter: false,
        cellRenderer: (params) => {
          const image =
            getImageUrl(
              params.data?.citizenImage2
            );

          if (!image) {
            return (
              <span className="text-sm text-gray-400">
                No Image
              </span>
            );
          }

          return (
            <a
              href={image}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={image}
                alt="Complaint"
                className="h-10 w-10 rounded-md border border-gray-200 object-cover"
              />
            </a>
          );
        },
      },

      {
        field: "createdAt",
        headerName: "Created Date",
        minWidth: 180,
        valueFormatter: (params) => {
          if (!params.value) {
            return "";
          }

          return new Date(
            params.value
          ).toLocaleString("en-IN");
        },
      },

      {
        field: "status",
        headerName: "Status",
        minWidth: 130,
      },

      {
        field: "assignedTo",
        headerName: "Assigned To",
        minWidth: 180,
        valueGetter: (params) =>
          getUserName(
            params.data?.assignedTo
          ),
      },

      {
        field: "assignedAt",
        headerName: "Assigned Date",
        minWidth: 180,
        valueFormatter: (params) => {
          if (!params.value) {
            return "";
          }

          return new Date(
            params.value
          ).toLocaleString("en-IN");
        },
      },

      {
        field: "reassignedTo",
        headerName: "Reassigned To",
        minWidth: 180,
        valueGetter: (params) =>
          getUserName(
            params.data?.reassignedTo
          ),
      },

      {
        field: "reassignedAt",
        headerName: "Reassigned At",
        minWidth: 180,
        valueFormatter: (params) => {
          if (!params.value) {
            return "";
          }

          return new Date(
            params.value
          ).toLocaleString("en-IN");
        },
      },

      

      {
        headerName: "Action",
        minWidth: 360,
        maxWidth: 390,
        sortable: false,
        filter: false,
        cellRenderer: (params) => {
          const grievance = params.data;

          const isAcceptLoading =
            actionLoading ===
            `accept-${grievance.grievanceId}`;

          const isResolveLoading =
            actionLoading ===
            `resolve-${grievance.grievanceId}`;

          const isOpen =
            grievance.status === "Open";

          const isResolved =
            grievance.status ===
            "Resolved";

          return (
            <div className="flex items-center gap-2">
              {isOpen && (
                <button
                  type="button"
                  disabled={
                    isAcceptLoading ||
                    assignmentLoading
                  }
                  onClick={() =>
                    handleAccept(
                      grievance
                    )
                  }
                  className="
                    rounded-md
                    border
                    border-[#2563A6]
                    bg-[#EAF3FB]
                    px-3
                    py-1.5
                    text-sm
                    font-medium
                    text-[#123A63]
                    transition-all
                    duration-200
                    hover:bg-[#2563A6]
                    hover:text-white
                    hover:shadow-md
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {isAcceptLoading ||
                  (assignmentLoading &&
                    selectedGrievance?.grievanceId ===
                      grievance.grievanceId)
                    ? "Loading..."
                    : "Accept"}
                </button>
              )}

              {!isResolved && (
                <button
                  type="button"
                  disabled={
                    isResolveLoading
                  }
                  onClick={() =>
                    handleResolve(
                      grievance
                    )
                  }
                  className="
                    rounded-md
                    border
                    border-[#2E7D32]
                    bg-[#EAF7EA]
                    px-3
                    py-1.5
                    text-sm
                    font-medium
                    text-[#2E7D32]
                    transition-all
                    duration-200
                    hover:bg-[#2E7D32]
                    hover:text-white
                    hover:shadow-md
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {isResolveLoading
                    ? "Resolving..."
                    : "Resolve"}
                </button>
              )}

              <button
                type="button"
                disabled={editLoading}
                onClick={() =>
                  handleEdit(
                    grievance
                  )
                }
                className="
                  rounded-md
                  border
                  border-[#7B61A8]
                  bg-[#F4EFFA]
                  px-3
                  py-1.5
                  text-sm
                  font-medium
                  text-[#5B3E7D]
                  transition-all
                  duration-200
                  hover:bg-[#7B61A8]
                  hover:text-white
                  hover:shadow-md
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Edit
              </button>
            </div>
          );
        },
      },
    ],
    [
      actionLoading,
      assignmentLoading,
      selectedGrievance,
      editLoading,
      categories,
      subCategories,
      users,
      plazas,
    ]
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  const totalCount =
    tmsGrievances.length;

  const openCount =
    tmsGrievances.filter(
      (grievance) =>
        grievance.status === "Open"
    ).length;

  const inProgressCount =
    tmsGrievances.filter(
      (grievance) =>
        grievance.status ===
        "In Progress"
    ).length;

  const resolvedCount =
    tmsGrievances.filter(
      (grievance) =>
        grievance.status ===
        "Resolved"
    ).length;

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-gray-600">
          Loading TMS grievances...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={closeToast}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#123A63]">
          TMS Grievances
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Toll / FASTag related grievances
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[#D5E1EC] bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Grievances
          </p>

          <p className="mt-2 text-2xl font-bold text-[#123A63]">
            {totalCount}
          </p>
        </div>

        <div className="rounded-xl border border-[#D5E1EC] bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Open
          </p>

          <p className="mt-2 text-2xl font-bold text-[#123A63]">
            {openCount}
          </p>
        </div>

        <div className="rounded-xl border border-[#D5E1EC] bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            In Progress
          </p>

          <p className="mt-2 text-2xl font-bold text-[#123A63]">
            {inProgressCount}
          </p>
        </div>

        <div className="rounded-xl border border-[#D5E1EC] bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Resolved
          </p>

          <p className="mt-2 text-2xl font-bold text-[#123A63]">
            {resolvedCount}
          </p>
        </div>
      </div>

      <form
        onSubmit={formik.handleSubmit}
        className="mb-6 rounded-xl border border-[#D5E1EC] bg-white p-5 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label
              htmlFor="grievanceCode"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Grievance Code
            </label>

            <input
              id="grievanceCode"
              name="grievanceCode"
              type="text"
              placeholder="Enter grievance code"
              value={
                formik.values.grievanceCode
              }
              onChange={
                formik.handleChange
              }
              onBlur={
                formik.handleBlur
              }
              className="
                h-10
                w-full
                rounded-md
                border
                border-gray-300
                px-3
                text-sm
                uppercase
                outline-none
                focus:border-[#2563A6]
                focus:ring-2
                focus:ring-[#B9D8F2]
              "
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Status
            </label>

            <select
              id="status"
              name="status"
              value={
                formik.values.status
              }
              onChange={
                formik.handleChange
              }
              className="
                h-10
                w-full
                rounded-md
                border
                border-gray-300
                px-3
                text-sm
                outline-none
                focus:border-[#2563A6]
                focus:ring-2
                focus:ring-[#B9D8F2]
              "
            >
              <option value="">
                All Statuses
              </option>

              <option value="Open">
                Open
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Resolved">
                Resolved
              </option>

              <option value="Reopened">
                Reopened
              </option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={() =>
                formik.resetForm()
              }
              className="
                h-10
                w-full
                rounded-md
                border
                border-gray-300
                px-5
                text-sm
                font-medium
                text-gray-700
                transition
                hover:bg-gray-50
              "
            >
              Clear Filters
            </button>
          </div>
        </div>
      </form>

      <div className="rounded-xl border border-[#D5E1EC] bg-white p-4 shadow-sm">
        <Table
          rowData={filteredGrievances}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          height="500px"
        />
      </div>

      {showEditPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#D5E1EC] px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-[#123A63]">
                  Edit Grievance
                </h2>

                {selectedGrievance && (
                  <p className="mt-1 text-sm text-gray-500">
                    Grievance:{" "}
                    <span className="font-medium text-gray-700">
                      {
                        selectedGrievance.grievanceCode
                      }
                    </span>
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={
                  handleCloseEditPopup
                }
                disabled={editLoading}
                className="
                  text-2xl
                  leading-none
                  text-gray-400
                  transition
                  hover:text-gray-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                ×
              </button>
            </div>

            <div className="space-y-5 px-6 py-6">
              <div>
                <label
                  htmlFor="edit-status"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Status
                </label>

                <select
                  id="edit-status"
                  value={editStatus}
                  onChange={(event) =>
                    setEditStatus(
                      event.target.value
                    )
                  }
                  disabled={editLoading}
                  className="
                    h-10
                    w-full
                    rounded-md
                    border
                    border-gray-300
                    px-3
                    text-sm
                    outline-none
                    focus:border-[#2563A6]
                    focus:ring-2
                    focus:ring-[#B9D8F2]
                  "
                >
                  <option value="">
                    Select Status
                  </option>

                  <option value="Open">
                    Open
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Resolved">
                    Resolved
                  </option>

                  <option value="Reopened">
                    Reopened
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="edit-assigned-user"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Reassign To
                </label>

                <select
                  id="edit-assigned-user"
                  value={
                    editAssignedUser?.userId ||
                    ""
                  }
                  onChange={(event) => {
                    const user =
                      assignableUsers.find(
                        (item) =>
                          Number(
                            item.userId
                          ) ===
                          Number(
                            event.target.value
                          )
                      );

                    setEditAssignedUser(
                      user || null
                    );
                  }}
                  disabled={
                    editLoading ||
                    assignmentLoading
                  }
                  className="
                    h-10
                    w-full
                    rounded-md
                    border
                    border-gray-300
                    px-3
                    text-sm
                    outline-none
                    focus:border-[#2563A6]
                    focus:ring-2
                    focus:ring-[#B9D8F2]
                  "
                >
                  <option value="">
                    Select TMS User
                  </option>

                  {assignableUsers.map(
                    (user) => (
                      <option
                        key={user.userId}
                        value={user.userId}
                      >
                        {user.firstName}{" "}
                        {user.lastName} -{" "}
                        {user.plazaName}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-[#D5E1EC] px-6 py-4">
              <button
                type="button"
                onClick={
                  handleCloseEditPopup
                }
                disabled={editLoading}
                className="
                  rounded-md
                  border
                  border-gray-300
                  bg-white
                  px-5
                  py-2
                  text-sm
                  font-medium
                  text-gray-700
                  transition
                  hover:bg-gray-50
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleConfirmEdit
                }
                disabled={
                  editLoading ||
                  assignmentLoading ||
                  !editHasChanges
                }
                className="
                  rounded-md
                  bg-[#2563A6]
                  px-5
                  py-2
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-[#123A63]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {editLoading
                  ? "Updating..."
                  : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAssignmentPopup && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#D5E1EC] px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-[#123A63]">
                  Assign Grievance
                </h2>

                {selectedGrievance && (
                  <p className="mt-1 text-sm text-gray-500">
                    Grievance:{" "}
                    <span className="font-medium text-gray-700">
                      {
                        selectedGrievance.grievanceCode
                      }
                    </span>
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={
                  handleCloseAssignmentPopup
                }
                disabled={
                  actionLoading !== null
                }
                className="
                  text-2xl
                  leading-none
                  text-gray-400
                  transition
                  hover:text-gray-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                ×
              </button>
            </div>

            <div className="max-h-[450px] overflow-y-auto px-6 py-5">
              <p className="mb-4 text-sm font-medium text-gray-700">
                Select a user to assign this grievance:
              </p>

              {assignmentLoading ? (
                <div className="flex min-h-[180px] items-center justify-center">
                  <p className="text-sm text-gray-500">
                    Loading users and plazas...
                  </p>
                </div>
              ) : assignableUsers.length ===
                0 ? (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-700">
                  No active users with a
                  mapped plaza were found.
                </div>
              ) : (
                <div className="space-y-3">
                  {assignableUsers.map(
                    (user) => {
                      const isSelected =
                        selectedUser?.userId ===
                        user.userId;

                      return (
                        <button
                          key={user.userId}
                          type="button"
                          onClick={() =>
                            setSelectedUser(
                              user
                            )
                          }
                          className={`
                            w-full
                            rounded-lg
                            border
                            p-4
                            text-left
                            transition-all
                            duration-200
                            ${
                              isSelected
                                ? "border-[#2563A6] bg-[#EAF3FB] shadow-sm"
                                : "border-gray-200 bg-white hover:border-[#9BBFDF] hover:bg-[#F8FBFE]"
                            }
                          `}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-[#123A63]">
                                {
                                  user.firstName
                                }{" "}
                                {
                                  user.lastName
                                }
                              </p>

                              <p className="mt-1 text-sm text-gray-600">
                                {user.email ||
                                  "No email"}
                              </p>

                              <p className="mt-1 text-sm text-gray-600">
                                {user.phoneNumber ||
                                  "No phone number"}
                              </p>

                              <p className="mt-2 text-sm font-medium text-[#2563A6]">
                                Plaza:{" "}
                                {
                                  user.plazaName
                                }
                              </p>
                            </div>

                            <div
                              className={`
                                flex
                                h-5
                                w-5
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                border
                                ${
                                  isSelected
                                    ? "border-[#2563A6] bg-[#2563A6]"
                                    : "border-gray-300 bg-white"
                                }
                              `}
                            >
                              {isSelected && (
                                <span className="h-2 w-2 rounded-full bg-white" />
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-[#D5E1EC] px-6 py-4">
              <button
                type="button"
                onClick={
                  handleCloseAssignmentPopup
                }
                disabled={
                  actionLoading !== null
                }
                className="
                  rounded-md
                  border
                  border-gray-300
                  bg-white
                  px-5
                  py-2
                  text-sm
                  font-medium
                  text-gray-700
                  transition
                  hover:bg-gray-50
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={
                  handleConfirmAssignment
                }
                disabled={
                  !selectedUser ||
                  assignmentLoading ||
                  actionLoading !== null
                }
                className="
                  rounded-md
                  bg-[#2563A6]
                  px-5
                  py-2
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-[#123A63]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {actionLoading &&
                selectedGrievance
                  ? "Assigning..."
                  : "Assign"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TmsComplaints;