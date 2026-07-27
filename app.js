const bag = JSON.parse(localStorage.getItem("menzoBag") || "[]");
const count = document.querySelector("#bagCount");
const drawerCount = document.querySelector("#drawerCount");
const bagItems = document.querySelector("#bagItems");
const drawer = document.querySelector("#drawer");
const overlay = document.querySelector("#overlay");
const checkout = document.querySelector(".checkout");

function renderBag() {
  count.textContent = bag.length;
  drawerCount.textContent = bag.length;
  bagItems.innerHTML = bag.length
    ? bag.map((item, i) => `<div class="bag-line"><span>${item}</span><button aria-label="Remove ${item}" data-remove="${i}">×</button></div>`).join("")
    : "<p>Your bag is waiting.</p>";
  localStorage.setItem("menzoBag", JSON.stringify(bag));
}

function toggleDrawer(open) {
  drawer.classList.toggle("open", open);
  overlay.classList.toggle("show", open);
  drawer.setAttribute("aria-hidden", String(!open));
}

document.querySelectorAll(".add-btn").forEach(button => {
  button.addEventListener("click", () => {
    bag.push(button.dataset.product);
    button.textContent = "Added ✓";
    setTimeout(() => button.textContent = "Add to bag +", 1100);
    renderBag();
  });
});
document.querySelectorAll(".buy-btn").forEach(button => {
  button.addEventListener("click", () => {
    bag.push(button.dataset.product);
    renderBag();
    togglePayment(true);
  });
});

bagItems.addEventListener("click", event => {
  const index = event.target.dataset.remove;
  if (index !== undefined) {
    bag.splice(Number(index), 1);
    renderBag();
  }
});

document.querySelector("#bagBtn").addEventListener("click", () => toggleDrawer(true));
document.querySelector("#closeDrawer").addEventListener("click", () => toggleDrawer(false));
overlay.addEventListener("click", () => toggleDrawer(false));
checkout.addEventListener("click", () => {
  if (!bag.length) {
    checkout.textContent = "Add an item first";
    setTimeout(() => checkout.textContent = "Continue to payment", 1400);
    return;
  }
  toggleDrawer(false);
  togglePayment(true);
});

const paymentModal = document.querySelector("#paymentModal");
const paymentOverlay = document.querySelector("#paymentOverlay");
function togglePayment(open) {
  paymentModal.classList.toggle("open", open);
  paymentOverlay.classList.toggle("show", open);
  paymentModal.setAttribute("aria-hidden", String(!open));
}
document.querySelector("#paymentClose").addEventListener("click", () => togglePayment(false));
paymentOverlay.addEventListener("click", () => togglePayment(false));
document.querySelector("#copyPayment").addEventListener("click", async () => {
  await navigator.clipboard.writeText("8867717777");
  document.querySelector("#paymentMessage").textContent = "Google Pay number copied: 8867717777";
});
document.querySelector("#paidButton").addEventListener("click", () => {
  document.querySelector("#orderForm").hidden = false;
  document.querySelector("#paidButton").hidden = true;
  document.querySelector("#orderForm").scrollIntoView({behavior: "smooth", block: "start"});
});
document.querySelector("#orderForm").addEventListener("submit", event => {
  event.preventDefault();
  const pincode = document.querySelector("#buyerPincode").value.trim();
  if (!/^671\d{3}$/.test(pincode)) {
    document.querySelector("#paymentMessage").textContent = "Delivery is available only for Kasaragod 671xxx PIN codes.";
    document.querySelector("#buyerPincode").focus();
    return;
  }
  const proof = document.querySelector("#paymentProof").files[0];
  const orderId = `MZ${Date.now().toString().slice(-8)}`;
  const order = {
    orderId,
    items: [...bag],
    pricePerItem: 299,
    total: bag.length * 299,
    utr: document.querySelector("#utrNumber").value.trim(),
    buyerName: document.querySelector("#buyerName").value.trim(),
    buyerPhone: document.querySelector("#buyerPhone").value.trim(),
    address: document.querySelector("#buyerAddress").value.trim(),
    pincode,
    proofFileName: proof?.name || "",
    createdAt: new Date().toISOString(),
    status: "Order received"
  };
  localStorage.setItem("menzoPendingOrder", JSON.stringify(order));
  const orders = JSON.parse(localStorage.getItem("menzoOrders") || "{}");
  orders[orderId] = order;
  localStorage.setItem("menzoOrders", JSON.stringify(orders));
  window.location.href = `track.html?order=${encodeURIComponent(orderId)}&success=1`;
});
document.querySelector("#menuBtn").addEventListener("click", () => {
  document.querySelector(".desktop-nav").classList.toggle("mobile-open");
});
document.querySelector("#searchBtn").addEventListener("click", () => {
  document.querySelector("#new").scrollIntoView({behavior: "smooth"});
});
document.querySelector("#newsletterForm").addEventListener("submit", event => {
  event.preventDefault();
  document.querySelector("#formMessage").textContent = "Welcome to MENZO. You're on the list.";
  event.target.reset();
});
const whatsapp = document.querySelector(".whatsapp");
const whatsappToggle = document.querySelector("#whatsappToggle");
whatsappToggle.addEventListener("click", () => {
  const open = whatsapp.classList.toggle("open");
  whatsappToggle.setAttribute("aria-expanded", String(open));
});
document.addEventListener("click", event => {
  if (!whatsapp.contains(event.target)) {
    whatsapp.classList.remove("open");
    whatsappToggle.setAttribute("aria-expanded", "false");
  }
});

const authModal = document.querySelector("#authModal");
const authOverlay = document.querySelector("#authOverlay");
const authMessage = document.querySelector("#authMessage");
const otpRequestForm = document.querySelector("#otpRequestForm");
const otpVerifyForm = document.querySelector("#otpVerifyForm");
let pendingEmail = "";

function toggleAuth(open) {
  authModal.classList.toggle("open", open);
  authOverlay.classList.toggle("show", open);
  authModal.setAttribute("aria-hidden", String(!open));
}

document.querySelector("#accountBtn").addEventListener("click", () => toggleAuth(true));
document.querySelector("#authClose").addEventListener("click", () => toggleAuth(false));
authOverlay.addEventListener("click", () => toggleAuth(false));

otpRequestForm.addEventListener("submit", async event => {
  event.preventDefault();
  const auth = window.MENZO_AUTH || {};
  if (!auth.supabaseUrl || !auth.supabaseAnonKey) {
    authMessage.textContent = "Email OTP setup is pending.";
    return;
  }
  pendingEmail = document.querySelector("#authEmail").value.trim();
  authMessage.textContent = "Sending OTP…";
  const response = await fetch(`${auth.supabaseUrl}/auth/v1/otp`, {
    method: "POST",
    headers: {"apikey": auth.supabaseAnonKey, "Content-Type": "application/json"},
    body: JSON.stringify({email: pendingEmail, create_user: true})
  });
  if (!response.ok) {
    authMessage.textContent = "Could not send OTP. Please check the email and try again.";
    return;
  }
  otpRequestForm.hidden = true;
  otpVerifyForm.hidden = false;
  authMessage.textContent = "OTP sent. Check your email.";
});

otpVerifyForm.addEventListener("submit", async event => {
  event.preventDefault();
  const auth = window.MENZO_AUTH || {};
  const token = document.querySelector("#authOtp").value.trim();
  authMessage.textContent = "Verifying…";
  const response = await fetch(`${auth.supabaseUrl}/auth/v1/verify`, {
    method: "POST",
    headers: {"apikey": auth.supabaseAnonKey, "Content-Type": "application/json"},
    body: JSON.stringify({email: pendingEmail, token, type: "email"})
  });
  if (!response.ok) {
    authMessage.textContent = "Invalid or expired OTP.";
    return;
  }
  const session = await response.json();
  localStorage.setItem("menzoSession", JSON.stringify(session));
  document.querySelector("#accountBtn").textContent = "Account";
  authMessage.textContent = "Login successful.";
  setTimeout(() => toggleAuth(false), 900);
});
renderBag();
