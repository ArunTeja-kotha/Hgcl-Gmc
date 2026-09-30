const sidebarConfig = {
  SuperAdmin: [
    {
      menuId: 1,
      name: "Dashboard",
      route: "/dashboard",
      icon: "⌂",
      children: [],
    },

    {
      menuId: 2,
      name: "User Management",
      route: "/users",
      icon: "♙",
      children: [
        {
          menuId: 21,
          name: "Users",
          route: "/users",
        },
        {
          menuId: 22,
          name: "Roles",
          route: "/roles",
        },
      ],
    },

    {
      menuId: 3,
      name: "Department Management",
      route: "/departments",
      icon: "▤",
      children: [
        {
          menuId: 31,
          name: "Departments",
          route: "/departments",
        },
        {
          menuId: 32,
          name: "Sub Departments",
          route: "/sub-departments",
        },
      ],
    },

    {
      menuId: 4,
      name: "Grievances",
      route: "/grievances",
      icon: "▣",
      children: [
        {
          menuId: 41,
          name: "All Grievances",
          route: "/grievances",
        },
        {
          menuId: 42,
          name: "Categories",
          route: "/categories",
        },
        {
          menuId: 43,
          name: "Sub Categories",
          route: "/sub-categories",
        },
      ],
    },

    {
      menuId: 5,
      name: "Reports",
      route: "/reports",
      icon: "▥",
      children: [],
    },
 
  {
      menuId: 6,
      name: "Plazas",
      route: "/Plazas",
      icon: "▣",
  },
]
};

export default sidebarConfig;