import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EmployeeList() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const response = await axios.get("http://localhost:8080/api/employees");
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    }
    fetchEmployees();
  }, []); // Fixed dependency array to avoid infinite requests

  const handleCreate = () => {
    navigate("/add-employee");
  };

  const handleEdit = (employee) => {
    navigate("/add-employee", { state: { isEdit: true, employeeData: employee } });
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.post("http://localhost:8080/api/delete-employee", { id });
      if (res.data.success) {
        setEmployees(employees.filter((employee) => employee._id !== id));
        alert(res.data.msg);
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      alert("Server error while deleting the employee");
    }
  };


  const handleSearch=async(keyword)=>{
    
    try{
      
    const res = await axios.post(`http://localhost:8080/api/search/${keyword}`);
    if (res.data.success) {
      console.log(res.data)
      setEmployees(res.data.employee);
      // alert(res.data.msg);
    }
  }catch (error) {
    console.error("Error searching employee:", error);
    // alert("Server error while searching the employee");
  }
  }

  return (
    <div className="p-4">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg flex flex-col">
        <div className="flex justify-between items-center pb-6">
          <h1 className="text-3xl font-extrabold text-blue-700">Employee List</h1>
          <div><span>Search By Keyword:</span><input type="text" className="p-1 ml-2 border-blue-500 rounded-md border-solid border-2" value={keyword} onChange={(e)=>{
            setKeyword(e.target.value)
            handleSearch(e.target.value)
            }}/></div>
          <button className="bg-blue-800 px-3  text-white py-1 rounded-sm mr-2" onClick={handleCreate}>
            Create New
          </button>
        </div>
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Id</th>
              <th className="px-6 py-3">Image</th>

              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Mobile No</th>
              <th className="px-6 py-3">Designation</th>
              <th className="px-6 py-3">Course</th>
              <th className="px-6 py-3">Gender</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {employees?.map((employee) => (
              <tr key={employee._id} className="bg-white border-b hover:bg-black/10">
                <td className="px-6 py-4">{employee._id}</td>
                <td className="px-6 py-4"><img src={employee.f_Image} alt="image" className="rounded-full size-10 object-cover"/></td>
                <td className="px-6 py-4">{employee.f_Name}</td>
                <td className="px-6 py-4">{employee.f_Email}</td>
                <td className="px-6 py-4">{employee.f_Mobile}</td>
                <td className="px-6 py-4">{employee.f_Designation}</td>
                <td className="px-6 py-4">{employee.f_Course}</td>
                <td className="px-6 py-4">{employee.f_Gender}</td>
                <td className="px-6 py-4">{employee.f_Create_date}</td>
                <td className="px-6 py-4">
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleEdit(employee)}
                  >
                    Edit
                  </button>{" "}
                  |
                  <button
                    className="text-red-600 hover:underline ml-2"
                    onClick={() => handleDelete(employee._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EmployeeList;
