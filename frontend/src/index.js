import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ToastContainer } from 'react-toastify';

import './Design/Login.css';
import './Design/Register.css';
import "./Design/Header.scss";
import "./Design/Header.css";
import "./Design/Facebook.css";
import './Design/App.css';
import './Design/Photo.css';
import './Design/Profile.css';
import './Design/User.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <ToastContainer />

  </React.StrictMode>
);

