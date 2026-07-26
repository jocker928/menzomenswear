const bag = JSON.parse(localStorage.getItem("menzoBag") || "[]");
const count = document.querySelector("#bagCount");
const drawerCount = document.querySelector("#drawerCount");
const bagItems = document.querySelector("#bagItems");
const drawer = document.querySelector("#drawer");
const overlay = document.querySelector("#overlay");

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
    setTimeout(() => button.textContent = "Quick add +", 1100);
    renderBag();
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
renderBag();
