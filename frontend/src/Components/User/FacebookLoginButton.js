import React from 'react';
import FacebookLogin from 'react-facebook-login';

const FacebookLoginButton = ({ onFacebookLogin }) => {
  const responseFacebook = (response) => {
    onFacebookLogin(response);
  };

  return (
    <FacebookLogin
      appId="3675250786095175"
      autoLoad={false}
      fields="name,email,picture"
      callback={responseFacebook}
    />
  );
};

export default FacebookLoginButton;
