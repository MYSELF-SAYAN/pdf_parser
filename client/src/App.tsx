import { useState } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Navigate, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import ChatComponent from "./components/ChatComponent";
function App() {
  const user = useSelector((state: any) => state.user);
  const logged = user.isLogged;
  console.log(logged);
  return (
    <div className=" ">
      <Routes>
        <Route
          path="/"
          element={logged ? <Home /> : <Navigate to="/signup" />}
        />
        <Route
          path="/login"
          element={logged ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={logged ? <Navigate to="/" /> : <Signup />}
        />
        <Route
          path="/chat"
          element={logged ? <ChatComponent /> : <Navigate to="/login" />}
        />
        {/* <Route path="/chat" element={<ChatComponent/>} /> */}
      </Routes>
    </div>
  );
}

export default App;
