import { useEffect, useState } from "react";
import fullHistoryData from "../assets/ql_cartpole.json";

const actionLabels = ["←", "→"];
const gamma = 0.99;
const alpha = 0.1;

function DeepqCartpole({ episodeIndex, stepIndex, setEpisodeIndex, setStepIndex }) {
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => setEpisodes(fullHistoryData || []), []);

  if (!episodes.length) return <p>Loading...</p>;

  const currentEpisode = episodes[episodeIndex] || { steps: [], total_reward: 0 };
  const steps = currentEpisode.steps || [];
  const safeStepIndex = Math.min(stepIndex, Math.max(steps.length - 1, 0));
  const currentStep = steps[safeStepIndex] || {};

  const state = currentStep.state || [0, 0, 0, 0];
  const nextState = currentStep.next_state || state;
  const epsilon = currentStep.epsilon ?? 0;
  const qValues = currentStep.q_values || [0, 0];
  const nextQValues = currentStep.next_q_values || [0, 0];
  const chosenAction = currentStep.action ?? 0;
  const reward = currentStep.reward ?? 0;

  const bestAction = qValues.indexOf(Math.max(...qValues));
  const isGreedy = chosenAction === bestAction;
  const nextMaxQ = Math.max(...nextQValues);
  const updatedQ = qValues[chosenAction] + alpha * (reward + gamma * nextMaxQ - qValues[chosenAction]);

  // Gradient colors for Q-table
  const allQ = qValues.concat(nextQValues);
  const minQ = Math.min(...allQ);
  const maxQ = Math.max(...allQ);

  const bgColorForQ = (val) => {
    const t = (val - minQ) / ((maxQ - minQ) || 1e-6);
    const low = { r: 185, g: 245, b: 225 };
    const mid = { r: 90, g: 200, b: 180 };
    const high = { r: 30, g: 105, b: 155 };
    let r, g, b;
    if (t < 0.5) {
      const p = t / 0.5;
      r = low.r + p * (mid.r - low.r);
      g = low.g + p * (mid.g - low.g);
      b = low.b + p * (mid.b - low.b);
    } else {
      const p = (t - 0.5) / 0.5;
      r = mid.r + p * (high.r - mid.r);
      g = mid.g + p * (high.g - mid.g);
      b = mid.b + p * (high.b - mid.b);
    }
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

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "#0077b6", fontSize: "1.3rem" }}>Q-Learning (CartPole)</h2>

      {/* Sliders */}
      <div style={{ display: "flex", gap: "1.2rem", justifyContent: "center", marginBottom: "1rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <label style={{ fontSize: "0.85rem", textAlign: "center" }}>Episode: {episodeIndex}</label>
          <input
            type="range"
            min="0"
            max={episodes.length - 1}
            value={episodeIndex}
            onChange={(e) => { setEpisodeIndex(Number(e.target.value)); setStepIndex(0); }}
            style={{ width: "200px" }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <label style={{ fontSize: "0.85rem", textAlign: "center" }}>Step: {safeStepIndex}</label>
          <input
            type="range"
            min="0"
            max={steps.length - 1}
            value={safeStepIndex}
            onChange={(e) => setStepIndex(Number(e.target.value))}
            style={{ width: "200px" }}
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


      {/* Q-table */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        width: "100%",
        margin: "1rem 0"
      }}>
        <h4 style={{ marginBottom: "0.4rem", color: "#0077b6", fontSize: "1rem", fontWeight: "600" }}>Policy (Q-values)</h4>
        <table style={{ width: "300px", margin: "0 auto", borderCollapse: "separate", borderSpacing: 0, fontSize: "0.75rem", boxShadow: "0 0 4px rgba(0,0,0,0.08)", borderRadius: "6px", overflow: "hidden" }}>
          <thead>
            <tr style={{ backgroundColor: "#e9ecef" }}>
              <th style={{ padding: "6px 8px", color: "#333", borderBottom: "1px solid #ccc", fontWeight: "600" }}>State</th>
              {actionLabels.map((a, i) => <th key={i} style={{ padding: "6px 8px", color: "#333", borderBottom: "1px solid #ccc", fontWeight: "600" }}>{a}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={actionLabels.length + 1} style={{ padding: "6px", textAlign: "center", color: "#777", backgroundColor: "#f9f9f9" }}>...</td>
            </tr>

            {[state, nextState].map((s, idx) => {
              const rowQValues = idx === 0 ? qValues : nextQValues;
              return (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#fcfcfc" : "#f4f4f4", borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "6px 8px", textAlign: "center", fontWeight: idx === 0 ? "bold" : "500", borderRight: "1px solid #ddd" }}>
                    [{s.map(v => v.toFixed(2)).join(", ")}]
                  </td>
                  {rowQValues.map((val, i) => {
                    const t = (val - minQ) / ((maxQ - minQ) || 1e-6);
                    const low = { r: 185, g: 245, b: 225 };
                    const mid = { r: 90, g: 200, b: 180 };
                    const high = { r: 30, g: 105, b: 155 };
                    let r, g, b;
                    if (t < 0.5) {
                      const p = t / 0.5;
                      r = low.r + p * (mid.r - low.r);
                      g = low.g + p * (mid.g - low.g);
                      b = low.b + p * (mid.b - low.b);
                    } else {
                      const p = (t - 0.5) / 0.5;
                      r = mid.r + p * (high.r - mid.r);
                      g = mid.g + p * (high.g - mid.g);
                      b = mid.b + p * (high.b - mid.b);
                    }
                    const bgColor = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
                    return (
                      <td key={i} style={{
                        padding: "6px 8px",
                        backgroundColor: bgColor,
                        fontWeight: idx === 0 && i === chosenAction ? "bold" : "500",
                        color: val > (minQ + maxQ) / 2 ? "white" : "black",
                        borderRight: i < rowQValues.length - 1 ? "1px solid #ddd" : "",
                        transition: "0.3s"
                      }} title={`Q(s=[${s.map(v=>v.toFixed(2)).join(", ")}], a=${actionLabels[i]}) = ${val.toFixed(2)}`}>
                        {val.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            <tr>
              <td colSpan={actionLabels.length + 1} style={{ padding: "6px", textAlign: "center", color: "#777", backgroundColor: "#f9f9f9" }}>...</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Current/Next Info Cards */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1.2rem" }}>
        <div style={{ flex: "1 1 240px", background: "#e0f7fa", padding: "0.8rem", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", minWidth: "220px", fontSize: "0.8rem" }}>
          <p><b>Current State:</b> [{state.map(v=>v.toFixed(2)).join(", ")}]</p>
          <p><b>Optimal Action (Max):</b> {actionLabels[bestAction]} ({Math.max(...qValues).toFixed(2)})</p>
          <p><b>Epsilon:</b> {epsilon.toFixed(2)}</p>
          <p><b>Chosen Action:</b> <span style={{ color: isGreedy ? "#007f00" : "#c1121f" }}>{actionLabels[chosenAction]}</span> {isGreedy ? "(Greedy)" : "(Exploring)"}</p>
        </div>
        <div style={{ flex: "1 1 240px", background: "#fff3e0", padding: "0.8rem", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", minWidth: "220px", fontSize: "0.8rem" }}>
          <p><b>Chosen Action Q-Value:</b> {qValues[chosenAction].toFixed(2)}</p>
          <p><b>Next State:</b> [{nextState.map(v=>v.toFixed(2)).join(", ")}]</p>
          <p><b>Reward:</b> {reward.toFixed(2)}</p>
          <p><b>Next-State Max Q:</b> {nextMaxQ.toFixed(2)}</p>
        </div>
      </div>

     {/* Q-update Card */}
    {/* Q-update Card */}
<div style={{
  background: "#f1f3f5",
  padding: "0.6rem 1rem",
  borderRadius: "10px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  textAlign: "center",
  maxWidth: "560px",
  margin: "auto",
  fontSize: "0.8rem",
  marginBottom: "1.5rem"
}}>
  <h4 style={{ color: "#0077b6", marginBottom: "4px", fontSize: "0.9rem" }}>Update Rule</h4>

  <p style={{ margin: "3px 0" }}>
    Q(s,a) ← Q(s,a) + α [ r + γ max(Q(next)) − Q(s,a) ]
  </p>

  <p style={{ margin: "3px 0", padding: "5px", borderRadius: "4px" }}>
    <b>{qValues[chosenAction].toFixed(2)}</b> + {alpha} × [ <b>{reward.toFixed(2)}</b> + {gamma} × (<b>{nextMaxQ.toFixed(2)}</b>) − (<b>{qValues[chosenAction].toFixed(2)}</b>) ] = <b>{updatedQ.toFixed(3)}</b>
  </p>

  <p style={{ margin: "3px 0" }}>
    Q-Table[State [{state.map(s => s.toFixed(2)).join(", ")}]][{actionLabels[chosenAction]}] = <b style={{ color: "#005f99" }}>{updatedQ.toFixed(3)}</b>
  </p>
</div>




      {/* Reward plot with axes */}
      <div style={{ marginTop: "2rem", maxWidth: "950px", margin: "auto" }}>
        <h4 style={{ textAlign: "center", color: "#0077b6", fontWeight: "600", marginBottom: "0.2rem", fontSize: "0.85rem" }}>Total Rewards per Episode</h4>
        <svg width="100%" height="180">
          {(() => {
            const rewards = episodes.slice(0, episodeIndex + 1).map(ep => ep.total_reward ?? 0);
            if (!rewards.length) return null;

            const svgWidth = 900;
            const svgHeight = 150;
            const padding = 40;
            const maxReward = Math.max(...rewards, 1);
            const minReward = Math.min(...rewards, 0);
            const maxEpisodes = 250;
            const stepX = (svgWidth - padding) / (maxEpisodes - 1);
            const scaleY = val => svgHeight - ((val - minReward) / (maxReward - minReward)) * svgHeight;

            let path = `M${padding},${scaleY(rewards[0])}`;
            rewards.forEach((val, i) => {
              const x = padding + i * stepX;
              const y = scaleY(val);
              if (i > 0) path += ` L${x},${y}`;
            });

            return (
              <svg width="100%" height="180" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
                {[minReward, (minReward + maxReward) / 2, maxReward].map((val, i) => (
                  <g key={i}>
                    <text x={padding-10} y={scaleY(val)} fontSize="10" textAnchor="end" alignmentBaseline="middle">{val.toFixed(1)}</text>
                    <line x1={padding} x2={svgWidth} y1={scaleY(val)} y2={scaleY(val)} stroke="#eee"/>
                  </g>
                ))}
                <line x1={padding} x2={svgWidth} y1={svgHeight} y2={svgHeight} stroke="#000" />
                {[0,50,100,150,200,250].map((val,i)=>(
                  <text key={i} x={padding+val*stepX} y={svgHeight+12} fontSize="10" textAnchor="middle">{val}</text>
                ))}
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

