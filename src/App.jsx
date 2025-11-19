// App.jsx
import { useState } from "react";
import Qlearning from "./components/Qlearning";
import Deepqlearning from "./components/Deepqlearning";
import TutorialOverlay from "./components/TutorialOverlay";

function App() {
  const [qEpisodeIndex, setQEpisodeIndex] = useState(0);
  const [qStepIndex, setQStepIndex] = useState(0);

  const [dqEpisodeIndex, setDQEpisodeIndex] = useState(0);
  const [dqStepIndex, setDQStepIndex] = useState(0);

  // tutorial + dimming state
  const [showTutorial, setShowTutorial] = useState(true);
  // "left" | "right" | "both" | null
  const [focusSide, setFocusSide] = useState("both");

  const containerStyle = {
    display: "flex",
    width: "99vw",
    height: "120vh",
  };

  const panelStyle = {
    width: "50%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  };

  const contentStyle = {
    flex: 1,
    overflowY: "auto",
    padding: "1rem",
  };

  const helpButtonWrapper = {
    position: "fixed",
    top: "30px",
    right: "30px",
    zIndex: 20,
  };

  const helpButtonStyle = {
    borderRadius: "999px",
    border: "none",
    padding: "0.35rem 0.75rem",
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
    background: "#f3f4ff",
    color: "#1d4ed8",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  };

  const isLeftFocused =
    !showTutorial || !focusSide || focusSide === "both" || focusSide === "left";

  const isRightFocused =
    !showTutorial || !focusSide || focusSide === "both" || focusSide === "right";

  return (
    <>
      {/* small '?' button to reopen the tutorial */}
      <div style={helpButtonWrapper}>
        <button
          style={helpButtonStyle}
          onClick={() => {
            setShowTutorial(true);
            setFocusSide("both");
          }}
        >
          (?) Tutorial
        </button>
      </div>

      <div style={containerStyle}>
        {/* Left Panel – Q-Learning (CliffWalk) */}
        <div
          style={{
            ...panelStyle,
            backgroundColor: "#e0e0e0ff",
            borderRight: "1px solid #ddd",
            opacity: isLeftFocused ? 1 : 0.25,
            boxShadow:
              isLeftFocused && showTutorial
                ? "0 0 0 3px rgba(37,99,235,0.35)"
                : "none",
            transform:
              isLeftFocused && showTutorial ? "scale(1.01)" : "scale(1)",
            transition:
              "opacity 220ms ease, transform 220ms ease, box-shadow 220ms ease",
          }}
        >
          <div style={contentStyle}>
            <Qlearning
              episodeIndex={qEpisodeIndex}
              stepIndex={qStepIndex}
              setEpisodeIndex={setQEpisodeIndex}
              setStepIndex={setQStepIndex}
            />
          </div>
        </div>

        {/* Right Panel – Deep Q-Learning (CartPole) */}
        <div
          style={{
            ...panelStyle,
            backgroundColor: "#e0e0e0ff",
            opacity: isRightFocused ? 1 : 0.25,
            boxShadow:
              isRightFocused && showTutorial
                ? "0 0 0 3px rgba(249,115,22,0.35)"
                : "none",
            transform:
              isRightFocused && showTutorial ? "scale(1.01)" : "scale(1)",
            transition:
              "opacity 220ms ease, transform 220ms ease, box-shadow 220ms ease",
          }}
        >
          <div style={contentStyle}>
            <Deepqlearning
              episodeIndex={dqEpisodeIndex}
              stepIndex={dqStepIndex}
              setEpisodeIndex={setDQEpisodeIndex}
              setStepIndex={setDQStepIndex}
            />
          </div>
        </div>
      </div>

      {showTutorial && (
        <TutorialOverlay
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



