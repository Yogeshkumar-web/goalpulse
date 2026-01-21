"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type GuestTask = {
  id: string;
  title: string;
  completed: boolean;
};

// Initial demo tasks to show potential users
const DEMO_TASKS: GuestTask[] = [
  { id: "1", title: "Start your first focused work session", completed: true },
  { id: "2", title: "Plan tomorrow's goals", completed: false },
  { id: "3", title: "Review code changes", completed: false },
  { id: "4", title: "Take a 5-minute break", completed: false },
];

export default function GuestDashboard() {
  const [tasks, setTasks] = useState<GuestTask[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Load from local storage or set initial demo tasks
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("guest_tasks");
    if (saved) {
      setTasks(JSON.parse(saved));
    } else {
      setTasks(DEMO_TASKS);
      localStorage.setItem("guest_tasks", JSON.stringify(DEMO_TASKS));
    }
  }, []);

  const toggleTask = (id: string) => {
    const newTasks = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t,
    );
    setTasks(newTasks);
    localStorage.setItem("guest_tasks", JSON.stringify(newTasks));
  };

  const handleAddTaskAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    setShowLoginPrompt(true);
  };

  // Calculate progress
  const completedCount = tasks.filter((t) => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <div
      className="container animate-fade-in-up"
      style={{ marginTop: "var(--spacing-12)" }}
    >
      {/* Header / Hero Area */}
      <div style={{ textAlign: "center", marginBottom: "var(--spacing-12)" }}>
        <h1
          style={{
            fontSize: "3.5rem",
            marginBottom: "var(--spacing-4)",
            letterSpacing: "-0.02em",
          }}
        >
          Master Your <span className="text-gradient">Daily Flow</span>
        </h1>
        <p
          style={{
            fontSize: "1.25rem",
            color: "var(--text-secondary)",
            maxWidth: "600px",
            margin: "0 auto var(--spacing-8)",
          }}
        >
          Track tasks, build momentum, and achieve your goals.
          <br />
          Try the demo below instantly.
        </p>

        <div className="flex-center" style={{ gap: "var(--spacing-4)" }}>
          <Link href="/auth/login" className="btn btn-primary">
            Get Started Free
          </Link>
          <Link href="#demo-board" className="btn btn-secondary">
            Try Demo Board
          </Link>
        </div>
      </div>

      {/* Guest Dashboard Board */}
      <div
        id="demo-board"
        className="glass-card"
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "var(--spacing-8)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Glow effect behind */}
        <div
          style={{
            position: "absolute",
            top: "-50%",
            left: "50%",
            transform: "translate(-50%, 0)",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(0, 230, 118, 0.1) 0%, transparent 70%)",
            zIndex: -1,
            pointerEvents: "none",
          }}
        />

        <div
          className="flex-between"
          style={{ marginBottom: "var(--spacing-6)" }}
        >
          <div>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>
              Today's Focus
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                color: "var(--primary)",
                lineHeight: 1,
              }}
            >
              {Math.round(progress)}%
            </div>
            <div
              style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}
            >
              Daily Completion
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            height: "6px",
            backgroundColor: "var(--surface-hover)",
            borderRadius: "var(--radius-full)",
            marginBottom: "var(--spacing-8)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              backgroundColor: "var(--primary)",
              borderRadius: "var(--radius-full)",
              transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>

        {/* Task Input (Fake) */}
        <form
          onSubmit={handleAddTaskAttempt}
          style={{ marginBottom: "var(--spacing-8)", position: "relative" }}
        >
          <div style={{ display: "flex", gap: "var(--spacing-2)" }}>
            <input
              type="text"
              placeholder="Add a new task..."
              style={{
                flex: 1,
                padding: "1rem",
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                color: "var(--text-primary)",
                fontSize: "1rem",
              }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ minWidth: "100px" }}
            >
              Add
            </button>
          </div>

          {/* Login Prompt Overlay/Tooltip */}
          {showLoginPrompt && (
            <div
              className="animate-fade-in"
              style={{
                position: "absolute",
                top: "110%",
                left: 0,
                right: 0,
                backgroundColor: "var(--surface-active)",
                border: "1px solid var(--primary)",
                padding: "1rem",
                borderRadius: "var(--radius-md)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                zIndex: 10,
              }}
            >
              <span>
                🚀 <strong>Level up!</strong> Create an account to add custom
                tasks and track history.
              </span>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Link
                  href="/auth/login"
                  className="btn btn-primary"
                  style={{ padding: "0.5rem 1rem", fontSize: "0.8rem" }}
                >
                  Login
                </Link>
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="btn btn-ghost"
                  style={{ padding: "0.5rem", fontSize: "1.2rem" }}
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Task List */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--spacing-3)",
          }}
        >
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "1rem",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                transition: "all 0.2s",
                opacity: task.completed ? 0.7 : 1,
              }}
              className="hover:border-primary-hover"
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  border: `2px solid ${task.completed ? "var(--primary)" : "var(--text-muted)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "1rem",
                  backgroundColor: task.completed
                    ? "var(--primary)"
                    : "transparent",
                  transition: "all 0.2s",
                }}
              >
                {task.completed && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>

              <span
                style={{
                  flex: 1,
                  textDecoration: task.completed ? "line-through" : "none",
                  color: task.completed
                    ? "var(--text-muted)"
                    : "var(--text-primary)",
                }}
              >
                {task.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Social Proof / Trusted By (Optional Polish) */}
      <div
        style={{
          textAlign: "center",
          marginTop: "var(--spacing-12)",
          color: "var(--text-muted)",
          fontSize: "0.875rem",
        }}
      >
        <p>Join thousands of developers staying consistent every day.</p>
      </div>
    </div>
  );
}
