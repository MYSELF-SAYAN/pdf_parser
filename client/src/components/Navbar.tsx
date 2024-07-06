import React from "react";
import { useDispatch } from "react-redux";
import { logOut } from "../store/slices/userSlice";
import { useSelector } from "react-redux";
const Navbar = () => {
  const dispatch = useDispatch();
  const user=useSelector((state:any)=>state.user);
  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-3xl font-bold">PDFify</div>
        <div className="flex gap-10 ">
        <p className="text-2xl font-bold text-white">Welcome {user.username}</p>
        <button className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-gray-100"
        onClick={() => {
          dispatch(logOut());
        }}
        >
          Log out
        </button>
        </div>
        
      </div>
    </nav>
  );
};

export default Navbar;
