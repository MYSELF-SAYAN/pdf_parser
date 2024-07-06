import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const signup = async () => {
    try {
      if (email === "" || username === "" || password === "") {
        alert("Please enter all the fields");
        return;
      }
      const response = await axios.post("http://localhost:8000/auth/create", {
        email: email,
        name: username,
        password: password,
      });
      console.log(response);
      if (response.status === 201) {
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    console.log(username, email, password)
  }, [username, email, password]);
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="mx-auto w-full max-w-md rounded-lg border border-input bg-card p-6 shadow-lg sm:p-8">
        <div className="space-y-4">
          <div className="flex flex-col items-center space-y-2">
            <h2 className="text-2xl font-bold">Welcome to PDFify</h2>
            <p className="text-sm text-muted-foreground">
              Enter your details to sign up.
            </p>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Email
            </label>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="email"
              placeholder="name@example.com"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Username
              </label>
            </div>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="username"
              placeholder="username"
              type="text"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Password
              </label>
            </div>
            <input
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-red-600 text-white hover:bg-red-400 h-10 px-4 py-2 w-full"
            onClick={signup}
          >
            Sign Up
          </button>
          <div className="relative flex items-center py-4">
            <div className="flex-1 border-t border-input"></div>
            <span className="mx-4 bg-background px-2 text-muted-foreground">
              Or
            </span>
            <div className="flex-1 border-t border-input"></div>
          </div>
          <button
            
            className="inline-flex w-full items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-200"
            onClick={() => navigate("/login")}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
