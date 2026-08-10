import { useEffect, useState } from "react";
import api from "./api";
import "./Admin.css";

export default function Admin() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchFeedback = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/feedback");

      setData(res.data);
    } catch (error) {
      console.error("Failed to fetch feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  // Search + sentiment filtering
  const filteredData = data.filter((item) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      item.transcript?.toLowerCase().includes(searchText) ||
      item.sentiment?.toLowerCase().includes(searchText) ||
      String(item.id).includes(searchText);

    const matchesSentiment =
      sentimentFilter === "All" ||
      item.sentiment?.toLowerCase() ===
        sentimentFilter.toLowerCase();

    return matchesSearch && matchesSentiment;
  });

  // Statistics
  const totalFeedback = data.length;

  const positiveCount = data.filter(
    (item) => item.sentiment?.toLowerCase() === "positive"
  ).length;

  const negativeCount = data.filter(
    (item) => item.sentiment?.toLowerCase() === "negative"
  ).length;

  const neutralCount = data.filter(
    (item) => item.sentiment?.toLowerCase() === "neutral"
  ).length;

  const getSentimentClass = (sentiment) => {
    const value = sentiment?.toLowerCase();

    if (value === "positive") return "positive";
    if (value === "negative") return "negative";
    if (value === "neutral") return "neutral";

    return "unknown";
  };

  return (
    <div className="admin-page">

      {/* Header */}
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>
            Monitor and analyze customer voice feedback
          </p>
        </div>

        <button
          className="refresh-btn"
          onClick={fetchFeedback}
          disabled={loading}
        >
          🔄 {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Statistics */}
      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon total">
            📊
          </div>

          <div>
            <p>Total Feedback</p>
            <h2>{totalFeedback}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon positive-icon">
            😊
          </div>

          <div>
            <p>Positive</p>
            <h2>{positiveCount}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon neutral-icon">
            😐
          </div>

          <div>
            <p>Neutral</p>
            <h2>{neutralCount}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon negative-icon">
            😞
          </div>

          <div>
            <p>Negative</p>
            <h2>{negativeCount}</h2>
          </div>
        </div>

      </div>

      {/* Controls */}
      <div className="controls">

        <div className="search-box">
          🔍

          <input
            type="text"
            placeholder="Search feedback..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={sentimentFilter}
          onChange={(e) =>
            setSentimentFilter(e.target.value)
          }
        >
          <option value="All">All Sentiments</option>
          <option value="Positive">Positive</option>
          <option value="Neutral">Neutral</option>
          <option value="Negative">Negative</option>
        </select>

      </div>

      {/* Table */}
      <div className="table-card">

        <div className="table-header">
          <div>
            <h2>Feedback Records</h2>
            <p>
              Showing {filteredData.length} of {data.length} records
            </p>
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading feedback...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="empty-state">
            <div>📭</div>
            <h3>No feedback found</h3>
            <p>
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>id</th>
                  <th>User</th>
                  <th>Audio</th>
                  <th>Transcript</th>
                  <th>Sentiment</th>
                </tr>
              </thead>

              <tbody>

                {filteredData.map((item) => (
                  <tr key={item.id}>

                    <td>
                      <span className="id-badge">
                        #{item.id}
                      </span>
                    </td>

                    <td>
                      <span className="id-badge">
                        {item.username}
                      </span>
                    </td>

                    <td>
                      <div className="audio-name">
                        🎧
                        <audio
                          controls
                          src={item.audio_url}
                        />
                      </div>
                    </td>

                    <td className="transcript">
                      {item.transcript || "No transcript available"}
                    </td>

                    <td>
                      <span
                        className={`sentiment ${getSentimentClass(
                          item.sentiment
                        )}`}
                      >
                        {item.sentiment === "positive" && "😊"}
                        {item.sentiment === "neutral" && "😐"}
                        {item.sentiment === "negative" && "😞"}

                        {item.sentiment || "Unknown"}
                      </span>
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}
