import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { FaPlus } from "react-icons/fa";
import ProjectsCard from "../components/ProjectsCard";
import { useSelector } from "react-redux";
import axios from "axios";
import Navbar from "../components/Navbar";
const Home = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [fetchedProjects, setFetchedProjects] = useState([]);
  const [refresh, setRefresh] = useState(1);
  const user = useSelector((state: any) => state.user);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      minWidth: "500px",
      maxWidth: "500px",
    },
  };

  const handleFileUpload = async () => {
    if (!file || !projectName) {
      alert("Please provide a file and project name.");
      return;
    }

    const formData = new FormData();
    formData.append("username", user.username);
    formData.append("title", projectName);
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8000/pdf/parse",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      await axios.post("http://localhost:8000/pdf/chat", {
        username: user.username,
        title: projectName,
        prompt:"Holaaa"
      }), 
      console.log("File uploaded successfully:", response.data);
      setModalIsOpen(false);
      setRefresh(refresh + 1);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    }
  };

  const handleFileChange = (e: { target: { files: any[] } }) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please upload a PDF file.");
      setFile(null);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/pdf/getPdfs/${user.username}`
        );
        setFetchedProjects(response.data);
        console.log("Projects fetched successfully:", response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/pdf/getPdfs/${user.username}`
        );
        setFetchedProjects(response.data);
        
        console.log("Projects fetched successfully:", response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [refresh]);

  return (
    <div>
        <Navbar />
    <div className="grid grid-cols-4 gap-5 p-4">
    
      <div
        className="bg-blue-500 text-white px-4 py-2 rounded min-h-[300px] flex flex-col items-center justify-center cursor-pointer"
        onClick={() => setModalIsOpen(!modalIsOpen)}
      >
        <FaPlus className="text-9xl" />
        <p className="text-3xl font-bold">Create Conversation</p>
      </div>
      {fetchedProjects &&
        fetchedProjects.map((project: any) => <ProjectsCard data={project} />)}

      <Modal
        isOpen={modalIsOpen}
        style={customStyles}
        onRequestClose={() => setModalIsOpen(false)}
        ariaHideApp={false}
      >
        <div className="flex justify-end">
          <button
            className="bg-red-500 text-white px-2 py-1 rounded"
            onClick={() => setModalIsOpen(!modalIsOpen)}
          >
            Close
          </button>
        </div>
        <div className="p-4">
          <p className="mb-2">Upload your PDF</p>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="mb-4 border rounded p-2"
          />
          <p className="mb-2">Enter project name</p>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="mb-4 border rounded p-2 w-full"
          />
          <div className="mt-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={handleFileUpload}
            >
              Submit
            </button>
          </div>
        </div>
      </Modal>
    </div>
    </div>
  );
};

export default Home;
