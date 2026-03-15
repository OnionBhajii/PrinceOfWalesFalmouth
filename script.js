// ── Navbar ──
fetch("navbar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;

    // These must be inside here — the navbar HTML doesn't exist until the fetch completes
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
      menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("nav-open");
        const isOpen = navLinks.classList.contains("nav-open");
        menuToggle.setAttribute("aria-expanded", isOpen);
      });
    }
  });

// ── Navbar scroll effect ──
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".site-header");
  if (nav) {
    if (window.scrollY > 10) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }
});

// ── Footer ──
fetch("footer.html")
  .then(res => res.text())
  .then(data => {
    const el = document.getElementById("footer");
    if (el) el.innerHTML = data;
  });

// ── Events page: Facebook Page Plugin fallback ──
// If the FB plugin hasn't rendered after 4 seconds (App ID not yet set,
// or visitor has Facebook blocked), hide the plugin wrapper and show
// the fallback card instead.
setTimeout(function () {
  var plugin   = document.querySelector(".fb-page");
  var wrap     = document.querySelector(".fb-plugin-wrap");
  var fallback = document.getElementById("fb-fallback");

  if (!plugin || plugin.offsetHeight < 50) {
    if (wrap)     wrap.style.display     = "none";
    if (fallback) fallback.style.display = "block";
  }
}, 4000);
   // ── Room gallery logic ──
document.querySelectorAll('.room-gallery').forEach(gallery => {
    const track = gallery.querySelector('.room-gallery-track');
    const imgs  = track.querySelectorAll('img');
    const dots  = gallery.querySelectorAll('.gallery-dot');
    let current = 0;

    function goTo(index) {
    current = (index + imgs.length) % imgs.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    gallery.querySelector('.prev').addEventListener('click', () => goTo(current - 1));
    gallery.querySelector('.next').addEventListener('click', () => goTo(current + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
});