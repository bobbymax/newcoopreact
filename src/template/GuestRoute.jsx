import React from "react";
import logo from "../assets/images/logos/logo.png";
// import bg from "../assets/images/bg.png";

const GuestRoute = ({ children }) => {
  return (
    <div className="home__wrapper">
      <div className="container">
        <div className="row">
          <div className="col-md-12">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default GuestRoute;
