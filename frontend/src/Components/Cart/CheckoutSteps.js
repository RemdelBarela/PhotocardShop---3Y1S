import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faCreditCard } from '@fortawesome/free-solid-svg-icons';

const CheckoutSteps = ({ shipping, confirmOrder, payment }) => {
  return (
    <div className="checkout-progress d-flex justify-content-center mt-5">
      {shipping ? (
        <Link to="shipping" className="float-right circular-link">
             <div className="step active-step"> <FontAwesomeIcon icon={faInfoCircle} size="3x"  /> </div>
             </Link>
      ) : (
        <Link to="#!" className="circular-link" disabled>
            <div className="step incomplete"><FontAwesomeIcon icon={faInfoCircle} size="3x"  /></div>
           
        </Link>
      )}

      {confirmOrder ? (
        <Link to="/order/confirm" className="float-right circular-link">
             <div className="step active-step"><FontAwesomeIcon icon={faCheckCircle} size="3x"  /></div>
           </Link>
      ) : (
        <Link to="#!" className="circular-link" disabled>
            <div className="step incomplete"><FontAwesomeIcon icon={faCheckCircle} size="3x"  /></div>
             </Link>
      )}

      {payment ? (
        <Link to="/payment" className="float-right circular-link">
        
          <div className="step active-step"><FontAwesomeIcon icon={faCreditCard} size="3x"  /></div>
        
        </Link>
      ) : (
        <Link to="#!" className="circular-link" disabled>
           <div className="step incomplete"><FontAwesomeIcon icon={faCreditCard} size="3x"  /></div>
       
        </Link>
      )}
    </div>
  );
};

export default CheckoutSteps;
