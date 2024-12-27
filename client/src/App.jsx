import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Services from "./pages/Services";
import Information from "./pages/Information";
import Contact from "./pages/Contact";
import CartDetail from "./pages/CartDetail";
import Register from "./pages/Register";
import Manage from "./pages/Manage";

import CreatePost from "./pages/Post/CreatePost";
import UpdatePost from "./pages/Post/UpdatePost";
import PostDetail from "./pages/Post/PostDetail";

import CreateProduct from "./pages/Product/CreateProduct";
import UpdateProduct from "./pages/Product/UpdateProduct";
import ProductDetail from "./pages/Product/ProductDetail";

import CreateService from "./pages/Service/CreateService";
import UpdateService from "./pages/Service/UpdateService";

import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import Shop from "./pages/Shop";
import ServiceDetail from "./pages/Service/ServiceDetail";
import MyAppointment from "./pages/MyAppointment";
import AdminAppointment from "./pages/AdminAppointment";



const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/information" element={<Information />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<CartDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<PrivateRoute />}>
          <Route path="/manage" element={<Manage />} />
        </Route>
        <Route path="/my-appointments" element={<MyAppointment />} />
        <Route path="/admin-appointments" element={<AdminAppointment />} />
        <Route element={<OnlyAdminPrivateRoute />}>
          {/*----- POST -----*/}
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
          {/*----- PRODUCT -----*/}
          <Route path="/create-product" element={<CreateProduct />} />
          <Route
            path="/update-product/:productId"
            element={<UpdateProduct />}
          />
          {/*----- SERVICE -----*/}
          <Route path="/create-service" element={<CreateService />} />
          <Route
            path="/update-service/:serviceId"
            element={<UpdateService />}
          />
        </Route>
        {/*----- DETAIL -----*/}
        <Route path="/post/:postSlug" element={<PostDetail />} />
        <Route path="/product/:productSlug" element={<ProductDetail />} />
        <Route path="/service/:serviceSlug" element={<ServiceDetail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
