/* =========================================================
   EVENTAARI OFFLINE JAVASCRIPT
   Works without internet connection or external libraries.

   File structure:
   1. Demo data
   2. Helper functions
   3. Header interactions
   4. Events page functions
   5. Calendar functions
   6. Community page functions
   7. Page initialization
========================================================= */

/* =========================================================
   1. DEMO DATA
========================================================= */
const STORAGE_KEYS = {
  customEvents: "eventaari_custom_events_familiar_structure",
  completedChallenges: "eventaari_completed_challenges_familiar_structure"
};

const USER_PROGRESS = {
  baseXP: 1375,
  xpPerLevel: 2000,
  levelNames: {
    1: "Explorer",
    2: "Event Scout",
    3: "Bus Stop Hero",
    4: "Party Animal",
    5: "Coffee Commander",
    6: "Badge Collector",
    7: "Local Legend"
  }
};

const baseEvents = [
  {
    id: "fight-club-festival",
    title: "Fight club Festival",
    category: "Music",
    displayDate: "24.09.1984",
    calendarDate: "1984-09-24",
    time: "18:00",
    location: "Land somewhere far",
    description: "A totally normal music event. Nothing suspicious. Please do not ask what the first rule is."
  },
  {
    id: "lorem-exhibition-night",
    title: "Lorem ipsum Exhibition Night",
    category: "Culture",
    displayDate: "25.01.2028",
    calendarDate: "2028-01-25",
    time: "12:00",
    location: "Isengard",
    description: "A culture evening for people who enjoy placeholder text, dramatic towers and questionable travel plans."
  },
  {
    id: "does-anybody-read-these",
    title: "Does anybody even read these?",
    category: "Sports",
    displayDate: "26.02.3000",
    calendarDate: "3000-02-26",
    time: "10:00",
    location: "The sun",
    description: "Extreme sports taken maybe a little too literally. Sunscreen is probably not enough."
  },
  {
    id: "space-food-market",
    title: "Space Food Market",
    category: "Food",
    displayDate: "27.02.2029",
    calendarDate: "2029-02-27",
    time: "16:00",
    location: "In the spaceship",
    description: "Taste food that is definitely edible and probably not floating away from the plate."
  },
  {
    id: "community-heist",
    title: "Community Heist",
    category: "Community",
    displayDate: "28.08.2035",
    calendarDate: "2035-08-28",
    time: "14:00",
    location: "it's a secret",
    description: "A mysterious community event. The location is secret, but somehow everyone knows where to go."
  }
];

const challenges = [
  {
    id: "first-event",
    title: "Attend your first event",
    reward: "+100 XP",
    description: "Open the Events page and pick one event that looks interesting enough to leave the house for."
  },
  {
    id: "new-category",
    title: "Try a new category",
    reward: "+150 XP",
    description: "Explore a category you would not normally choose, even if it sounds new."
  },
  {
    id: "coffee-quest",
    title: "Find the coffee route",
    reward: "+200 XP",
    description: "Discover an event or place that could reasonably lead to coffee. Very important student research."
  },
  {
    id: "last-bus",
    title: "Catch the last bus",
    reward: "+250 XP",
    description: "Attend an evening event and still make it home. Via train or bus. Or teleportation if you are lucky."
  }
];

const badges = [
  {
    title: "Party Animal",
    icon: "🎤",
    requirement: 1,
    goal: "attend 1 student-style event.",
    description: "You survived your first student-style event and lived to tell the story."
  },
  {
    title: "Badge Hunter",
    icon: "🧵",
    requirement: 2,
    goal: "Collect events from 3 different categories.",
    description: "For users who collect experiences like overall patches."
  },
  {
    title: "cafestronaut Veteran",
    icon: "☕",
    requirement: 2,
    goal: "Attend 2 café, food or campus break events.",
    description: "You understand that coffee is basically student fuel."
  },
  {
    title: "Overalls Hero",
    icon: "🚌",
    requirement: 3,
    goal: "Attend 1 evening event.",
    description: "You made it home after an evening event. Somehow."
  },
  {
    title: "Torille!",
    icon: "🏆",
    requirement: 3,
    goal: "Save or attend 1 local city event.",
    description: "A badge for finding something worth leaving the house for."
  },
  {
    title: "Restaraunt Master",
    icon: "🌭",
    requirement: 3,
    goal: "Save or attend 1 food or market event.",
    description: "You found a food event that feels suspiciously Finnish."
  },
  {
    title: "Sisu Mode",
    icon: "🧊",
    requirement: 4,
    goal: "Complete 3 local challenges.",
    description: "You explored even when staying inside would have been easier."
  },
  {
    title: "Local Legend",
    icon: "📍",
    requirement: 4,
    goal: "Complete 5 local challenges in the full version.",
    description: "You are starting to look like someone who knows the city."
  }
];

const leaderboard = [
  // Profile picture placeholder:
  // Add a real image later by putting the file into assets/ and filling profileImage.
  // Example: { name: "Aino Karttunen", level: "Level 7 Local Legend", initials: "AK", profileImage: "assets/aino.png" }
  { name: "Spurdo spärdö", level: "Level 7 Local Legend", initials: "AK", profileImage: "assets/sprudo.png" },
  { name: "test 123", level: "Level 5 Coffee Commander", initials: "MM", profileImage: "" },
  { name: "Mikko Mallikas", level: "Level 4 Sitsit Survivor", initials: "SN", profileImage: "" },
  { name: "Hämeenlinna Student", level: "Level 3 Bus Stop Hero", initials: "JV", profileImage: "" },
  { name: "Demo User", level: "Level 1 Explorer", initials: "DU", profileImage: "assets/profile-picture.png" }
];

let activeFilter = "All";
let calendarDate = new Date(1984, 8, 1);

/* =========================================================
   2. HELPER FUNCTIONS
========================================================= */
function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Local storage is not available in this browser.");
  }
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getAllEvents() {
  return [...baseEvents, ...readStorage(STORAGE_KEYS.customEvents, [])];
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function getLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function categoryClass(category) {
  return `${String(category).toLowerCase()}-image`;
}

/* =========================================================
   3. HEADER INTERACTIONS
========================================================= */
function initHeader() {
  const hamburgerButton = document.querySelector(".hamburger-button");
  const navigation = document.querySelector("#main-navigation");
  const avatarButton = document.querySelector(".avatar-button");
  const profileArea = document.querySelector(".profile-area");

  if (hamburgerButton && navigation) {
    hamburgerButton.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("nav-open");
      hamburgerButton.setAttribute("aria-expanded", String(isOpen));
    });
  }

  if (avatarButton && profileArea) {
    avatarButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const isOpen = profileArea.classList.toggle("menu-open");
      avatarButton.setAttribute("aria-expanded", String(isOpen));
    });
  }

  initProfilePopup();
}

function initProfilePopup() {
  const profileArea = document.querySelector(".profile-area");

  // The profile menu now uses real buttons instead of normal links.
  // Event delegation makes the popup work even if the menu HTML changes later.
  document.addEventListener("click", (event) => {
    const popupButton = event.target.closest("[data-profile-popup]");
    if (popupButton) {
      event.preventDefault();
      event.stopPropagation();
      openProfilePopup(popupButton.dataset.profilePopup || "profile");
      profileArea?.classList.remove("menu-open");
      document.querySelector(".avatar-button")?.setAttribute("aria-expanded", "false");
      return;
    }

    const clickedInsideProfile = event.target.closest(".profile-area");
    const clickedInsidePopup = event.target.closest("#profile-popup");

    if (!clickedInsideProfile && !clickedInsidePopup) {
      profileArea?.classList.remove("menu-open");
      document.querySelector(".avatar-button")?.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeProfilePopup();
      profileArea?.classList.remove("menu-open");
      document.querySelector(".avatar-button")?.setAttribute("aria-expanded", "false");
    }
  });
}

function openProfilePopup(view = "profile") {
  const existingPopup = document.querySelector("#profile-popup");
  if (existingPopup) existingPopup.remove();

  const progress = getUserProgress();
  const levelName = progress.levelName;
  const neededXP = progress.neededXP;

  const popup = document.createElement("div");
  popup.id = "profile-popup";
  popup.className = "modal-backdrop";
  popup.innerHTML = `
    <article class="modal-card profile-popup-card" role="dialog" aria-modal="true" aria-labelledby="profile-popup-title">
      <div class="modal-header">
        <h2 id="profile-popup-title">${view === "badges" ? "Badges / achievements" : view === "signin" ? "Account" : "Profile"}</h2>
        <button class="close-button" type="button" aria-label="Close profile popup">×</button>
      </div>

      <div class="profile-popup-top">
        <div class="profile-popup-avatar">
          <img src="assets/profile-picture.png" alt="Demo user profile picture" />
        </div>
        <div>
          <h3 class="profile-popup-name">Demo User</h3>
          <p class="profile-popup-meta">Level ${progress.level} ${escapeHTML(levelName)} · ${progress.currentLevelXP} / ${USER_PROGRESS.xpPerLevel} XP</p>
          <div class="xp-bar large" aria-label="Profile XP progress">
            <div class="xp-fill" style="width: ${progress.progressPercent}%"></div>
          </div>
        </div>
      </div>

      ${view === "badges" ? profileBadgesHTML() : view === "signin" ? profileSigninHTML() : profileOverviewHTML(progress, neededXP)}
    </article>
  `;

  document.body.appendChild(popup);
  document.querySelector(".profile-area")?.classList.remove("menu-open");

  popup.querySelector(".close-button").addEventListener("click", closeProfilePopup);
  popup.addEventListener("click", (event) => {
    if (event.target === popup) closeProfilePopup();
  });
}

function closeProfilePopup() {
  document.querySelector("#profile-popup")?.remove();
}

function profileOverviewHTML(progress, neededXP) {
  return `
    <div class="profile-popup-grid">
      <div class="profile-popup-stat">
        <strong>Current level</strong>
        Level ${progress.level} ${escapeHTML(progress.levelName)}
      </div>
      <div class="profile-popup-stat">
        <strong>Next level</strong>
        ${neededXP} XP needed
      </div>
      <div class="profile-popup-stat">
        <strong>Completed challenges</strong>
        ${getCompletedChallenges().length}
      </div>
      <div class="profile-popup-stat">
        <strong>Profile idea</strong>
        Saved events and badges can be moved here later.
      </div>
    </div>
    <div class="profile-popup-actions">
      <button class="button button-primary" type="button" onclick="openProfilePopup('badges')">View badges</button>
      <a class="button button-secondary" href="community.html">Open Community page</a>
    </div>
  `;
}

function profileBadgesHTML() {
  const completedCount = getCompletedChallenges().length;
  const badgeItems = badges
    .map((badge) => {
      const isUnlocked = completedCount >= badge.requirement;
      return `
        <div class="profile-popup-badge ${isUnlocked ? "" : "locked"}">
          <span>${badge.icon}</span>
          <strong>${escapeHTML(badge.title)}</strong>
          <small>${escapeHTML(badge.goal)}</small>
        </div>
      `;
    })
    .join("");

  return `
    <p class="profile-popup-meta">Student overall patch style badges. The goals are example rules for the future profile page.</p>
    <div class="profile-popup-badges">
      ${badgeItems}
    </div>
  `;
}

function profileSigninHTML() {
  return `
    <div class="profile-popup-stat">
      <strong>Offline demo</strong>
      Login is only a placeholder in this offline version. Later this could connect to real authentication.
    </div>
  `;
}

/* =========================================================
   4. EVENTS PAGE FUNCTIONS
========================================================= */
function createEventCard(event) {
  const article = document.createElement("article");
  article.className = "event-card";
  article.dataset.eventId = event.id;

  const dateText = event.displayDate || formatDate(event.date);

  article.innerHTML = `
    <div class="event-image ${categoryClass(event.category)}"><span>${escapeHTML(event.category)}</span></div>
    <div class="event-info">
      <h3>${escapeHTML(event.title)}</h3>
      <p>${escapeHTML(dateText)} · ${escapeHTML(event.time)}</p>
      <p>📍 ${escapeHTML(event.location)}</p>
      <p class="event-description">${escapeHTML(event.description)}</p>
    </div>
  `;

  return article;
}

function filterEvents() {
  const searchInput = document.querySelector("#event-search");
  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

  return getAllEvents().filter((event) => {
    const matchesFilter = activeFilter === "All" || event.category === activeFilter;
    const searchableText = `${event.title} ${event.category} ${event.location} ${event.description}`.toLowerCase();
    const matchesQuery = !query || searchableText.includes(query);
    return matchesFilter && matchesQuery;
  });
}

function renderEvents() {
  const grid = document.querySelector("#events-grid");
  const counter = document.querySelector("#event-count-number");
  const emptyMessage = document.querySelector("#events-empty-message");

  if (!grid) return;

  const events = filterEvents();
  grid.innerHTML = "";

  events.forEach((event) => {
    grid.appendChild(createEventCard(event));
  });

  if (counter) counter.textContent = events.length;
  if (emptyMessage) emptyMessage.classList.toggle("hidden", events.length !== 0);

  syncCalendarToFirstVisibleEvent(events);
  renderCalendarJumpButtons(events);
  renderCalendar();
}

function initEventFilters() {
  const searchInput = document.querySelector("#event-search");
  const filterButtons = document.querySelectorAll(".filter-pill");

  if (searchInput) {
    searchInput.addEventListener("input", renderEvents);
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "All";
      filterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderEvents();
    });
  });
}

function initCreateEventForm() {
  const modal = document.querySelector("#event-modal");
  const form = document.querySelector("#create-event-form");
  const openButtons = [document.querySelector("#open-create-event"), document.querySelector("#open-create-event-bottom")];
  const closeButton = document.querySelector("#close-create-event");

  function openModal() {
    if (modal) modal.classList.remove("hidden");
  }

  function closeModal() {
    if (modal) modal.classList.add("hidden");
  }

  openButtons.forEach((button) => {
    if (button) button.addEventListener("click", openModal);
  });

  if (closeButton) closeButton.addEventListener("click", closeModal);

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
  }

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const customEvents = readStorage(STORAGE_KEYS.customEvents, []);

      customEvents.push({
        id: `custom-${Date.now()}`,
        title: data.get("title"),
        category: data.get("category"),
        date: data.get("date"),
        calendarDate: data.get("date"),
        time: data.get("time"),
        location: data.get("location"),
        description: data.get("description") || "User-created offline test event."
      });

      writeStorage(STORAGE_KEYS.customEvents, customEvents);
      form.reset();
      closeModal();
      renderEvents();
    });
  }
}

/* =========================================================
   5. CALENDAR FUNCTIONS
========================================================= */
function getCalendarEvents() {
  return filterEvents().filter((event) => event.calendarDate || event.date);
}

function getEventDateKey(event) {
  return event.calendarDate || event.date || "";
}

function getEventMonthKey(event) {
  return getEventDateKey(event).slice(0, 7);
}

function setCalendarToEventMonth(event) {
  const dateKey = getEventDateKey(event);
  const match = dateKey.match(/^(\d{4})-(\d{2})-/);

  if (!match) return;

  calendarDate = new Date(Number(match[1]), Number(match[2]) - 1, 1);
}

function syncCalendarToFirstVisibleEvent(events) {
  if (!events.length) return;

  const currentMonthKey = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, "0")}`;
  const hasEventInCurrentMonth = events.some((event) => getEventMonthKey(event) === currentMonthKey);

  if (!hasEventInCurrentMonth) {
    const sortedEvents = [...events].sort((a, b) => getEventDateKey(a).localeCompare(getEventDateKey(b)));
    setCalendarToEventMonth(sortedEvents[0]);
  }
}

function renderCalendarJumpButtons(events) {
  const jumpRow = document.querySelector("#calendar-jump-row");
  if (!jumpRow) return;

  const monthMap = new Map();

  events
    .filter((event) => getEventDateKey(event))
    .sort((a, b) => getEventDateKey(a).localeCompare(getEventDateKey(b)))
    .forEach((event) => {
      const monthKey = getEventMonthKey(event);
      if (!monthMap.has(monthKey)) monthMap.set(monthKey, event);
    });

  jumpRow.innerHTML = "";

  const currentMonthKey = `${calendarDate.getFullYear()}-${String(calendarDate.getMonth() + 1).padStart(2, "0")}`;

  monthMap.forEach((event, monthKey) => {
    const dateKey = getEventDateKey(event);
    const [year, month] = dateKey.split("-");
    const labelDate = new Date(Number(year), Number(month) - 1, 1);
    const button = document.createElement("button");

    button.className = `calendar-jump-pill ${monthKey === currentMonthKey ? "active" : ""}`;
    button.type = "button";
    button.textContent = labelDate.toLocaleDateString("en-GB", { month: "short", year: "numeric" });

    button.addEventListener("click", () => {
      setCalendarToEventMonth(event);
      renderCalendar();
      renderCalendarJumpButtons(filterEvents());
    });

    jumpRow.appendChild(button);
  });
}

function renderCalendar() {
  const calendarGrid = document.querySelector("#calendar-grid");
  const calendarTitle = document.querySelector("#calendar-title");

  if (!calendarGrid || !calendarTitle) return;

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDay = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;
  const startDate = new Date(year, month, 1 - startDay);
  const monthTitle = calendarDate.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  calendarTitle.textContent = monthTitle;
  calendarGrid.innerHTML = "";

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  weekdays.forEach((day) => {
    const weekday = document.createElement("div");
    weekday.className = "calendar-weekday";
    weekday.textContent = day;
    calendarGrid.appendChild(weekday);
  });

  const events = getCalendarEvents();

  for (let index = 0; index < totalCells; index += 1) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + index);
    const dateKey = getLocalDateKey(currentDate);

    const dayCell = document.createElement("div");
    dayCell.className = "calendar-day";
    if (currentDate.getMonth() !== month) dayCell.classList.add("is-muted");

    dayCell.innerHTML = `<span class="calendar-day-number">${currentDate.getDate()}</span>`;

    events
      .filter((event) => (event.calendarDate || event.date) === dateKey)
      .forEach((event) => {
        const chip = document.createElement("span");
        chip.className = "calendar-event-chip";
        chip.textContent = event.title;
        dayCell.appendChild(chip);
      });

    calendarGrid.appendChild(dayCell);
  }
}

function initCalendarControls() {
  const prevButton = document.querySelector("#calendar-prev");
  const nextButton = document.querySelector("#calendar-next");

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      calendarDate.setMonth(calendarDate.getMonth() - 1);
      renderCalendar();
      renderCalendarJumpButtons(filterEvents());
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      calendarDate.setMonth(calendarDate.getMonth() + 1);
      renderCalendar();
      renderCalendarJumpButtons(filterEvents());
    });
  }
}

/* =========================================================
   6. COMMUNITY PAGE FUNCTIONS
========================================================= */
function getCompletedChallenges() {
  return readStorage(STORAGE_KEYS.completedChallenges, []);
}

function getChallengeXP(challenge) {
  const match = String(challenge.reward).match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

function getChallengeXPById(challengeId) {
  const challenge = challenges.find((item) => item.id === challengeId);
  return challenge ? getChallengeXP(challenge) : 0;
}

function getUserProgress() {
  const completed = getCompletedChallenges();
  const challengeXP = challenges
    .filter((challenge) => completed.includes(challenge.id))
    .reduce((total, challenge) => total + getChallengeXP(challenge), 0);

  const totalXP = USER_PROGRESS.baseXP + challengeXP;
  const level = Math.floor(totalXP / USER_PROGRESS.xpPerLevel) + 1;
  const currentLevelXP = totalXP % USER_PROGRESS.xpPerLevel;
  const neededXP = USER_PROGRESS.xpPerLevel - currentLevelXP;
  const levelName = USER_PROGRESS.levelNames[level] || "Local Legend";

  return {
    totalXP,
    level,
    levelName,
    levelLabel: `Level ${level} ${levelName}`,
    currentLevelXP,
    neededXP,
    progressPercent: (currentLevelXP / USER_PROGRESS.xpPerLevel) * 100
  };
}

function setXPFill(fillElement, percent, animate = false, fromPercent = null) {
  if (!fillElement) return;

  if (animate && fromPercent !== null) {
    fillElement.classList.remove("sparkle");
    fillElement.style.width = `${fromPercent}%`;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        fillElement.classList.add("sparkle");
        fillElement.style.width = `${percent}%`;
      });
    });

    window.setTimeout(() => {
      fillElement.classList.remove("sparkle");
    }, 1300);
  } else {
    fillElement.style.width = `${percent}%`;
  }
}

function updateProgressDisplays(options = {}) {
  const progress = getUserProgress();
  const animate = Boolean(options.animate);
  const fromPercent = typeof options.fromPercent === "number" ? options.fromPercent : null;

  document.querySelectorAll(".xp-top strong").forEach((levelElement) => {
    levelElement.textContent = `Level ${progress.level}`;
  });

  document.querySelectorAll(".xp-top span").forEach((xpElement) => {
    xpElement.textContent = `${progress.currentLevelXP} / ${USER_PROGRESS.xpPerLevel} XP`;
  });

  document.querySelectorAll(".xp-box .xp-fill").forEach((fillElement) => {
    setXPFill(fillElement, progress.progressPercent, animate, fromPercent);
  });

  const communityLevelTitle = document.querySelector("#community-level-title");
  const communityXPNeeded = document.querySelector("#community-xp-needed");
  const communityCurrentXP = document.querySelector("#community-current-xp");
  const communityXPFill = document.querySelector("#community-xp-fill");

  if (communityLevelTitle) communityLevelTitle.textContent = progress.levelLabel;
  if (communityCurrentXP) communityCurrentXP.textContent = `${progress.currentLevelXP} / ${USER_PROGRESS.xpPerLevel} XP`;
  if (communityXPNeeded) communityXPNeeded.textContent = progress.neededXP;
  if (communityXPFill) setXPFill(communityXPFill, progress.progressPercent, animate, fromPercent);
}

function renderChallenges() {
  const challengeGrid = document.querySelector("#challenge-grid");
  const completedCounter = document.querySelector("#completed-challenge-count");

  if (!challengeGrid) return;

  const completed = getCompletedChallenges();
  challengeGrid.innerHTML = "";

  challenges.forEach((challenge) => {
    const isCompleted = completed.includes(challenge.id);
    const card = document.createElement("article");
    card.className = `challenge-card ${isCompleted ? "completed" : ""}`;

    card.innerHTML = `
      <div class="reward-text">${escapeHTML(challenge.reward)}</div>
      <h3>${escapeHTML(challenge.title)}</h3>
      <p>${escapeHTML(challenge.description)}</p>
      <button class="button ${isCompleted ? "button-secondary" : "button-primary"}" type="button" data-challenge-id="${escapeHTML(challenge.id)}">
        ${isCompleted ? "Completed" : "Mark complete"}
      </button>
    `;

    challengeGrid.appendChild(card);
  });

  if (completedCounter) completedCounter.textContent = completed.length;
  updateProgressDisplays();

  challengeGrid.querySelectorAll("button[data-challenge-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.challengeId;
      const oldProgress = getUserProgress();
      const current = getCompletedChallenges();
      const wasCompleted = current.includes(id);
      const next = wasCompleted ? current.filter((item) => item !== id) : [...current, id];
      writeStorage(STORAGE_KEYS.completedChallenges, next);
      renderChallenges();
      renderBadges();
      renderLeaderboard();

      if (!wasCompleted && getChallengeXPById(id) > 0) {
        updateProgressDisplays({ animate: true, fromPercent: oldProgress.progressPercent });
      }
    });
  });
}

function renderBadges() {
  const badgeGrid = document.querySelector("#badge-grid");
  if (!badgeGrid) return;

  const completedCount = getCompletedChallenges().length;
  badgeGrid.innerHTML = "";

  badges.forEach((badge) => {
    const isUnlocked = completedCount >= badge.requirement;
    const card = document.createElement("article");
    card.className = `badge-card ${isUnlocked ? "" : "locked"}`;

    card.innerHTML = `
      <div class="badge-icon">${badge.icon}</div>
      <h3>${escapeHTML(badge.title)}</h3>
      <p>${escapeHTML(badge.description)}</p>
      <p class="badge-goal"><strong>Goal:</strong> ${escapeHTML(badge.goal)}</p>
      <p class="reward-text">${isUnlocked ? "Unlocked" : "Locked in demo"}</p>
    `;

    badgeGrid.appendChild(card);
  });
}

function renderLeaderboard() {
  const list = document.querySelector("#leaderboard-list");
  if (!list) return;

  list.innerHTML = "";

  const progress = getUserProgress();

  leaderboard.forEach((user, index) => {
    const row = document.createElement("article");
    row.className = "leaderboard-row";

    const avatarContent = user.profileImage
      ? `<img src="${escapeHTML(user.profileImage)}" alt="${escapeHTML(user.name)} profile picture" />`
      : escapeHTML(user.initials);

    const levelText = user.name === "Demo User" ? progress.levelLabel : user.level;

    row.innerHTML = `
      <div class="leaderboard-rank">${index + 1}</div>
      <div class="leaderboard-avatar">${avatarContent}</div>
      <div class="leaderboard-name">${escapeHTML(user.name)}</div>
      <div class="leaderboard-level">${escapeHTML(levelText)}</div>
    `;

    list.appendChild(row);
  });
}

function initCommunityPage() {
  const resetButton = document.querySelector("#reset-community-progress");

  if (resetButton) {
    resetButton.addEventListener("click", () => {
      writeStorage(STORAGE_KEYS.completedChallenges, []);
      renderChallenges();
      renderBadges();
      renderLeaderboard();
    });
  }

  renderChallenges();
  renderBadges();
  renderLeaderboard();
}

/* =========================================================
   7. LANDING PAGE MAP IMAGE DEMO
========================================================= */
function initMovableMapPreview() {
  const map = document.querySelector(".map-preview");
  if (!map) return;

  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let positionX = 50;
  let positionY = 50;
  let zoom = 115;

  function applyMapPosition() {
    map.style.backgroundSize = `${zoom}%`;
    map.style.backgroundPosition = `${positionX}% ${positionY}%`;
  }

  map.classList.add("is-draggable-map");
  map.setAttribute("title", "Drag to move the map image. Use mouse wheel to zoom.");
  applyMapPosition();

  map.addEventListener("pointerdown", (event) => {
    isDragging = true;
    startX = event.clientX;
    startY = event.clientY;
    map.classList.add("is-dragging");
    map.setPointerCapture(event.pointerId);
  });

  map.addEventListener("pointermove", (event) => {
    if (!isDragging) return;

    const rect = map.getBoundingClientRect();
    const deltaX = ((event.clientX - startX) / rect.width) * 100;
    const deltaY = ((event.clientY - startY) / rect.height) * 100;

    positionX = Math.max(0, Math.min(100, positionX - deltaX));
    positionY = Math.max(0, Math.min(100, positionY - deltaY));
    startX = event.clientX;
    startY = event.clientY;
    applyMapPosition();
  });

  function stopDragging() {
    isDragging = false;
    map.classList.remove("is-dragging");
  }

  map.addEventListener("pointerup", stopDragging);
  map.addEventListener("pointercancel", stopDragging);
  map.addEventListener("wheel", (event) => {
    event.preventDefault();
    zoom = Math.max(105, Math.min(180, zoom + (event.deltaY < 0 ? 8 : -8)));
    applyMapPosition();
  }, { passive: false });
}

/* =========================================================
   7. PAGE INITIALIZATION
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initMovableMapPreview();
  updateProgressDisplays();

  const page = document.body.dataset.page;

  if (page === "events") {
    initEventFilters();
    initCreateEventForm();
    initCalendarControls();
    renderEvents();
  }

  if (page === "community") {
    initCommunityPage();
  }
});
