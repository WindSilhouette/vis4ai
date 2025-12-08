// src/components/TutorialOverlay.jsx
import { useEffect, useState } from "react";

const steps = [
  {
    id: "welcome",
    title: "Welcome to the Reinforcement Learning 101 👋",
    body: `
This page is a mini-course on reinforcement learning.

You’ll watch TWO agents learn in the SAME environment:

• Left panel: Tabular Q-Learning
• Right panel: Deep Q-Learning (DQN)

Use the tabs at the very top to switch between:
• CliffWalk — a gridworld navigation task
• CartPole — a classic balancing control task

We’ll walk through what RL is, how to read this interface, and
why choosing the wrong method for a problem can hurt performance.`,
    focusSide: "both",
    sectionId: "top-controls",
  },
  {
    id: "layout",
    title: "Layout of the Page",
    body: `
Look at the two big panels:

Each side (left and right) has the same structure:

1) Top of each panel:
   • Episode slider and Step slider (scrub through training)
2) Middle:
   • Environment visualization + current behavior/policy
3) Info cards:
   • Current state, chosen action, reward, and next state
4) Bottom:
   • The update rule and a reward-per-episode plot

Because both sides share the same layout, you can directly compare
how Q-Learning and DQN behave on the SAME task.`,
    focusSide: "both",
    sectionId: "panels-wrapper",
  },
  {
    id: "rl-core",
    title: "Reinforcement Learning in One Picture",
    body: `
Both sides visualize the core RL loop:

• STATE s — what the agent currently observes
• ACTION a — what it decides to do
• REWARD r — immediate feedback from the environment
• NEXT STATE s' — where it ends up after the action

Over many episodes, the agent tries to learn a POLICY:
a rule that maps states → actions to maximize long-term reward.

Both Q-Learning and DQN learn an action-value function Q(s,a)
that estimates “how good” each action is in each state.`,
    focusSide: "both",
    sectionId: "panels-wrapper",
  },
  {
    id: "cliffwalk-env",
    title: "CliffWalk Environment (Discrete Grid)",
    body: `
Now focus on the LEFT panel and make sure the environment at the top
is set to "CliffWalk":

• Each cell in the grid is a discrete STATE
• Actions are ↑ → ↓ ←
• Blue = start, Yellow = goal, Red = cliff, Green = agent

Stepping into the cliff gives a big negative reward.
Every move costs a small negative reward, so the agent wants a
short, SAFE path along the edge.

This is a small, nicely discrete world — perfect for a table-based
method like tabular Q-Learning.`,
    focusSide: "left",
    sectionId: "left-panel",
  },
  {
    id: "qlearning-good-match",
    title: "Why Q-Learning Fits CliffWalk",
    body: `
On the LEFT panel, Q-Learning stores Q(s,a) in a Q-TABLE.

Try this:

1) Move the Episode slider from early to late episodes.
2) Scrub the Step slider within an episode.

Watch how:

• The arrows or colors in the grid stabilize into a shortest safe path
• The Q-table under the grid (if shown) becomes more confident
• The reward-per-episode plot trends upward and then stabilizes

Here, tabular Q-Learning is efficient and interpretable:
you can literally look up “what the agent thinks” for each (s,a).`,
    focusSide: "left",
    sectionId: "left-panel",
  },
  {
    id: "dqn-on-cliffwalk",
    title: "DQN on CliffWalk: Overkill",
    body: `
Now look at the RIGHT panel while still on CliffWalk.

The environment is the SAME, but here Q(s,a) is approximated by
a neural network (DQN) instead of a table.

This has pros and cons:

• Pros:
  – Can scale to huge or continuous state spaces
  – Can generalize between similar states

• Cons on a tiny grid like CliffWalk:
  – More parameters to tune
  – Harder to interpret
  – Risk of overfitting or instability for no real benefit

CliffWalk is a case where a simple table is usually the better choice:
using DQN “works”, but it’s more complexity than you need.`,
    focusSide: "right",
    sectionId: "right-panel",
  },
  {
    id: "switch-cartpole",
    title: "Switch to CartPole 🕹️",
    body: `
Now let’s see the opposite scenario.

👉 At the very top of the page, CLICK the "CartPole" tab.

Both panels will switch to the CartPole environment.

CartPole state is continuous, typically something like:
[cart position, cart velocity, pole angle, pole angular velocity]

Actions are:
• push cart left
• push cart right

The goal is to keep the pole upright for as many time steps as possible.

Because the state is continuous, a naive Q-table either:
• explodes in size, or
• relies on very coarse discretization (losing information).`,
    focusSide: "both",
    sectionId: "top-controls",
  },
  {
    id: "qlearning-bad-match-cartpole",
    title: "Q-Learning Struggles on CartPole",
    body: `
Focus on the LEFT panel while CartPole is selected.

Try:

1) Move to early episodes — behavior is usually very unstable.
2) Move to much later episodes — performance may improve, but
   it often stays noisy or fragile.

Why? Because tabular Q-Learning has to discretize a continuous state:

• Many states that are actually different get merged into the same bin
• The agent cannot smoothly generalize to “nearby” states
• Small changes in angle/velocity can require very different actions

This is a case where the METHOD is a bad match for the PROBLEM.`,
    focusSide: "left",
    sectionId: "left-panel",
  },
  {
    id: "dqn-good-match-cartpole",
    title: "DQN on CartPole: Right Tool for the Job",
    body: `
Now look at the RIGHT panel for CartPole.

Here, DQN uses a neural network to approximate Q(s,a):

• Inputs: the continuous state values
• Hidden layers: learn useful features automatically
• Outputs: Q-values for each action (left/right)

Because the network is continuous, it can generalize:
states that are “similar” in angle/velocity correspond to similar Q-values.

Compare the reward-per-episode trend for DQN vs Q-Learning on CartPole:
DQN usually learns a more stable, high-reward policy.`,
    focusSide: "right",
    sectionId: "right-panel",
  },
  {
    id: "reward-curves",
    title: "Using Reward Curves to Judge Methods",
    body: `
Scroll down within each panel so you can see the reward-per-episode plots.

These curves summarize how well each method is doing:

• Early episodes: low reward and high variance (agent is exploring)
• As learning progresses:
  – Good methods: trend goes up and stabilizes
  – Poorly matched methods: trend is noisy or plateaus early

Try this experiment:

1) On CliffWalk:
   – Compare Q-Learning vs DQN reward curves.
   – Q-Learning often wins with simpler, cleaner learning.

2) On CartPole:
   – Compare the curves again.
   – DQN should typically achieve higher, more stable rewards.

This is how you can visually see when a method is “too simple”
or “too heavy” for a given task.`,
    focusSide: "both",
    sectionId: "panels-wrapper",
  },
  {
    id: "hands-on",
    title: "Hands-On: Explore Episodes and Steps",
    body: `
To really understand what the agents are doing:

1) Pick an environment (CliffWalk or CartPole).
2) Start at an early episode and scrub through the steps.
   – Watch how often the agent fails or falls.
3) Jump to a late episode and scrub again.
   – Look for more goal-directed, stable behavior.
4) Check how the update rule at the bottom changes Q(s,a) or the loss.

Use both sides together:

• Ask: “What is tabular Q-Learning seeing and updating?”
• Ask: “What is the DQN network learning and how fast?”`,
    focusSide: "both",
    sectionId: "panels-wrapper",
  },
  {
    id: "wrap-up",
    title: "Key Takeaways",
    body: `
You’ve seen two core ideas:

1) What reinforcement learning is:
   • Agents learn from repeated interaction using reward signals.
   • They approximate a policy (directly or via Q(s,a)).

2) Why method choice matters:
   • Discrete, small problems (like CliffWalk):
     – Simple tabular Q-Learning is efficient and interpretable.
   • Continuous or high-dimensional problems (like CartPole):
     – Function approximation (DQN) is often necessary.

This interface is meant as a sandbox:
revisit episodes, switch environments, and compare curves to build
intuition for when each method makes sense.

You can reopen this tutorial anytime with the "Tutorial" button
in the top bar.`,
    focusSide: "both",
    sectionId: "panels-wrapper",
  },
];

function TutorialOverlay({ onClose, onFocusChange, environment }) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === steps.length - 1;

  const requiresCartpole = step.id === "switch-cartpole";
  const nextDisabled =
    !isLast && requiresCartpole && environment !== "cartpole";

  // Tell App which side to focus (left / right / both)
  useEffect(() => {
    if (!onFocusChange) return;
    onFocusChange(step.focusSide || "both");
  }, [step.focusSide, onFocusChange]);

  // Highlight the relevant DOM section by id
  useEffect(() => {
    const prev = document.querySelectorAll(".tutorial-highlight");
    prev.forEach((el) => el.classList.remove("tutorial-highlight"));

    if (step.sectionId) {
      const el = document.getElementById(step.sectionId);
      if (el) {
        el.classList.add("tutorial-highlight");
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    return () => {
      const current = document.querySelectorAll(".tutorial-highlight");
      current.forEach((el) => el.classList.remove("tutorial-highlight"));
    };
  }, [step.sectionId]);

  const handleClose = () => {
    if (onFocusChange) onFocusChange(null);
    const current = document.querySelectorAll(".tutorial-highlight");
    current.forEach((el) => el.classList.remove("tutorial-highlight"));
    onClose?.();
  };

  // Keyboard navigation: ← → Esc
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") {
        if (isLast) {
          handleClose();
        } else if (!nextDisabled) {
          setStepIndex((i) => i + 1);
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
  }, [isFirst, isLast, nextDisabled]);

  // Position & dimming:
  //  - when focusSide === "left": overlay pushed RIGHT, no dim
  //  - when focusSide === "right": overlay pushed LEFT, no dim
  //  - when "both": centered with dimming
  const isSideFocused = step.focusSide === "left" || step.focusSide === "right";

  const backdropStyle = {
    position: "fixed",
    inset: 0,
    background: isSideFocused
      ? "transparent"
      : "rgba(15,23,42,0.45)",
    display: "flex",
    justifyContent:
      step.focusSide === "left"
        ? "flex-end" // show box on right, leave left clear
        : step.focusSide === "right"
        ? "flex-start" // show box on left, leave right clear
        : "center",
    alignItems: "center",
    padding: "5vh 3vw",
    zIndex: 12000,
    pointerEvents: "none",
  };

  const panelStyle = {
    width: "min(620px, 96vw)",
    maxHeight: "min(90vh, 580px)",
    background: "#ffffff",
    borderRadius: "18px",
    padding: "1.25rem 1.5rem 1.1rem",
    boxShadow: "0 18px 55px rgba(0,0,0,0.45)",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    pointerEvents: "auto",
    overflowY: "auto",
  };

  const titleStyle = {
    margin: 0,
    marginBottom: "0.6rem",
    fontSize: "clamp(1.1rem, 1.1vw + 0.95rem, 1.3rem)",
    fontWeight: 700,
    color: "#0f172a",
  };

  const bodyStyle = {
    fontSize: "clamp(0.87rem, 0.9vw + 0.65rem, 1rem)",
    lineHeight: 1.6,
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
            style={{
              ...primaryButton,
              opacity: nextDisabled ? 0.6 : 1,
              cursor: nextDisabled ? "default" : "pointer",
            }}
            disabled={nextDisabled}
            onClick={() => {
              if (isLast) {
                handleClose();
              } else if (!nextDisabled) {
                setStepIndex((i) => i + 1);
              }
            }}
          >
            {requiresCartpole && environment !== "cartpole"
              ? "Switch to CartPole ↑"
              : isLast
              ? "Start Exploring"
              : "Next →"}
          </button>
        </div>

        {requiresCartpole && environment !== "cartpole" && (
          <div
            style={{
              marginTop: "0.35rem",
              fontSize: "0.78rem",
              color: "#b91c1c",
              textAlign: "right",
            }}
          >
            Use the "CartPole" tab at the top of the page to continue.
          </div>
        )}
      </div>
    </div>
  );
}

export default TutorialOverlay;