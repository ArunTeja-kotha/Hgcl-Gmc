const sidebarConfig = {
  // =========================================================
  // SUPER ADMINISTRATOR
  // =========================================================
  SuperAdmin: [
    {
      menuId: 1,
      name: "User Management",
      route: "/users",
      children: [
        {
          menuId: 11,
          name: "Users",
          route: "/users",
        },
        {
          menuId: 12,
          name: "Roles",
          route: "/roles",
        },
      ],
    },

    {
      menuId: 2,
      name: "Department Management",
      route: "/departments",
      children: [
        {
          menuId: 21,
          name: "Departments",
          route: "/departments",
        },
        {
          menuId: 22,
          name: "Sub Departments",
          route: "/sub-departments",
        },
      ],
    },

    {
      menuId: 3,
      name: "Grievances",
      route: "/grievances",
      children: [
        {
          menuId: 31,
          name: "All Grievances",
          route: "/grievances",
        },
        {
          menuId: 32,
          name: "Categories",
          route: "/categories",
        },
        {
          menuId: 33,
          name: "Sub Categories",
          route: "/sub-categories",
        },
      ],
    },

    {
      menuId: 4,
      name: "Plaza Management",
      route: "/plazas",
    },
  ],

  // =========================================================
  // WEB ADMINISTRATOR
  // =========================================================
  WebAdmin: [
    {
      menuId: 1,
      name: "User Management",
      route: "/users",
      children: [
        {
          menuId: 11,
          name: "Users",
          route: "/users",
        },
      ],
    },
  ],

  // =========================================================
  // TMS USER
  // =========================================================
  TMSUser: [
    {
      menuId: 2,
      name: "Toll Plaza Grievances",
      route: "/tms/grievances",
      children: [
        {
          menuId: 21,
          name: "All Grievances",
          route: "/tms/grievances",
        },
        {
          menuId: 22,
          name: "New Grievances",
          route: "/tms/grievances/new",
        },
      ],
    },
  ],

  // =========================================================
  // WEB USER
  // =========================================================
  WebUser: [
    {
      menuId: 4,
      name: "Grievances",
      route: "/webuser/grievances",
      children: [
        {
          menuId: 41,
          name: "All Grievances",
          route: "/webuser/grievances",
        },
      ],
    },
  ],

  // =========================================================
  // NODAL OFFICER
  // =========================================================
  NodalOfficer: [
    {
      menuId: 3,
      name: "Grievances",
      route: "/nodal/grievances",
      children: [
        {
          menuId: 31,
          name: "All Grievances",
          route: "/nodal/grievances",
        },
        {
          menuId: 32,
          name: "New Grievances",
          route: "/nodal/grievances/new",
        },
        {
          menuId: 33,
          name: "Pending Grievances",
          route: "/nodal/grievances/pending",
        },
      
        {
          menuId: 34,
          name: "Reassigned Grievances",
          route: "/nodal/grievances/reassigned",
        },
      ],
    },
  ],

  // =========================================================
  // FIELD USER
  // =========================================================
  FieldUser: [
    {
      menuId: 4,
      name: "Grievances",
      route: "/field/grievances",
      children: [
        {
          menuId: 41,
          name: "Assigned Grievances",
          route: "/field/grievances/assigned",
        },
        {
          menuId: 42,
          name: "Completed Grievances",
          route: "/field/grievances/completed",
        },
      ],
    },
  ],

  // =========================================================
  // CITIZEN
  // =========================================================
  Citizen: [
    {
      menuId: 3,
      name: "Grievances",
      route: "/citizen/grievances",
      children: [
        {
          menuId: 31,
          name: "Add Grievance",
          route: "/citizen/grievances/add",
        },
        {
          menuId: 32,
          name: "View My Grievances",
          route: "/citizen/grievances/my",
        },
        {
          menuId: 33,
          name: "Reopen Grievance",
          route: "/citizen/grievances/reopen",
        },
      ],
    },
    {
    menuId: 4,
    name: "Profile",
    route: "/citizen/profile",
  },
  ],
};

export default sidebarConfig;