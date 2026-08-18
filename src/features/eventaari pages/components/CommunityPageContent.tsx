"use client";

import { useState } from "react";
import {
  badges,
  challenges,
  leaderboard,
  USER_PROGRESS,
} from "../data/demoData";
import { useUserProgress } from "./UserProgressContext";

export default function CommunityPageContent() {
  const {
    completedChallengeIds,
    progress,
    resetChallenges,
    toggleChallenge,
  } = useUserProgress();
  const [sparkle, setSparkle] = useState(false);

  function handleChallenge(id: string) {
    const wasCompleted = completedChallengeIds.includes(id);
    toggleChallenge(id);
    if (!wasCompleted) {
      setSparkle(true);
      window.setTimeout(() => setSparkle(false), 1300);
    }
  }

  return (
    <main className="page-content community-page-content">
      <section className="community-intro-panel">
        <div>
          <p className="eyebrow">Community page</p>
          <h1>Gain rewards from local activities</h1>
          <p>
            lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            euismod, nunc ut aliquam aliquam, nunc nisl aliquet nunc, eget
            aliquam nisl nunc eget nunc. Sed euismod, nunc ut aliquam aliquam,
            nunc nisl aliquet nunc, eget aliquam nisl nunc eget nunc.
          </p>
        </div>
        <div className="hero-stat-card">
          <strong>{completedChallengeIds.length}</strong>
          <span>completed challenges</span>
        </div>
      </section>

      <section className="profile-progress-panel">
        <div className="text-panel compact-panel">
          <p className="eyebrow">Current level</p>
          <h2>{progress.levelLabel}</h2>
          <p className="level-current-xp">
            {progress.currentLevelXP} / {USER_PROGRESS.xpPerLevel} XP
          </p>
          <p><span>{progress.neededXP}</span> XP needed for the next level.</p>
          <div className="xp-bar large">
            <div
              className={`xp-fill ${sparkle ? "sparkle" : ""}`}
              style={{ width: `${progress.progressPercent}%` }}
            />
          </div>
        </div>
        <div className="text-panel compact-panel">
          <p className="eyebrow">Profile</p>
          <h2>Badges + levels</h2>
          <p>This could show something related to the profile.</p>
        </div>
      </section>

      <div className="community-top-grid">
        <section id="badges" className="community-section badges-section">
          <div className="section-title-row">
            <div>
              <p className="eyebrow">Achievements</p>
              <h2>Student badges/achievements</h2>
            </div>
          </div>
          <div className="badge-grid">
            {badges.map((badge) => {
              const unlocked =
                completedChallengeIds.length >= badge.requirement;
              return (
                <article
                  className={`badge-card ${unlocked ? "" : "locked"}`}
                  key={badge.title}
                >
                  <div className="badge-icon">{badge.icon}</div>
                  <h3>{badge.title}</h3>
                  <p>{badge.description}</p>
                  <p className="badge-goal"><strong>Goal:</strong> {badge.goal}</p>
                  <p className="reward-text">
                    {unlocked ? "Unlocked" : "Locked in demo"}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="community-section leaderboard-section">
          <div className="section-title-row compact-title">
            <div>
              <p className="eyebrow">Progress</p>
              <h2>Leaderboard</h2>
            </div>
          </div>
          <div className="leaderboard-list">
            {leaderboard.map((user, index) => (
              <article className="leaderboard-row" key={user.name}>
                <div className="leaderboard-rank">{index + 1}</div>
                <div className="leaderboard-avatar">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt={`${user.name} profile picture`} />
                  ) : (
                    user.initials
                  )}
                </div>
                <div className="leaderboard-name">{user.name}</div>
                <div className="leaderboard-level">
                  {user.name === "Demo User" ? progress.levelLabel : user.level}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="community-section">
        <div className="section-title-row">
          <div>
            <p className="eyebrow">daily tasks</p>
            <h2>Local challenges</h2>
          </div>
          <button
            className="button button-secondary small-button"
            type="button"
            onClick={resetChallenges}
          >
            Reset progress
          </button>
        </div>
        <div className="challenge-grid">
          {challenges.map((challenge) => {
            const completed = completedChallengeIds.includes(challenge.id);
            return (
              <article
                className={`challenge-card ${completed ? "completed" : ""}`}
                key={challenge.id}
              >
                <div className="reward-text">{challenge.reward}</div>
                <h3>{challenge.title}</h3>
                <p>{challenge.description}</p>
                <button
                  className={`button ${completed ? "button-secondary" : "button-primary"}`}
                  type="button"
                  onClick={() => handleChallenge(challenge.id)}
                >
                  {completed ? "Completed" : "Mark complete"}
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
