/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useStateContext } from "../context/ContextProvider";
import { Link, useLocation } from "react-router-dom";
import { getChildren } from "../app/helpers";

const Module = () => {
  const { navigation } = useStateContext();
  const { pathname } = useLocation();

  const [page, setPage] = useState(null);
  const [children, setChildren] = useState([]);

  useEffect(() => {
    const activePage = navigation?.filter((nav) => nav?.url === pathname)[0];
    setPage(activePage);
  }, [pathname]);

  useEffect(() => {
    if (page !== null) {
      const { children } = page;

      setChildren(children);
    }
  }, [page]);

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          {children?.map((child, i) => (
            <div className="module__card" key={i}>
              <div className="module__card-title">
                <span className="material-icons-sharp">{child?.icon}</span>
                <h3>{child?.name}</h3>
              </div>

              <div className="children__section">
                <div className="row">
                  {getChildren(navigation, child?.id)?.map((chd, index) => (
                    <div className="col-md-3 mb-4" key={index}>
                      <Link to={chd?.url} className="module__menu-card">
                        <span className="material-icons-sharp child__nav__icon">
                          {chd?.icon}
                        </span>
                        <h3>{chd?.name}</h3>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Module;
