import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import { io } from "socket.io-client";
import Login from "../components/Login";
import "../App.css";

const socket = io("https://poll-rooms-jyx9.onrender.com");

export default function Poll() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [voted, setVoted] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch poll initially
  useEffect(() => {
    api.get(`/polls/${id}`).then(res => setPoll(res.data));

    // ✅ NOW expecting FULL poll object
    socket.on(`poll-${id}`, updatedPoll => {
      setPoll(updatedPoll);
    });

    return () => socket.off(`poll-${id}`);
  }, [id]);

  if (!poll) {
  return (
    <div className="container">
      <div className="card">
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-btn"></div>
        <div className="skeleton skeleton-btn"></div>
        <div className="skeleton skeleton-btn"></div>
      </div>
    </div>
  );
}

  const isExpired =
    poll.expiresAt && new Date() > new Date(poll.expiresAt);

  const totalVotes = Array.isArray(poll.options)
    ? poll.options.reduce((sum, o) => sum + o.votes, 0)
    : 0;

  const vote = index => {
    if (!token || voted || isExpired) return;

    socket.emit("vote", {
      pollId: id,
      optionIndex: index,
      token
    });

    setVoted(true);
  };

  // 🔐 Require Google login before voting
  if (!token) {
    return <Login onLogin={() => window.location.reload()} />;
  }

  return (
    <div className="container">
      <h1>{poll.question}</h1>

      {isExpired && (
        <p className="expired">⏰ This poll has expired</p>
      )}

      <div className="card">
        {Array.isArray(poll.options) &&
          poll.options.map((o, i) => (
            <button
              key={i}
              className="vote-btn"
              onClick={() => vote(i)}
              disabled={voted || isExpired}
            >
              {o.text}
              <span>{o.votes}</span>
            </button>
          ))}
      </div>

      {/* 📊 RESULTS DASHBOARD */}
      <div className="dashboard">
        <h3>Results</h3>

        {Array.isArray(poll.options) &&
          poll.options.map((o, i) => {
            const percent =
              totalVotes === 0
                ? 0
                : Math.round((o.votes / totalVotes) * 100);

            return (
              <div key={i} className="result-row">
                <span>{o.text}</span>
                <div className="bar">
                  <div className="fill" style={{ width: `${percent}%` }}>
  <span className="percent">{percent}%</span>
</div>
                </div>
                <span>
                  {o.votes} votes ({percent}%)
                </span>
              </div>
            );
          })}

        <p>Total votes: {totalVotes}</p>
      </div>
    </div>
  );
}
