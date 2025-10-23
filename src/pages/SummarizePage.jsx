import React, { useState, useEffect } from "react";
import SidebarLayout from "../components/SidebarLayout";
import api from "../api/api";

export default function SummarizePage() {   
  const [text, setText] = useState("");
  const [count, setCount] = useState(3);
  const [summary, setSummary] = useState("");
  const [summaries, setSummaries] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 POST: Generate summary
  const handleGenerate = async () => {
    if (!text.trim()) return alert("Please enter text to summarize.");
    setLoading(true);
    try {
      const resp = await api.post("/summary/summarize/", {
        text,
        sentences_count: count,
      });

      // Expect data = { summary: "...", sentences: [...] }
      const plainSummary =
        typeof resp.data.summary === "string"
          ? resp.data.summary
          : Array.isArray(resp.data.summary)
          ? resp.data.summary.join(" ")
          : JSON.stringify(resp.data);

      setSummary(plainSummary);
      fetchSummaries(); // refresh past summaries
    } catch (err) {
      console.error("Error generating summary:", err);
      setSummary("Error generating summary.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 GET: Fetch all past summaries
  const fetchSummaries = async () => {
    try {
      const resp = await api.get("/summary/summarize/");

      // Ensure summary column contains only plain text
      const formatted = resp.data.map((s) => ({
        text: s.text,
        summary:
          typeof s.summary === "string"
            ? s.summary
            : Array.isArray(s.summary)
            ? s.summary.join(" ")
            : s.summary?.summary || "",
      }));
      setSummaries(formatted);
    } catch (err) {
      console.error("Error fetching summaries:", err);
    }
  };

  useEffect(() => {
    fetchSummaries();
  }, []);

  return (
    <SidebarLayout
      children={{
        sidebar: (
          <div className="flex flex-col gap-3">
            <textarea
              rows={10}
              className="border p-2 rounded w-full"
              placeholder="Enter article text..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`p-2 rounded text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-800 hover:bg-green-900"
              }`}
            >
              {loading ? "Generating..." : "Generate Summary"}
            </button>
          </div>
        ),
        main: (
          <div className="flex flex-col gap-5">
            {/* Display current summary */}
            {summary && (
              <div className="bg-gray-50 p-4 border rounded">
                <h3 className="font-semibold mb-2">Generated Summary</h3>
                <p className="text-gray-800 whitespace-pre-line">{summary}</p>
              </div>
            )}

            {/* Past summaries table */}
            <div className="overflow-x-auto">
              {summaries.length > 0 ? (
                <table className="w-full border-collapse border border-gray-300 mt-4">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="border p-2 text-left">Text</th>
                      <th className="border p-2 text-left">Summary</th>
                      <th className="border p-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaries.map((s, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="border p-2">{s.text}</td>
                        <td className="border p-2">{s.summary}</td>
                        <td className="border p-2">
                          <button
                            className="text-blue-700 hover:underline"
                            onClick={() => setSummary(s.summary)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-600 mt-4">
                  No past summaries available.
                </p>
              )}
            </div>
          </div>
        ),
      }}
    />
  );
}
