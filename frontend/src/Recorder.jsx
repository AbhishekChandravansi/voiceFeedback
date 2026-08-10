import { useRef, useState } from "react";
import api from "./api";
import "./Recorder.css";

export default function Recorder() {
  const recorder = useRef(null);
  const chunks = useRef([]);

  const [result, setResult] = useState("");
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      recorder.current = new MediaRecorder(stream);

      recorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.current.push(event.data);
        }
      };

      recorder.current.onstop = async () => {
        const blob = new Blob(chunks.current, {
          type: "audio/webm",
        });

        const form = new FormData();

        form.append("audio", blob, "voice.webm");
        // form.append("user_id", localStorage.getItem("user_id"));

        try {
          setUploading(true);

          const response = await api.post("/upload", form);

          setResult(
            `Transcript\n${response.data.transcript}\n\nSentiment\n${response.data.sentiment}`
          );
        } catch (error) {
          console.error(error);
          setResult(
            "Something went wrong while processing your recording."
          );
        } finally {
          setUploading(false);
        }

        chunks.current = [];
      };

      recorder.current.start();
      setRecording(true);
    } catch (error) {
      console.error(error);

      setResult(
        "Microphone permission is required to record audio."
      );
    }
  };

  const stop = () => {
    if (
      !recorder.current ||
      recorder.current.state === "inactive"
    ) {
      return;
    }

    recorder.current.stop();

    recorder.current.stream
      .getTracks()
      .forEach((track) => track.stop());

    setRecording(false);
  };

  return (
    <div className="recorder-page">
      <div className="recorder-card">

        <div className="icon-wrapper">
          🎙️
        </div>

        <h1>Voice Feedback</h1>

        <p className="subtitle">
          Share your thoughts using your voice
        </p>

        <div
          className={`mic-circle ${
            recording ? "recording" : ""
          }`}
        >
          <span>🎤</span>
        </div>

        {recording ? (
          <div className="recording-status">
            <span className="pulse"></span>
            Recording...
          </div>
        ) : (
          <div className="recording-status idle">
            Ready to record
          </div>
        )}

        <div className="buttons">
          {!recording ? (
            <button
              className="start-btn"
              onClick={start}
              disabled={uploading}
            >
              🎙 Start Recording
            </button>
          ) : (
            <button
              className="stop-btn"
              onClick={stop}
            >
              ⏹ Stop & Upload
            </button>
          )}
        </div>

        {uploading && (
          <div className="processing">
            <div className="spinner"></div>
            <span>Analyzing your feedback...</span>
          </div>
        )}

        {result && !uploading && (
          <div className="result-card">
            <h3>✨ Feedback Analysis</h3>

            <div className="result-content">
              {result}
            </div>
          </div>
        )}

        <p className="privacy">
          🔒 Your recording is securely processed
        </p>

      </div>
    </div>
  );
}

