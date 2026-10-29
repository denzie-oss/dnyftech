"use strict";

const menuToggle = document.getElementById("menu-toggle");
const navigation = document.getElementById("main-nav");
const year = document.getElementById("year");

if (year) {
  year.textContent = String(new Date().getFullYear());
}

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("is-open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      menuToggle.textContent = "☰";
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      navigation.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      menuToggle.textContent = "☰";
      menuToggle.focus();
    }
  });
}


// DNYFTECH live API integration.
const API_BASE_URL = "http://127.0.0.1:8000";

const apiStatus = document.getElementById("api-status");
const apiVersion = document.getElementById("api-version");
const apiPlatform = document.getElementById("api-platform");
const apiTagline = document.getElementById("api-tagline");
const apiDivisionList = document.getElementById("api-division-list");
const apiError = document.getElementById("api-error");
const apiRefresh = document.getElementById("api-refresh");

async function loadPlatformStatus() {
  if (!apiStatus) return;

  apiStatus.textContent = "CONNECTING...";
  apiStatus.dataset.state = "loading";
  apiError.textContent = "";

  try {
    const [healthResponse, infoResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/health`),
      fetch(`${API_BASE_URL}/api/v1/info`)
    ]);

    if (!healthResponse.ok || !infoResponse.ok) {
      throw new Error("The API returned an unsuccessful response.");
    }

    const health = await healthResponse.json();
    const info = await infoResponse.json();

    if (health.status !== "ok") {
      throw new Error("The API health check did not pass.");
    }

    apiStatus.textContent = "● ONLINE";
    apiStatus.dataset.state = "online";
    apiPlatform.textContent = info.platform;
    apiVersion.textContent = info.version;
    apiTagline.textContent = info.tagline;

    apiDivisionList.replaceChildren();

    info.divisions.forEach((division) => {
      const item = document.createElement("span");
      item.className = "api-division";
      item.textContent = division;
      apiDivisionList.appendChild(item);
    });
  } catch (error) {
    apiStatus.textContent = "● OFFLINE";
    apiStatus.dataset.state = "offline";
    apiVersion.textContent = "Unavailable";
    apiDivisionList.replaceChildren();

    const message = document.createElement("span");
    message.className = "api-placeholder";
    message.textContent = "Division data unavailable.";
    apiDivisionList.appendChild(message);

    apiError.textContent =
      "Cannot reach the API. Start the Flask server on port 8000 and refresh.";
  }
}

if (apiRefresh) {
  apiRefresh.addEventListener("click", loadPlatformStatus);
}

loadPlatformStatus();
