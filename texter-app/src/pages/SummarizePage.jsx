import React, { useState, useEffect } from "react";
import SidebarLayout from "../components/SidebarLayout";

export default function SummarizePage() {
  const [text, setText] = useState("");
  const [count, setCount] = useState(3);
  const [summary, setSummary] = useState("");
  const [summaries, setSummaries] = useState([]);

  // 🔹 POST: Generate summary
  const handleGenerate = async () => {
    if (!text.trim()) return alert("Please enter text to summarize.");
    try {
      const resp = await fetch("http://127.0.0.1:8000/api/summary/summarize/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, sentences_count: count }),
      });
      const data = await resp.json();

      // Expect data = { summary: "...", sentences: [...] }
      const plainSummary = typeof data.summary === "string"
        ? data.summary
        : Array.isArray(data.summary)
        ? data.summary.join(" ")
        : JSON.stringify(data);

      setSummary(plainSummary);
      fetchSummaries(); // refresh past summaries
    } catch (err) {
      console.error("Error generating summary:", err);
      setSummary("Error generating summary.");
    }
  };

  // 🔹 GET: Fetch all past summaries
  const fetchSummaries = async () => {
    try {
      const resp = await fetch("http://127.0.0.1:8000/api/summary/summarize/");
      const data = await resp.json();

      // Make sure summary column contains only plain text
      const formatted = data.map((s) => ({
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
            <input
              type="number"
              className="border p-2 rounded w-full"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              placeholder="Sentence count"
              min={1}
            />
            <button
              onClick={handleGenerate}
              className="bg-green-800 text-white p-2 rounded hover:bg-green-900"
            >
              Generate Summary
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
            <div>
              <h2 className="text-xl font-bold mb-3">Past Summaries</h2>
              {summaries.length > 0 ? (
                <table className="w-full border">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="p-2 text-left">Text</th>
                      <th className="p-2 text-left">Summary</th>
                      <th className="p-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaries.map((s, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-2 w-1/2">{s.text}</td>
                        <td className="p-2 w-1/2">{s.summary}</td>
                        <td className="p-2">
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
                <p className="text-gray-600">No past summaries available.</p>
              )}
            </div>
          </div>
        ),
      }}
    />
  );
}
