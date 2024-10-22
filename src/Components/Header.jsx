/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import KamaiLogo from '../assets/logo/Kamai.png';


const Header = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <>
      <nav class="fixed top-0 z-50 w-full bg-slate-200 border-b border-slate-300">
        <div class="px-3 py-3 lg:px-5 lg:pl-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center justify-start rtl:justify-end">
              <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                <span class="sr-only">Open sidebar</span>
                <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
              </button>
              <a href="#" class="flex ms-10 md:me-24">
                <img src={KamaiLogo} class="h-12" alt="Kamai Logo" />
              </a>
            </div>
            <div class="flex items-center">
              <div class="flex items-center me-5">
                <p className="text-indigo-800 font-semibold pr-1">Welcome,</p>
                <p className="text-orange-500 underline italic">{localStorage.getItem("user_name") || "No username found"}</p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
