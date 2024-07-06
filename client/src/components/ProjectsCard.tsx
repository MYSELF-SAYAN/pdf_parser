import React from "react";
import { FaFilePdf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
interface ProjectsCardProps {
  data: {
    fileData: string;
    fileurl: string;
    title: string;
    conversations: [];
  };
}
const ProjectsCard = ({ data }: ProjectsCardProps) => {
  //console.log(data);
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user);
  return (
    <div className="h-[300px] border border-gray-200 rounded-xl p-4 flex flex-col justify-center items-center space-y-4 shadow-xl">
      {/* Uncomment the iframe to display the PDF
      <iframe
        src={pdfUrl}
        width="100%"
        height="100%"
        style={{ border: "none" }}
        title="PDF Viewer"
      ></iframe> 
      */}
      <FaFilePdf className="text-red-700" size={100} />
      <p className="text-center text-2xl font-bold">
       {
        data.title
       }
      </p>
      <div className="flex justify-end w-full">
        <button className="bg-blue-500 text-2xl text-white px-8 py-2 rounded hover:bg-blue-600"
        onClick={()=>{
          navigate('/chat', { state: { title: data.title,username:user.username,url:data.fileurl } });}}
        >
          Chat
        </button>
      </div>
    </div>
  );
};

export default ProjectsCard;
