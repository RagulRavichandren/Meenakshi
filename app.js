/**
 * Sri Meenakshi Sweets & Bakery (SINCE 1977, Madurai)
 * Pure Vanilla Client Application Logic
 */

// Master Branch Data
const BRANCH_DATA = [
  {
    id: "fatima",
    name: "Sri Meenakshi Sweets (Fatima College Branch)",
    address: "Fatima College, Madurai, Tamil Nadu",
    landmark: "Opposite to Fatima College",
    label: "Branch 1: Opposite to Fatima College",
    mapSrc: "https://www.openstreetmap.org/export/embed.html?bbox=78.0900%2C9.9550%2C78.1150%2C9.9750&layer=mapnik&marker=9.9652%2C78.1018",
    mapsDir: "https://www.google.com/maps/dir/?api=1&destination=Fatima+College+Madurai"
  },
  {
    id: "vilangudi",
    name: "Sri Meenakshi Sweets (Vilangudi Branch)",
    address: "Vilangudi, Madurai, Tamil Nadu",
    landmark: "Opposite to Bus Stop",
    label: "Branch 2: Opposite to Bus Stop, Vilangudi",
    mapSrc: "https://www.openstreetmap.org/export/embed.html?bbox=78.0800%2C9.9480%2C78.1070%2C9.9670&layer=mapnik&marker=9.9575%2C78.0934",
    mapsDir: "https://www.google.com/maps/dir/?api=1&destination=Vilangudi+Madurai"
  },
  {
    id: "kitchen",
    name: "Sri Meenakshi Bakery & Production Kitchen",
    address: "Pallavan Nagar, Kalavasal, Madurai, Tamil Nadu",
    landmark: "Kalavasal Junction",
    label: "Facility: Pallavan Nagar, Kalavasal Junction",
    mapSrc: "https://www.openstreetmap.org/export/embed.html?bbox=78.0850%2C9.9200%2C78.1120%2C9.9410&layer=mapnik&marker=9.9305%2C78.0982",
    mapsDir: "https://www.google.com/maps/dir/?api=1&destination=Pallavan+Nagar+Kalavasal+Madurai"
  }
];

// Stores Information
const STORES = {
  phone: "+91 9489872822",
  whatsapp: "+91 9489872822",
  branches: {
    fatima: BRANCH_DATA[0],
    vilangudi: BRANCH_DATA[1],
    kitchen: BRANCH_DATA[2]
  }
};

/**
 * Universal Branch Selector
 * Can be triggered directly by inline onclick or dynamically via event listeners
 */
function selectBranch(index) {
  const idx = parseInt(index, 10);
  if (isNaN(idx) || idx < 0 || idx >= BRANCH_DATA.length) return;
  const branch = BRANCH_DATA[idx];

  // 1. Synchronize Map Switch Buttons
  const switchButtons = document.querySelectorAll(".btn-map-switch");
  switchButtons.forEach((btn, i) => {
    if (i === idx) {
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
    } else {
      btn.classList.remove("active");
      btn.setAttribute("aria-selected", "false");
    }
  });

  // 2. Synchronize Store Address Plaques
  const plaques = document.querySelectorAll(".store-plaque");
  plaques.forEach((plaque, i) => {
    if (i === idx) {
      plaque.classList.add("featured-plaque");
    } else {
      plaque.classList.remove("featured-plaque");
    }
  });

  // 3. Update OpenStreetMap Iframe
  const mapFrame = document.getElementById("map-frame");
  if (mapFrame && branch.mapSrc) {
    mapFrame.src = branch.mapSrc;
  }

  // 4. Update Branch Indicator Label
  const labelIndicator = document.getElementById("map-label-indicator");
  if (labelIndicator) {
    labelIndicator.textContent = branch.label;
  }

  // 5. Update External Google Maps Directions Link
  const externalLink = document.getElementById("map-external-link");
  if (externalLink && branch.mapsDir) {
    externalLink.href = branch.mapsDir;
  }
}

// Expose globally so inline onclick="selectBranch(0/1/2)" works instantly
window.selectBranch = selectBranch;

// Clipboard Address Copy Functionality
function setupAddressCopy() {
  const copyButtons = document.querySelectorAll(".btn-plaque-copy");
  copyButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const locationKey = btn.getAttribute("data-location");
      const branch = STORES.branches[locationKey];
      if (!branch) return;

      const textToCopy = `${branch.name}\nAddress: ${branch.address}\nLandmark: ${branch.landmark}\nPhone / WhatsApp: ${STORES.phone}`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast("Address copied to clipboard!");
        }).catch(() => {
          fallbackCopy(textToCopy);
        });
      } else {
        fallbackCopy(textToCopy);
      }
    });
  });
}

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand("copy");
    showToast("Address copied to clipboard!");
  } catch (err) {
    showToast("Address copied to clipboard!");
  }
  document.body.removeChild(textarea);
}

function showToast(message) {
  let toast = document.getElementById("copy-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "copy-toast";
    toast.className = "copy-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("active");

  setTimeout(() => {
    toast.classList.remove("active");
  }, 2800);
}

// Event Listeners for Map Switch Buttons & Plaques
function initMapSwitcher() {
  const switchButtons = document.querySelectorAll(".btn-map-switch");
  switchButtons.forEach((btn, index) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      selectBranch(index);
    });
  });

  const plaques = document.querySelectorAll(".store-plaque");
  plaques.forEach((plaque, index) => {
    plaque.addEventListener("click", () => {
      selectBranch(index);
    });
  });
}

// Active Nav Item on Scroll
function setupNavScrollTracker() {
  const navLinks = document.querySelectorAll(".main-nav .nav-item a");
  const sections = document.querySelectorAll("section[id]");
  if (!navLinks.length || !sections.length) return;

  window.addEventListener("scroll", () => {
    let currentId = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      if (window.pageYOffset >= sectionTop) {
        currentId = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      const parent = link.parentElement;
      if (link.getAttribute("href") === `#${currentId}`) {
        parent.classList.add("active");
      } else {
        parent.classList.remove("active");
      }
    });
  });
}

// Bulletproof Self-Initialization (Supports immediate execution or DOMContentLoaded)
function initApp() {
  setupAddressCopy();
  initMapSwitcher();
  setupNavScrollTracker();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
