import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import { ToastContainer } from 'react-toastify'

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import "assets/css/styleGlobal.css";
// ** React Toastify
import 'react-toastify/dist/ReactToastify.css';


import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Switch>
      <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
      <Route path="/auth" render={(props) => <AuthLayout {...props} />} />
      <Redirect from="/" to="/admin/index" />
    </Switch>
    <ToastContainer newestOnTop />
  </BrowserRouter>
);
