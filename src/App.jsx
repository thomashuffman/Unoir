import React, { useState } from "react";
import RunManager from "./run/runManager";
import "./App.css";

export default function App() {
  const [inRun, setInRun] = useState(false); // eventually you’ll have a title screen

  return (
    <div className="app-container">
      <h1 className="title">UNOIR Prototype</h1>
      {inRun ? (
        <RunManager onExitRun={() => setInRun(false)} />
      ) : (
        <div className="overlay">
          <h2>Welcome to UNOIR</h2>
          <button className="btn draw" onClick={() => setInRun(true)}>
            Start Run
          </button>
        </div>
      )}
    </div>
  );
}
