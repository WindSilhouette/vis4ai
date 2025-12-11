import { useEffect, useState } from "react";
import dqnData from "../assets/dqn_cliffwalking.json";

const arrows = ["↑", "→", "↓", "←"];
const gridRows = 4;
const gridCols = 12;
const totalStates = gridRows * gridCols;
const cliffStates = Array.from({ length: 10 }, (_, i) => 37 + i);
const startState = 36;
const goalState = 47;

// ...imports and setup remain the same...

function DeepqCliffwalk({ episodeIndex, stepIndex, setEpisodeIndex, setStepIndex }) {
  const [episodes, setEpisodes] = useState([]);

  useEffect(() => setEpisodes(dqnData || []), []);

  if (!episodes.length) return <p>Loading...</p>;

  const currentEpisode = episodes[episodeIndex] || {};
  const steps = currentEpisode.steps || [];
  const safeStepIndex = Math.min(stepIndex, Math.max(steps.length - 1, 0));
  const currentStep = steps[safeStepIndex] || {};

  const state = currentStep.state || Array(totalStates).fill(0);
  const nextState = currentStep.next_state || state;
  const epsilon = currentStep.epsilon ?? 0;

  const qValues = currentStep.q_values || Array(4).fill(0);
  const nextQValues = currentStep.next_q_values || Array(4).fill(0);
  const chosenAction = currentStep.action ?? 0;

  const bestAction = nextQValues.indexOf(Math.max(...nextQValues));
  const nextMaxQ = Math.max(...nextQValues);
  const isGreedy = chosenAction === bestAction;

  const reward = currentStep.reward ?? 0;
  const target = reward + 0.99 * nextMaxQ;
  const loss = (target - qValues[chosenAction]) ** 2;

  const bestActionArrow = arrows[bestAction] ?? "?";
  const chosenActionArrow = arrows[chosenAction] ?? "?";

  const stateToCoord = (s) => `(${Math.floor(s / gridCols)},${s % gridCols})`;
  const currentStateIndex = state.findIndex((v) => v === 1) >= 0 ? state.findIndex((v) => v === 1) : 36; // fallback start

  return (
    <div style={{ maxWidth: "950px", margin: "auto", padding: "1rem", fontFamily: "Inter, sans-serif", background: "#fefefe", borderRadius: "16px", boxShadow: "0 6px 18px rgba(0,0,0,0.1)" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1rem", color: "#ff6600", fontSize: "1.3rem" }}>Deep Q-Learning (CliffWalk)</h2>

      {/* Sliders */}
      <div style={{ display: "flex", gap: "1.2rem", justifyContent: "center", marginBottom: "1rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <label style={{ fontSize: "0.85rem" }}>Episode: {episodeIndex}</label>
          <input type="range" min="0" max={episodes.length - 1} value={episodeIndex} onChange={(e) => { setEpisodeIndex(Number(e.target.value)); setStepIndex(0); }} style={{ width: "200px" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <label style={{ fontSize: "0.85rem" }}>Step: {safeStepIndex}</label>
          <input type="range" min="0" max={steps.length - 1} value={safeStepIndex} onChange={(e) => setStepIndex(Number(e.target.value))} style={{ width: "200px" }} />
        </div>
      </div>

      {/* CliffWalking Grid */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${gridCols}, 36px)`, gridTemplateRows: `repeat(${gridRows}, 36px)`, justifyContent: "center", margin: "auto", marginBottom: "1rem" }}>
        {Array.from({ length: totalStates }, (_, i) => {
          const isAgent = state[i] === 1;
          const isCliff = cliffStates.includes(i);
          const isStart = i === startState;
          const isGoal = i === goalState;
          let bg = "#000000e3";
          if (isCliff) bg = "#dc3545";
          if (isGoal) bg = "#ffc107";
          if (isStart) bg = "#0d6efd";
          if (isAgent) bg = "#28a745";

          return (
            <div key={i} style={{ border: "1px solid #444", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: isAgent ? "bold" : "500", fontSize: "0.85rem", backgroundColor: bg }}>
              {isStart ? "S" : isGoal ? "G" : isCliff ? "X" : isAgent ? "A" : ""}
            </div>
          );
        })}
      </div>

      {/* Color labels */}
        <div style={{ display: "flex", gap: "10px", fontSize: "0.8rem", flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}><div style={{ width: "16px", height: "16px", background: "#0d6efd" }} />Start</div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}><div style={{ width: "16px", height: "16px", background: "#ffc107" }} />Goal</div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}><div style={{ width: "16px", height: "16px", background: "#dc3545" }} />Cliff</div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}><div style={{ width: "16px", height: "16px", background: "#28a745" }} />Agent</div>
        </div>

      {/* Neural Network */}
      <h4 style={{ textAlign: "center", color: "#0077b6", fontWeight: "600", marginBottom: "0.5rem" }}>Policy (Neural Network)</h4>
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap", marginBottom: "1rem", alignItems: "center" }}>
        {/* Input */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", maxHeight: "200px", overflowY: "auto" }}>
          <p style={{ fontSize: "0.85rem", marginBottom: "4px" }}>Input (One-Hot)</p>

          {(() => {
            const rows = 4; // fixed for CliffWalk
            const itemsPerRow = Math.ceil(state.length / rows);

            const rowArrays = Array.from({ length: rows }, (_, row) =>
              state.slice(row * itemsPerRow, (row + 1) * itemsPerRow)
            );

            return (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {rowArrays.map((row, rowIndex) => (
                  <div key={rowIndex} style={{ display: "flex", flexDirection: "row", gap: "2px" }}>
                    {row.map((v, i) => {
                      const isLastRow = rowIndex === rows - 1;
                      const isFirstItem = i === 0;

                      // In the last row: keep only the FIRST circle
                      if (isLastRow && !isFirstItem) {
                        return null;
                      }

                      return (
                        <div
                          key={i}
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            backgroundColor: v ? "#0077b6" : "#d9e2ec"
                          }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        <div style={{ fontSize: "1.8rem", color: "#555" }}>→</div>

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
        <div style={{ fontSize: "1.8rem", color: "#555" }}>→</div>

        {/* Output */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <p style={{ fontSize: "0.85rem", marginBottom: "4px" }}>Output (Q-values)</p>
          {qValues.map((v, i) => (
            <div key={i} style={{ margin: "2px", width: "50px", height: "28px", borderRadius: "6px", backgroundColor: i === chosenAction ? "#cfe2ff" : "#e2e8f0", border: "1px solid #a3bffa", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "0.8rem" }}>
              {v.toFixed(2)}
            </div>
          ))}
        </div>
      </div>

      {/* Info Panels */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        <div style={{ flex: "1 1 240px", background: "#e0f7fa", padding: "0.8rem", borderRadius: "10px", fontSize: "0.8rem" }}>
            <p><b>Current State:</b> {stateToCoord(currentStateIndex)}</p>
            <p><b>Optimal Action (Max):</b> {bestActionArrow} ({nextMaxQ.toFixed(2)})</p>
            <p><b>Epsilon:</b> {epsilon.toFixed(2)}</p>
            <p><b>Chosen Action:</b> {chosenActionArrow} {isGreedy ? "(Greedy)" : "(Exploring)"}</p>
        </div>
        <div style={{ flex: "1 1 240px", background: "#fff3e0", padding: "0.8rem", borderRadius: "10px", fontSize: "0.8rem" }}>
            <p><b>Chosen Action Q-Value:</b> {qValues[chosenAction].toFixed(2)}</p>
            <p><b>Next State:</b> {stateToCoord(currentStateIndex)}</p>
            <p><b>Reward:</b> {reward}</p>
            <p><b>Next-State Optimal Action (Max):</b> {bestActionArrow} ({nextMaxQ.toFixed(2)})</p>
        </div>
        </div>


      {/* Loss Box */}
      <div style={{ background: "#f1f3f5", padding: "0.6rem 1rem", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", textAlign: "center", maxWidth: "560px", margin: "auto", fontSize: "0.8rem" }}>
        <h4 style={{ color: "#0077b6", marginBottom: "4px", fontSize: "0.85rem" }}>Update Rule</h4>
        <p style={{ margin: "3px 0" }}><b>Target:</b> r + γ max(Q_next) = {reward.toFixed(2)} + 0.99 × {nextMaxQ.toFixed(2)} = <b>{target.toFixed(2)}</b></p>
        <p style={{ margin: "3px 0" }}><b>Loss:</b> (Target − Q(s,a))² = ({target.toFixed(2)} − {qValues[chosenAction].toFixed(2)})² = <b>{loss.toFixed(3)}</b></p>
      </div>

    {/* Total Reward Line Plot */}
    <div style={{ marginTop: "2rem", width: "90%", maxWidth: "90%", margin: "auto" }}>
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
    <svg width="100%" height="200" viewBox="0 0 900 200" preserveAspectRatio="none">
        {(() => {
        if (!episodes.length) return null;

        const svgWidth = 900;
        const svgHeight = 150;
        const padding = 40;
        const maxEpisodes = 500; // X-axis 0→500

        // Collect total_reward at each episode
        const episodeRewards = episodes.map(ep => ({ episode: ep.episode, reward: ep.total_reward }));

        const stepX = (svgWidth - padding) / (maxEpisodes - 1);

        // Y scaling from min reward → 0
        const rewards = episodeRewards.map(r => r.reward);
        const minReward = Math.min(...rewards);
        const maxReward = 0;
        const scaleY = val => svgHeight - ((val - minReward) / (maxReward - minReward)) * (svgHeight - padding);

        // Build path
        let path = "";
        episodeRewards.forEach((r, i) => {
            if (r.episode > episodeIndex) return;
            const x = padding + r.episode * stepX;
            const y = scaleY(r.reward);
            path += i === 0 ? `M${x},${y}` : ` L${x},${y}`;
        });

        const yTicks = [minReward, (minReward + maxReward) / 2, maxReward];
        const xTicks = Array.from({ length: 11 }, (_, i) => i * 50); // 0,50,...500

        return (
            <>
            {/* Y-axis labels and grid lines */}
            {yTicks.map((val, i) => (
                <g key={`y-${i}`}>
                <text x={padding - 10} y={scaleY(val)} fontSize="10" textAnchor="end" alignmentBaseline="middle">
                    {val.toFixed(0)}
                </text>
                <line x1={padding} x2={svgWidth} y1={scaleY(val)} y2={scaleY(val)} stroke="#eee" />
                </g>
            ))}

            {/* X-axis line */}
            <line x1={padding} x2={svgWidth} y1={svgHeight} y2={svgHeight} stroke="#000" />

            {/* X-axis labels */}
            {xTicks.map((val, i) => {
                const x = padding + val * stepX;
                return (
                <g key={`x-${i}`}>
                    <text x={x} y={svgHeight + 12} fontSize="10" textAnchor="middle">{val}</text>
                    <line x1={x} x2={x} y1={svgHeight - 3} y2={svgHeight} stroke="#000" />
                </g>
                );
            })}

            {/* Line path */}
            <path d={path} fill="none" stroke="#0077b6" strokeWidth="3" />
            </>
        );
        })()}
    </svg>
    </div>


    </div>
  );
}

export default DeepqCliffwalk;




