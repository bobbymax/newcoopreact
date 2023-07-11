import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logos/logo.png";

const Home = () => {
  return (
    <div className="home__content">
      {/* <div>Home</div>
      <Link to="/auth/login">Login</Link> */}
      <div className="section">
        <h1>
          <img src={logo} alt="Coop Logo" />
          <span>NCDMB</span> Multipurpose Cooperative Society
        </h1>
        <Link to="/auth/login" className="login__bttn">
          <span className="material-icons-sharp">login</span>
          Login
        </Link>
      </div>
    </div>
  );
};

export default Home;
