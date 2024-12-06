const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Employee = require('./models/employee.js');
const User = require('./models/user.js');
const cloudinary = require('cloudinary')


dotenv.config();
const app = express();
const port = process.env.PORT || 8080;
const db_url = process.env.DATABASE_URL;

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Middleware
app.use(cors());
app.use(express.json({limit:'50mb'})); // Parses incoming JSON requests

// Database Connection
mongoose
  .connect(db_url, {
  })
  .then(() => console.log('Database connected successfully'))
  .catch((err) => {
    console.error('Database connection failed:', err);
  });

// Default Route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (user) {
      res.json({ success: true,msg:"login successfull",user });
    } else {
      res.status(401).json({ success: false, msg: 'Invalid username or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, msg: 'Server error' });
  }
});


app.post('/api/signup',async(req,res)=>{
    try {
        console.log("started registering")
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (user) {
         return res.status(409).json({ success: false,msg:"user already registered" });
        } 
        console.log("usernot available so started registering")
        const newuser=new User({username,password})
        await newuser.save()
        console.log("registered")
          return res.status(201).json({ success: true, msg: 'user created' });
        
      } catch (error) {
        res.status(500).json({ success: false, msg: 'Server error' });
      }
})

// Get Employees Route
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ success: false, msg: 'Server error' });
  }
});

// Validate Employee Function
const validateEmployee = (employee) => {
    if (!employee.f_Name || !employee.f_Email || !employee.f_Mobile || !employee.f_Designation || !employee.f_Gender) {
      return 'All fields are required!';
    }
  
    if (!Array.isArray(employee.f_Course) || employee.f_Course.length === 0) {
      return 'At least one course must be selected!';
    }
  
    if (employee.f_Mobile.length !== 10 || isNaN(employee.f_Mobile)) {
      return 'Mobile number must be 10 digits long!';
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(employee.f_Email)) {
      return 'Invalid email address!';
    }
  
    return 'valid';
  };
  
// Add Employee Route
app.post('/api/add-employee', async (req, res) => {
    
  try {
    console.log("image adding")
    const {f_Image}=req.body
    if(!f_Image){
        return res.status(401).json({success:false,msg:"image error"})
    }
    console.log("image checked now started uploading")
    const result=await cloudinary.v2.uploader.upload(f_Image,{folder:'mern-test'})
    console.log("image added")
    const imgUrl=result.secure_url||null;
    console.log("image added ",imgUrl)
    // const imgUrl=null;
    // console.log(req.body)
    const newEmployee = new Employee({...req.body,f_Image:imgUrl});
    console.log(newEmployee)
    const message = validateEmployee(newEmployee);

    if (message !== 'valid') {
      return res.status(400).json({ success: false, msg: message });
    }
    console.log("validation done")
    const isValid = await Employee.findOne({ f_Email: newEmployee.f_Email });
    if (isValid) {
      return res.status(409).json({ success: false, msg: 'Email already exists' });
    }
    console.log("saving started")
    await newEmployee.save();
    console.log("saving done")
    res.json({ success: true, msg: 'Employee added successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, msg: 'Server error' });
  }
});
app.post('/api/delete-employee', async (req, res) => {
  try {
   const {id}=req.body;
    
   console.log(id)
    const user = await Employee.findOneAndDelete(id);
    console.log("found",user)
    if(user){
    res.json({ success: true, msg: 'Employee deleted successfully!' });
    }
  } catch (error) {
    res.status(500).json({ success: false, msg: 'error while deleteing' });
  }
});

app.post('/api/edit-employee/:id', async (req, res) => {
    try {
      const { id } = req.params; // Get id from route parameters
      console.log(id)
      const employeeData = req.body; // Get the new data for the employee
      console.log(employeeData)
  
      // Validate employee data before updating
      const validationMessage = validateEmployee(employeeData);
      if (validationMessage !== 'valid') {
        return res.status(400).json({ success: false, msg: validationMessage });
      }
      

      console.log("image adding")

    const {f_Image}=req.body
    if(!f_Image){
        return res.status(401).json({success:false,msg:"image error"})
    }

    const result=await cloudinary.v2.uploader.upload(f_Image,{folder:'mern-test'})
    console.log("image added")
    const imgUrl=result.secure_url||null;
    console.log("image added ",imgUrl)

      const updatedEmployee = await Employee.findByIdAndUpdate(
        id,
        {...employeeData,f_Image:imgUrl},
        { new: true } 
      );
  
      if (!updatedEmployee) {
        return res.status(404).json({ success: false, msg: 'Employee not found!' });
      }
  
      res.json({ success: true, msg: 'Employee updated successfully!', employee: updatedEmployee });
    } catch (error) {
      res.status(500).json({ success: false, msg: 'Error while updating employee', error });
    }
  });

app.post('/api/search/:keyword', async (req, res) => {
    const { keyword } = req.params;
    console.log("Search keyword:", keyword);
  
    try {
      let employee;
  
      if (keyword.length===0) {
        // If no keyword is provided, return all employees
        employee = await Employee.find();
      } else {
        // Search employees by name, email, or mobile with partial match (case-insensitive)
        const searchRegex = new RegExp(keyword, 'i'); // 'i' for case-insensitive
        employee = await Employee.find({
          $or: [
            { f_Name: { $regex: searchRegex } },
            { f_Email: { $regex: searchRegex } },
            { f_Mobile: { $regex: searchRegex } },
          ],
        });
      }
  
      if (employee.length > 0) {
        return res.status(200).json({ success: true, employee });
      } else {
        return res.status(404).json({ success: false, msg: 'No employees found' });
      }
    } catch (error) {
      console.error("Error while searching:", error);
      res.status(500).json({ success: false, msg: 'Server error' });
    }
  });
  





// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
