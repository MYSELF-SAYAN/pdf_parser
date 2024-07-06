import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";

interface Message {
  role: string;
  text: string;
  loading?: boolean; // Optional loading state for each message
}

const ChatComponent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { username, title, url } = location.state;

  function modifyLink(url: string) {
    const trimmedUrl = url.slice(0, -4);
    const modifiedUrl = `${trimmedUrl}raw=1`;
    return modifiedUrl;
  }

  const newUrl = modifyLink(url);

  const generateMessage = async () => {
    try {
      const newPrompt: Message = {
        role: "user",
        text: prompt,
      };

      // Update messages state with the new user message and set loading to true for the bot response
      setMessages((prevMessages) => [
        ...prevMessages,
        newPrompt,
        { role: "model", text: "", loading: true },
      ]);

      // Get bot response
      const res = await axios.post("http://localhost:8000/pdf/chat", {
        username: username,
        title: title,
        prompt: prompt,
      });

      const botResponse: Message = {
        role: "model",
        text: res.data.response,
        loading: false, // Set loading to false once the response is received
      };

      // Update messages state with the bot response
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1),
        botResponse,
      ]);
      setPrompt("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/pdf/getChat/${username}/${title}`
        );
        console.log(response.data);
        setMessages(response.data.slice(1));
      } catch (error) {
        console.error(error);
      }
    };
    fetchMessages();
  }, [username, title]);

  return (
    <div className="flex h-screen">
      {/* PDF Viewer */}
      <div className="w-1/2 border-r border-gray-300 relative">
        <p
          onClick={() => navigate("/")}
          className="cursor-pointer text-2xl font-bold p-3 absolute top-0 left-0 w-full bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-20 bg-blue-500 text-white"
        >
          Back
        </p>
        <iframe src={newUrl} className="w-full h-full" title="PDF Viewer" />
      </div>

      {/* Chat Interface */}
      <div className="w-1/2 flex flex-col">
        <div className="flex-grow overflow-auto p-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded ${
                message.role === "user"
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-200 self-start"
              }`}
            >
              <div className="w-full font-bold uppercase">{message.role}</div>
              {message.loading ? (
                <Loader />
              ) : (
                <pre className="whitespace-pre-wrap break-words flex flex-wrap">
                  {message.text}
                </pre>
              )}
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-300">
          <div className="flex">
            <input
              type="text"
              className="flex-grow border rounded-l p-2"
              placeholder="Type your message..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-r"
              onClick={generateMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
