// ══════════════════════════════════════
//  NAVBAR
// ══════════════════════════════════════
fetch("navbar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;

    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks   = document.querySelector(".nav-links");

    // Hamburger toggle
    if (menuToggle && navLinks) {
      menuToggle.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("nav-open");
        menuToggle.setAttribute("aria-expanded", isOpen);

        const spans = menuToggle.querySelectorAll("span");
        if (isOpen) {
          spans[0].style.transform = "translateY(7px) rotate(45deg)";
          spans[1].style.opacity   = "0";
          spans[2].style.transform = "translateY(-7px) rotate(-45deg)";
        } else {
          spans[0].style.transform = "";
          spans[1].style.opacity   = "";
          spans[2].style.transform = "";
        }
      });

      // Close menu on outside click
      document.addEventListener("click", (e) => {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
          navLinks.classList.remove("nav-open");
          menuToggle.setAttribute("aria-expanded", false);
          menuToggle.querySelectorAll("span").forEach(s => {
            s.style.transform = "";
            s.style.opacity   = "";
          });
        }
      });
    }

    // Active nav link highlighting
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(link => {
      const href = link.getAttribute("href");
      if (href === currentPage || (currentPage === "" && href === "index.html")) {
        link.classList.add("active");
      }
    });
  });

// ══════════════════════════════════════
//  NAVBAR SCROLL EFFECT
// ══════════════════════════════════════
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".site-header");
  if (nav) {
    nav.classList.toggle("scrolled", window.scrollY > 10);
  }
}, { passive: true });

// ══════════════════════════════════════
//  FOOTER
// ══════════════════════════════════════
fetch("footer.html")
  .then(res => res.text())
  .then(data => {
    const el = document.getElementById("footer");
    if (el) el.innerHTML = data;
  });

// ══════════════════════════════════════
//  GIG GUIDE TABS & AUTO-CLEANUP
// ══════════════════════════════════════
const gigTabs = document.querySelectorAll(".gig-tab");

if (gigTabs.length > 0) {

  // Tab click logic
  gigTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".gig-tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".gig-list").forEach(l => l.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(`gig-${tab.dataset.month}`).classList.add("active");
    });
  });

  // Hide past events
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  document.querySelectorAll(".gig-list li").forEach(li => {
    const dateStr = li.getAttribute("data-date");
    if (dateStr && new Date(dateStr) < today) {
      li.style.display = "none";
    }
  });

  // Hide tabs with no remaining events, auto-switch if needed
  let firstVisibleTab       = null;
  let activeTabStaysVisible = false;

  gigTabs.forEach(tab => {
    const list = document.getElementById(`gig-${tab.dataset.month}`);
    if (list) {
      const visible = Array.from(list.querySelectorAll("li")).filter(li => li.style.display !== "none");
      if (visible.length === 0) {
        tab.style.display = "none";
      } else {
        if (!firstVisibleTab) firstVisibleTab = tab;
        if (tab.classList.contains("active")) activeTabStaysVisible = true;
      }
    }
  });

  if (!activeTabStaysVisible && firstVisibleTab) {
    firstVisibleTab.click();
  }
}

// ══════════════════════════════════════
//  ROOM GALLERY CAROUSELS
// ══════════════════════════════════════
document.querySelectorAll(".room-gallery").forEach(gallery => {
  const track   = gallery.querySelector(".room-gallery-track");
  const imgs    = track.querySelectorAll("img");
  const dots    = gallery.querySelectorAll(".gallery-dot");
  let   current = 0;

  function goTo(index) {
    current = ((index % imgs.length) + imgs.length) % imgs.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("active", i === current));
  }

  gallery.querySelector(".prev").addEventListener("click", () => goTo(current - 1));
  gallery.querySelector(".next").addEventListener("click", () => goTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener("click", () => goTo(i)));

  // Swipe support
  let startX = null;
  track.addEventListener("touchstart", e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener("touchend", e => {
    if (startX === null) return;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
    startX = null;
  });
});
