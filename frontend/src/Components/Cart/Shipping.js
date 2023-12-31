import React, { Fragment, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { countries } from 'countries-list';
import MetaData from '../Layout/MetaData';
import CheckoutSteps from './CheckoutSteps';

const Shipping = ({  shipping, saveShippingInfo }) => {

  const countriesList = Object.values(countries);
  const [address, setAddress] = useState(shipping.address);
  const [city, setCity] = useState(shipping.city);
  const [postalCode, setPostalCode] = useState(shipping.postalCode);
  const [phoneNo, setPhoneNo] = useState(shipping.phoneNo);
  const [country, setCountry] = useState(shipping.country);

  const location = useLocation();
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {

    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCartItems);
    console.log(storedCartItems);
  }, []);
  const submitHandler = (e) => {
    e.preventDefault();
    saveShippingInfo({ address, city, phoneNo, postalCode, country });
    navigate('/confirm');
  };

  return (
    <Fragment>
      <MetaData title={'Shipping Info'} />
      <CheckoutSteps shipping />
      <div className="row wrapper"  style={{marginTop:"30px", marginBottom: "70px"}}>
        <div className="col-10 col-lg-5" style={{marginBottom:"50px"}}>
        <form className="shipping-form" onSubmit={submitHandler} >
    <h1 className="mb-4">SHIPPING DETAILS</h1>
            <div className="form-group" >
              <label htmlFor="address_field" >
                ADDRESS
              </label>
              <input
                type="text"
                id="address_field"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                
              />
            </div>

            <div className="form-group">
              <label htmlFor="city_field" >
                CITY
              </label>
              <input
                type="text"
                id="city_field"
                className="form-control"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                 
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone_field" >
                PHONE NUMBER
              </label>
              <input
                type="phone"
                id="phone_field"
                className="form-control"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                required
               
              />
            </div>

            <div className="form-group">
              <label htmlFor="postal_code_field">
                POSTAL CODE
              </label>
              <input
                type="number"
                id="postal_code_field"
                className="form-control"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
               
              />
            </div>

            <div className="form-group">
              <label htmlFor="country_field" >
                COUNTRY
              </label>
              <select
                id="country_field"
                className="form-control"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
               
              >
                {countriesList.map((country) => (
                  <option key={country.name} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <button id="shipping_btn" type="submit" className="btn btn-block py-3" >
              CONTINUE
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Shipping;
