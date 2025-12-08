// src/App.jsx
import { useState } from "react";
import QlearningCliffwalk from "./components/QlearningCliffwalk";
import DeepqCliffwalk from "./components/DeepqCliffwalk";
import TutorialOverlay from "./components/TutorialOverlay";
import DeepqCartpole from "./components/DeepqCartpole";
import QlearningCartpole from "./components/QlearningCartpole";

function App() {
  const [qEpisodeIndex, setQEpisodeIndex] = useState(0);
  const [qStepIndex, setQStepIndex] = useState(0);

  const [dqEpisodeIndex, setDQEpisodeIndex] = useState(0);
  const [dqStepIndex, setDQStepIndex] = useState(0);

  const [showTutorial, setShowTutorial] = useState(true);
  const [focusSide, setFocusSide] = useState("both"); // "left" | "right" | "both" | null

  const [environment, setEnvironment] = useState("cliffwalk"); // "cliffwalk" or "cartpole"

  const headerHeight = 56;

  const containerStyle = {
    display: "flex",
    width: "100vw",
    height: `calc(100vh - ${headerHeight}px)`,
    overflow: "hidden",
    flexDirection: "column",
  };

  const panelsWrapperStyle = {
    display: "flex",
    flex: 1,
    overflow: "hidden",
  };

  const panelStyle = {
    flex: 1,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    border: "1px solid #e5e7eb",
    backgroundColor: "#e5e7eb",
    transition:
      "opacity 220ms ease, transform 220ms ease, box-shadow 220ms ease",
  };

  const contentStyle = {
    flex: 1,
    overflowY: "auto",
    padding: "1rem",
  };

  const buttonWrapperStyle = {
    display: "flex",
    alignItems: "center",
    padding: "0.5rem 0.75rem",
    gap: "0.75rem",
    background: "#f8fafc",
    borderBottom: "1px solid #e5e7eb",
    position: "relative",
    height: `${headerHeight}px`,
    boxSizing: "border-box",
  };

  const toggleButtonStyle = {
    padding: "0.35rem 0.9rem",
    fontSize: "0.9rem",
    cursor: "pointer",
    borderRadius: "999px",
    border: "1px solid #cbd5f5",
    background: "#ffffff",
    fontWeight: 500,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "96px",
  };

  const tutorialButtonStyle = {
    ...toggleButtonStyle,
    marginLeft: "auto",
    borderColor: "#2563eb",
    color: "#2563eb",
  };

  const isLeftFocused =
    !showTutorial || !focusSide || focusSide === "both" || focusSide === "left";

  const isRightFocused =
    !showTutorial || !focusSide || focusSide === "both" || focusSide === "right";

  return (
    <>
      {/* Top controls: environment tabs + tutorial button */}
      <div id="top-controls" style={buttonWrapperStyle}>
        <button
          style={{
            ...toggleButtonStyle,
            background:
              environment === "cliffwalk" ? "#2563eb" : toggleButtonStyle.background,
            color: environment === "cliffwalk" ? "#ffffff" : "#111827",
            borderColor: environment === "cliffwalk" ? "#2563eb" : "#cbd5f5",
          }}
          onClick={() => setEnvironment("cliffwalk")}
          disabled={environment === "cliffwalk"}
        >
          CliffWalk
        </button>

        <button
          style={{
            ...toggleButtonStyle,
            background:
              environment === "cartpole" ? "#2563eb" : toggleButtonStyle.background,
            color: environment === "cartpole" ? "#ffffff" : "#111827",
            borderColor: environment === "cartpole" ? "#2563eb" : "#cbd5f5",
          }}
          onClick={() => setEnvironment("cartpole")}
          disabled={environment === "cartpole"}
        >
          CartPole
        </button>

        {/* Reopen tutorial */}
        <button
          style={tutorialButtonStyle}
          onClick={() => {
            setShowTutorial(true);
            setFocusSide("both");
          }}
        >
          Tutorial
        </button>
      </div>

      {/* Main two-panel layout */}
      <div style={containerStyle}>
        <div id="panels-wrapper" style={panelsWrapperStyle}>
          {/* Left Panel: Q-learning side */}
          <div
            id="left-panel"
            style={{
              ...panelStyle,
              opacity: isLeftFocused ? 1 : 0.25,
              boxShadow:
                isLeftFocused && showTutorial
                  ? "0 0 0 3px rgba(37,99,235,0.35)"
                  : "none",
              transform: isLeftFocused && showTutorial ? "scale(1.01)" : "scale(1)",
            }}
          >
            <div style={contentStyle}>
              {environment === "cliffwalk" && (
                <QlearningCliffwalk
                  episodeIndex={qEpisodeIndex}
                  stepIndex={qStepIndex}
                  setEpisodeIndex={setQEpisodeIndex}
                  setStepIndex={setQStepIndex}
                />
              )}
              {environment === "cartpole" && (
                <QlearningCartpole
                  episodeIndex={qEpisodeIndex}
                  stepIndex={qStepIndex}
                  setEpisodeIndex={setQEpisodeIndex}
                  setStepIndex={setQStepIndex}
                />
              )}
            </div>
          </div>

          {/* Right Panel: DQN side */}
          <div
            id="right-panel"
            style={{
              ...panelStyle,
              opacity: isRightFocused ? 1 : 0.25,
              boxShadow:
                isRightFocused && showTutorial
                  ? "0 0 0 3px rgba(249,115,22,0.35)"
                  : "none",
              transform: isRightFocused && showTutorial ? "scale(1.01)" : "scale(1)",
            }}
          >
            <div style={contentStyle}>
              {environment === "cliffwalk" && (
                <DeepqCliffwalk
                  episodeIndex={dqEpisodeIndex}
                  stepIndex={dqStepIndex}
                  setEpisodeIndex={setDQEpisodeIndex}
                  setStepIndex={setDQStepIndex}
                />
              )}
              {environment === "cartpole" && (
                <DeepqCartpole
                  episodeIndex={dqEpisodeIndex}
                  stepIndex={dqStepIndex}
                  setEpisodeIndex={setDQEpisodeIndex}
                  setStepIndex={setDQStepIndex}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {showTutorial && (
        <TutorialOverlay
          environment={environment}
          onClose={() => {
            setShowTutorial(false);
            setFocusSide(null);
          }}
          onFocusChange={setFocusSide}
        />
      )}
    </>
  );
}

export default App;




