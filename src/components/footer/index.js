import "./style.css";

import React, { useContext, useState } from "react";

import { BsCodeSlash } from "react-icons/bs";
import { Link } from "react-router-dom";
import { context } from "../../App";

function Footer() {
  const { setAdminFormOpen } = useContext(context);
  const [setRender] = useState(1);
  return (
    <footer>
      <div className="wave">
        <img className="footerwave" src="/footerwave.png" alt="wave" />
      </div>
      <div className="footer-content">
        <div className="footer-detail-container">
          <Link className="logo" to="/">
            <img
              style={{ width: 30, height: 35, marginRight: 10 }}
              src="/logo.png"
              alt="logo"
            />
            Firecart
          </Link>
          <Link className="small-title" to="/developer">
            <BsCodeSlash /> Developer Details
          </Link>
        </div>
        <p className="small-title">
          <span
            onClick={() => {
              setAdminFormOpen((i) => !i);
              setRender((i) => i + 1);
            }}
          >
            ©
          </span>{" "}
          All rights reserved by vidhanshu.com
        </p>
      </div>
    </footer>
  );
}

export default Footer;
