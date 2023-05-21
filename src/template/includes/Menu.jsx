import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useStateContext } from "../../context/ContextProvider";
import { splitRoute } from "../../app/helpers";

const Menu = () => {
  const { navigation } = useStateContext();
  const [url, setUrl] = useState("");

  const { pathname } = useLocation();

  useEffect(() => {
    setUrl(splitRoute(pathname));
  }, [pathname]);

  return (
    <nav>
      <ul>
        <li>
          <Link
            to="/dashboard"
            className={`nav__link ${url === "/dashboard" ? "active" : ""}`}
          >
            <span className="material-icons-sharp nav_icons">dashboard</span>
            <p className="nav__text">Dashboard</p>
          </Link>
        </li>
        {navigation
          ?.filter((nav) => nav?.type === "application")
          ?.map((nav, i) => (
            <li key={i}>
              <Link
                to={nav?.url}
                className={`nav__link ${nav?.url === url ? "active" : ""}`}
              >
                <span className="material-icons-sharp nav_icons">
                  {nav?.icon}
                </span>
                <p className="nav__text">{nav?.name}</p>
              </Link>
            </li>
          ))}
      </ul>
    </nav>
  );
};

export default Menu;
