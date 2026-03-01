/* Optimized countdown + weather fetch
 * Cleaner date handling, no regex parsing
 * Cached DOM nodes and defensive fetch/error handling
 */
(function () {
  "use strict";

  let intervalId = null;
  let eventDate = null;

  const daysDiv = document.querySelector("#days");
  const hoursDiv = document.querySelector("#hours");
  const minutesDiv = document.querySelector("#minutes");
  const secondsDiv = document.querySelector("#seconds");

  document.addEventListener("DOMContentLoaded", init);

  function getEventDate() {
    const now = new Date();
    const year = now.getFullYear();
    // Target: June 24 at 00:00 of this year or next year if passed
    const candidate = new Date(`${year}-05-02T14:00`);
    return candidate <= now ? new Date(`${year + 1}-05-02T14:00`) : candidate;
  }

  function init() {
    eventDate = getEventDate();
    updateCountdown(); // show initial values immediately

    if (Date.now() < eventDate.getTime()) {
      intervalId = setInterval(updateCountdown, 1000);
    }

    get_data();
  }

  function updateCountdown() {
    const now = Date.now();
    const target = eventDate.getTime();

    if (now >= target) {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      showFinished();
      return;
    }

    let remaining = Math.floor((target - now) / 1000); // seconds
    const days = Math.floor(remaining / 86400);
    remaining %= 86400;
    const hours = Math.floor(remaining / 3600);
    remaining %= 3600;
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;

    daysDiv.textContent = String(days);
    hoursDiv.textContent = String(hours);
    minutesDiv.textContent = String(minutes);
    secondsDiv.textContent = String(seconds);
  }

  function showFinished() {
    const counter = document.getElementById("counter");
    if (!counter) return;
    counter.innerHTML = "";
    counter.classList.add("congrats", "flip-scale-up-hor");
    const congrats = document.createElement("div");
    congrats.textContent = "Bon Sant Joan!";
    counter.appendChild(congrats);
  }

  /* Clima Information */
  const url =
    "https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/20052/?api_key=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbWVyaWNvLmNvdEBnbWFpbC5jb20iLCJqdGkiOiJmOWEwMGY3MC0yZTQ5LTQwNmYtYjViOC00MDkzNTY1NzdjNzQiLCJpc3MiOiJBRU1FVCIsImlhdCI6MTY3OTg1ODMyOCwidXNlcklkIjoiZjlhMDBmNzAtMmU0OS00MDZmLWI1YjgtNDA5MzU2NTc3Yzc0Iiwicm9sZSI6IiJ9.4it22Cc2Iu-yBCKp8rjIeVhGZ6Kmr1NZW4W3Y_adoFs";

  async function get_data() {
    try {
      const infoResp = await fetch(url);
      if (!infoResp.ok) throw new Error(`Aemet URL error: ${infoResp.status}`);
      const info = await infoResp.json();

      // info.datos should be a url
      if (!info || !info.datos)
        throw new Error("Aemet response missing 'datos' URL");

      const datosResp = await fetch(info.datos);
      if (!datosResp.ok)
        throw new Error(`Aemet datos fetch error: ${datosResp.status}`);
      const resp = await datosResp.json();

      const data = resp && resp[0];
      const predictions = data?.prediccion?.dia || [];

      const nameEl = document.getElementById("name");
      if (nameEl && data?.nombre) {
        nameEl.innerHTML = `<h1>El temps a ${data.nombre}</h1>`;
      }

      const dias = document.getElementsByClassName("col-4 text-center");

      for (let i = 0; i < 3; i++) {
        const p = predictions[i];
        if (!p || !dias[i]) continue;
        const date = p.fecha ? new Date(p.fecha) : null;
        const min = p.temperatura?.minima ?? "-";
        const max = p.temperatura?.maxima ?? "-";
        // Use defensive access for precipitation and estadoCielo
        const prob1 = p.probPrecipitacion?.[1]?.value ?? "-";
        const prob2 = p.probPrecipitacion?.[2]?.value ?? "-";
        const estado = p.estadoCielo?.[0]?.descripcion ?? "";

        const dateLabel = date
          ? date.toLocaleString("default", { day: "numeric", month: "short" })
          : "";

        dias[i].innerHTML = `
<h5>${dateLabel}</h5>
<div>Min: ${min} &#8451</div>
<div>Max: ${max} &#8451</div><br>
<div>00 a 12hs ${prob1} %</div>
<div>12 a 24hs ${prob2} %</div><br>
<div>${estado}</div>`;
      }
    } catch (err) {
      console.error("Error fetching weather data:", err);
    }
  }
})();
