import api from "../api/api";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseSharp } from "react-icons/io5";

import "../styles/Layout.css";

const Layout = () => {
  const getProfile = () => {
    api.profile().then((res) => {
      if (!res.state) {
        document.cookie = "access_token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = "/";
      }
    });
  };

  const [isMobile, setMobile] = useState(false);

  const handleMobile = () => {
    setMobile(!isMobile);
  };

  useEffect(() => {
    getProfile();
}, []);

  return (
    <>
      <div className="Layout">
        <div className="Navbar-title">
          <button onClick={() => (window.location.href = "/")}><span>AREA</span></button>
        </div>
        <div className="Navbar-links">
          <button onClick={() => (window.location.href = "/")}>Home</button>
          <button onClick={() => (window.location.href = "/Services")}>Services</button>
          <button onClick={() => (window.location.href = "/Profile")}>Profile</button>
        </div>
        <button className="mobile-button" onClick={handleMobile}>
          {isMobile ? <IoCloseSharp color="white" /> : <RxHamburgerMenu />}
        </button>
        <div className="Navbar-mobile-links">
          {isMobile ?
          <>
            <button onClick={() => (window.location.href = "/")}>Home</button>
            <button onClick={() => (window.location.href = "/Services")}>Services</button>
            <button onClick={() => (window.location.href = "/Profile")}>Profile</button>
          </>
          : null
          }
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Layout;
