/*eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  Grid,
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Box,
  Modal,
  TableContainer,
  Table, TableHead, TableCell, TableRow, TableBody,
  Menu,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import UserList from "../../UserList";

import { Layout } from "antd";
import Header from "../../Header";

const { Sider } = Layout;

const HomePage = () => {
  const [selectedOption, setSelectedOption] = useState("Organization");
  const [organizationData, setOrganizationData] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [reportedJobs, setReportedJobs] = useState([]);
  const [org, setOrg] = useState([]);
  const [kycStatus, setKycStatus] = useState("Kyc pending"); // Default choice
  const navigate = useNavigate();
  const location = useLocation();
  const [filter, setFilter] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [openPopup, setOpenPopup] = useState(false);
  const [popupDetails, setPopupDetails] = useState({});
  const [ReportedJobsPopupOpen, setReportedJobsPopupOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);


  const [verifyJob, setverifyJob] = useState(null);
  const [jobPostingsPopup, setjobPostingsPopup] = useState()

  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [approvedbutton, setApprovedbutton] = useState([]);

  const [jobpostings, setJobpostings] = useState([])

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken' || ''));
  const menuItems = [
    "Organization",
    "Candidate",
    "Reported Jobs",
    "User List",
    "Subscription",
    "Pending JobPostings"
  ];
  const startIndex = Math.max(0, (currentPage - 1) * itemsPerPage);

  const endIndex = startIndex + itemsPerPage;
  const paginatedData = org.slice(startIndex, endIndex);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const data = {
    Candidate: [
      { id: "CAND001", name: "John Doe" },
      { id: "CAND002", name: "Jane Smith" },
      { id: "CAND003", name: "Michael Johnson" },
      { id: "CAND004", name: "Emily Davis" },
      { id: "CAND005", name: "Sarah Wilson" },
      { id: "CAND006", name: "James Brown" },
      { id: "CAND007", name: "Patricia Garcia" },
      { id: "CAND008", name: "Robert Miller" },
      { id: "CAND009", name: "Linda Martinez" },
      { id: "CAND010", name: "David Anderson" },
    ],
  };



  useEffect(() => {
    const fetchReportedJobs = async () => {
      if (selectedOption === "Reported Jobs") {
        try {
          const response = await fetch(
            "https://dev.kamai.ai/employer/report-issue",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setReportedJobs(data.length ? data : []);
          setLoading(false);

          console.log('Reported jobs :', data);
        } catch (error) {
          console.error("Error fetching reported jobs:", error);
          setReportedJobs([]);
          setError("Failed to fetch reported jobs.");
          setLoading(false);
        }
      }
    };

    fetchReportedJobs();
  }, [selectedOption, authToken]);

  const handleReportedJobsViewDetails = (data) => {
    setSelectedJob(data);
    console.log('selectedjob data: ', data)
    setReportedJobsPopupOpen(true);
  };


  const handleRJClosePopup = () => {
    setReportedJobsPopupOpen(false);
    setSelectedJob(null);

  };

  useEffect(() => {
    const fetchOrganization = async (pageNumber) => {
      if (selectedOption === "Organization") {
        try {
          const response = await fetch(
            `https://dev.kamai.ai/employer/loadAllOrgs?page=${pageNumber}&size=10&sortBy=createdOn&sortDir=desc`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          setOrganizationData(data.content);

          console.log('organization data :', data.content)
          setTotalPages(data.totalPages);
          setShouldRefresh(false)


        } catch (error) {
          console.error("Error fetching organization:", error);
          setOrganizationData([]);
        }
      }
    };

    fetchOrganization(currentPage);
  }, [selectedOption, authToken, currentPage, shouldRefresh]);

  useEffect(() => {

    console.log("Organizations state:", org);
  }, [org]);

  const handleMenuClick = (menu) => {
    setSelectedOption(menu);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filterData = (data) => {
    if (!filter) return data;

    return data.filter((item) => {
      return Object.values(item).some((value) => {
        if (typeof value === "string") {
          return value.toLowerCase().includes(filter.toLowerCase());
        }
        return String(value).toLowerCase().includes(filter.toLowerCase());
      });
    });
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const DetailPopup = ({ open, onClose, details }) => {
    return (
      // <div className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 ${open ? 'block' : 'hidden'}`}>
      //   <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
      //     <h2 className="text-center text-2xl font-bold text-blue-600 mb-6">User Profile Details</h2>
      //     <div className="space-y-4 ">
      //       <p className="text-lg">
      //         <span className="font-semibold">ID:</span> {details.id}
      //       </p>
      //       <p className="text-lg">
      //         <span className="font-semibold">Recruiter Name:</span> {details.name}
      //       </p>
      //       <p className="text-lg">
      //         <span className="font-semibold">Company Name:</span> {details.companyName}
      //       </p>
      //       <p className="text-lg">
      //         <span className="font-semibold">Email:</span> {details.email}
      //       </p>
      //       <p className="text-lg">
      //         <span className="font-semibold">Mobile Number:</span> {details.mobileNumber}
      //       </p>
      //       <p className="text-lg">
      //         <span className="font-semibold">Address:</span> {details.address}
      //       </p>
      //       <div className="flex items-center gap-3">
      //         <p className="text-lg">
      //           <span className="font-semibold">KYC Status:</span> {details.kycStatus}
      //         </p>
      //         {details.kycStatus === 'SUCCESS' ? (
      //           <button className="bg-green-500 text-white py-1 px-4 rounded-full">
      //             Verified
      //           </button>
      //         ) : (
      //           <button
      //             className="bg-blue-500 text-white py-1 px-4 rounded-full hover:bg-blue-600"
      //             onClick={() => handleKyc(details.id)}
      //           >
      //             Update KYC
      //           </button>
      //         )}
      //       </div>
      //     </div>
      //     <div className="flex justify-center mt-6">
      //       <button
      //         onClick={onClose}
      //         className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600"
      //       >
      //         Close
      //       </button>
      //     </div>
      //   </div>
      // </div>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 ${open ? "block" : "hidden"
          }`}
      >
        <div className="max-w-sm mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
          <div className="border-b px-4 pb-6">
            <div className="text-center my-4">
              <img
                className="h-32 w-32 rounded-full border-4 border-gray-800 mx-auto my-4"
                src={details.profilePicAWSS3URL}
                alt="Profile Pic"
              />
              <div className="py-2">
                <h3 className="font-bold text-2xl text-gray-800 mb-1">
                  {details.name}
                </h3>
                <div className="inline-flex text-gray-700 items-center">
                  <svg
                    className="h-5 w-5 text-black mr-1"
                    fill="currentcolor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path d="M5.64 16.36a9 9 0 1 1 12.72 0l-5.65 5.66a1 1 0 0 1-1.42 0l-5.65-5.66zm11.31-1.41a7 7 0 1 0-9.9 0L12 19.9l4.95-4.95zM12 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                  </svg>
                  {details.locality +
                    ", " +
                    details.location +
                    " - " +
                    details.address}
                </div>
                <div className="inline-flex text-gray-700 items-center">
                  <svg
                    className="h-5 w-5 text-gray-700 mr-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke="#000000"
                      stroke-width="0.144"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7"
                        stroke="#858585"
                        stroke-width="0.288"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="2"
                        stroke="#858585"
                        stroke-width="0.288"
                        stroke-linecap="round"
                      ></rect>{" "}
                    </g>
                  </svg>
                  {details.email}
                </div>
                <br />
                <div className="inline-flex text-gray-700 items-center">
                  <svg
                    className="h-5 w-5 text-gray-600 mr-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    transform="rotate(90)"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M21 5.5C21 14.0604 14.0604 21 5.5 21C5.11378 21 4.73086 20.9859 4.35172 20.9581C3.91662 20.9262 3.69906 20.9103 3.50103 20.7963C3.33701 20.7019 3.18146 20.5345 3.09925 20.364C3 20.1582 3 19.9181 3 19.438V16.6207C3 16.2169 3 16.015 3.06645 15.842C3.12515 15.6891 3.22049 15.553 3.3441 15.4456C3.48403 15.324 3.67376 15.255 4.05321 15.117L7.26005 13.9509C7.70153 13.7904 7.92227 13.7101 8.1317 13.7237C8.31637 13.7357 8.49408 13.7988 8.64506 13.9058C8.81628 14.0271 8.93713 14.2285 9.17882 14.6314L10 16C12.6499 14.7999 14.7981 12.6489 16 10L14.6314 9.17882C14.2285 8.93713 14.0271 8.81628 13.9058 8.64506C13.7988 8.49408 13.7357 8.31637 13.7237 8.1317C13.7101 7.92227 13.7904 7.70153 13.9509 7.26005L13.9509 7.26005L15.117 4.05321C15.255 3.67376 15.324 3.48403 15.4456 3.3441C15.553 3.22049 15.6891 3.12515 15.842 3.06645C16.015 3 16.2169 3 16.6207 3H19.438C19.9181 3 20.1582 3 20.364 3.09925C20.5345 3.18146 20.7019 3.33701 20.7963 3.50103C20.9103 3.69907 20.9262 3.91662 20.9581 4.35173C20.9859 4.73086 21 5.11378 21 5.5Z"
                        stroke="#000000"
                        stroke-width="0.264"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                    </g>
                  </svg>
                  {details.mobileNumber}
                </div>
              </div>
            </div>
            <div className="flex gap-2 px-2">
              <button
                onClick={() => handleKyc(details.id)}
                className={`flex-1 rounded-full bg-blue-600 dark:bg-blue-800 text-white dark:text-white antialiased font-bold hover:bg-blue-800 dark:hover:bg-blue-900 px-4 py-2
                          ${kycStatus === "SUCCESS"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-800"
                  }
                          ${kycStatus === "SUCCESS"
                    ? "dark:bg-green-800 dark:hover:bg-green-900"
                    : "dark:bg-blue-800 dark:hover:bg-blue-900"
                  }
                        `}
              >
                {details.kycStatus === "SUCCESS" ? "Verified" : "Verify"}

              </button>

              <button
                onClick={onClose}
                className="flex-1 rounded-full bg-gray-600 text-white antialiased font-bold hover:bg-gray-800 px-4 py-2"
              >
                Close
              </button>
            </div>
          </div>
          <div className="px-4 py-4">
            {/* <div>
                {details.kycStatus === "PENDING" ? 
                  <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  :
                  <svg className='mx-auto mb-4 w-12 h-12' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> 
                    <path d="M7.29417 12.9577L10.5048 16.1681L17.6729 9" stroke="#ffffff" strokeWidth="2" stroke-linecap="round" stroke-linejoin="round"></path> <circle cx="12" cy="12" r="10" stroke="#ffffff" stroke-width="2"></circle> </g>
                  </svg>
                }
              </div>
              <div className="flex gap-2 items-center justify-center text-gray-800 dark:text-gray-300 mb-4 ">
                <span>Your Kyc Status is <strong className="text-black dark:text-white underline">{details.kycStatus}</strong></span>
              </div> */}
            <div>
              {details.kycStatus === "PENDING" ? (
                <svg
                  className="mx-auto mb-4 w-12 h-12 text-red-600"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              ) : (
                <svg
                  className="mx-auto mb-4 w-12 h-12 text-green-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.29417 12.9577L10.5048 16.1681L17.6729 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                  ></circle>
                </svg>
              )}
            </div>
            <div className="flex gap-2 items-center justify-center text-gray-800  mb-4">
              <span>
                Your Kyc Status is{" "}
                <strong
                  className={`underline ${details.kycStatus === "PENDING"
                    ? "text-red-600 "
                    : "text-green-600 "
                    }`}
                >
                  {details.kycStatus}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
    setShouldRefresh(true);
  };


  const handleViewDetail = async (orgId) => {
    console.log("orgId :: ", orgId);
    try {
      const response = await fetch(
        `http://k8s-developm-ingressa-1c98111f81-862727769.ap-south-1.elb.amazonaws.com/employer/organization/${orgId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setPopupDetails(data);
        console.log('popup-details:', data);
        setOpenPopup(true);
      }
    } catch (error) {
      console.log("error : ", error);
    }
  };

  const handleKyc = async (orgId) => {
    const response = await fetch(
      `http://k8s-developm-ingressa-1c98111f81-862727769.ap-south-1.elb.amazonaws.com/employer/organization/${orgId}/kycupdate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          orgId: orgId,
          kycStatus: "SUCCESS",
          comments:
            "KYC Verification done on 5th September by Raj and Verification is Success.",
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("KYC update successful:", data);

    setPopupDetails((prevDetails) => ({
      ...prevDetails,
      kycStatus: "SUCCESS"
    }));

    return data;
  };


  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  useEffect(() => {
    const handleSubscriptionRequests = async () => {
      if (selectedOption === "Subscription") {
        try {
          const response = await fetch(
            `https://dev.kamai.ai/employer/subscription-plans/subscription/request?sortDir=desc`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          console.log("subscription Request status : Success");
          const data = await response.json();
          setSubscriptionData(data);
          console.log("Subscription Requests : ", data);
        } catch (error) {
          console.error("Error in subscription request:", error);
        }
      }
    };

    handleSubscriptionRequests();
  }, [selectedOption, authToken]);

  const handleApprove = async (orgId, subscriptionRequestId) => {
    console.log("orgId :: ", orgId);
    console.log("subscriptionRequestId :: ", subscriptionRequestId);

    try {
      const response = await fetch(
        `https://dev.kamai.ai/employer/subscription-plans/${orgId}/subscription/request/${subscriptionRequestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            orgId: orgId,
            subscriptionRequestId: subscriptionRequestId,
          }),
        }
      );

      if (response.ok) {
        alert("Subscription approved!");
        setApprovedbutton(prevstate => [...prevstate, orgId]);

      } else {
        alert("Failed to approve subscription");
      }
    } catch (error) {
      console.error("Error approving subscription:", error);
    }
  };

  useEffect(() => {
    const Pendingjobpostings = async () => {
      if (selectedOption === "Pending JobPostings") {
        try {
          const response = await fetch(
            `https://dev.kamai.ai/employer/verification-pending-jobpostings `,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          console.log("verification pending Request status : Success");
          const data = await response.json();
          setJobpostings(data.content);
          console.log("JobPosting Requests : ", data);
        } catch (error) {
          console.error("Error in verification Pending request:", error);
        }
      }
    };

    Pendingjobpostings();
  }, [selectedOption, authToken]);

  const handleJobpostingsView = (data) => {
    setverifyJob(data);
    console.log('verification pending jobposting data: ', data)
    setjobPostingsPopup(true);
  };


  const handleJobPostingsClosePopup = () => {
    setjobPostingsPopup(false);
    setverifyJob(null);

  };



  return (
    <>
      <Header />
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          backgroundColor: "background.default",
        }}
      >
        {/* Sidebar */}
        <aside
          id="logo-sidebar"
          className="fixed top-0 left-0 w-64 h-full pt-20 transition-transform -translate-x-full bg-slate-200 sm:translate-x-0 mt-0 "
        >
          <div className="top-0 h-full flex flex-col px-3 pb-4 overflow-y-auto bg-slate-200">
            <ul className="space-y-2 font-medium ">
              {menuItems.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className={`flex items-center p-2 text-gray-700 rounded-lg transition duration-300 hover:bg-white`}
                  >
                    <svg
                      className="w-5 h-5 text-gray-700 group-hover:text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 22 21"
                    >
                      <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                      <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                    </svg>
                    <button
                      className="ml-3"
                      onClick={() => handleMenuClick(item)}
                    >
                      {item}
                    </button>
                  </a>
                </li>
              ))}
            </ul>
            <a
              href="#"
              className="mt-auto border w-1/2 mx-14 border-orange-500 text-center focus:ring-orange-800 hover:bg-orange-600 text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-3 lg:px-3 py-3 lg:py-2.5 mr-2"
              // className="mt-auto border border-orange-500 text-center text-red-800 dark:text-orange-500 hover:bg-red-50 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-red-700 dark:hover:text-white focus:outline-none dark:focus:ring-red-800"
              onClick={openModal}
            >
              Logout
            </a>
          </div>
        </aside>
        {isModalOpen && (
          <div
            id="popup-modal"
            className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-screen h-screen bg-slate-200 bg-opacity-50"
          >
            <div className="relative p-4 w-[32%]">
              <div className="relative bg-white rounded-lg shadow dark:bg-white">
                <button
                  type="button"
                  className="absolute top-3 right-2.5 text-black bg-transparent hover:bg-gray-200 hover:text-black rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center "
                  onClick={closeModal}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 1l6 6m0 0l6 6M7 7L1 13M7 7l6-6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
                <div className="p-4 md:p-5 text-center">
                  <svg
                    className="mx-auto mb-4 text-red-600 w-12 h-12 dark:text-red-600"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>

                  <h3 className="mb-5 text-lg font-normal text-black">
                    Are you sure you want to logout?

                  </h3>

                  <button
                    onClick={handleLogout}
                    className="py-2.5 px-5 mr-3 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 transition duration-300 ease-in-out"
                  >
                    Yes, I'm sure
                  </button>

                  <button
                    onClick={closeModal}
                    className="py-2.5 px-5 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition duration-300 ease-in-out"
                  >
                    No, cancel
                  </button>

                  {/* <h3 className="mb-5 text-lg font-normal text-white-500 dark:text-white">
                    Are you sure you want to logout?
                  </h3>
                  <button
                    onClick={handleLogout}
                    // className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                    className="py-2.5 px-5 mr-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    Yes, I'm sure
                  </button>
                  <button
                    onClick={closeModal}
                    className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                  // className="py-2.5 px-5 ml-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    No, cancel
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Main Content Area */}
        <Box
          sx={{
            flexGrow: 1,
            padding: "20px",
            marginLeft: "250px",
            marginTop: "64px",
            overflowY: "auto",
          }}
        >
          <Grid container>
            {selectedOption === "Organization" &&
              organizationData.length > 0 && (
                <>
                  <div style={{ flex: 1 }}>
                    <div
                      className="search-and-filters"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "10px",
                      }}
                    >
                      <div class="w-3/5 max-w-screen-md py-2 mt-4">
                        <form class="relative mx-auto flex w-full max-w-2xl items-center justify-between rounded-md border shadow-lg">
                          <svg
                            class="absolute left-2 block h-5 w-5 text-slate-300"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <circle cx="11" cy="11" r="8" class=""></circle>
                            <line
                              x1="21"
                              y1="21"
                              x2="16.65"
                              y2="16.65"
                              class=""
                            ></line>
                          </svg>
                          <input
                            type="name"
                            name="search"
                            class="h-14 w-full rounded-md py-4 pr-40 pl-12 outline-none focus:ring-2"
                            placeholder="Name, Location, Locality...."
                          />
                          <button
                            type="submit"
                            class="absolute right-0 mr-1 inline-flex h-12 items-center justify-center rounded-lg bg-blue-500 px-10 font-medium text-white focus:ring-4 hover:bg-blue-600"
                          >
                            Search
                          </button>
                        </form>
                      </div>
                      {/* <FormControl variant="outlined" sx={{ minWidth: 180 }}>
                  <InputLabel>Salary</InputLabel>
                  <Select label="Salary" sx={{ backgroundColor: '#fff' }}>
                    <MenuItem value=""><em>None</em></MenuItem>
                    <MenuItem value="0-10000">0-10000</MenuItem>
                    <MenuItem value="10001-20000">10001-20000</MenuItem>
                    <MenuItem value="20001-30000">20001-30000</MenuItem>
                  </Select>
                </FormControl> */}
                      <div class="flex flex-col -mt-2 -ml-10">
                        <label
                          for="manufacturer"
                          class="text-md font-medium text-stone-600"
                        >
                          Salary
                        </label>

                        <select
                          id="manufacturer"
                          class="mt-2 block w-full rounded-md border border-gray-100 bg-gray-100 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        >
                          <option>None</option>
                          <option>0-10000</option>
                          <option>10001-20000</option>
                          <option>20001-30000</option>
                        </select>
                      </div>
                      <div class="flex flex-col -mt-2">
                        <label
                          for="manufacturer"
                          class="text-md font-medium text-stone-600"
                        >
                          Package
                        </label>

                        <select
                          id="manufacturer"
                          class="mt-2 block w-full rounded-md border border-gray-100 bg-gray-100 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        >
                          <option>None</option>
                          <option>0-10000</option>
                          <option>10001-20000</option>
                          <option>20001-30000</option>
                        </select>
                      </div>
                      {/* <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                  <InputLabel>Package</InputLabel>
                  <Select label="Package" sx={{ backgroundColor: '#fff' }}>
                    <MenuItem value=""><em>None</em></MenuItem>
                    <MenuItem value="0-10000">0-10000</MenuItem>
                    <MenuItem value="10001-20000">10001-20000</MenuItem>
                    <MenuItem value="20001-30000">20001-30000</MenuItem>
                  </Select>
                </FormControl> */}
                    </div>

                    {/* <ul style={{ listStyleType: 'none', padding: '0' }}>
                {organizationData.map((org) => (
                  <Card
                    key={org.id}
                    sx={{
                      borderRadius: '10px',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      marginBottom: '15px',
                    }}
                  >
                    <CardContent
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <img
                          src={org.logo || '/path/to/default-image.jpg'}
                          alt={org.name || 'Organization Logo'}
                          style={{
                            objectFit: 'cover',
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                          }}
                        />
                        <Box>
                          <Typography variant="h6" sx={{ color: '#333', fontWeight: 'bold' }}>
                            {org.name || 'No Name Provided'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#777' }}>
                            Email: {org.email || 'No Email Provided'}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#777' }}>
                            Location: {org.location || 'Location missing'}
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        variant="contained"
                        onClick={() => handleViewDetail(org.id)}
                        sx={{
                          backgroundColor: '#1e88e5',
                          color: 'white',
                          textTransform: 'none',
                          '&:hover': {
                            backgroundColor: '#166bb7',
                          },
                        }}
                      >
                        View
                      </Button>
                    </CardContent>
                  </Card>
                )
                )}
              </ul> */}
                    <div className="p-3 bg-slate-100 text-black rounded-lg">
                      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs uppercase bg-slate-100">
                            <tr>
                              <th className="px-6 py-3">Profile Pic</th>
                              <th className="px-6 py-3">Name</th>
                              <th className="px-6 py-3">Email</th>
                              <th className="px-6 py-3">Location</th>
                              <th className="px-6 py-3">Kyc Status</th>
                              <th className="px-6 py-3">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {organizationData.length > 0 ? (
                              organizationData.map((org) => (
                                <tr
                                  key={org.id}
                                  className="border-b bg-slate-50 border-slate-300"
                                >
                                  <td className="px-6 py-4">
                                    <img
                                      src={org.profilePicAWSS3URL}
                                      alt="Profile Pic"
                                      className="w-16 h-16 rounded-full"
                                    />
                                  </td>
                                  <td className="px-6 py-4">
                                    {org.companyName || "N/A"}
                                  </td>
                                  <td className="px-6 py-4">
                                    {org.email || "N/A"}
                                  </td>
                                  <td className="px-6 py-4">
                                    {org.locality + ", " + org.location ||
                                      "N/A"}
                                  </td>
                                  <td className="px-6 py-4">{org.kycStatus}</td>
                                  <td className="px-6 py-4">
                                    <button
                                      className="font-medium text-blue-500 hover:underline mr-2"
                                      onClick={() => handleViewDetail(org.id)}
                                    >
                                      View
                                    </button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan="4"
                                  className="px-6 py-4 text-center text-gray-400"
                                >
                                  No organizations available
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Controls */}
                      <nav className="flex justify-between items-center pt-4">
                        <span className="text-sm font-normal">
                          Showing{" "}
                          <span className="font-semibold">{currentPage}</span>{" "}
                          of <span className="font-semibold">{totalPages}</span>
                        </span>
                        <ul className="inline-flex items-center -space-x-px">
                          <li>
                            <button
                              onClick={handlePreviousPage}
                              disabled={currentPage === 0}
                              className="block px-3 py-2 leading-tight text-white bg-orange-500 rounded-l-lg border border-orange-600 hover:bg-orange-400 hover:text-white"
                            >
                              Prev
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={handleNextPage}
                              disabled={currentPage === totalPages - 1}
                              className="block px-3 py-2 leading-tight text-white bg-blue-700 rounded-r-lg border border-blue-800 hover:bg-blue-600 hover:text-white"
                            >
                              Next
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                  {popupDetails && (
                    <DetailPopup
                      open={openPopup}
                      onClose={handleClosePopup}
                      details={popupDetails}
                      handleKyc={handleKyc}
                    />
                  )}
                </>
              )}

            {selectedOption === "User List" && <UserList />}


            {selectedOption === "Candidate" && (
              <Grid item xs={12}>
                {data.Candidate.length > 0 ? (
                  <div className="p-3 bg-slate-100 text-black rounded-lg">
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                      <table className="w-full h-full text-sm text-left table-fixed">
                        <thead className="text-xs uppercase bg-slate-100">
                          <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.Candidate.map((candidate, index) => (
                            <tr key={index} className="border-b bg-slate-50 border-slate-300">
                              <td className="px-6 py-4">{candidate.name}</td>
                              <td className="px-6 py-4">{candidate.id}</td>
                              <td className="px-6 py-4">
                                <button className="font-medium text-blue-500 hover:underline mr-2">
                                  View Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <Typography variant="body1">No candidates found.</Typography>
                )}
              </Grid>
            )}

            {selectedOption === "Reported Jobs" && (
              <>
                {loading ? (
                  <Grid item xs={12}>
                    <Typography variant="body1">Loading reported jobs...</Typography>
                  </Grid>
                ) : error ? (
                  <Grid item xs={12}>
                    <Typography variant="body1" color="error">
                      {error}
                    </Typography>
                  </Grid>
                ) : reportedJobs.length > 0 ? (

                  <div className="p-3 bg-slate-100 text-black rounded-lg w-full h-full">
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-w-full">
                      <table className="w-full text-sm text-center table-auto">
                        <thead className="text-xs uppercase bg-slate-100 ">
                          <tr>
                            <th scope="col" className="px-8 py-3 w-24 ">Job Id</th>
                            <th scope="col" className="px-8 py-3 w-24" >Organization Id</th>
                            <th scope="col" className="px-6 py-3">Organization Name</th>
                            <th scope="col" className="px-6 py-3">Job Title</th>
                            <th scope="col" className="px-6 py-3">Job Location</th>
                            <th scope="col" className="px-6 py-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportedJobs.map((data, jobId) => (
                            <tr key={jobId} className="border-b bg-slate-50 border-slate-300">
                              <td className="px-8 py-4">{data.jobId}</td>
                              <td className="px-8 py-4">{data.orgId}</td>
                              <td className="px-6 py-4">{data.orgName}</td>
                              <td className="px-6 py-4">{data.jobTitle}</td>
                              <td className="px-6 py-4">{data.location}</td>
                              <td >
                                <button
                                  className="font-medium text-blue-500 hover:underline mr-2"
                                  onClick={() => handleReportedJobsViewDetails(data)}
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <Grid item xs={12}>
                    <Typography variant="body1">No reported jobs found.</Typography>
                  </Grid>
                )}


                {selectedJob && selectedJob.reportedDetails && (


                  <Modal
                    open={ReportedJobsPopupOpen}
                    onClose={handleRJClosePopup}
                    aria-labelledby="job-details-modal"
                    aria-describedby="job-details-modal-description"
                  >


                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="p-3 bg-slate-100 text-black rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">

                        <div className="flex-1 relative overflow-x-auto shadow-md sm:rounded-lg max-h-[80vh] overflow-y-auto">
                          <table className="w-full text-sm">
                            <thead className="text-xs uppercase bg-slate-100 sticky top-0">
                              <tr>
                                <th scope="col" className="px-6 py-3">Job Id</th>
                                <th scope="col" className="px-6 py-3">Jobseeker Id</th>
                                <th scope="col" className="px-6 py-3">Jobseeker Name</th>
                                <th scope="col" className="px-6 py-3">Mobile number</th>

                                <th scope="col" className="px-6 py-3">issueType</th>

                              </tr>
                            </thead>
                            <tbody>
                              {selectedJob.reportedDetails.map((detail
                              ) => (
                                <>
                                  <tr key={detail.jobseekerId
                                  } className="border-b bg-slate-50 border-slate-300">
                                    <td className="px-6 py-4">{selectedJob.jobId}</td>
                                    <td className="px-6 py-4">{detail.jobseekerId}</td>
                                    <td className="px-6 py-4">{detail.jobseekerId}</td>
                                    <td className="px-6 py-4">{detail.jobseekerId}</td>

                                    <td className="px-6 py-4">{detail.issueType.issueType}</td>
                                  </tr>
                                </>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="mt-4 flex justify-center items-center">
                          <Button variant="contained" color="primary" onClick={handleRJClosePopup}>
                            Close
                          </Button>
                        </div>
                      </div>
                    </div>


                  </Modal>
                )}
              </>
            )}




            {/* {selectedOption === "Reported Jobs" && (
              <>
                {loading ? (
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      Loading reported jobs...
                    </Typography>
                  </Grid>
                ) : error ? (
                  <Grid item xs={12}>
                    <Typography variant="body1" color="error">
                      {error}
                    </Typography>
                  </Grid>
                ) : reportedJobs.length > 0 ? (
                  reportedJobs.map((job, index) => (
                    <Grid item xs={12} key={index}>
                      <Card
                        sx={{
                          borderRadius: "10px",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                          marginBottom: "10px",
                        }}
                      >
                        <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Job Name: { }
                          </Typography>
                          <button
                            className="font-medium text-blue-500 hover:underline mr-2"
                            onClick={() => {
                            }}
                          >
                            View Details
                          </button>

                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      No reported jobs found.
                    </Typography>
                  </Grid>
                )}
              </>
            )} */}

            {selectedOption === "Subscription" && (
              // Currently using
              //   <div class="grid lg:grid-cols-3 px-8 gap-10 text-zinc-800 mt-10">
              //     <div class="flex flex-col items-center bg-slate-100 p-8 rounded-lg shadow-lg max-w-sm">
              //         <div>
              //             <h2 class="font-extrabold text-3xl text-center mb-2">Starter</h2>
              //             <p class="opacity-60 text-center">For the individual and small teams
              //             </p>
              //             <div class="flex flex-col items-center my-8">
              //                 <p class="font-extrabold text-4xl">₹ 2199
              //                 </p>
              //                 <p class="text-sm opacity-60">/month
              //                 </p>
              //             </div>
              //         </div>
              //         <div class="flex flex-col gap-1">
              //             <p class="flex items-center text-sm"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              //                     fill="currentColor" aria-hidden="true" class="w-4 h-4 mr-2">
              //                     <path fill-rule="evenodd"
              //                         d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
              //                         clip-rule="evenodd"></path>
              //                 </svg>
              //                 <b>Trending Dashboard</b><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
              //                     aria-hidden="true" class="w-4 h-4 ml-1 fill-orange-300">
              //                     <path fill-rule="evenodd"
              //                         d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z"
              //                         clip-rule="evenodd"></path>
              //                 </svg>
              //             </p>
              //             <p class="flex items-center text-sm"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              //                     fill="currentColor" aria-hidden="true" class="w-4 h-4 mr-2">
              //                     <path fill-rule="evenodd"
              //                         d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
              //                         clip-rule="evenodd"></path>
              //                 </svg>
              //                 <b>10 Keywords</b>
              //             </p>
              //             <p class="flex items-center text-sm"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              //                     fill="currentColor" aria-hidden="true" class="w-4 h-4 mr-2">
              //                     <path fill-rule="evenodd"
              //                         d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
              //                         clip-rule="evenodd"></path>
              //                 </svg>
              //                 <b>100 Accounts Tracking</b>
              //             </p>
              //             <p class="flex items-center text-sm"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              //                     fill="currentColor" aria-hidden="true" class="w-4 h-4 mr-2">
              //                     <path fill-rule="evenodd"
              //                         d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
              //                         clip-rule="evenodd"></path>
              //                 </svg>
              //                 <b>3 Users</b>
              //             </p>
              //             <p class="flex items-center text-sm"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              //                     fill="currentColor" aria-hidden="true" class="w-4 h-4 mr-2">
              //                     <path fill-rule="evenodd"
              //                         d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
              //                         clip-rule="evenodd"></path>
              //                 </svg> Basic Support
              //             </p>
              //             <div class="flex justify-center mt-8 ">
              //                 <button class="border px-4 py-2 border-violet-400 border-4 hover:bg-violet-100 rounded-xl">Subscribe Now
              //                     </button>
              //             </div>
              //         </div>
              //     </div>
              //     <div
              //         class="flex flex-col items-center bg-gradient-to-br from-blue-100 via-orange-100 to-purple-100 p-8 rounded-lg shadow-lg relative border-8 border-orange-200 max-w-sm">
              //         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
              //             class="w-20 h-20 absolute -top-11 -left-11 fill-red-400">
              //             <path fill-rule="evenodd"
              //                 d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z"
              //                 clip-rule="evenodd"></path>
              //         </svg>
              //         <p class="mono text-sm absolute -top-4 bg-red-400 text-zinc-100 py-0.5 px-2 font-bold tracking-wider rounded">
              //             POPULAR
              //         </p>
              //         <div>
              //             <div class="flex gap-4 justify-center">
              //                 <p class="font-extrabold text-3xl mb-2">Pro

              //                 </p>
              //             </div>
              //             <p class="opacity-60 text-center">For agencies and businesses

              //             </p>
              //             <p class="opacity-60 text-center">
              //             </p>
              //             <div class="flex gap-4 justify-center">
              //                 <div class="flex flex-col items-center my-8">
              //                     <p class="font-extrabold text-4xl">₹ 5999

              //                     </p>
              //                     <p class="text-sm opacity-60">/month

              //                     </p>
              //                 </div>
              //             </div>
              //         </div>
              //         <div class="flex flex-col gap-1">
              //             <p class="flex items-center text-sm"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              //                     fill="currentColor" aria-hidden="true" class="w-4 h-4 mr-2">
              //                     <path fill-rule="evenodd"
              //                         d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
              //                         clip-rule="evenodd"></path>
              //                 </svg>
              //                 <b>Trending Dashboard</b><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
              //                     aria-hidden="true" class="w-4 h-4 ml-1 fill-orange-300">
              //                     <path fill-rule="evenodd"
              //                         d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z"
              //                         clip-rule="evenodd"></path>
              //                 </svg>
              //             </p>
              //             <p class="flex items-center text-sm"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              //                     fill="currentColor" aria-hidden="true" class="w-4 h-4 mr-2">
              //                     <path fill-rule="evenodd"
              //                         d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
              //                         clip-rule="evenodd"></path>
              //                 </svg>
              //                 <b>25 Keywords</b>
              //             </p>
              //             <p class="flex items-center text-sm"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              //                     fill="currentColor" aria-hidden="true" class="w-4 h-4 mr-2">
              //                     <path fill-rule="evenodd"
              //                         d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
              //                         clip-rule="evenodd"></path>
              //                 </svg>
              //                 <b>250 Accounts Tracking</b>
              //             </p>
              //             <p class="flex items-center text-sm"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              //                     fill="currentColor" aria-hidden="true" class="w-4 h-4 mr-2">
              //                     <path fill-rule="evenodd"
              //                         d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
              //                         clip-rule="evenodd"></path>
              //                 </svg>
              //                 <b>10 Users</b>
              //             </p>
              //             <p class="flex items-center text-sm"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              //                     fill="currentColor" aria-hidden="true" class="w-4 h-4 mr-2">
              //                     <path fill-rule="evenodd"
              //                         d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
              //                         clip-rule="evenodd"></path>
              //                 </svg>
              //                 <b>Early Beta Features&nbsp;</b>
              //             </p>
              //             <p class="flex items-center text-sm"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              //                     fill="currentColor" aria-hidden="true" class="w-4 h-4 mr-2">
              //                     <path fill-rule="evenodd"
              //                         d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
              //                         clip-rule="evenodd"></path>
              //                 </svg> Premium Support
              //             </p>
              //             <div class="flex justify-center mt-8">
              //                 <button class="px-4 py-2 border-violet-400 border-4 hover:bg-violet-100 rounded-xl">Subscribe Now
              //                     </button>
              //             </div>
              //         </div>
              //     </div>
              //     <div class="flex flex-col items-center bg-slate-100 p-8 rounded-lg shadow-lg max-w-sm">
              //         <div>
              //             <h2 class="font-extrabold text-3xl text-center mb-2">Custom</h2>
              //             <p class="opacity-60 text-center">For the individual and small teams
              //             </p>
              //             <div class="flex flex-col items-center my-8">
              //                 <p class="font-extrabold text-4xl">₹ 9999
              //                 </p>
              //                 <p class="text-sm opacity-60">/month
              //                 </p>
              //             </div>
              //         </div>
              //         <div class="flex flex-col gap-1">
              //             <p class="flex items-center text-sm"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              //                     fill="currentColor" aria-hidden="true" class="w-4 h-4 mr-2">
              //                     <path fill-rule="evenodd"
              //                         d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
              //                         clip-rule="evenodd"></path>
              //                 </svg>
              //                 <b>Trending Dashboard</b><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
              //                     aria-hidden="true" class="w-4 h-4 ml-1 fill-orange-300">
              //                     <path fill-rule="evenodd"
              //                         d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z"
              //                         clip-rule="evenodd"></path>
              //                 </svg>
              //             </p>
              //             <p class="flex items-center text-sm"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              //                     fill="currentColor" aria-hidden="true" class="w-4 h-4 mr-2">
              //                     <path fill-rule="evenodd"
              //                         d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
              //                         clip-rule="evenodd"></path>
              //                 </svg>
              //                 <b>10 Keywords</b>
              //             </p>
              //             <p class="flex items-center text-sm"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              //                     fill="currentColor" aria-hidden="true" class="w-4 h-4 mr-2">
              //                     <path fill-rule="evenodd"
              //                         d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
              //                         clip-rule="evenodd"></path>
              //                 </svg>
              //                 <b>100 Accounts Tracking</b>
              //             </p>
              //             <p class="flex items-center text-sm"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              //                     fill="currentColor" aria-hidden="true" class="w-4 h-4 mr-2">
              //                     <path fill-rule="evenodd"
              //                         d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
              //                         clip-rule="evenodd"></path>
              //                 </svg>
              //                 <b>3 Users</b>
              //             </p>
              //             <p class="flex items-center text-sm"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              //                     fill="currentColor" aria-hidden="true" class="w-4 h-4 mr-2">
              //                     <path fill-rule="evenodd"
              //                         d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
              //                         clip-rule="evenodd"></path>
              //                 </svg> Basic Support
              //             </p>
              //             <div class="flex justify-center mt-8 ">
              //                 <button class="border px-4 py-2 border-violet-400 border-4 hover:bg-violet-100 rounded-xl">Subscribe Now
              //                     </button>
              //             </div>
              //         </div>
              //     </div>
              // </div>
              <div className="p-3 bg-slate-100 text-black rounded-lg">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  <table className="w-full h-full text-sm text-left table-fixed">
                    <thead className="text-xs uppercase bg-slate-100">
                      <tr>
                        <th className="px-6 py-3">Employer Name</th>
                        <th className="px-6 py-3">Subscription Type</th>
                        <th className="px-6 py-3">Subscription Name</th>
                        <th className="px-6 py-3">Requested On</th>
                        <th className="px-6 py-3">Subscription Status</th>
                        <th classname="px-6 py-3">Approve Request</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* {subscriptionData.length > 0 ? (
                        subscriptionData.map((org) => ( */}
                      {Object.entries(subscriptionData).map(([orgId, org]) => (
                        <tr key={orgId} className="border-b bg-slate-50 border-slate-300">
                          <td className="px-6 py-4">{org.employerName || 'Null'}</td>
                          <td className="px-6 py-4">{org.subscriptionType || 'Null'}</td>
                          <td className="px-6 py-4">{org.subscriptionName || 'Null'}</td>
                          <td className="px-6 py-4">{org.subscriptionRequestedOn || 'Null'}</td>
                          <td className="px-6 py-4">{org.subscriptionStatus || 'Null'}</td>
                          <td className="px-6 py-4">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded"
                              onClick={() => {

                                if (!approvedbutton.includes(org.orgId)) {

                                  handleApprove(org.orgId, org.requestId);

                                }

                              }}
                              disabled={approvedbutton.includes(org.orgId)}

                            > {approvedbutton.includes(org.orgId) ? 'Approved' : 'Approve'}
                            </button>
                          </td>
                        </tr>
                      ))}

                      {/* from here<tr key={org.id} className="border-b bg-gray-800 border-gray-700">
                            <td className="px-6 py-4">CODEFUSIONAI LIMITE</td>
                            <td className="px-6 py-4">IND_BASIC</td>
                            <td className="px-6 py-4">Individual</td>
                            <td className="px-6 py-4">2024-09-26T05:03:14</td>  
                            <td className="px-6 py-4">REQUESTED</td>
                            <td className="px-6 py-4">
                                <button 
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={() => handleApprove(0,209)} 
                                > Approve
                                </button>
                            </td>          

                          </tr>
                          <tr key={org.id} className="border-b bg-gray-800 border-gray-700">
                            <td className="px-6 py-4">CODEFUSIONAI LIMITE</td>
                            <td className="px-6 py-4">IND_BASIC</td>
                            <td className="px-6 py-4">Individual</td>
                            <td className="px-6 py-4">2024-09-26T05:03:14</td>  
                            <td className="px-6 py-4">REQUESTED</td>
                            <td className="px-6 py-4">
                                <button 
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={() => handleApprove(org.id, org.subscriptionRequestId)} 
                                > Approve
                                </button>
                            </td>
                          </tr>
                          <tr key={org.id} className="border-b bg-gray-800 border-gray-700">
                            <td className="px-6 py-4">CODEFUSIONAI LIMITE</td>
                            <td className="px-6 py-4">IND_BASIC</td>
                            <td className="px-6 py-4">Individual</td>
                            <td className="px-6 py-4">2024-09-26T05:03:14</td>  
                            <td className="px-6 py-4">REQUESTED</td>
                            <td className="px-6 py-4">
                                <button 
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={() => handleApprove(org.id, org.subscriptionRequestId)} 
                                > Approve
                                </button>
                            </td>
                          </tr>
                          <tr key={org.id} className="border-b bg-gray-800 border-gray-700">
                            <td className="px-6 py-4">CODEFUSIONAI LIMITE</td>
                            <td className="px-6 py-4">IND_BASIC</td>
                            <td className="px-6 py-4">Individual</td>
                            <td className="px-6 py-4">2024-09-26T05:03:14</td>  
                            <td className="px-6 py-4">REQUESTED</td>
                            <td className="px-6 py-4">
                                <button 
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={() => handleApprove(org.id, org.subscriptionRequestId)} 
                                > Approve
                                </button>
                            </td>
                          </tr>
                          <tr key={org.id} className="border-b bg-gray-800 border-gray-700">
                            <td className="px-6 py-4">CODEFUSIONAI LIMITE</td>
                            <td className="px-6 py-4">IND_BASIC</td>
                            <td className="px-6 py-4">Individual</td>
                            <td className="px-6 py-4">2024-09-26T05:03:14</td>  
                            <td className="px-6 py-4">REQUESTED</td>
                            <td className="px-6 py-4">
                                <button 
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={() => handleApprove(org.id, org.subscriptionRequestId)} 
                                > Approve
                                </button>
                            </td>
                          </tr>
                          <tr key={org.id} className="border-b bg-gray-800 border-gray-700">
                            <td className="px-6 py-4">CODEFUSIONAI INDIA SERVICE LIMITED</td>
                            <td className="px-6 py-4">IND_BASIC</td>
                            <td className="px-6 py-4">Individual</td>
                            <td className="px-6 py-4">2024-09-26T05:03:14</td>  
                            <td className="px-6 py-4">REQUESTED</td>
                            <td className="px-6 py-4">
                                <button 
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={() => handleApprove(org.id, org.subscriptionRequestId)} 
                                > Approve
                                </button>
                            </td>
                          </tr> till here*/}
                      {/* ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-6 py-4 text-center text-gray-400">No organizations available</td>
                        </tr>
                      )} */}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedOption === 'Pending JobPostings' && (


              <div className="p-3 bg-slate-100 text-black rounded-lg">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  <table className="w-full h-full text-sm text-center table-fixed">
                    <thead className="text-xs uppercase bg-slate-100">
                      <tr>
                        <th className="px-8 py-3 w-24">Job Id</th>
                        <th className="px-6 py-3 w-24">Org Id</th>
                        <th className="px-6 py-3">Company Name</th>
                        <th className="px-6 py-3">Created on</th>
                        <th className="px-6 py-3">Location</th>
                        <th className="px-6 py-3">Locality</th>
                        <th classname="px-6 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobpostings.map((data) => (
                        <tr key={data.jobId} className="border-b bg-slate-50 border-slate-300">
                          <td className="px-6 py-4">{data.jobId}</td>
                          <td className="px-6 py-4">{data.organizationId}</td>
                          <td className="px-6 py-4">{data.companyName}</td>
                          <td className="px-6 py-4">{data.createdOn}</td>
                          <td className="px-6 py-4">{data.location}</td>
                          <td className="px-6 py-4">{data.locality}</td>
                          <td >
                            <button
                              className="font-medium text-blue-500 hover:underline mr-2"

                              onClick={() => handleJobpostingsView(data)}

                            >
                              View
                            </button>

                          </td>
                        </tr>
                      ))}

                    </tbody>
                  </table>
                </div>

              </div>
            )}

            {verifyJob && (


              <Modal
                open={jobPostingsPopup}
                onClose={handleJobPostingsClosePopup}
                aria-labelledby="job-details-modal"
                aria-describedby="job-details-modal-description"
              >


                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="p-3 bg-slate-100 text-black rounded-lg w-full max-w-6xl max-h-[80vh] flex flex-col">

                    <div className="flex-1 relative overflow-x-auto shadow-md sm:rounded-lg max-h-[80vh] overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="text-xs uppercase bg-slate-100 sticky top-0">
                          <tr>
                            <th scope="col" className="px-6 py-3">Job Id</th>
                            <th scope="col" className="px-6 py-3">Job Title</th>
                            <th scope="col" className="px-6 py-3">Mobile number</th>
                            <th scope="col" className="px-6 py-3">work Timings</th>
                            <th scope="col" className="px-6 py-3">work Mode</th>
                            <th scope="col" className="px-6 py-3">Benefits</th>

                            <th scope="col" className="px-6 py-3">Max salary</th>
                            <th scope="col" className="px-6 py-3">Min salary</th>
                            <th scope="col" className="px-6 py-4">Job Description</th>

                          </tr>
                        </thead>
                        <tbody>

                          <>
                            <tr key={verifyJob.jobId
                            } className="border-b bg-slate-50 border-slate-300">
                              <td className="px-6 py-4">{verifyJob.jobId}</td>
                              <td className="px-6 py-4">{verifyJob.jobTitle}</td>
                              <td className="px-6 py-4">{verifyJob.contactNumber}</td>
                              <td className="px-6 py-4">{verifyJob.workTimings}</td>
                              <td className="px-6 py-4">{verifyJob.workMode}</td>
                              <td className="px-6 py-4">{verifyJob.benefits}</td>

                              <td className="px-6 py-4">{verifyJob.salaryMax}</td>
                              <td className="px-6 py-4">{verifyJob.salaryMin}</td>
                              <td className="px-6 py-4">
                                <div className="max-h-24 overflow-y-auto p-2 bg-slate-50 border rounded-lg">
                                  {verifyJob.jobDescription}
                                </div>
                              </td>

                            </tr>
                          </>

                        </tbody>
                      </table>
                    </div>

                    <div className="mt-4 flex justify-center items-center">
                      <Button variant="contained" color="primary" onClick={handleJobPostingsClosePopup}>
                        Close
                      </Button>
                    </div>
                  </div>
                </div>


              </Modal>
            )}


          </Grid>
        </Box>
      </Box >
    </>
  );
};

export default HomePage;
