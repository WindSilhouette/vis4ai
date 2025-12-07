import { useEffect, useState } from "react";
import fullHistoryData from "../assets/dqn_cartpole.json";

const actionLabels = ["←", "→"];
const gamma = 0.99;

function DeepqCartpole({ episodeIndex, stepIndex, setEpisodeIndex, setStepIndex }) {
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => setEpisodes(fullHistoryData || []), []);

  if (!episodes.length) return <p>Loading...</p>;

  const currentEpisode = episodes[episodeIndex] || {};
  const steps = currentEpisode.steps || [];
  const safeStepIndex = Math.min(stepIndex, Math.max(steps.length - 1, 0));
  const currentStep = steps[safeStepIndex] || {};

  const state = currentStep.state || [0, 0, 0, 0];
  const nextState = currentStep.next_state || state;
  const epsilon = currentStep.epsilon ?? 0;

  const qValues = currentStep.q_values || [0, 0];
  const nextQValues = currentStep.next_q_values || [0, 0];
  const chosenAction = currentStep.action ?? 0;

  const bestAction = qValues.indexOf(Math.max(...qValues));
  const isGreedy = chosenAction === bestAction;

  const reward = currentStep.reward ?? 0;
  const nextMaxAction = nextQValues.indexOf(Math.max(...nextQValues));
  const nextMaxQ = Math.max(...nextQValues);

  const target = reward + gamma * nextMaxQ;
  const loss = (target - qValues[chosenAction]) ** 2;

  // Q-value heatmap
  const minQ = Math.min(...qValues.concat(nextQValues));
  const maxQ = Math.max(...qValues.concat(nextQValues));
  const bgColorForQ = (val) => {
    const t = (val - minQ) / ((maxQ - minQ) || 1e-6);
    const r = 200 - t * 100;
    const g = 220 + t * 20;
    const b = 255 - t * 80;
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
  };

  // CartPole visualization
  const x = state[0] ?? 0;
  const theta = state[2] ?? 0;
  const poleAngleDeg = theta * (180 / Math.PI);

  const containerStyle = {
  maxWidth: "100%",  // Changed from "950px"
  margin: "auto",
  padding: "1rem",
  fontFamily: "Inter, sans-serif",
  background: "#fefefe",
  borderRadius: "16px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.1)"
};

  const sliderStyle = { width: "200px" };
  const sliderContainerStyle = {
    display: "flex",
    gap: "1.2rem",
    justifyContent: "center",
    marginBottom: "1rem",
    flexWrap: "wrap"
  };
  const labelStyle = { fontSize: "0.85rem", textAlign: "center" };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "#ff6600", fontSize: "1.3rem" }}>
        Deep Q-Learning (CartPole)
      </h2>

      {/* Sliders */}
      <div style={sliderContainerStyle}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <label style={labelStyle}>Episode: {episodeIndex}</label>
          <input
            type="range"
            min="0"
            max={episodes.length - 1}
            value={episodeIndex}
            onChange={(e) => {
              setEpisodeIndex(Number(e.target.value));
              setStepIndex(0);
            }}
            style={sliderStyle}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <label style={labelStyle}>Step: {safeStepIndex}</label>
          <input
            type="range"
            min="0"
            max={steps.length - 1}
            value={safeStepIndex}
            onChange={(e) => setStepIndex(Number(e.target.value))}
            style={sliderStyle}
          />
        </div>
      </div>

            {/* CartPole */}
      <div style={{
  width: "300px",
  textAlign: "center",
  height: "140px",
  position: "relative",
  border: "2px solid #333",
  borderRadius: "12px",
  backgroundColor: "#f0f4f8",
  margin: "auto",
  boxShadow: "inset 0 0 6px rgba(0,0,0,0.05)"
}}>
  <div style={{
    position: "absolute",
    bottom: "12px",
    left: 0,
    width: "100%",
    height: "3px",
    backgroundColor: "#888"
  }} />

  {/* Cart */}
  <div style={{
    position: "absolute",
    bottom: "15px",
    left: `${((x + 2.4) / 4.8) * 300}px`,
    width: "40px",
    height: "20px",
    backgroundColor: "#0077b6",
    borderRadius: "5px",
    transform: "translateX(-50%)",
    boxShadow: "0 1.5px 3px rgba(0,0,0,0.2)"
  }} />

  {/* Pole */}
  <div style={{
    position: "absolute",
    bottom: "35px",
    left: `${((x + 2.4) / 4.8) * 300}px`,
    width: "6px",
    height: "90px",
    backgroundColor: "#ffbf00",
    transformOrigin: "bottom center",
    transform: `translateX(-50%) rotate(${poleAngleDeg}deg)`,
    borderRadius: "3px",
    boxShadow: "0 1.5px 3px rgba(0,0,0,0.2)"
  }} />
</div>


      {/* Neural Network Visualization */}
      <h4
        style={{
          textAlign: "center",
          color: "#0077b6",
          fontWeight: "600",
          marginTop: "1rem",
          marginBottom: "0.5rem",
        }}
      >
        Policy (Neural Network)
      </h4>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "2rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        {/* Input Layer */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p style={{ fontWeight: "600", fontSize: "0.85rem", marginBottom: "0.3rem" }}>Input (State)</p>
          {state.map((v, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "3px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "#d9e2ec",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "600",
                  color: "#102a43",
                  fontSize: "0.75rem",
                  marginBottom: "2px",
                }}
              >
                {v.toFixed(2)}
              </div>
              <span style={{ fontSize: "0.7rem", color: "#555" }}>
                {["Cart Pos", "Cart Vel", "Pole Angle", "Pole Vel"][i]}
              </span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: "1.8rem", color: "#555", marginTop: "0.8rem" }}>→</div>

        {/* Hidden Layer */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p style={{ fontWeight: "600", fontSize: "0.85rem", marginBottom: "0.3rem" }}>Hidden Layer</p>
          <div
            style={{
              width: "80px",
              height: "80px",
              background: "linear-gradient(145deg, #ffeccc, #ffdda1)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              fontWeight: "bold",
              color: "#7a4900",
              fontSize: "0.85rem",
              boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
            }}
          >
            Black Box
          </div>
        </div>

        <div style={{ fontSize: "1.8rem", color: "#555", marginTop: "0.8rem" }}>→</div>

        {/* Output Layer */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p style={{ fontWeight: "600", fontSize: "0.85rem", marginBottom: "0.3rem" }}>Output (Actions)</p>
          {qValues.map((v, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "3px",
              }}
            >
              <div
                style={{
                  width: "60px",
                  height: "34px",
                  borderRadius: "10px",
                  backgroundColor: i === chosenAction ? "#cfe2ff" : "#e2e8f0",
                  border: "1px solid #a3bffa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "600",
                  fontSize: "0.75rem",
                }}
              >
                {v.toFixed(2)}
              </div>
              <span style={{ fontSize: "0.7rem", color: "#555" }}>{actionLabels[i]}</span>
            </div>
          ))}
        </div>
      </div>



      {/* Current vs Next State Info */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
          marginTop: "1rem",
          marginBottom: "1.2rem"
        }}
      >
        {/* Left Panel: Current State */}
        <div
          style={{
            flex: "1 1 240px",
            background: "#e0f7fa",
            padding: "0.8rem",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            minWidth: "220px",
            fontSize: "0.8rem"
          }}
        >
          <p>
            <b>Current State:</b> [{state.map((v) => v.toFixed(2)).join(", ")}]
          </p>
          <p>
            <b>Optimal Action (Max):</b>{" "}
            {actionLabels[qValues.indexOf(Math.max(...qValues))]} ({Math.max(...qValues).toFixed(2)})
          </p>
          <p>
            <b>Epsilon:</b> {epsilon.toFixed(2)}
          </p>
          <p>
            <b>Chosen Action:</b>{" "}
            <span style={{ color: isGreedy ? "#007f00" : "#c1121f" }}>
              {actionLabels[chosenAction]}
            </span>{" "}
            {isGreedy ? "(Greedy)" : "(Exploring)"}
          </p>
        </div>

        {/* Right Panel: Next State / Target */}
        <div
          style={{
            flex: "1 1 240px",
            background: "#fff3e0",
            padding: "0.8rem",
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            minWidth: "220px",
            fontSize: "0.8rem"
          }}
        >
          <p>
            <b>Chosen Action Q-Value:</b> {qValues[chosenAction].toFixed(2)}
          </p>
          <p>
            <b>Next State:</b> [{nextState.map((v) => v.toFixed(2)).join(", ")}]
          </p>
          <p>
            <b>Reward:</b> {reward.toFixed(2)}
          </p>
          <p>
            <b>Next-State Optimal Action (Max):</b> {actionLabels[nextMaxAction]} (
            {nextMaxQ.toFixed(2)})
          </p>
        </div>
      </div>

      {/* Deep Q-Learning Target & Loss */}
      <div
        style={{
          background: "#f1f3f5",
          padding: "0.6rem 1rem",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          textAlign: "center",
          maxWidth: "560px",
          margin: "auto",
          fontSize: "0.8rem",
          marginTop: "1rem"
        }}
      >
        <h4 style={{ color: "#0077b6", marginBottom: "4px", fontSize: "0.9rem" }}>
          Update Rule
        </h4>

        <p style={{ margin: "3px 0" }}>
          <b>Target:</b> r + γ max(Q_target(s′,a′)) = {reward.toFixed(2)} + {gamma} ×{" "}
          {nextMaxQ.toFixed(2)} = <b>{target.toFixed(2)}</b>
        </p>

        <p style={{ margin: "3px 0" }}>
          <b>Loss:</b> (Target − Q(s,a))² = ({target.toFixed(2)} − {qValues[chosenAction].toFixed(2)}
          )² = <b style={{ color: "#005f99" }}>{loss.toFixed(3)}</b>
        </p>
      </div>

    {/* Total Reward Line Plot */}
<div style={{ marginTop: "2rem", maxWidth: "950px", margin: "auto" }}>
  <h4
    style={{
      textAlign: "center",
      color: "#0077b6",
      fontWeight: "600",
      marginBottom: "0.2rem",
      fontSize: "0.85rem"
    }}
  >
    Total Rewards per Episode
  </h4>
  <svg width="100%" height="180">
    {(() => {
      if (!episodes.length) return null;

      const rewards = episodes
        .slice(0, episodeIndex + 1)
        .map(ep => ep.total_reward ?? 0);

      if (!rewards.length) return null;

      const svgWidth = 900; // virtual width for calculations
      const svgHeight = 150;
      const padding = 40;

      const maxReward = Math.max(...rewards, 1);
      const minReward = Math.min(...rewards, 0);

      const maxEpisodes = 250;
      const stepX = (svgWidth - padding) / (maxEpisodes - 1);

      const scaleY = val => svgHeight - ((val - minReward) / (maxReward - minReward)) * svgHeight;

      // Build path
      let path = `M${padding},${scaleY(rewards[0])}`;
      rewards.forEach((val, i) => {
        const x = padding + i * stepX;
        const y = scaleY(val);
        path += ` L${x},${y}`;
      });

      // Use viewBox to scale to container width
      return (
        <svg width="100%" height="180" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          {/* Y-axis labels and grid lines */}
          {[minReward, (minReward + maxReward) / 2, maxReward].map((val, i) => (
            <g key={i}>
              <text
                x={padding - 10}
                y={scaleY(val)}
                fontSize="10"
                textAnchor="end"
                alignmentBaseline="middle"
              >
                {val.toFixed(1)}
              </text>
              <line
                x1={padding}
                x2={svgWidth}
                y1={scaleY(val)}
                y2={scaleY(val)}
                stroke="#eee"
              />
            </g>
          ))}

          {/* X-axis */}
          <line x1={padding} x2={svgWidth} y1={svgHeight} y2={svgHeight} stroke="#000" />

          {/* X-axis labels */}
          {[0, 50, 100, 150, 200, 250].map((val, i) => (
            <text
              key={i}
              x={padding + val * stepX}
              y={svgHeight + 12}
              fontSize="10"
              textAnchor="middle"
            >
              {val}
            </text>
          ))}

          {/* Reward line */}
          <path d={path} fill="none" stroke="#0077b6" strokeWidth="3" />
        </svg>
      );
    })()}
  </svg>
</div>


    </div>
  );
}

export default DeepqCartpole;






