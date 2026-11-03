/**
 * Sri Meenakshi Sweets & Bakery (SINCE 1977, Madurai)
 * Pure Vanilla Client Application Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  setupAddressCopy();
  initMapSwitcher();
  setupNavScrollTracker();
});

// Branch & Store Information
const STORES = {
  phone: "+91 9489872822",
  whatsapp: "+91 9489872822",
  branches: {
    fatima: {
      name: "Sri Meenakshi Sweets (Fatima College Branch)",
      address: "Fatima College, Madurai, Tamil Nadu",
      landmark: "Opposite to Fatima College"
    },
    vilangudi: {
      name: "Sri Meenakshi Sweets (Vilangudi Branch)",
      address: "Vilangudi, Madurai, Tamil Nadu",
      landmark: "Opposite to Bus Stop"
    },
    kitchen: {
      name: "Sri Meenakshi Bakery & Production Kitchen",
      address: "Pallavan Nagar, Kalavasal, Madurai, Tamil Nadu",
      landmark: "Kalavasal Junction"
    }
  }
};

// Clipboard Address Copy Functionality
function setupAddressCopy() {
  const copyButtons = document.querySelectorAll(".btn-plaque-copy");
  copyButtons.forEach(btn => {
    btn.addEventListener("click", () => {
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
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  showToast("Address copied to clipboard!");
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

// Interactive Google Maps Branch Switcher (Zero External Script Dependencies)
function initMapSwitcher() {
  const mapFrame = document.getElementById("map-frame");
  const switchButtons = document.querySelectorAll(".btn-map-switch");
  const labelIndicator = document.getElementById("map-label-indicator");
  if (!mapFrame || !switchButtons.length) return;

  const branchLabels = {
    "1. Fatima College": "Branch 1: Opposite to Fatima College, Madurai",
    "2. Vilangudi": "Branch 2: Opposite to Bus Stop, Vilangudi, Madurai",
    "3. Kalavasal Kitchen": "Facility: Pallavan Nagar, Kalavasal Junction, Madurai"
  };

  switchButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      switchButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const targetSrc = btn.getAttribute("data-map-src");
      if (targetSrc) {
        mapFrame.src = targetSrc;
      }

      const btnText = btn.textContent.trim();
      if (labelIndicator && branchLabels[btnText]) {
        labelIndicator.textContent = branchLabels[btnText];
      }
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
