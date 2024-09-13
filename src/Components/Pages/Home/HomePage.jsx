import React, { useState, useEffect } from 'react';
import { Card, CardContent, Button, Typography, Grid, Container, Select, MenuItem, FormControl, InputLabel, TextField, Box, Menu, Pagination, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import UserList from '../../UserList';

import { Layout } from 'antd';
import { Header } from 'antd/es/layout/layout';


const { Sider } = Layout;

const HomePage = () => {
  const [selectedOption, setSelectedOption] = useState('Organization');
  const [reportedJobs, setReportedJobs] = useState([]);
  const [org, setOrg] = useState([]);
  const [kycStatus, setKycStatus] = useState('Kyc pending'); // Default choice
  const navigate = useNavigate();
  const location = useLocation();
  const [filter, setFilter] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [openPopup, setOpenPopup] = useState(false);
  const [popupDetails, setPopupDetails] = useState({});
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [authToken, setAuthToken] = useState(location.state?.authToken || '');
  const menuItems = ['Organization', 'Candidate', 'Reported Jobs', 'User List', 'Subscription'];
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = org.slice(startIndex, endIndex);
  

  const data = {
    Candidate: [
      { id: 'CAND001', name: 'John Doe' },
      { id: 'CAND002', name: 'Jane Smith' },
      { id: 'CAND003', name: 'Michael Johnson' },
      { id: 'CAND004', name: 'Emily Davis' },
      { id: 'CAND005', name: 'Sarah Wilson' },
      { id: 'CAND006', name: 'James Brown' },
      { id: 'CAND007', name: 'Patricia Garcia' },
      { id: 'CAND008', name: 'Robert Miller' },
      { id: 'CAND009', name: 'Linda Martinez' },
      { id: 'CAND010', name: 'David Anderson' },
    ]
  };

  useEffect(() => {
    const fetchReportedJobs = async () => {
      if (selectedOption === 'ReportedJobs') {
        try {
          const response = await fetch('https://dev.kamai.ai/admin/issue-type', {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            },
          });
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setReportedJobs(data.length ? data : null);  
        } catch (error) {
          console.error('Error fetching reported jobs:', error);
          setReportedJobs(null);
        }
      }
    };
  
    fetchReportedJobs();
  
    return () => {
    };
  }, [selectedOption, authToken]);

  useEffect(() => {
    const fetchOragization = async (pageNumber) => {
      if (selectedOption === 'Organization') {
        try {
          const response = await fetch(`http://k8s-developm-ingressa-1c98111f81-862727769.ap-south-1.elb.amazonaws.com/employer/loadAllOrgs?page=${pageNumber}&size=10&sortBy=createdOn&sortDir=desc`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
            }
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
  
          const data = await response.json();
          // setOrg(data.content.length ? data.content : []);  
          setOrg(data.content);
          setTotalPages(data.totalPages);  
        } catch (error) {
          console.error('Error fetching organization:', error);
          setOrg([]);  
        }
      }
    };
    
    fetchOragization(currentPage);
  }, [selectedOption, authToken, currentPage]);

  useEffect(() => {
    console.log('Organizations state:', org);
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
        if (typeof value === 'string') {
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
      <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: '15px', padding: '20px' } }}>
      <DialogTitle sx={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: '#3f51b5' }}>
        Details
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <Typography variant="body1" sx={{ fontSize: '18px' }}>
            <strong>ID:</strong> {details.id}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '18px' }}>
            <strong>Recruiter Name:</strong> {details.name}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '18px' }}>
            <strong>Company Name:</strong> {details.companyName}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '18px' }}>
            <strong>Email:</strong> {details.email}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '18px' }}>
            <strong>Mobile Number:</strong> {details.mobileNumber}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: '18px' }}>
            <strong>Address:</strong> {details.address}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Typography variant="body1" sx={{ fontSize: '18px' }}>
              <strong>KYC Status:</strong> {details.kycStatus}
            </Typography>
            <Button variant="outlined" color="primary" sx={{ borderRadius: '8px', padding: '5px 10px' }}>
              Update KYC
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button onClick={onClose} color="primary" variant="contained" sx={{ borderRadius: '10px', padding: '10px 20px' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
    );
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleViewDetail = async(orgId) => {
    console.log("orgId :: ", orgId)
    try{
      const response = await fetch(`http://k8s-developm-ingressa-1c98111f81-862727769.ap-south-1.elb.amazonaws.com/employer/organization/${orgId}`, {
        method: 'GET',
        headers: {
          "Content-Type" : "application/json",
          Authorization: `Bearer ${authToken}`,
        }
      })
      if(response.ok){
        const data = await response.json();
        setPopupDetails(data);
        setOpenPopup(true);
      }
    }catch(error){
      console.log("error : ", error);
    }
  }

  return (
    <>
      <Header
        style={{
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 30px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          backgroundColor: '#f8f8f8',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <img
          src={require('../../../assets/logo/Kamai.png')}
          alt="Kamai"
          style={{ height: '40px' }}
        />

      <Typography
        strong
        style={{
          color: '#080808',
          fontSize: '16px',
          fontWeight:"bold"
        }}
      >
        Admin Dashboard
      </Typography>

      </Header>

      <Box sx={{ display: 'flex', height: '91vh' }}>
        <Sider width={200} style={{ backgroundColor: 'orange', padding: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
          {/* <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>Menu</Typography> */}
          {menuItems.map((item) => (
            <Typography
              key={item}
              variant="body1"
              style={{
                padding: '10px 20px',
                cursor: 'pointer',
                borderRadius: '10px',
                marginBottom: '10px',
                backgroundColor: selectedOption === item ? '#2A4190' : 'transparent',
                color: selectedOption === item ? 'white' : 'black',
                transition: 'color 0.3s',
              }}
              onClick={() => handleMenuClick(item)}
              onMouseEnter={(e) => (e.target.style.color = 'white')}
              onMouseLeave={(e) => (e.target.style.color = selectedOption === item ? 'white' : 'black')}
            >
              {item}
            </Typography>
          ))}
        </Sider>

        <Box sx={{ flexGrow: 1, padding: '20px', overflow: 'hidden' }}>
          <Grid container spacing={3} sx={{ height: '100%', overflowY: 'auto' }}>
            {/* Organization */}
            {selectedOption === 'Organization' && (
              <>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'center' }}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      placeholder="Search by name, type, etc."
                      value={filter}
                      onChange={handleFilterChange}
                      sx={{ bgcolor: 'white', borderRadius: '5px' }}
                    />
                    <FormControl variant="outlined" sx={{ minWidth: '140px' }}>
                      <InputLabel>Salary</InputLabel>
                      <Select
                        label="Salary"
                        sx={{ bgcolor: 'white', borderRadius: '5px' }}
                      >
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value="0-10000">0-10000</MenuItem>
                        <MenuItem value="10001-20000">10001-20000</MenuItem>
                        <MenuItem value="20001-30000">20001-30000</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl variant="outlined" sx={{ minWidth: '140px' }}>
                      <InputLabel>Package</InputLabel>
                      <Select
                        label="Package"
                        sx={{ bgcolor: 'white', borderRadius: '5px' }}
                      >
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value="0-10000">0-10000</MenuItem>
                        <MenuItem value="10001-20000">10001-20000</MenuItem>
                        <MenuItem value="20001-30000">20001-30000</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl variant="outlined" sx={{ minWidth: '140px' }}>
                      <InputLabel>KYC Status</InputLabel>
                      <Select
                        label="KYC Status"
                        sx={{ bgcolor: 'white', borderRadius: '5px' }}
                      >
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value={10}>KYC pending</MenuItem>
                        <MenuItem value={20}>KYC done</MenuItem>
                        <MenuItem value={30}>KYC verified</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>

                <Grid item xs={12}>
      {org.length > 0 ? (
        <>
          {filterData(org).map((item) => (
            <Card key={item.id} sx={{ borderRadius: '15px', boxShadow: "0 6px 12px rgba(0,0,0,0.1)", marginBottom: '20px' }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM8a2MUfdySK0SpBsRoLJ7GvrRP0mMIkixcw&s"
                    alt="Profile Pic"
                    style={{ width: 60, height: 60, borderRadius: '50%', border: '2px solid #ccc' }}
                  />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                      Name: {item.companyName}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#555' }}>
                      Email: {item.email}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#555' }}>
                      Mobile: {item.username}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'justify' }}>
                  <Typography variant="body2" sx={{ color: '#555' }}>
                    Location: {item.location}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#555' }}>
                    Locality: {item.locality}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#555' }}>
                    Company Type: {item.orgType}
                  </Typography>
                </Box>
                <Box>
                  <Button
                    onClick={() => handleViewDetail(item.id)}
                    variant="contained"
                    color="primary"
                    sx={{ marginBottom: '10px', padding: '8px 16px', borderRadius: '10px', textTransform: 'none' }}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
          <Pagination
            count={totalPages} // Calculate the total number of pages
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
          />
        </>
      ) : (
        <>
          <Typography variant="body1" sx={{ color: '#777', textAlign: 'center' }}>
            No organization data available.
          </Typography>
          <Pagination
            count={totalPages} // Calculate the total number of pages
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
          />
        </>
      )}
      <DetailPopup open={openPopup} onClose={handleClosePopup} details={popupDetails} />
    </Grid>

              </>
            )}


            {selectedOption === 'User List' && <UserList />}

            {selectedOption === 'Candidate' && (
              <Grid item xs={12}>
                {data.Candidate.length > 0 ? (
                  data.Candidate.map((candidate) => (
                    <Card key={candidate.id} sx={{ borderRadius: '10px', boxShadow: "0 4px 8px rgba(0,0,0,0.1)", marginBottom: '10px' }}>
                      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Name: {candidate.name}</Typography>
                          <Typography variant="body1" sx={{ color: '#777' }}>ID: {candidate.id}</Typography>
                        </Box>
                        <Button variant="contained" sx={{ backgroundColor: '#1e88e5', color: 'white' }}>VIEW</Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Typography variant="body1">No candidates found.</Typography>
                )}
              </Grid>
            )}

            {selectedOption === 'Reported Jobs' && (
              <Grid item xs={12}>
                {reportedJobs ? (
                  reportedJobs.map((job, index) => (
                    <Card key={index} sx={{ borderRadius: '10px', boxShadow: "0 4px 8px rgba(0,0,0,0.1)", marginBottom: '10px' }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Reported By: {job.reportedByName}</Typography>
                        <Typography variant="body1" sx={{ color: '#777' }}>Reason: {job.issueType}</Typography>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Typography variant="body1">No reported jobs found.</Typography>
                )}
              </Grid>
            )}

            {selectedOption === 'Subscription' && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Card sx={{
                    padding: '15px',
                    borderRadius: '15px',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                    border: '1px solid yellow',
                    marginTop: '20px',
                    marginLeft: '20px',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      transition: 'transform 0.3s ease-in-out',
                    },
                  }}>
                    <CardContent>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>1 Month Plan</Typography>
                      <Typography variant="body1" sx={{ marginTop: '10px', color: '#777' }}>Best for 1 or more opening</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>Rs. 2199</Typography>
                        <Box sx={{
                          backgroundColor: '#f0c8a0',
                          padding: '2px 8px',
                          borderRadius: '5px',
                          marginLeft: '10px',
                          fontSize: '14px',
                          color: '#555',
                        }}>
                          Rs. 2199/Month
                        </Box>
                      </Box>
                      <Button variant="contained" sx={{ backgroundColor: 'orange', color: 'white', marginTop: '10px' }}>Upgrade at Rs. 2000</Button>
                      <ul style={{ marginTop: '10px', paddingLeft: '20px', color: '#555' }}>
                        <li>Unlimited number of listings</li>
                        <li>Listings are visible for 30 days</li>
                        <li>One-Time Fee</li>
                        <li>This plan includes 1 job</li>
                        <li>Non-Highlighted Post</li>
                        <li>Posted for 30 days</li>
                      </ul>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Card sx={{
                    padding: '15px',
                    borderRadius: '15px',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                    border: '1px solid yellow',
                    marginTop: '20px',
                    marginLeft: '20px',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      transition: 'transform 0.3s ease-in-out',
                    },
                  }}>
                    <Typography 
                      variant="body2" 
                      sx={{
                        position: 'absolute',
                        top: '56px',
                        right: '-22px',
                        backgroundColor: 'blue',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        fontWeight: 'bold',
                        transform: 'rotate(45deg)',
                        transformOrigin: 'top right',
                        zIndex: 1,
                        width: "90px",
                        textAlign:'center'
                      }}
                    >
                      Popular
                    </Typography>

                    <CardContent>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>3 Month Plan</Typography>
                      <Typography variant="body1" sx={{ marginTop: '10px', color: '#777' }}>Ideal for multiple openings</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>Rs. 5999</Typography>
                        <Box sx={{
                          backgroundColor: '#f0c8a0',
                          padding: '2px 8px',
                          borderRadius: '5px',
                          marginLeft: '10px',
                          fontSize: '14px',
                          color: '#555',
                        }}>
                          Rs. 5999/Month
                        </Box>
                      </Box>
                      <Button variant="contained" sx={{ backgroundColor: 'orange', color: 'white', marginTop: '10px' }}>Upgrade at Rs. 5500</Button>
                      <ul style={{ marginTop: '10px', paddingLeft: '20px', color: '#555' }}>
                        <li>Unlimited number of listings</li>
                        <li>Listings are visible for 90 days</li>
                        <li>One-Time Fee</li>
                        <li>This plan includes 3 jobs</li>
                        <li>Non-Highlighted Post</li>
                        <li>Posted for 90 days</li>
                      </ul>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Card sx={{
                    padding: '15px',
                    borderRadius: '15px',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
                    border: '1px solid yellow',
                    marginTop: '20px',
                    marginLeft: '20px',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      transition: 'transform 0.3s ease-in-out',
                    },
                  }}>
                    <CardContent>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>6 Month Plan</Typography>
                      <Typography variant="body1" sx={{ marginTop: '10px', color: '#777' }}>Great for long-term hiring needs</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>Rs. 9999</Typography>
                        <Box sx={{
                          backgroundColor: '#f0c8a0',
                          padding: '2px 8px',
                          borderRadius: '5px',
                          marginLeft: '10px',
                          fontSize: '14px',
                          color: '#555',
                        }}>
                          Rs. 9999/Month
                        </Box>
                      </Box>
                      <Button variant="contained" sx={{ backgroundColor: 'orange', color: 'white', marginTop: '10px', }}>Upgrade at Rs. 9500</Button>
                      <ul style={{ marginTop: '10px', paddingLeft: '20px', color: '#555' }}>
                        <li>Unlimited number of listings</li>
                        <li>Listings are visible for 180 days</li>
                        <li>One-Time Fee</li>
                        <li>This plan includes 6 jobs</li>
                        <li>Non-Highlighted Post</li>
                        <li>Posted for 180 days</li>
                      </ul>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Box> 
      </Box>
    </>
  );
};

export default HomePage;
