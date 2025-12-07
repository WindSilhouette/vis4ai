// App.jsx
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
  const [focusSide, setFocusSide] = useState("both");

  const [environment, setEnvironment] = useState("cliffwalk"); // "cliffwalk" or "cartpole"

  const headerHeight = 50; // height of top buttons
  const containerStyle = {
    display: "flex",
    width: "100%",
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

  const buttonWrapperStyle = {
    display: "flex",
    justifyContent: "center",
    padding: "0.5rem",
    gap: "1rem",
    background: "#f8f9fa",
    borderBottom: "1px solid #ddd",
    height: `${headerHeight}px`,
    boxSizing: "border-box",
    width: "100%",        // <-- force full width
    position: "sticky",   // optional: stay on top when scrolling
    top: 0,               // required if sticky
    left: 0,
    zIndex: 10,
  };


  const toggleButtonStyle = {
    padding: "0.4rem 0.8rem",
    fontSize: "0.9rem",
    cursor: "pointer",
    borderRadius: "6px",
    border: "1px solid #ccc",
    background: "#fff",
  };

  const isLeftFocused =
    !showTutorial || !focusSide || focusSide === "both" || focusSide === "left";

  const isRightFocused =
    !showTutorial || !focusSide || focusSide === "both" || focusSide === "right";

  return (
    <>
      {/* Top Buttons */}
      <div style={buttonWrapperStyle}>
        <button
          style={toggleButtonStyle}
          onClick={() => setEnvironment("cliffwalk")}
          disabled={environment === "cliffwalk"}
        >
          CliffWalk
        </button>
        <button
          style={toggleButtonStyle}
          onClick={() => setEnvironment("cartpole")}
          disabled={environment === "cartpole"}
        >
          CartPole
        </button>

        {/* Small '?' button to reopen tutorial */}
        <button
          style={{ ...toggleButtonStyle, marginLeft: "auto" }}
          onClick={() => {
            setShowTutorial(true);
            setFocusSide("both");
          }}
        >
          Tutorial
        </button>
      </div>

      <div style={containerStyle}>
        <div style={panelsWrapperStyle}>
          {/* Left Panel */}
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

          {/* Right Panel */}
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
              {/* Mirror panel shows same environment */}
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



