import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./components/Chat/Chat";
import ChatBody from "./components/chatBody/ChatBody";
import Join from "./components/Join/Join";
import Auth from "./pages/Auth/Auth";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Join />} /> */}
        <Route path="/" element={<Auth />} />
        {/* <Route path="/chat" element={<Chat />} /> */}
        <Route path="/chat" element={<ChatBody />} />
      </Routes>
    </Router>
  );
};

export default App;
