import { useState } from "react";
import { api } from "../api";
import "../App.css";

export default function CreatePoll() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [expiry, setExpiry] = useState("");
  const [pollLink, setPollLink] = useState("");
  const [copied, setCopied] = useState(false);

  const addOption = () => setOptions([...options, ""]);

  const removeOption = index => {
    if (options.length <= 2) return;
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index, value) => {
    const copy = [...options];
    copy[index] = value;
    setOptions(copy);
  };

  const submit = async e => {
    e.preventDefault();

    const cleanOptions = options
      .map(o => o.trim())
      .filter(o => o !== "");

    if (cleanOptions.length < 2) {
      alert("At least 2 options are required");
      return;
    }

    const normalized = cleanOptions.map(o => o.toLowerCase());
    if (new Set(normalized).size !== normalized.length) {
      alert("Duplicate options are not allowed");
      return;
    }

    try {
      const payload = {
        question: question.trim(),
        options: cleanOptions,
        expiresAt: expiry ? expiry : null
      };

      console.log("SENDING POLL:", payload);

      const res = await api.post("/polls", payload);
      setPollLink(`${window.location.origin}/poll/${res.data._id}`);

    } catch (err) {
      console.error("CREATE POLL ERROR:", err);

      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Something went wrong while creating the poll");
      }
    }
  };

  return (
    <div className="container">
      <h1>Create Poll</h1>

      <form onSubmit={submit} className="card">
        <input
          className="input"
          placeholder="Poll question"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          required
        />

        <label>Expiry (optional)</label>
        <input
          type="datetime-local"
          className="input"
          value={expiry}
          onChange={e => setExpiry(e.target.value)}
        />

        <h3>Options</h3>

        {options.map((opt, i) => (
          <div key={i} className="option-row">
            <input
              className="input"
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={e => updateOption(i, e.target.value)}
              required
            />
            <button
              type="button"
              className="danger"
              onClick={() => removeOption(i)}
            >
              ✕
            </button>
          </div>
        ))}

        <button type="button" className="secondary" onClick={addOption}>
          + Add Option
        </button>

        <button type="submit" className="primary">
          Create Poll
        </button>
      </form>

      {pollLink && (
        <div className="card">
          <h3>Share your poll</h3>
          <input className="input" value={pollLink} readOnly />
          <button
  className="primary"
  onClick={() => {
    navigator.clipboard.writeText(pollLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }}
>
  {copied ? "Link copied ✓" : "Copy link"}
</button>
        </div>
      )}
    </div>
  );
}