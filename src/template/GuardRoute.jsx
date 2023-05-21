import React from "react";
import "./css/main.css";

const GuardRoute = ({ children }) => {
  return (
    <div className="guard__wrapper">
      <div className="authentication__container">
        <div className="form__section">{children}</div>
      </div>
    </div>
  );
};

export default GuardRoute;
