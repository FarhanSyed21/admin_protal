/* eslint-disable no-unused-vars */
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";


const Header = () => {

  return (
    <>
      <header className="heater-transparent">
        <div className={`jm-header-area header-sticky sticky`}>
          <div className="container">
            <div className="jm-header-main jm-header-padding ">
              <div className="row align-items-center ">
                <div className="col-xl-3 col-lg-3  col-7">
                  <div className="jm-header-logo">
                    <Link className="jm-logo" to="/">
                      <img
                        src="assets/img/logo/logo.png"
                        alt="Image Not Fouund"
                      />
                    </Link>
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 d-none d-lg-block">
                  <div className="jm-header-main-menu text-center">
                    <nav className="jm-mobile-menu" id="jm-mobile-menu">
                      <ul>
                        <li className="menu-has-children">
                          <Link to="#">Home</Link>
                          <ul className="sub-menu">
                            <li>
                              <Link to="#">Home 1</Link>
                            </li>
                            <li>
                              <Link to="#">Home 2</Link>
                            </li>
                          </ul>
                        </li>
                        <li className="menu-has-children">
                          <Link to="#">Jobs</Link>
                          <ul
                            className="sub-menu grid grid-cols-2"
                            style={{ width: "420px" }}
                          >
                            <li>
                              <Link to="#">Jobs Grid</Link>
                            </li>
                            <li>
                              <Link to="#">Jobs List</Link>
                            </li>
                            <li>
                              <Link to="#">Jobs by title</Link>
                            </li>
                            <li>
                              <Link to="#">Jobs by city</Link>
                            </li>
                            <li>
                              <Link to="#">
                                Jobs by qualification
                              </Link>
                            </li>
                            <li>
                              <Link to="#">Fresher jobs</Link>
                            </li>
                            <li>
                              <Link to="#">
                                Jobs for disabled people
                              </Link>
                            </li>
                            <li>
                              <Link to="#">Job Details</Link>
                            </li>
                            <li>
                              <Link to="#">
                                Jobs By Category
                              </Link>
                            </li>
                            <li>
                              <Link to="#">Employer List</Link>
                            </li>
                            <li>
                              <Link to="#">Employer Grid</Link>
                            </li>
                            <li>
                              <Link to="#">
                                Employer Details
                              </Link>
                            </li>
                            <li>
                              <Link to="#">Post a Job</Link>
                            </li>
                            <li>
                              <Link to="#">Add Resume</Link>
                            </li>
                            <li>
                              <Link to="#">Sample Videos</Link>
                            </li>
                          </ul>
                        </li>
                        <li className="menu-has-children">
                          <Link to="#">Candidates</Link>
                          <ul className="sub-menu">
                            <li>
                              <Link to="#">Candidates Grid</Link>
                            </li>
                            <li>
                              <Link to="#">
                                Candidates List
                              </Link>
                            </li>
                            <li>
                              <Link to="#">
                                Candidates Details
                              </Link>
                            </li>
                            <li>
                              <Link to="#">
                                Candidates Register
                              </Link>
                            </li>
                            <li>
                              <Link to="#">
                                Video Description
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li className="menu-has-children">
                          <Link to="#">Pages</Link>
                          <ul className="sub-menu">
                            <li>
                              <Link to="#">About</Link>
                            </li>
                            <li>
                              <Link to="#">Services</Link>
                            </li>
                            <li>
                              <Link to="#">
                                Services Details
                              </Link>
                            </li>
                            <li>
                              <Link to="#">Contact</Link>
                            </li>
                            <li>
                              <Link to="#">Subscription</Link>
                            </li>
                          </ul>
                        </li>
                        <li className="menu-has-children">
                          <Link to="#">Blog</Link>
                          <ul className="sub-menu">
                            <li>
                              <Link to="#">Blog Grid</Link>
                            </li>
                            <li>
                              <Link to="#">Blog List</Link>
                            </li>
                            <li>
                              <Link to="#">Blog Details</Link>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-3 col-5">
                  <div className="jm-header-right  text-end d-flex gap-4 align-items-center justify-content-end">
                    <button
                      className="jm-theme-btn-2 text-[#130160] whitespace-nowrap font-semibold d-none d-lg-block"
                    >
                      Employer Login
                    </button>
                    <button
                      className="jm-theme-btn d-none d-lg-block"
                      style={{
                        padding: "8px 20px",
                        borderRadius: "10px",
                      }}
                    >
                      Candidate Login
                    </button>
                    <div
                      className="jm-navbar-mobile-sign side-toggle d-lg-none d-inline-block"
                      role="button"
                    >
                      <span className="dr-line-1"></span>
                      <span className="dr-line-2"></span>
                      <span className="dr-line-3"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
