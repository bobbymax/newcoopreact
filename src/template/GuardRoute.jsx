import React from "react";
import "./css/main.css";
import logo from "../assets/images/logos/logo.png";

const GuardRoute = ({ children }) => {
  return (
    <div className="guard__wrapper">
      <div className="authentication__container">
        <div className="brand">
          <img src={logo} alt="Cooperative logo" />
        </div>
        <div className="form__section">{children}</div>
      </div>
    </div>
  );
};

export default GuardRoute;
