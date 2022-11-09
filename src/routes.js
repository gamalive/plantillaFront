import Index from "views/Index.js";
import Profile from "views/admin/Profile.js";
// import Maps from "views/admin/Maps.js";
import Register from "views/admin/Register.js";
import Login from "views/auth/Login.js";
import Tables from "views/admin/Tables.js";
import Icons from "views/admin/Icons.js";
import Puestos from "views/admin/Puestos";
import Roles from "views/admin/Roles";
import Usuarios from "views/admin/Usuarios";
import Personal from "views/admin/Personal";
import Clientes from "views/admin/Clientes";
import Proveedores from "views/admin/Proveedores";
import Categorias from "views/admin/Categorias";
import Productos from "views/admin/Productos";
import Ingresos from "views/admin/Ingresos";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/admin"
  },
  {
    path: "/usuarios",
    name: "Usuarios",
    icon: "ni ni-circle-08 text-red",
    component: Usuarios,
    layout: "/admin"
  },
  {
    path: "/roles",
    name: "Roles",
    icon: "fa fa-id-card text-red",
    component: Roles,
    layout: "/admin"
  },
  {
    path: "/puestos",
    name: "Puestos",
    icon: "fa fa-suitcase text-red",
    component: Puestos,
    layout: "/admin"
  },
  {
    path: "/personal",
    name: "Personal",
    icon: "ni ni-single-02 text-red",
    component: Personal,
    layout: "/admin"
  },
  {
    path: "/proveedores",
    name: "Proveedores",
    icon: "fa fa-users text-info",
    component: Proveedores,
    layout: "/admin"
  },
  {
    path: "/clientes",
    name: "Clientes",
    icon: "fa fa-child text-info",
    component: Clientes,
    layout: "/admin"
  },
  {
    path: "/categorias",
    name: "Categorías",
    icon: "fa fa-cubes text-info",
    component: Categorias,
    layout: "/admin"
  },
  {
    path: "/productos",
    name: "Productos",
    icon: "fa fa-shopping-basket text-info",
    component: Productos,
    layout: "/admin"
  },
  {
    path: "/ingresos",
    name: "Ingresos",
    icon: "fa fa-shopping-cart text-success",
    component: Ingresos,
    layout: "/admin"
  },
  {
    path: "/ventas",
    name: "Ventas",
    icon: "fa fa-shopping-bag text-success",
    component: Productos,
    layout: "/admin"
  },
  // {
  //   path: "/tables",
  //   name: "Tablas",
  //   icon: "ni ni-bullet-list-67 text-red",
  //   component: Tables,
  //   layout: "/admin"
  // },

  // {
  //   path: "/maps",
  //   name: "Maps",
  //   icon: "ni ni-pin-3 text-orange",
  //   component: Maps,
  //   layout: "/admin"
  // },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-yellow",
    component: Profile,
    layout: "/admin"
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth"
  },
  // {
  //   path: "/register",
  //   name: "Register",
  //   icon: "ni ni-circle-08 text-pink",
  //   component: Register,
  //   layout: "/auth"
  // }
];
export default routes;
