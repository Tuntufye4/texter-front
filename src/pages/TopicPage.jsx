import React, { useState, useEffect } from "react";
import SidebarLayout from "../components/SidebarLayout";
import api from "../api/api";

export default function TopicPage() {
  const [text, setText] = useState("");
  const [nTopics, setNTopics] = useState(5);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch existing topic records
  const fetchTopics = async () => {
    try {
      const resp = await api.get("/topic/topic/");
      setRecords(Array.isArray(resp.data) ? resp.data : []);
    } catch (err) {
      console.error("Error fetching topics:", err);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  // Generate new topics
  const handleGenerate = async () => {
    if (!text.trim()) return alert("Enter text first!");
    setLoading(true);
    try {
      const resp = await api.post("/topic/topic/", {
        text,
        n_topics: nTopics,
      });
      setRecords((prev) => [resp.data, ...prev]);
    } catch (err) {
      console.error("Error generating topics:", err);
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
              className={`p-2 rounded text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-800 hover:bg-green-900"
              }`}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Topics"}
            </button>
          </div>
        ),
        main: (
          <div className="overflow-x-auto mt-4">
            <table className="table-auto border-collapse border border-gray-300 w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-left">Text</th>
                  <th className="border px-4 py-2 text-left">Topics</th>
                  <th className="border px-4 py-2 text-left">Created</th>
                </tr>
              </thead>
              <tbody>
                {records.length > 0 ? (
                  records.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="border px-4 py-2 w-1/2">{item.text}</td>
                      <td className="border px-4 py-2 whitespace-pre-line">
                        {item.topics || "No topics"}
                      </td>
                      <td className="border px-4 py-2">
                        {item.created_at
                          ? new Date(item.created_at).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="text-center py-3 text-gray-500"
                    >
                      No topics generated yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ),
      }}
    />  
  );
}
