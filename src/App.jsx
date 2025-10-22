import React from "react";  
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import TTSPage from "./pages/TTSPage";   
import SummarizePage from "./pages/SummarizePage";
import TopicPage from "./pages/TopicPage";

export default function App() {
  return (  
    <Router>
      <header className="bg-green-800 text-white p-4 flex items-center">
        <Link
          to="/"
          className="text-2xl font-semibold hover:text-gray-200"
        >
          Texter
        </Link>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tts" element={<TTSPage />} />  
        <Route path="/summarize" element={<SummarizePage />} />
        <Route path="/topic" element={<TopicPage />} />
      </Routes>
    </Router>
  );
}   
   