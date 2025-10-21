import React, { useState, useEffect } from "react";
import SidebarLayout from "../components/SidebarLayout";

export default function EntitiesPage() {
  const [text, setText] = useState("");
  const [entities, setEntities] = useState([]);
  const [records, setRecords] = useState([]);

  // 🔹 Fetch existing records from backend
  const fetchRecords = async () => {
    try {
      const resp = await fetch("http://127.0.0.1:8000/api/entities/entities/");
      const json = await resp.json();
      if (Array.isArray(json)) {
        setRecords(json);
      } else {
        console.error("Unexpected response format:", json);
      }
    } catch (err) {
      console.error("Error fetching records:", err);
    }
  };

  // 🔹 Submit new text for entity extraction
  const handleSubmit = async () => {
    if (!text.trim()) return alert("Please enter text to extract entities.");
    try {
      const resp = await fetch("http://127.0.0.1:8000/api/entities/entities/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const json = await resp.json();
      setEntities(json.entities || []);
      fetchRecords(); // refresh table after new record is created
    } catch (err) {
      console.error("Error extracting entities:", err);
    }
  };

  // 🔹 Fetch all existing records on load
  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <SidebarLayout
      children={{
        sidebar: (
          <div className="flex flex-col gap-3">
            <textarea
              rows={10}
              className="border p-2 rounded"
              placeholder="Enter text..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              onClick={handleSubmit}
              className="bg-green-800 text-white p-2 rounded hover:bg-green-900"
            >
              Get Frequency  
            </button>
          </div>
        ),
        main: (
          <div>   
            <h2 className="text-xl font-bold mb-3">Frequency</h2>

            {/* Current extraction result */}
            {entities.length > 0 && (  
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Current Extraction Result:</h3>
                <table className="w-full border mb-4">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="p-2 text-left">Text</th>
                      <th className="p-2 text-left">Label</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entities.map((ent, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-2">{ent.text}</td>
                        <td className="p-2">{ent.label}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* All saved entity extraction records */}
            <h3 className="font-semibold mb-2">Previous Records</h3>
            {records.length > 0 ? (
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="p-2 text-left">Text</th>
                    <th className="p-2 text-left">Frequency</th>
                    <th className="p-2 text-left">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, idx) => (
                    <tr key={idx} className="border-b align-top">
                      <td className="p-2 w-1/2">{record.text}</td>
                      <td className="p-2 w-1/3">
                        {Array.isArray(record.entities) && record.entities.length > 0 ? (
                          <ul className="list-disc pl-4">
                            {record.entities.map((ent, i) => (
                              <li key={i}>
                                <strong>{ent.text}</strong> — {ent.label}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-500">No entities</span>
                        )}
                      </td>
                      <td className="p-2 w-1/6 text-gray-600">
                        {record.created_at
                          ? new Date(record.created_at).toLocaleString()
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600">No entity records found.</p>
            )}
          </div>
        ),
      }}
    />
  );
}
   