// import { createContext, useContext, useEffect, useState } from "react";
// import axios from "axios";  // Make sure to import axios
// import { toast } from "react-toastify";


// const projectContext = createContext(null);

// export const useProject = () => {
//   return useContext(projectContext);
// };

// export const ProjectContextProvider = ({ children }) => {
//   const [projects, setProjects] = useState([]);
//   const [isProjectAdded,setProjectAdded]=useState(false)

//   const getAllProjects = async () => {
//     try {
//        const response = await axios.get('https://portfolio-api-pi-ten.vercel.app/api/projects/getallprojects', { withCredentials: true });
//       // const response = await axios.get(`http://localhost:8080/api/projects/getallprojects`);
//       if (response.status === 200) {
//         setProjects(response.data.projects);
//         console.log("Projects fetched successfully:", response.data.projects);  // Log the response projects
//       }
//     } catch (err) {
//       console.error("Error while fetching projects:", err);
//     } finally {
//       setProjectAdded(true); // Authentication check is done
//     }
//   };

//   const deleteProject=async(id)=>{
//     try {
//       const response = await axios.delete('https://portfolio-api-pi-ten.vercel.app/api/projects/deleteproject',{id:id}, { withCredentials: true });
//      // const response = await axios.get(`http://localhost:8080/api/projects/getallprojects`);
//      if (response.status === 200) {
//       console.log('project deleted')
//      }
//    } catch (err) {
//      console.error("Error while fetching projects:", err);
//    }
//   }

//   const addProject = async (values) => {
//     console.log("err",values)
//     try {
//        const response = await axios.post( `https://portfolio-api-pi-ten.vercel.app/api/projects/addproject`,values,{ withCredentials: true });
//       //const response = await axios.post( `http://localhost:8080/api/projects/addproject`,values,{ withCredentials: true });
//       if (response.status === 201) {
//         getAllProjects(); // Refresh projects after adding
//       }
//     } catch (error) {
//       console.log("Error while adding project");
//     }
//   };

//   const editProject = async (id, values) => {
//     try {
//        const response = await axios.post(`https://portfolio-api-pi-ten.vercel.app/api/projects/editproject`,{ ...values, id },{ withCredentials: true });
//       //const response = await axios.post(`http://localhost:8080/api/projects/editproject`,{ ...values, id },{ withCredentials: true });
//       if (response.status === 201) {
//         getAllProjects(); // Refresh projects after editing
//       }
//     } catch (error) {
//        console.log("Error while updating project");
//     }
//   };



//   useEffect(() => {
//     getAllProjects();  // Fetch projects when the context initializes
//   }, []);


 

//   return (
//     <projectContext.Provider value={{ projects,isProjectAdded,deleteProject,addProject,editProject,setProjects }}>
//       {children}
//     </projectContext.Provider>
//   );
// };
