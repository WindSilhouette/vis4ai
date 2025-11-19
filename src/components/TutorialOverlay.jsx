// src/components/TutorialOverlay.jsx
import { useEffect, useState } from "react";

const steps = [
  {
    title: "Welcome to the RL Playground 👋",
    body: `
This interface replays training for two reinforcement learning agents:

• Left: Q-Learning on the CliffWalk grid.
• Right: Deep Q-Learning (DQN) on CartPole.

We'll walk through what RL is, how these problems are similar/different,
and how the two algorithms work.`,
    focus: "both",
  },
  {
    title: "What is Reinforcement Learning?",
    body: `
Reinforcement Learning (RL) is about an AGENT interacting with an ENVIRONMENT.

On each step:
• The agent is in some STATE s,
• Chooses an ACTION a,
• The environment returns a REWARD r and a new STATE s'.

The goal in both panels is the same:
Learn a POLICY (a rule for choosing actions) that maximizes long-term reward.`,
    focus: "both",
  },
  {
    title: "CliffWalk: Discrete Gridworld",
    body: `
On the left, CliffWalk is a discrete grid:

• States = each cell (finite).
• Actions = ↑ → ↓ ←.
• Green = agent, Blue = start, Yellow = goal, Red = cliff.

Falling into the cliff gives a big negative reward (-100), and moving a step yields a cost of -1. The agent must learn the fastest safe path along the cliff edge to reach the goal.`,
    focus: "left",
  },
  {
    title: "Q-Learning & the Q-Table",
    body: `
Q-Learning stores a value Q(s,a) for every (state, action) pair
in a Q-TABLE.

• The table below the grid shows Q(s,a).
• The arrows on the grid show the greedy action: argmax_a Q(s,a).
• As episodes progress, these values update and the path improves.

This only works nicely because CliffWalk has a small, discrete state space.`,
    focus: "left",
  },
  {
    title: "The Q-Learning Update Rule",
    body: `
At the bottom left, you see the Q-Learning update:

  Q(s,a) ← Q(s,a) + α [ r + γ max_a' Q(s',a') − Q(s,a) ]

The blue/orange cards show:
• Current state, chosen action, reward, next state,
• The exact numbers plugged into the formula,
• The updated Q(s,a) value in the table.`,
    focus: "left",
  },
  {
    title: "CartPole: Continuous Control",
    body: `
On the right, CartPole is a continuous control problem:

STATE = [cart position, cart velocity, pole angle, pole angular velocity] (infinite)
ACTIONS = push cart left or right.

This is still RL (state, action, reward), but the state space is continuous. However, we can't make a Q-table with infinitely many rows.`,
    focus: "right",
  },
  {
    title: "Deep Q-Learning (DQN)",
    body: `
To handle continuous states, we approximate Q(s,a) with a neural network.

• Left side shows the input state values.
• Middle "black box" is the hidden layer(s).
• Right side shows output Q-values for actions ← and →.

The chosen action is highlighted. Epsilon controls how often
we explore (random action) vs exploit (greedy action).`,
    focus: "right",
  },
  {
    title: "DQN Update & Loss",
    body: `
At the bottom right, you see the DQN target and loss:

  Target = r + γ max_a' Q_target(s',a')
  Loss   = (Target − Q(s,a))²

As you scrub through episodes and steps, you can watch how the target and loss evolve while the agent learns to balance the pole. The loss is used to update the weights of the neural network instead of updating a cell in a Q-table.`,
    focus: "right",
  },
  {
    title: "How the Two Problems Connect",
    body: `
Both CliffWalk and CartPole are RL tasks:

• An agent interacts with an environment.
• Both use Q-values and Bellman's idea of bootstrapping.
• Both try to maximize long-term reward over an episode.

They differ in representation:
• CliffWalk: small, discrete states → tabular Q-Learning is perfect.
• CartPole: continuous states → we need function approximation (DQN).`,
    focus: "both",
  },
  {
    title: "Using This Interface",
    body: `
1) Use the Episode slider to move forward/backward in training.
2) Use the Step slider to visualize a single episode.
3) On the left, watch how the Q-table and policy (arrows) improve.
4) On the right, watch how the network's Q-values and loss evolve.

You can reopen this tutorial anytime with the "?" button in the top-right.`,
    focus: "both",
  },
];

function TutorialOverlay({ onClose, onFocusChange }) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;
  const currentFocus = step.focus || "both";

  // tell App which side to dim
  useEffect(() => {
    if (onFocusChange) onFocusChange(currentFocus);
  }, [currentFocus, onFocusChange]);

  const handleClose = () => {
    if (onFocusChange) onFocusChange(null);
    onClose?.();
  };

  // keyboard navigation: ← → Esc
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") {
        if (!isLast) {
          setStepIndex((i) => i + 1);
        } else {
          handleClose();
        }
      } else if (e.key === "ArrowLeft") {
        if (!isFirst) {
          setStepIndex((i) => i - 1);
        }
      } else if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isFirst, isLast]);

  const backdropStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.40)",
    display: "flex",
    justifyContent:
      currentFocus === "left"
        ? "flex-end" // dialog opposite side so sim stays visible
        : currentFocus === "right"
        ? "flex-start"
        : "center",
    alignItems: currentFocus === "both" ? "center" : "flex-start",
    padding: "5vh 3vw",
    zIndex: 9999,
    pointerEvents: "none", // only panel is interactive
  };

  const panelStyle = {
    width:
      currentFocus === "both"
        ? "min(560px, 96vw)"
        : "min(480px, 96vw)", // a bit narrower when hugging sides
    maxHeight: "min(90vh, 560px)",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "1.25rem 1.4rem 1.1rem",
    boxShadow: "0 16px 48px rgba(0,0,0,0.35)",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    pointerEvents: "auto",
    overflowY: "auto", // scroll if window is short
  };

  const titleStyle = {
    margin: 0,
    marginBottom: "0.6rem",
    fontSize: "clamp(1.05rem, 1.1vw + 0.9rem, 1.25rem)",
    fontWeight: 700,
    color: "#0f172a",
  };

  const bodyStyle = {
    fontSize: "clamp(0.85rem, 0.9vw + 0.6rem, 0.98rem)",
    lineHeight: 1.55,
    whiteSpace: "pre-line",
    color: "#111827",
  };

  const footerStyle = {
    marginTop: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.75rem",
  };

  const buttonBase = {
    borderRadius: "999px",
    border: "none",
    padding: "0.5rem 1rem",
    fontSize: "0.85rem",
    fontWeight: 600,
    cursor: "pointer",
  };

  const primaryButton = {
    ...buttonBase,
    background: "#2563eb",
    color: "white",
  };

  const secondaryButton = {
    ...buttonBase,
    background: "#e5e7eb",
    color: "#111827",
  };

  const skipButton = {
    position: "absolute",
    top: "0.6rem",
    right: "0.8rem",
    background: "transparent",
    border: "none",
    color: "#6b7280",
    fontSize: "0.8rem",
    cursor: "pointer",
  };

  return (
    <div style={backdropStyle}>
      <div style={panelStyle}>
        <button style={skipButton} onClick={handleClose}>
          Skip ✕
        </button>

        <h3 style={titleStyle}>{step.title}</h3>
        <p style={bodyStyle}>{step.body}</p>

        <div style={footerStyle}>
          <button
            style={{ ...secondaryButton, opacity: isFirst ? 0.5 : 1 }}
            onClick={() => !isFirst && setStepIndex((i) => i - 1)}
            disabled={isFirst}
          >
            ← Back
          </button>

          <div
            style={{
              fontSize: "0.8rem",
              color: "#6b7280",
              flex: 1,
              textAlign: "center",
            }}
          >
            Step {stepIndex + 1} / {steps.length}
          </div>

          <button
            style={primaryButton}
            onClick={() => {
              if (isLast) {
                handleClose();
              } else {
                setStepIndex((i) => i + 1);
              }
            }}
          >
            {isLast ? "Start Exploring" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TutorialOverlay;
