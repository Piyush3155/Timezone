const zones = [
  { code: "PST", name: "Pacific Time", timeZone: "America/Los_Angeles", key: "pacific" },
  { code: "MST", name: "Mountain Time", timeZone: "America/Denver", key: "mountain" },
  { code: "CST", name: "Central Time", timeZone: "America/Chicago", key: "central" },
  { code: "EST", name: "Eastern Time", timeZone: "America/New_York", key: "eastern" },
  { code: "AST", name: "Atlantic Time", timeZone: "America/Halifax", key: "atlantic" }
];

const list = document.getElementById("timezone-list");
const dateElement = document.getElementById("date");

// References to DOM elements we update each tick
const refs = [];

function getParts(timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZoneName: "short"
  }).formatToParts(new Date());

  return Object.fromEntries(
    parts.map(part => [part.type, part.value])
  );
}

function getTimestamp(timeZone) {
  const parts = getParts(timeZone);
  return `${parts.year}-${parts.month}-${parts.day} ` +
    `${parts.hour}:${parts.minute}:${parts.second} ` +
    `${parts.dayPeriod} ${parts.timeZoneName}`;
}

function formatDate(parts) {
  const months = {
    "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr",
    "05": "May", "06": "Jun", "07": "Jul", "08": "Aug",
    "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec"
  };
  return `${months[parts.month]} ${parts.day}, ${parts.year}`;
}

// Build the cards once
function buildCards() {
  zones.forEach((zone, index) => {
    const article = document.createElement("article");
    article.className = "timezone";
    article.dataset.zone = zone.key;

      const codeEl = document.createElement("div");
      codeEl.className = "zone-code";

      const infoDiv = document.createElement("div");
      infoDiv.className = "zone-info";

      const nameEl = document.createElement("div");
      nameEl.className = "zone-name";
      nameEl.textContent = zone.name;

      const dateEl = document.createElement("div");
      dateEl.className = "zone-date";

      infoDiv.appendChild(nameEl);
      infoDiv.appendChild(dateEl);

      const rightDiv = document.createElement("div");
      rightDiv.className = "zone-right";

      const timeEl = document.createElement("div");
      timeEl.className = "zone-time";

      const timeText = document.createTextNode("");
      const periodSpan = document.createElement("span");
      periodSpan.className = "zone-period";
      timeEl.appendChild(timeText);
      timeEl.appendChild(periodSpan);

      const copyBtn = document.createElement("button");
      copyBtn.className = "copy";
      copyBtn.dataset.index = index;
      copyBtn.textContent = "📋 Copy";

      rightDiv.appendChild(timeEl);
      rightDiv.appendChild(copyBtn);

      article.appendChild(codeEl);
      article.appendChild(infoDiv);
      article.appendChild(rightDiv);

      list.appendChild(article);

      refs.push({ codeEl, dateEl, timeText, periodSpan });
    });
}

// Update only the text content each tick
function update() {
  const now = new Date();

  dateElement.textContent = now.toLocaleDateString("en-US", {
    timeZone: "America/New_York",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

    zones.forEach((zone, i) => {
      const parts = getParts(zone.timeZone);
      const ref = refs[i];

      ref.codeEl.textContent = parts.timeZoneName;
      ref.dateEl.textContent = formatDate(parts);
      ref.timeText.textContent = `${parts.hour}:${parts.minute}:${parts.second}`;
      ref.periodSpan.textContent = parts.dayPeriod;
    });
  }

// Copy handler
list.addEventListener("click", async (event) => {
    const button = event.target.closest(".copy");
    if (!button) return;

    const zone = zones[Number(button.dataset.index)];
    const timestamp = getTimestamp(zone.timeZone);

    try {
      await navigator.clipboard.writeText(timestamp);
      button.classList.add("copied");
      button.textContent = "✓ Copied!";
      setTimeout(() => {
        button.classList.remove("copied");
        button.textContent = "📋 Copy";
      }, 1500);
    } catch {
      button.textContent = "✗ Failed";
      setTimeout(() => {
        button.textContent = "📋 Copy";
      }, 1500);
    }
  });

  document.getElementById("refresh").addEventListener("click", update);

  buildCards();
  update();
  setInterval(update, 1000);
