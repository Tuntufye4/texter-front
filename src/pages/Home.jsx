import React from "react";
import { Link } from "react-router-dom";
import {
  SpeakerWaveIcon,
  ChartBarIcon,  
  DocumentTextIcon,
  LightBulbIcon,   
  NewspaperIcon, 
} from "@heroicons/react/24/outline";

export default function Home() {
  const services = [
    { name: "Text to Speech", path: "/tts", icon: <SpeakerWaveIcon className="w-12 h-12 text-green-700 mb-2" /> },
    { name: "Summarize", path: "/summarize", icon: <LightBulbIcon className="w-12 h-12 text-green-700 mb-2" /> },
    { name: "Topic", path: "/topic", icon:<NewspaperIcon className="w-12 h-12 text-green-700 mb-2" />},
  ];

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-gray-50 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 w-full max-w-4xl">
        {services.map((s) => (
          <Link
            key={s.name}
            to={s.path}
            className="p-8 bg-white hover:bg-green-50 text-center text-lg font-semibold rounded-2xl shadow-md border border-gray-200 transition transform hover:-translate-y-1 hover:shadow-lg flex flex-col items-center"
          >
            {s.icon}
            <span className="text-gray-800 mt-2">{s.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
