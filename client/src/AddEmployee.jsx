import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function AddEmployee() {
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = location.state?.isEdit || false;
  const initialData = location.state?.employeeData || {
    f_Name: "",
    f_Email: "",
    f_Mobile: "",
    f_Image:"",
    f_Designation: "",
    f_Gender: "M",
    f_Course: [],
    f_Create_date: "",
  };

  const [employeeData, setEmployeeData] = useState(initialData);
  const [isLoading,setLoading]=useState(false);

  useEffect(() => {
    if (isEdit) {
      setEmployeeData(initialData); // Populate form if editing
    }
  }, [isEdit, initialData]);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
  
    if (name === "f_Course") {
      setEmployeeData((prevData) => ({
        ...prevData,
        f_Course: checked
          ? [...prevData.f_Course, value]
          : prevData.f_Course.filter((course) => course !== value),
      }));
    } else {
      setEmployeeData({
        ...employeeData,
        [name]: type === "date" && value === "" ? null : value, // Handle date input
      });
    }
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const url = isEdit
        ? `http://localhost:8080/api/edit-employee/${employeeData._id}`
        : "http://localhost:8080/api/add-employee";

      const response = await axios.post(url, employeeData);
      setEmployeeData({
        f_Name: "",
        f_Email: "",
        f_Mobile: "",
        f_Designation: "",
        f_Gender: "M",
        f_Course: [],
        f_Create_date: "",
      });
      alert(response.data.msg);
       isEdit&&navigate("/");
    } catch (error) {
      console.error("Error:", error);
      const message=error.response?.data?.msg||"Error while submitting the form"
      alert(message);
    }finally{
      setLoading(false)
    }
  };

  const handleImgChange=(e)=>{
    e.preventDefault()
    const file=e.target.files[0];

    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      const fileType = file.type;
  
      if (!allowedTypes.includes(fileType)) {
        alert("Only JPG and PNG files are allowed.");
        return;
      }
    }
    
    
    if(file){
      const reader=new FileReader();
      reader.readAsDataURL(file)
      reader.onload=()=>{
        console.log(reader.result)
          setEmployeeData({...employeeData,f_Image:reader.result})
      }
      reader.onerror=()=>{
        // toast.error("image upload error")
        alert("image uploaded")
      }
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-blue-700">{isEdit ? "Edit Employee" : "Add New Employee"}</h1>
      <form onSubmit={handleSubmit} className="flex flex-wrap justify-center items-center gap-4 border-2 border-solid border-black w-[80%] mx-auto mt-10 p-20 rounded-lg " >
        <div className="flex flex-wrap justify-center items-center gap-4 mb-10">
        <div>
          Name:
          <input
            type="text"
            placeholder="Name"
            name="f_Name"
            className="border-2  mx-4 my-4 p-1 border-black rounded-md"
            value={employeeData.f_Name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          Email:
          <input
            type="email"
            name="f_Email"
            className="border-2  mx-4 my-4 p-1 border-black rounded-md"
            placeholder="Email"
            value={employeeData.f_Email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          Mobile:
          <input
            type="text"
            name="f_Mobile"
            className="border-2  mx-4 my-4 p-1 border-black rounded-md"
            placeholder="Mobile"
            value={employeeData.f_Mobile}
            onChange={handleInputChange}
          />
        </div>
        <div>
          Designation:
          <select
            name="f_Designation"
            className="border-2  mx-4 my-4 p-1 border-black rounded-md"
            value={employeeData.f_Designation}
            onChange={handleInputChange}
          >
            <option value="">Select Designation</option>
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
        </div>
        <div className="flex items-center">
          Gender:
          <div className="border-2 border-solid border-black flex px-4 rounded-lg mx-4">
          <label>
            <input
              type="radio"
              name="f_Gender"
              value="M"
              className="border-2  mx-4  border-black rounded-md"
              checked={employeeData.f_Gender === 'M'}
              onChange={handleInputChange}
            />
            M
          </label>
          <label>
            <input
              type="radio"
              name="f_Gender"
              value="F"
              className="border-2  mx-4  border-black rounded-md"
              checked={employeeData.f_Gender === 'F'}
              onChange={handleInputChange}
            />
            F
          </label>
          </div>
        </div>
        <div className="flex items-center justify-start">
          Course:
          <div className="border-2 border-solid border-black flex px-4 rounded-lg mx-4">
          <label>
            <input
              type="checkbox"
              name="f_Course"
              value="MCA"
              className="border-2  mx-4 border-black rounded-md"
              checked={employeeData.f_Course.includes('MCA')}
              onChange={handleInputChange}
            />
            MCA
          </label>
          <label>
            <input
              type="checkbox"
              name="f_Course"
              value="BCA"
              className="border-2  mx-4  border-black rounded-md"
              checked={employeeData.f_Course.includes('BCA')}
              onChange={handleInputChange}
            />
            BCA
          </label>
          <label>
            <input
              type="checkbox"
              name="f_Course"
              className="border-2  mx-4  border-black rounded-md"
              value="BSC"
              checked={employeeData.f_Course.includes('BSC')}
              onChange={handleInputChange}
            />
            BSC
          </label>
        </div>
        </div>
        <div>
          Date:
          <input
            type="date"
            name="f_Create_date"
            className="border-2  mx-4 px-2 border-black rounded-md"
            value={employeeData.f_Create_date}
            onChange={handleInputChange}
          />
        </div>
        <div>
          Image:
          <input
            type="file"
            name="f_Image"
            
            
            onChange={handleImgChange}
          />
        </div>
        </div>

        <button className="bg-blue-800 text-white px-4 py-2 rounded-lg" type="submit">
          {isLoading?"...":(isEdit ? "Update Employee" : "Add Employee")}
        </button>
      </form>
    </div>
  );
}

export default AddEmployee;
