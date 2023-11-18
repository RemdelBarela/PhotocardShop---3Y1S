import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import Header from './Components/Layout/Header'
import Footer from './Components/Layout/Footer'
import ProtectedRoute from "./Components/Route/ProtectedRoute";

import Home from './Components/Home';
import PhotoDetails from "./Components/Photo/PhotoDetails";

import Login from "./Components/User/Login";
import Register from './Components/User/Register';
import Profile from "./Components/User/Profile";
import UpdateProfile from "./Components/User/UpdateProfile";
import UpdatePassword from "./Components/User/UpdatePassword";
import ForgotPassword from "./Components/User/ForgotPassword";
import NewPassword from "./Components/User/NewPassword";

import PhotosList from "./Components/Admin/Photo/PhotosList";
import NewPhoto from "./Components/Admin/Photo/NewPhoto";
import UpdatePhoto from "./Components/Admin/Photo/UpdatePhoto";

// import Cart from "./Components/Cart/Cart";
// import Shipping from "./Components/Cart/Shipping";
// import ConfirmOrder from "./Components/Cart/ConfirmOrder";
// import Payment from "./Components/Cart/Payment";
// import OrderSuccess from "./Components/Cart/OrderSuccess";
// import ListOrders from "./Components/Order/ListOrders";
// import OrderDetails from "./Components/Order/OrderDetails";
// import Dashboard from "./Components/Admin/Dashboard";
// import OrdersList from "./Components/Admin/OrdersList";
// import ProcessOrder from "./Components/Admin/ProcessOrder"
// import UsersList from "./Components/Admin/UsersList";
// import UpdateUser from "./Components/Admin/UpdateUser";

// import PhotoReviews from "./Components/Admin/PhotoReviews";
function App() {
  // const [state, setState] = useState({
  //   cartItems: localStorage.getItem('cartItems')
  //     ? JSON.parse(localStorage.getItem('cartItems'))
  //     : [],
  //   shippingInfo: localStorage.getItem('shippingInfo')
  //     ? JSON.parse(localStorage.getItem('shippingInfo'))
  //     : {},
  // })

  // const addItemToCart = async (id, quantity) => {
  //   console.log(id, quantity)
  //   try {
  //     const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/photo/${id}`)
  //     const item = {
  //       photo: data.photo._id,
  //       name: data.photo.name,
  //       price: data.photo.price,
  //       image: data.photo.images[0].url,
  //       stock: data.photo.stock,
  //       quantity: quantity
  //     }

  //     const isItemExist = state.cartItems.find(i => i.photo === item.photo)
  //     console.log(isItemExist, state)

  //     if (isItemExist) {
  //       setState({
  //         ...state,
  //         cartItems: state.cartItems.map(i => i.photo === isItemExist.photo ? item : i)
  //       })
  //     }
  //     else {
  //       setState({
  //         ...state,
  //         cartItems: [...state.cartItems, item]
  //       })
  //     }

  //     toast.success('Item Added to Cart', {
  //       position: toast.POSITION.BOTTOM_RIGHT
  //     })

  //   } catch (error) {
  //     toast.error(error, {
  //       position: toast.POSITION.TOP_LEFT
  //     });
  //     // navigate('/')
  //   }

  // }
  // const removeItemFromCart = async (id) => {
  //   setState({
  //     ...state,
  //     cartItems: state.cartItems.filter(i => i.photo !== id)
  //   })
  // }

  // const saveShippingInfo = async (data) => {
  //   setState({
  //     ...state,
  //     shippingInfo: data
  //   })
  //   localStorage.setItem('shippingInfo', JSON.stringify(data))
  // }

  return (
    <div className="App">


      <Router>
        {/* <Header cartItems={state.cartItems} /> */}
        <Header />
        <Routes>
          <Route path="/" element={<Home />} exact="true" />
          {/* <Route path="/photo/:id" element={<PhotoDetails cartItems={state.cartItems} addItemToCart={addItemToCart} />} exact="true" /> */}
          <Route path="/search/:keyword" element={<Home />} exact="true" />

          <Route path="/login" element={<Login />} exact="true" />
          <Route path="/register" element={<Register />} exact="true" />
          <Route path="/me" element={<Profile />} exact="true" />
          <Route path="/me/update" element={<UpdateProfile />} exact="true" />
          <Route path="/password/update" element={<UpdatePassword />} />
          <Route path="/password/forgot" element={<ForgotPassword />} exact="true" />
          <Route path="/password/reset/:token" element={<NewPassword />} exact="true" />

          {/* <Route path="/cart"
            element={<Cart
              cartItems={state.cartItems}
              addItemToCart={addItemToCart}
              removeItemFromCart={removeItemFromCart}
            />} exact="true" />
          <Route path="/shipping" element={<Shipping shipping={state.shippingInfo} saveShippingInfo={saveShippingInfo} />} />
          <Route path="/confirm" element={<ConfirmOrder cartItems={state.cartItems} shippingInfo={state.shippingInfo} />} />
          <Route path="/payment" element={<Payment cartItems={state.cartItems} shippingInfo={state.shippingInfo} />} />
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/orders/me" element={<ListOrders />} />
          <Route path="/order/:id" element={<OrderDetails />} /> */}
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          {/* <Route path="/admin/photos" element={<PhotosList />} /> */}

          <Route path="/admin/photo" element={<NewPhoto />} />
          <Route
            path="/admin/photo/:id"
            element={<UpdatePhoto />} />

          {/* <Route
            path="/admin/orders"
            element={<OrdersList />}
          /> */}
          {/* <Route
            path="/admin/order/:id"
            element={<ProcessOrder />} /> */}
          {/* <Route
            path="/admin/users"
            element={<UsersList />} /> */}
          {/* <Route path="/admin/user/:id" element={<UpdateUser />} /> */}
          {/* <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAdmin={true}>
                <Dashboard />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path="/admin/photos"
            element={
              <ProtectedRoute isAdmin={true}>
                <PhotosList />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/admin/users"
            element={
              <ProtectedRoute isAdmin={true}>
                <UsersList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute isAdmin={true}>
                <OrdersList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/reviews"
            element={
              <ProtectedRoute isAdmin={true} >
                <PhotoReviews />
              </ProtectedRoute>} /> */}

        </Routes>
      </Router>
      <Footer />
    </div>
  );

}

export default App;