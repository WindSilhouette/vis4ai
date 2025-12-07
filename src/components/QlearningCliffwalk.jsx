import { useEffect, useMemo, useState } from "react";
import trainingData from "../assets/ql_cliffwalking.json";

const arrows = ["↑", "→", "↓", "←"];

function QlearningCliffwalk({ episodeIndex, stepIndex, setEpisodeIndex, setStepIndex }) {
  const [log, setLog] = useState([]);
  const gridRows = 4;
  const gridCols = 12;
  const totalStates = gridRows * gridCols;
  const cliffStates = useMemo(() => Array.from({ length: 10 }, (_, i) => 37 + i), []);
  const startState = 36;
  const goalState = 47;

  // Load training data once
  useEffect(() => setLog(trainingData || []), []);

  const episodes = useMemo(() => [...new Set(log.map((x) => x.episode))].sort((a, b) => a - b), [log]);
  const currentEpisode = episodes[episodeIndex] ?? episodes[0];
  const episodeSteps = useMemo(() => log.filter((x) => x.episode === currentEpisode), [log, currentEpisode]);
  const safeStepIndex = Math.min(stepIndex, Math.max(episodeSteps.length - 1, 0));
  const current = episodeSteps[safeStepIndex];
  if (!log.length || !current) return <p>Loading...</p>;

  const { state, action, reward, qTable_snapshot, epsilon, new_state } = current;

  const bestActions = (qTable_snapshot || []).map(v => v.indexOf(Math.max(...v)));
  const qValues = qTable_snapshot?.[state] ?? [0, 0, 0, 0];
  const bestAction = bestActions[state];
  const isGreedy = action === bestAction;

  // Ensure next state is valid
  const displayNext = new_state ?? state;
  const nextMaxAction = bestActions[displayNext];
  const nextMaxQ = qTable_snapshot?.[displayNext]?.[nextMaxAction] ?? 0;

  const updatedQ = qValues[action] + 0.1 * (reward + 0.9 * nextMaxQ - qValues[action]);
  const allQ = qTable_snapshot.flat();
  const minQ = Math.min(...allQ);
  const maxQ = Math.max(...allQ);

  const stateToCoord = (s) => `(${Math.floor(s / gridCols)},${s % gridCols})`;

  const bgColorForQ = (val) => {
    const t = Math.max(0, Math.min(1, (val - minQ) / ((maxQ - minQ) || 1e-6)));
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

  const containerStyle = {
    maxWidth: "900px",
    margin: "auto",
    padding: "1.2rem",
    fontFamily: "Inter, sans-serif",
    background: "#fefefe",
    borderRadius: "16px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
  };

  const sliderStyle = { width: "200px" };
  const sliderContainerStyle = {
    display: "flex",
    gap: "1.2rem",
    justifyContent: "center",
    marginBottom: "1rem",
    flexWrap: "wrap",
  };
  const labelStyle = { fontSize: "0.85rem", textAlign: "center" };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: "center", marginBottom: "0.8rem", color: "#0077b6", fontSize: "1.3rem" }}>
        Q-Learning (CliffWalk)
      </h2>

      {/* Sliders */}
<div style={sliderContainerStyle}>
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <label style={{ ...labelStyle, fontSize: "0.85rem" }}>Episode: {episodeIndex}</label>
    <input
      type="range"
      min="0"
      max={episodes.length - 1}
      value={episodeIndex}
      onChange={(e) => { setEpisodeIndex(Number(e.target.value)); setStepIndex(0); }}
      style={{ ...sliderStyle, width: "200px" }}
    />
  </div>
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <label style={{ ...labelStyle, fontSize: "0.85rem" }}>Step: {safeStepIndex}</label>
    <input
      type="range"
      min="0"
      max={Math.max(episodeSteps.length - 1, 0)}
      value={safeStepIndex}
      onChange={(e) => setStepIndex(Number(e.target.value))}
      style={{ ...sliderStyle, width: "200px" }}
    />
  </div>
</div>


      {/* Grid */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${gridCols}, 36px)`, gridTemplateRows: `repeat(${gridRows}, 36px)`, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          {Array.from({ length: totalStates }, (_, i) => {
            const isAgent = i === state, isCliff = cliffStates.includes(i), isStart = i === startState, isGoal = i === goalState;
            let bg = "#000000e3";
            if (isCliff) bg = "#dc3545";
            if (isGoal) bg = "#ffc107";
            if (isStart) bg = "#0d6efd";
            if (isAgent) bg = "#28a745";
            return (
              <div key={i} style={{ border: "1px solid #444", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: isAgent ? "bold" : "500", fontSize: "0.85rem", backgroundColor: bg, transition: "0.3s" }} title={`State ${stateToCoord(i)}`}>
                {isStart ? "S" : isGoal ? "G" : isCliff ? "X" : arrows[bestActions[i]]}
              </div>
            );
          })}
        </div>
      </div>

      {/* Color labels */}
        <div style={{ display: "flex", gap: "10px", fontSize: "0.8rem", flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}><div style={{ width: "16px", height: "16px", background: "#0d6efd" }} />Start</div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}><div style={{ width: "16px", height: "16px", background: "#ffc107" }} />Goal</div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}><div style={{ width: "16px", height: "16px", background: "#dc3545" }} />Cliff</div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}><div style={{ width: "16px", height: "16px", background: "#28a745" }} />Agent</div>
        </div>

      {/* Q-table */}
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <h4 style={{ marginBottom: "0.4rem", color: "#0077b6", fontSize: "1rem", fontWeight: "600" }}>Policy (Q-table)</h4>
        <table style={{ margin: "auto", borderCollapse: "separate", borderSpacing: 0, fontSize: "0.75rem", minWidth: "260px", boxShadow: "0 0 4px rgba(0,0,0,0.08)", borderRadius: "6px", overflow: "hidden" }}>
          <thead>
            <tr style={{ backgroundColor: "#e9ecef" }}>
              <th style={{ padding: "6px 8px", color: "#333", borderBottom: "1px solid #ccc", fontWeight: "600" }}>State</th>
              {arrows.map((a, i) => <th key={i} style={{ padding: "6px 8px", color: "#333", borderBottom: "1px solid #ccc", fontWeight: "600" }}>{a}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={arrows.length + 1} style={{ padding: "6px", textAlign: "center", color: "#777", backgroundColor: "#f9f9f9" }}>...</td>
            </tr>

            {[state, displayNext].map((s, idx) => {
              const rowQValues = qTable_snapshot?.[s] ?? [0, 0, 0, 0];
              return (
                <tr key={`${s}-${idx}`} style={{ backgroundColor: idx % 2 === 0 ? "#fcfcfc" : "#f4f4f4", borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "6px 8px", textAlign: "center", fontWeight: s === state ? "bold" : "500", borderRight: "1px solid #ddd" }}>{stateToCoord(s)}</td>
                  {arrows.map((_, i) => (
                    <td key={i} style={{ padding: "6px 8px", backgroundColor: bgColorForQ(rowQValues[i]), fontWeight: s === state && i === action ? "bold" : "500", color: rowQValues[i] > (minQ + maxQ) / 2 ? "white" : "black", borderRight: i < arrows.length - 1 ? "1px solid #ddd" : "", transition: "0.3s" }} title={`Q(s=${stateToCoord(s)}, a=${arrows[i]}) = ${rowQValues[i].toFixed(2)}`}>{rowQValues[i].toFixed(2)}</td>
                  ))}
                </tr>
              );
            })}

            <tr>
              <td colSpan={arrows.length + 1} style={{ padding: "6px", textAlign: "center", color: "#777", backgroundColor: "#f9f9f9" }}>...</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Current vs Action Info */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1.2rem" }}>
        <div style={{ flex: "1 1 240px", background: "#e0f7fa", padding: "0.8rem", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", minWidth: "220px", fontSize: "0.8rem" }}>
          <p><b>Current State:</b> {stateToCoord(state)}</p>
          <p><b>Optimal Action (Max):</b> {arrows[bestAction]} ({qTable_snapshot?.[state]?.[bestAction]?.toFixed(2)})</p>
          <p><b>Epsilon:</b> {epsilon?.toFixed(2) ?? "N/A"}</p>
          <p><b>Chosen Action:</b> <span style={{ color: isGreedy ? "#007f00" : "#c1121f" }}>{arrows[action]}</span> {isGreedy ? "(Greedy)" : "(Exploring)"}</p>
        </div>
        <div style={{ flex: "1 1 240px", background: "#fff3e0", padding: "0.8rem", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)", minWidth: "220px", fontSize: "0.8rem" }}>
          <p><b>Chosen Action Q-Value:</b> {qValues[action].toFixed(2)}</p>
          <p><b>Next State:</b> {stateToCoord(displayNext)}</p>
          <p><b>Reward:</b> {reward}</p>
          <p><b>Next-State Optimal Action (Max):</b> {arrows[nextMaxAction] ?? "-"} ({nextMaxQ?.toFixed(2) ?? "N/A"})</p>
        </div>
      </div>

      {/* Q-update formula */}
      <div style={{ background: "#f1f3f5", padding: "0.6rem 1rem", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", textAlign: "center", maxWidth: "560px", margin: "auto", fontSize: "0.8rem" }}>
        <h4 style={{ color: "#0077b6", marginBottom: "4px", fontSize: "0.9rem" }}>Update Rule</h4>
        <p style={{ margin: "3px 0" }}>Q(s,a) ← Q(s,a) + α [ r + γ max(Q(s′,a′)) − Q(s,a) ]</p>
        <p style={{ margin: "3px 0", padding: "5px", borderRadius: "4px" }}>
          <b>{qValues[action].toFixed(2)}</b> + 0.1 × [ <b>{reward}</b> + 0.9 × (<b>{nextMaxQ.toFixed(2)}</b>) − (<b>{qValues[action].toFixed(2)}</b>) ]
        </p>
        <p style={{ margin: "3px 0" }}>Q-Table[{stateToCoord(state)}][{arrows[action]}] = <b style={{ color: "#005f99" }}>{updatedQ.toFixed(3)}</b></p>
      </div>

      {/* Reward plot */}
      <div style={{ marginTop: "2rem", width: "90%", maxWidth: "900px", margin: "auto" }}>
        <h4 style={{ textAlign: "center", color: "#0077b6", fontWeight: "600", marginBottom: "0.2rem", fontSize: "0.85rem" }}>Total Rewards per Episode</h4>
        <svg width="100%" height="200" viewBox="0 0 900 200" preserveAspectRatio="none">
          {(() => {
            if (!log.length) return null;

            const svgWidth = 900;
            const svgHeight = 150;
            const padding = 40;
            const maxEpisodes = 500;

            const episodeRewards = [];
            const seenEpisodes = new Set();
            log.forEach(step => {
              if (step.done && !seenEpisodes.has(step.episode)) {
                episodeRewards.push({ episode: step.episode, reward: step.total_reward_so_far });
                seenEpisodes.add(step.episode);
              }
            });

            if (!episodeRewards.length) return null;

            const rewards = episodeRewards.map(r => r.reward);
            const minReward = Math.min(...rewards);
            const maxReward = Math.max(...rewards);

            const stepX = (svgWidth - padding) / (maxEpisodes - 1);
            const scaleY = val => svgHeight - ((val - minReward) / ((maxReward - minReward) || 1)) * (svgHeight - padding);

            let path = "";
            episodeRewards.forEach((r, i) => {
              if (r.episode > episodeIndex) return;
              const x = padding + r.episode * stepX;
              const y = scaleY(r.reward);
              path += i === 0 ? `M${x},${y}` : ` L${x},${y}`;
            });

            const yTicks = [minReward, (minReward + maxReward) / 2, maxReward];
            const xTicks = Array.from({ length: 11 }, (_, i) => i * 50);

            return (
              <>
                {yTicks.map((val, i) => (
                  <g key={`y-${i}`}>
                    <text x={padding - 10} y={scaleY(val)} fontSize="10" textAnchor="end" alignmentBaseline="middle">{val.toFixed(0)}</text>
                    <line x1={padding} x2={svgWidth} y1={scaleY(val)} y2={scaleY(val)} stroke="#eee" />
                  </g>
                ))}
                <line x1={padding} x2={svgWidth} y1={svgHeight} y2={svgHeight} stroke="#000" />
                {xTicks.map((val, i) => {
                  const x = padding + val * stepX;
                  return (
                    <g key={`x-${i}`}>
                      <text x={x} y={svgHeight + 12} fontSize="10" textAnchor="middle">{val}</text>
                      <line x1={x} x2={x} y1={svgHeight - 3} y2={svgHeight} stroke="#000" />
                    </g>
                  );
                })}
                <path d={path} fill="none" stroke="#0077b6" strokeWidth="3" />
              </>
            );
          })()}
        </svg>
      </div>
    </div>
  );
}

export default QlearningCliffwalk;


















