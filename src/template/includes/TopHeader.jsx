import React from "react";
import mobileLogo from "../assets/images/logo/logo-small.png";
import { Link } from "react-router-dom";

const TopHeader = ({ handleLogout }) => {
  return (
    <div className="top__header">
      <div className="mobile__tabs">
        <div className="mobile__logo">
          <img src={mobileLogo} alt="Logo on Mobile view" />
        </div>
        <div className="menu__icon">
          <div className="menu__hide">
            <span className="material-icons-sharp open">menu</span>
            <span className="material-icons-sharp close">close</span>
          </div>
        </div>
      </div>
      <div className="quick__links"></div>
      <div className="notifications__section">
        <div className="notifications">
          <Link to="#" className="notification__links">
            <span className="material-icons-sharp">forum</span>
          </Link>
        </div>
        <div className="user__profile">
          <Link to="#" className="notification__links">
            <span className="material-icons-sharp">manage_accounts</span>
          </Link>
        </div>
        <div className="logout">
          <button
            type="button"
            className="custom__logout__btn bg__danger"
            onClick={() => handleLogout()}
          >
            <span className="material-icons-sharp">logout</span>
            <p>Logout</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
