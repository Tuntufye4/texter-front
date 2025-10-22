import React, { useState, useEffect } from "react";
import SidebarLayout from "../components/SidebarLayout";   

export default function TTSPage() {
  const [text, setText] = useState("");
  const [rate, setRate] = useState(200);
  const [records, setRecords] = useState([]);

  // Fetch existing audio records on mount
  const fetchRecords = async () => {
    try {
      const resp = await fetch("http://127.0.0.1:8000/api/speech/tts/");
      const data = await resp.json();
      setRecords(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleGenerate = async () => {
    if (!text) return;
    try {
      const resp = await fetch("http://127.0.0.1:8000/api/speech/tts/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, rate, format: "wav" }),
      });
      const data = await resp.json();
      setRecords((prev) => [data, ...prev]); // prepend new record
      setText(""); // clear input
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SidebarLayout
      children={{
        sidebar: (
          <div className="flex flex-col gap-3">
            <textarea
              rows={8}
              className="border p-2 rounded w-full"
              placeholder="Enter text..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />   
            <button
              onClick={handleGenerate}
              className="bg-green-800 text-white p-2 rounded hover:bg-green-900"
            >
              Generate Speech
            </button>
          </div>
        ),
        main: (
          <div>  
            {records.length > 0 ? (
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Text</th>
                    <th className="border p-2 text-left">Audio</th>
                    <th className="border p-2 text-left">Download</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((rec) => (
                    <tr key={rec.id} className="border-b">
                      <td className="border p-2">{rec.text}</td>
                      <td className="border p-2">
                        <audio
                          controls
                          src={`http://127.0.0.1:8000${rec.audio_data}`}
                        ></audio>
                      </td>
                      <td className="border p-2">
                        <a
                          href={`http://127.0.0.1:8000${rec.audio_data}`}
                          download="speech.wav"
                          className="text-blue-700 hover:underline"
                        >
                          Download
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600">No audio records found.</p>
            )}
          </div>
        ),
      }}
    />
  );
}
