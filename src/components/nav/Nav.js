import React from "react";
import "./nav.css";
import whatsapp from "../../images/whatsapp.png";

const Nav = () => {
  return (
    <div className="nav">
      <div className="nav__blocks">
        <img src={whatsapp}></img>
      </div>
      <div className="nav__blocks"></div>
      <div className="nav__blocks"></div>
    </div>
  );
};

export default Nav;
