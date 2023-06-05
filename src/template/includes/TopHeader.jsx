import React, { useEffect, useState } from "react";
import mobileLogo from "../assets/images/logo/logo-small.png";
import { Link, useLocation } from "react-router-dom";

const TopHeader = ({ handleLogout }) => {
  const { pathname } = useLocation();
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(pathname);
  }, [pathname]);

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
          <Link
            to="/stakeholders/member/messages"
            className={`notification__links ${
              url === "/stakeholders/member/messages"
                ? "notification__links-active"
                : ""
            }`}
          >
            <span className="material-icons-sharp">forum</span>
            <p>Messages</p>
          </Link>
        </div>
        <div className="user__profile">
          <Link
            to="/stakeholders/member/profile"
            className={`notification__links ${
              url === "/stakeholders/member/profile"
                ? "notification__links-active"
                : ""
            }`}
          >
            <span className="material-icons-sharp">manage_accounts</span>
            <p>Profile</p>
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
