import React, { useState, useEffect } from "react";
import SidebarLayout from "../components/SidebarLayout";
import api from "../api/api";

export default function TTSPage() {
  const [text, setText] = useState("");
  const [rate, setRate] = useState(200);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch existing audio records
  const fetchRecords = async () => {
    try {
      const resp = await api.get("/speech/tts/");
      setRecords(resp.data);
    } catch (err) {
      console.error("Error fetching records:", err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const resp = await api.post("/speech/tts/", {
        text,
        rate,
        format: "wav",
      });
      setRecords((prev) => [resp.data, ...prev]);
      setText("");
    } catch (err) {
      console.error("Error generating speech:", err);
    } finally {
      setLoading(false);
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
              disabled={loading}
              className={`bg-green-800 text-white p-2 rounded ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-900"
              }`}
            >
              {loading ? "Generating..." : "Generate Speech"}
            </button>
          </div>
        ),
        main: (
          <div className="overflow-x-auto">
            {records.length > 0 ? (
              <table className="w-full border-collapse border border-gray-300 mt-4">
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
                          src={
                            rec.audio_data.startsWith("http")
                              ? rec.audio_data
                              : `http://127.0.0.1:8000${rec.audio_data}`
                          }
                        />
                      </td>
                      <td className="border p-2">
                        <a
                          href={
                            rec.audio_data.startsWith("http")
                              ? rec.audio_data
                              : `http://127.0.0.1:8000${rec.audio_data}`
                          }
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
              <p className="text-gray-600 mt-4">No audio records found.</p>
            )}
          </div>
        ),
      }}
    />
  );
}
