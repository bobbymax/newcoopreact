import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./css/main.css";
import { useStateContext } from "../context/ContextProvider";
import { logout } from "../app/http/controllers/auth";
import { useDispatch } from "react-redux";
import { disembark } from "../features/userSlice";
import Sidebar from "./includes/Sidebar";
import TopHeader from "./includes/TopHeader";

const ProtectedRoute = ({ children }) => {
  const { auth } = useStateContext();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      logout()
        .then((res) => {
          dispatch(disembark());
          navigate("/auth/login");
          console.log(res.data);
        })
        .catch((e) => console.log(e.message));
    } catch (error) {}
  };

  // console.log(auth);

  return (
    <div className="wrapper">
      {/* Sidebar Section is Here */}
      <Sidebar />
      <main>
        <TopHeader handleLogout={handleLogout} />
        <div className="content">
          {auth ? children : <Navigate to="/auth/login" />}
        </div>
      </main>
    </div>
  );
};

export default ProtectedRoute;
