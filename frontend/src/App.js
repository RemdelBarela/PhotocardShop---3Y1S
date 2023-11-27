import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { getToken } from './utils/helpers'

import Header from './Components/Layout/Header'
import Footer from './Components/Layout/Footer'
import ProtectedRoute from "./Components/Route/ProtectedRoute";

import Home from './Components/Home';

import PhotoDetails from "./Components/Photocard/PhotoDetails";

import Login from "./Components/User/Login";
import Register from './Components/User/Register';

import Profile from "./Components/User/Profile";
import UpdateProfile from "./Components/User/UpdateProfile";

import UsersList from "./Components/Admin/User/UsersList";
import UpdateUser from "./Components/Admin/User/UpdateUser";

import UpdatePassword from "./Components/User/UpdatePassword";
import ForgotPassword from "./Components/User/ForgotPassword";
import NewPassword from "./Components/User/NewPassword";

import PhotosList from "./Components/Admin/Photo/PhotosList";
import NewPhoto from "./Components/Admin/Photo/NewPhoto";
import UpdatePhoto from "./Components/Admin/Photo/UpdatePhoto";

import MaterialsList from "./Components/Admin/Material/MaterialsList";
import NewMaterial from "./Components/Admin/Material/NewMaterial";
import UpdateMaterial from "./Components/Admin/Material/UpdateMaterial";

import Cart from "./Components/Cart/Cart";
import Shipping from "./Components/Cart/Shipping";
import ConfirmOrder from "./Components/Cart/ConfirmOrder";
import Payment from "./Components/Cart/Payment";
import OrderSuccess from "./Components/Cart/OrderSuccess";

import ListOrders from "./Components/Order/ListOrders";
import OrderDetails from "./Components/Order/OrderDetails";

import OrdersList from "./Components/Admin/Order/OrdersList";
import ProcessOrder from "./Components/Admin/Order/ProcessOrder"

import Receipt from "./Components/Admin/Receipt/Receipt"

import Dashboard from "./Components/Admin/Chart/Dashboard";
import PhotoSalesChart from "./Components/Admin/Chart/PhotoSalesChart";
import MaterialSalesChart from "./Components/Admin/Chart/MaterialSalesChart";
import UserSalesChart from "./Components/Admin/Chart/UserSalesChart";

import ListReviews from "./Components/Photo/Review/ListReviews";
// import PhotoReviews from "./Components/Admin/Photo/PhotoReview";
import ReviewsList from "./Components/Review/ReviewsList";



function App() {
  const [isDeleted, setIsDeleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [state, setState] = useState({
  //   cartItems: localStorage.getItem('cartItems')
  //   ? JSON.parse(localStorage.getItem('cartItems'))
  //   : [],

    cartItems: (() => {
      try {
        const cartItems = localStorage.getItem('cartItems');
        return cartItems ? JSON.parse(cartItems) : [];
      } catch (error) {
        console.error("Error parsing cartItems from localStorage:", error);
        return [];
      }
    })(),
    shippingInfo: localStorage.getItem('shippingInfo')
      ? JSON.parse(localStorage.getItem('shippingInfo'))
      : {},
  })

  const addItemToCart = async (photocardId, quantity) => { // Modified to accept photocard_id
    // console.log(id, quantity)
    try {
      // Fetch details of the photocard using the photocard_id
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/photocard/${photocardId}`);

      const item = {
        photocard: data.photocard._id,
        photo: data.photocard.photo._id,
        material: data.photocard.material._id,
        quantity: quantity,
        images: data.photocard.photo.images,
        Pname: data.photocard.photo.name,
        Mname: data.photocard.material.name,
        price: data.photocard.photo.price,
        stock: data.photocard.material.stock,
        // Add other necessary details of the photocard here based on your requirement
      };

      const isItemExist = state.cartItems.find(i => i.photocard === item.photocard)
      console.log(isItemExist, state)

      if (isItemExist) {
        setState({
          ...state,
          cartItems: state.cartItems.map(i => i.photocard === isItemExist.photocard ? item : i)
        })
      }
      else {
        setState({
          ...state,
          cartItems: [...state.cartItems, item]
        })
      }
  
      toast.success('PHOTOCARD ADDED TO CART', {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error) {
      toast.error(error.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };


  const removeItemFromCart = async (id) => {
    try {
          const config = {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${getToken()}`
              }
          }
          const { data } = await axios.delete(`${process.env.REACT_APP_API}/api/v1/photocard/delete/${id}`, config)
          setIsDeleted(data.success)
          setLoading(false)
      } catch (error) {
          setError(error.response.data.message)

      }

    setState({
      ...state,
      cartItems: state.cartItems.filter(i => i.photocard !== id)
    })
  }

  const checkoutItemRemoved = async (id) => {
    setState({
      ...state,
      cartItems: state.cartItems.filter(i => i.photocard !== id)
    })
  }

  const saveShippingInfo = async (data) => {
    setState({
      ...state,
      shippingInfo: data
    })
    localStorage.setItem('shippingInfo', JSON.stringify(data))
  }

  return (
    <div className="App">

      <Router>
        <Header cartItems={state.cartItems} />
        
        <Routes>
          <Route path="/" element={<Home />} exact="true" />
          
          <Route path="/search/:keyword" element={<Home />} exact="true" />

          <Route path="/photo/:id" element={<PhotoDetails cartItems={state.cartItems} addItemToCart={addItemToCart} />} exact="true" />

          <Route path="/login" element={<Login />} exact="true" />
          <Route path="/register" element={<Register />} exact="true" />

          <Route path="/me" element={<Profile />} exact="true" />
          <Route path="/me/update" element={<UpdateProfile />} exact="true" />

          <Route path="/admin/users"
            element={
              <ProtectedRoute isAdmin={true}>
                <UsersList />
              </ProtectedRoute>
            }/>
          <Route path="/admin/user/:id" element={<UpdateUser />} />

          <Route path="/password/update" element={<UpdatePassword />} />
          <Route path="/password/forgot" element={<ForgotPassword />} exact="true" />
          <Route path="/password/reset/:token" element={<NewPassword />} exact="true" />

          <Route path="/admin/photos"
            element={
              <ProtectedRoute isAdmin={true}>
                <PhotosList />
              </ProtectedRoute>
            }/>
          <Route path="/admin/photo" element={<NewPhoto />} />
          <Route path="/admin/photo/:id" element={<UpdatePhoto />} />
          
          
          <Route path="/review/:id" element={<ListReviews />} exact="true" />

          <Route
            path="/admin/reviews"
            element={
              <ProtectedRoute isAdmin={true} >
                <ReviewsList />
              </ProtectedRoute>} /> 

          <Route
            path="/admin/materials"
            element={
              <ProtectedRoute isAdmin={true}>
                <MaterialsList />
              </ProtectedRoute>
            }/>
          <Route path="/admin/material" element={<NewMaterial />} />
          <Route path="/admin/material/:id" element={<UpdateMaterial />} />

          <Route path="/cart"
            element={<Cart
              cartItems={state.cartItems}
              addItemToCart={addItemToCart}
              removeItemFromCart={removeItemFromCart}
            />} exact="true" />
          
          <Route path="/shipping" element={<Shipping shipping={state.shippingInfo} saveShippingInfo={saveShippingInfo} />} />
          <Route path="/confirm" element={<ConfirmOrder cartItems={state.cartItems} shippingInfo={state.shippingInfo} />} />
          <Route path="/payment" element={<Payment cartItems={state.cartItems} shippingInfo={state.shippingInfo} />} />
          <Route path="/success" element={<OrderSuccess cartItems={state.cartItems} />} />

          <Route path="/orders/me" element={<ListOrders />} />
          <Route path="/order/:id" element={<OrderDetails />} />

          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute isAdmin={true}>
                <OrdersList />
              </ProtectedRoute>
            }/>
          <Route path="/admin/order/:id"
            element={<ProcessOrder />} />

          <Route path="/print-receipt/:id"
            element={<Receipt />}/>

        {/* <Route path="/dashboard" element={<Dashboard />} /> */}

        <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute isAdmin={true}>
                <Dashboard />
              </ProtectedRoute>
            }/>

            <Route
            path="/admin/photo-sales"
            element={
              <ProtectedRoute isAdmin={true}>
                <PhotoSalesChart />
              </ProtectedRoute>
            }/>

            <Route
            path="/admin/customer-sales"
            element={
              <ProtectedRoute isAdmin={true}>
                <UserSalesChart />
              </ProtectedRoute>
            }/>

            <Route
            path="/admin/material-sales"
            element={
              <ProtectedRoute isAdmin={true}>
                <MaterialSalesChart />
              </ProtectedRoute>
            }/>
        </Routes>
      </Router>
      <Footer />
    </div>
  );

}
export default App;