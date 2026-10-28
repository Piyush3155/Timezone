const zones = [
  {
    code: "PST",
    name: "Pacific Time",
    timeZone: "America/Los_Angeles"
  },
  {
    code: "MST",
    name: "Mountain Time",
    timeZone: "America/Denver"
  },
  {
    code: "CST",
    name: "Central Time",
    timeZone: "America/Chicago"
  },
  {
    code: "EST",
    name: "Eastern Time",
    timeZone: "America/New_York"
  },
  {
    code: "AST",
    name: "Atlantic Time",
    timeZone: "America/Halifax"
  }
];

const list = document.getElementById("timezone-list");
const dateElement = document.getElementById("date");

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

function render() {
  const now = new Date();

  dateElement.textContent = now.toLocaleDateString("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  list.innerHTML = zones.map((zone, index) => {
    const parts = getParts(zone.timeZone);
    const timestamp = getTimestamp(zone.timeZone);

    return `
      <article class="timezone">
        <div class="zone-code">${parts.timeZoneName}</div>

        <div class="zone-info">
          <div class="zone-name">${zone.name}</div>
          <div class="zone-date">
            ${parts.month}/${parts.day}/${parts.year}
          </div>
        </div>

        <div class="zone-right">
          <div class="zone-time">
            ${parts.hour}:${parts.minute}:${parts.second}
            ${parts.dayPeriod}
          </div>
          <button class="copy" data-index="${index}">
            Copy timestamp
          </button>
        </div>
      </article>
    `;
  }).join("");
}

list.addEventListener("click", async (event) => {
  const button = event.target.closest(".copy");
  if (!button) return;

  const zone = zones[Number(button.dataset.index)];
  const timestamp = getTimestamp(zone.timeZone);

  try {
    await navigator.clipboard.writeText(timestamp);
    button.textContent = "Copied!";
    setTimeout(() => {
      button.textContent = "Copy timestamp";
    }, 1200);
  } catch {
    button.textContent = "Copy failed";
  }
});

document.getElementById("refresh").addEventListener("click", render);

render();
setInterval(render, 1000);

