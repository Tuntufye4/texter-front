import React, { useState, useEffect } from "react";
import SidebarLayout from "../components/SidebarLayout";

export default function TopicPage() {
  const [text, setText] = useState("");
  const [nTopics, setNTopics] = useState(5);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch existing topic records
  const fetchTopics = async () => {
    try {
      const resp = await fetch("http://127.0.0.1:8000/api/topic/topic/");
      const data = await resp.json();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching topics:", err);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  // Generate new topics
  const handleGenerate = async () => {
    if (!text) return alert("Enter text first!");
    setLoading(true);
    try {
      const resp = await fetch("http://127.0.0.1:8000/api/topic/topic/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, n_topics: nTopics }),
      });
      const data = await resp.json();
      setRecords((prev) => [data, ...prev]);
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
            <input
              type="number"
              className="border p-2 rounded"
              value={nTopics}
              onChange={(e) => setNTopics(Number(e.target.value))}   
              placeholder="Number of topics"
            />
            <button
              onClick={handleGenerate}
              className="bg-green-800 text-white p-2 rounded hover:bg-green-900"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Topics"}
            </button>
          </div>
        ),
        main: (
          <div>
            <h2 className="text-xl font-bold mb-3">Generated Topics</h2>
            <div className="overflow-x-auto">
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
                          {new Date(item.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-3 text-gray-500">
                        No topics generated yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>   
            </div>
          </div>
        ),
      }}
    />
  );
}
    