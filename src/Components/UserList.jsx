import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Container, Dialog, DialogTitle, DialogContent, IconButton, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const UserList = () => {
  const initialUsers = [
    { name: 'John Doe', mobileNumber: '1234567890', email: 'john@example.com', location: 'New York, NY', tags: ['developer', 'javascript'], profilePic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM8a2MUfdySK0SpBsRoLJ7GvrRP0mMIkixcw&s" },
    { name: 'Jane Smith', mobileNumber: '0987654321', email: 'jane@example.com', location: 'San Francisco, CA', tags: ['designer', 'ux/ui'], profilePic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM8a2MUfdySK0SpBsRoLJ7GvrRP0mMIkixcw&s" },
    { name: 'Will Smith', mobileNumber: '0987654321', email: 'Will@example.com', location: 'San Francisco, CA', tags: ['designer', 'ux/ui'], profilePic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM8a2MUfdySK0SpBsRoLJ7GvrRP0mMIkixcw&s" },
    { name: 'John Smith', mobileNumber: '0987654321', email: 'john@example.com', location: 'San Francisco, CA', tags: ['designer', 'ux/ui'], profilePic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM8a2MUfdySK0SpBsRoLJ7GvrRP0mMIkixcw&s" },
    { name: 'Will Mills', mobileNumber: '0987654321', email: 'mills@example.com', location: 'San Francisco, CA', tags: ['designer', 'ux/ui'], profilePic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM8a2MUfdySK0SpBsRoLJ7GvrRP0mMIkixcw&s" },
    { name: 'Roy Smith', mobileNumber: '0987654321', email: 'roy@example.com', location: 'San Francisco, CA', tags: ['designer', 'ux/ui'], profilePic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM8a2MUfdySK0SpBsRoLJ7GvrRP0mMIkixcw&s" },
    { name: 'Will Deo', mobileNumber: '0987654321', email: 'deo@example.com', location: 'San Francisco, CA', tags: ['designer', 'ux/ui'], profilePic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSM8a2MUfdySK0SpBsRoLJ7GvrRP0mMIkixcw&s" },
  ];

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    if (storedUsers.length === 0) {
      localStorage.setItem('users', JSON.stringify(initialUsers));
      setUsers(initialUsers);
    } else {
      setUsers(storedUsers);
    }
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEditing(true);
    setOpen(true);
  };

  const handleDeleteClick = (email) => {
    const updatedUsers = users.filter((user) => user.email !== email);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    const updatedUsers = users.map((user) =>
      user.email === selectedUser.email ? selectedUser : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    handleClose();
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (upload) => {
      setSelectedUser((prevState) => ({
        ...prevState,
        profilePic: upload.target.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <Container >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>

          <h1 className='font-semibold text-4xl underline font-serif'>User List</h1>

          {/* <FormControl style={{ minWidth: '250px' }} >
            <InputLabel>User Type</InputLabel>
            <Select
              value={filter}
              onChange={handleFilterChange}
              label="User Type"
              style={{height: '50px'}}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="operations_user">Operations User</MenuItem>
              <MenuItem value="operations_manager">Operations Manager</MenuItem>
              <MenuItem value="sales_manager">Sales Manager</MenuItem>
              <MenuItem value="sales_user">Sales User</MenuItem>
              <MenuItem value="account_manager">Account Manager</MenuItem>
              <MenuItem value="kamai_admin">Kamai Admin</MenuItem>
            </Select>
          </FormControl> */}
          <div class="flex flex-col py-0 font-serif">
            <label for="manufacturer" class="text-lg font-medium text-stone-600">User Type</label>
            <select id="manufacturer" class="mt-2 block w-full rounded-md border border-gray-100 bg-gray-100 px-2 py-2 shadow-sm outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50">
              <option>Operations User</option>
              <option>Operations Manager</option>
              <option>Sales Manager</option>
              <option>Sales User</option>
              <option>Account Manager</option>
              <option>Kamai Admin</option>
            </select>
          </div>
        </div>

        <TableContainer component={Paper} >
          <Table className='bg-gray-900' >
            <TableHead className='bg-gray-700 '>
              <TableRow >
                <TableCell style={{ color: "white", fontWeight: "bold", fontSize:"large" }}>Profile</TableCell>
                <TableCell style={{ color: "white", fontWeight: "bold", fontSize:"large" }}>Name</TableCell>
                <TableCell style={{ color: "white", fontWeight: "bold", fontSize:"large" }}>Email</TableCell>
                {/* <TableCell>Location</TableCell> */}
                <TableCell style={{ color: "white", fontWeight: "bold", fontSize:"large" }}>Mobile Number</TableCell>
                <TableCell align="center" style={{ color: "white", fontWeight: "bold", fontSize:"large" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={index}>
                  <TableCell style={{color: "white"}}>
                    <Avatar alt={user.name} src={user.profilePic} />
                  </TableCell>
                  <TableCell style={{color: "white"}}>{user.name}</TableCell>
                  <TableCell style={{color: "white"}}>{user.email}</TableCell>
                  {/* <TableCell>{user.location}</TableCell> */}
                  <TableCell style={{color: "white"}}>+91-{user.mobileNumber}</TableCell>
                  <TableCell align="center">
                    <IconButton aria-label="view" color='primary' onClick={() => handleUserClick(user)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton aria-label="edit" sx={{ color: "white" }} onClick={() => handleEditClick(user)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete" sx={{ color: "red" }} onClick={() => handleDeleteClick(user.email)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Popup Dialog */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{isEditing ? 'Edit User Details' : selectedUser ? selectedUser.name : 'User Details'}</DialogTitle>
          <DialogContent>
            {selectedUser && (
              <>
                {isEditing ? (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ marginBottom: '20px' }}
                    />
                    {selectedUser.profilePic && (
                      <Avatar
                        alt={selectedUser.name}
                        src={selectedUser.profilePic}
                        style={{
                          width: '100px',
                          height: '100px',
                          marginBottom: '20px',
                        }}
                      />
                    )}
                    <TextField
                      margin="dense"
                      label="Name"
                      type="text"
                      fullWidth
                      name="name"
                      value={selectedUser.name}
                      onChange={handleInputChange}
                    />
                    <TextField
                      margin="dense"
                      label="Mobile Number"
                      type="text"
                      fullWidth
                      name="mobileNumber"
                      value={selectedUser.mobileNumber}
                      onChange={handleInputChange}
                    />
                    <TextField
                      margin="dense"
                      label="Email"
                      type="email"
                      fullWidth
                      name="email"
                      value={selectedUser.email}
                      onChange={handleInputChange}
                    />
                    <TextField
                      margin="dense"
                      label="Location"
                      type="text"
                      fullWidth
                      name="location"
                      value={selectedUser.location}
                      onChange={handleInputChange}
                    />
                  </>
                ) : (
                  <>
                    <Avatar
                      alt={selectedUser.name}
                      src={selectedUser.profilePic}
                      style={{
                        width: '100px',
                        height: '100px',
                        marginBottom: '20px',
                      }}
                    />
                    <Typography variant="body1">
                      <b>Mobile Number:</b> {selectedUser.mobileNumber}
                    </Typography>
                    <Typography variant="body1">
                      <b>Email:</b> {selectedUser.email}
                    </Typography>
                    <Typography variant="body1" style={{ marginTop: '10px' }}>
                      <b>Location:</b> {selectedUser.location}
                    </Typography>
                    <Typography variant="body1" style={{ marginTop: '10px' }}>
                      <b>Tags:</b> {selectedUser.tags && selectedUser.tags.length > 0 ? selectedUser.tags.join(', ') : 'No tags available'}
                    </Typography>
                    <Typography variant="body1" style={{ marginTop: '10px' }}>
                      <b>Description:</b> Lorem ipsum dolor sit amet, consectetur adipisicing elit...
                    </Typography>
                  </>
                )}
              </>
            )}
          </DialogContent>
          {isEditing && (
            <div style={{ padding: '20px', textAlign: 'right' }}>
              <Button onClick={handleSave} variant="contained" color="primary">
                Save
              </Button>
            </div>
          )}
        </Dialog>
      </Container>
    </>
  );
};

export default UserList;


