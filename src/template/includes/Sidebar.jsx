import React from "react";
import fullLogo from "../assets/images/logo/logo.png";
import avatar from "../assets/images/avatar/ang.png";
import Menu from "./Menu";
import { useStateContext } from "../../context/ContextProvider";
import { currency } from "../../app/helpers";

const Sidebar = () => {
  const { auth, wallet } = useStateContext();

  console.log(auth);

  return (
    <aside>
      <div className="logo">
        <img src={fullLogo} alt="Website Logo" />
      </div>
      <div className="member__intro__section">
        <div className="avatar mb-4">
          <img src={avatar} alt="Member face card" />
        </div>
        <div className="member__info">
          <h3>{`${auth?.firstname} ${auth?.surname}`}</h3>
          <p>{currency(wallet?.savings)}</p>
          <small>
            savings as at <span>may</span>
          </small>
        </div>
      </div>
      <div className="navigation">
        <p className="pointer mb-4">menu</p>
        <Menu />
      </div>
    </aside>
  );
};

export default Sidebar;
