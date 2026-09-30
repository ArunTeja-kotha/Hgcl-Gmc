const sidebarConfig = {
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
  ],
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
        {
          menuId: 12,
          name: "Create User",
          route: "/users/create",
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
          name: "Assign Grievances",
          route: "/grievances/assign",
        },
      ],
    },
  ],
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
  WebUser: [
    {
      menuId: 3,
      name: "Grievances",
      route: "/webuser/grievances",
      children: [
        {
          menuId: 31,
          name: "All Grievances",
          route: "/webuser/grievances",
        },
        {
          menuId: 32,
          name: "New Grievances",
          route: "/webuser/grievances/new",
        },
        {
          menuId: 33,
          name: "My Grievances",
          route: "/webuser/grievances/my",
        },
        {
          menuId: 34,
          name: "Pending Grievances",
          route: "/webuser/grievances/pending",
        },
        {
          menuId: 35,
          name: "Completed Grievances",
          route: "/webuser/grievances/completed",
        },
      ],
    },
  ],

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
          name: "Assigned Grievances",
          route: "/nodal/grievances/assigned",
        },
        {
          menuId: 35,
          name: "Completed Grievances",
          route: "/nodal/grievances/completed",
        },
        {
          menuId: 36,
          name: "Reassigned Grievances",
          route: "/nodal/grievances/reassigned",
        },
        {
          menuId: 37,
          name: "Escalated Grievances",
          route: "/nodal/grievances/escalated",
        },
      ],
    },
  ],

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
  ],
};

export default sidebarConfig;