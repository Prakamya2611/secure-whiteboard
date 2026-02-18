import React, { useRef, useEffect, useState } from "react";

function App() {
  const canvasRef = useRef(null);
  const [room, setRoom] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [joined, setJoined] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const joinRoom = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/join-room/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ room, accessCode }),
      });

      if (response.status === 200) {
        setJoined(true);
      } else {
        alert("Invalid Room or Access Code");
      }
    } catch (error) {
      alert("Backend not running");
    }
  };

  useEffect(() => {
    if (!joined) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.lineCap = "round";
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#111";
  }, [joined]);

  const draw = (e) => {
    if (!isDrawing) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  if (!joined) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h2 style={styles.title}>Secure Whiteboard</h2>

          <input
            style={styles.input}
            placeholder="Room ID"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />

          <input
            style={styles.input}
            placeholder="Access Code"
            type="password"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
          />

          <button style={styles.button} onClick={joinRoom}>
            Join Room
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button style={styles.clearBtn} onClick={clearCanvas}>
        Clear
      </button>

      <canvas
        ref={canvasRef}
        style={{ background: "#ffffff", cursor: "crosshair" }}
        onMouseDown={() => setIsDrawing(true)}
        onMouseUp={() => setIsDrawing(false)}
        onMouseMove={draw}
      />
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #1f1c2c, #928dab)",
  },
  card: {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "15px",
    width: "320px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  title: {
    marginBottom: "25px",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  },
  clearBtn: {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "10px 20px",
    background: "#ff4d4d",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    zIndex: 1000,
  },
};

export default App;
