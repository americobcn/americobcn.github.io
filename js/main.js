/* Countdown + weather fetch
 * Cached DOM nodes and defensive fetch/error handling
 */
(function () {
  "use strict";

  const SECS_PER_DAY  = 86400;
  const SECS_PER_HOUR = 3600;
  const SECS_PER_MIN  = 60;

  let intervalId = null;
  let eventDate  = null;

  const counterDiv  = document.getElementById("counter");
  const daysDiv     = document.getElementById("days");
  const hoursDiv    = document.getElementById("hours");
  const minutesDiv  = document.getElementById("minutes");
  const secondsDiv  = document.getElementById("seconds");

  document.addEventListener("DOMContentLoaded", init);

  function getEventDate() {
    const now = new Date();
    const year = now.getFullYear();
    // Target: May 2 at 14:00
    const candidate = new Date(`${year}-05-02T14:00`);
    return candidate <= now ? new Date(`${year + 1}-05-02T14:00`) : candidate;
  }

  function init() {
    eventDate = getEventDate();
    updateCountdown(); // show initial values immediately

    if (Date.now() < eventDate.getTime()) {
      intervalId = setInterval(updateCountdown, 1000);
    }

    getData();
  }

  function updateCountdown() {
    const now    = Date.now();
    const target = eventDate.getTime();

    if (now >= target) {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      showFinished();
      return;
    }

    let remaining   = Math.floor((target - now) / 1000); // seconds
    const days      = Math.floor(remaining / SECS_PER_DAY);
    remaining      %= SECS_PER_DAY;
    const hours     = Math.floor(remaining / SECS_PER_HOUR);
    remaining      %= SECS_PER_HOUR;
    const minutes   = Math.floor(remaining / SECS_PER_MIN);
    const seconds   = remaining % SECS_PER_MIN;

    daysDiv.textContent    = String(days);
    hoursDiv.textContent   = String(hours);
    minutesDiv.textContent = String(minutes);
    secondsDiv.textContent = String(seconds);
  }

  function showFinished() {
    if (!counterDiv) return;
    counterDiv.innerHTML = "";
    counterDiv.classList.add("congrats", "flip-scale-up-hor");
    const congrats = document.createElement("div");
    congrats.textContent = "Bon Sant Joan!";
    counterDiv.appendChild(congrats);
  }

  function makeText(tag, text) {
    const el = document.createElement(tag);
    el.textContent = text;
    return el;
  }

  /* Clima Information */
  async function getData() {
    try {
      const resp = await fetch('/api/weather');
      if (!resp.ok) throw new Error(`Weather API error: ${resp.status}`);
      const json = await resp.json();

      const data        = json && json[0];
      const predictions = data?.prediccion?.dia || [];

      const nameEl = document.getElementById("name");
      if (nameEl && data?.nombre) {
        nameEl.textContent = `El temps a ${data.nombre}`;
      }

      for (let i = 0; i < 3; i++) {
        const p  = predictions[i];
        const el = document.getElementById(`dia_${i}`);
        if (!p || !el) continue;

        const date   = p.fecha ? new Date(p.fecha) : null;
        const min    = p.temperatura?.minima ?? "-";
        const max    = p.temperatura?.maxima ?? "-";
        const prob1  = p.probPrecipitacion?.[1]?.value ?? "-";
        const prob2  = p.probPrecipitacion?.[2]?.value ?? "-";
        const estado = p.estadoCielo?.[0]?.descripcion ?? "";

        const dateLabel = date
          ? date.toLocaleString("default", { day: "numeric", month: "short" })
          : "";

        el.textContent = "";
        el.appendChild(makeText("h5", dateLabel));
        el.appendChild(makeText("div", `Min: ${min} \u2103`));
        el.appendChild(makeText("div", `Max: ${max} \u2103`));
        el.appendChild(makeText("div", `00 a 12hs ${prob1} %`));
        el.appendChild(makeText("div", `12 a 24hs ${prob2} %`));
        el.appendChild(makeText("div", estado));
      }
    } catch (err) {
      console.error("Error fetching weather data:", err);
    }
  }
})();
