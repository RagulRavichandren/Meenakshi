/**
 * Sri Meenakshi Sweets & Bakery (SINCE 1977, Madurai)
 * Client Application Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  initMap();
  setupAddressCopy();
  setupInquirySummaryForm();
});

// Branch & Store Information
const STORES = {
  phone: "+91 9489872822",
  whatsapp: "+91 9489872822",
  branches: {
    fatima: {
      name: "Sri Meenakshi Sweets (Fatima College Branch)",
      address: "Fatima College, Madurai",
      landmark: "Opposite to Fatima College",
      lat: 9.9652,
      lng: 78.1018
    },
    vilangudi: {
      name: "Sri Meenakshi Sweets (Vilangudi Branch)",
      address: "Vilangudi, Madurai",
      landmark: "Opposite to Bus Stop",
      lat: 9.9575,
      lng: 78.0934
    },
    kitchen: {
      name: "Sri Meenakshi Bakery & Production Kitchen",
      address: "Pallavan Nagar, Kalavasal, Madurai",
      landmark: "Kalavasal Junction",
      lat: 9.9305,
      lng: 78.0982
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
          showToast("Address copied to clipboard");
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
  showToast("Address copied to clipboard");
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

// Leaflet Map with All 3 Madurai Branches
function initMap() {
  const mapElement = document.getElementById("map-element");
  if (!mapElement) return;

  if (typeof L === "undefined") {
    mapElement.innerHTML = `
      <div style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; text-align:center; color:#5e4851;">
        <p style="font-weight:700; color:#520924; margin-bottom:6px;">Sri Meenakshi Sweets & Bakery</p>
        <p style="font-size:0.88rem;">1. Fatima College &bull; 2. Vilangudi &bull; 3. Pallavan Nagar, Kalavasal</p>
      </div>
    `;
    return;
  }

  try {
    // Center map around Vilangudi / Fatima College / Kalavasal corridor
    const map = L.map("map-element", {
      center: [9.9510, 78.0980],
      zoom: 13,
      zoomControl: true,
      scrollWheelZoom: false
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Custom Pink Pin Marker
    const createCustomIcon = (label) => L.divIcon({
      className: 'custom-pink-pin',
      html: `
        <div style="background:#be185d; color:#fff; border:2px solid #ffffff; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px; box-shadow:0 3px 10px rgba(82,9,36,0.4);">
          ${label}
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });

    // 1. Fatima College Branch
    L.marker([STORES.branches.fatima.lat, STORES.branches.fatima.lng], { icon: createCustomIcon("1") })
      .addTo(map)
      .bindPopup(`
        <div style="font-family:inherit; padding:4px;">
          <strong style="color:#83103c; font-size:0.95rem;">Sri Meenakshi Sweets</strong><br/>
          <span style="font-size:0.82rem; color:#444;">Fatima College, Madurai (Opp. Fatima College)</span><br/>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${STORES.branches.fatima.lat},${STORES.branches.fatima.lng}" target="_blank" style="display:inline-block; margin-top:6px; color:#be185d; font-size:0.8rem; font-weight:700; text-decoration:none;">Get Directions &rarr;</a>
        </div>
      `);

    // 2. Vilangudi Branch
    L.marker([STORES.branches.vilangudi.lat, STORES.branches.vilangudi.lng], { icon: createCustomIcon("2") })
      .addTo(map)
      .bindPopup(`
        <div style="font-family:inherit; padding:4px;">
          <strong style="color:#83103c; font-size:0.95rem;">Sri Meenakshi Sweets</strong><br/>
          <span style="font-size:0.82rem; color:#444;">Vilangudi, Madurai (Opp. Bus Stop)</span><br/>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${STORES.branches.vilangudi.lat},${STORES.branches.vilangudi.lng}" target="_blank" style="display:inline-block; margin-top:6px; color:#be185d; font-size:0.8rem; font-weight:700; text-decoration:none;">Get Directions &rarr;</a>
        </div>
      `);

    // 3. Kalavasal Bakery & Production Kitchen
    L.marker([STORES.branches.kitchen.lat, STORES.branches.kitchen.lng], { icon: createCustomIcon("3") })
      .addTo(map)
      .bindPopup(`
        <div style="font-family:inherit; padding:4px;">
          <strong style="color:#83103c; font-size:0.95rem;">Bakery & Production Kitchen</strong><br/>
          <span style="font-size:0.82rem; color:#444;">Pallavan Nagar, Kalavasal, Madurai</span><br/>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${STORES.branches.kitchen.lat},${STORES.branches.kitchen.lng}" target="_blank" style="display:inline-block; margin-top:6px; color:#be185d; font-size:0.8rem; font-weight:700; text-decoration:none;">Get Directions &rarr;</a>
        </div>
      `);

  } catch (err) {
    console.warn("Map setup note:", err);
  }
}

// Inquiry Form - When clicking "Summary", input details are sent to +91 9489872822 on WhatsApp
function setupInquirySummaryForm() {
  const form = document.getElementById("inquiry-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("inquiry-name").value.trim();
    const phone = document.getElementById("inquiry-phone").value.trim();
    const branch = document.getElementById("inquiry-branch").value;
    const category = document.getElementById("inquiry-category").value;
    const notes = document.getElementById("inquiry-notes").value.trim();

    if (!name || !phone) {
      alert("Please enter your name and contact phone number.");
      return;
    }

    const summaryMessage = 
      `*Sri Meenakshi Sweets & Bakery (SINCE 1977)*\n` +
      `*Order & Inquiry Summary*\n\n` +
      `• *Name:* ${name}\n` +
      `• *Phone:* ${phone}\n` +
      `• *Preferred Branch:* ${branch}\n` +
      `• *Requirement:* ${category}\n` +
      (notes ? `• *Details / Notes:* ${notes}\n\n` : `\n`) +
      `Sent to Sri Meenakshi Sweets & Bakery Hotline: +91 9489872822`;

    const whatsappUrl = `https://wa.me/919489872822?text=${encodeURIComponent(summaryMessage)}`;
    window.open(whatsappUrl, "_blank");

    showToast("Summary generated. Redirecting to WhatsApp...");
    form.reset();
  });
}
