// ── Navbar ──
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

        // Animate hamburger lines into X
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

// ── Navbar scroll effect ──
window.addEventListener("scroll", () => {
  const nav = document.querySelector(".site-header");
  if (nav) {
    nav.classList.toggle("scrolled", window.scrollY > 10);
  }
}, { passive: true });

// ── Footer ──
fetch("footer.html")
  .then(res => res.text())
  .then(data => {
    const el = document.getElementById("footer");
    if (el) el.innerHTML = data;
  });

// ── Events page: Facebook Page Plugin fallback ──
setTimeout(function () {
  const plugin   = document.querySelector(".fb-page");
  const wrap     = document.querySelector(".fb-plugin-wrap");
  const fallback = document.getElementById("fb-fallback");

  if (!plugin || plugin.offsetHeight < 50) {
    if (wrap)     wrap.style.display     = "none";
    if (fallback) fallback.style.display = "block";
  }
}, 4000);

// ── Events page: Gig Guide Tabs & Auto-Cleanup ──
const gigTabs = document.querySelectorAll('.gig-tab');
if (gigTabs.length > 0) {
  
  // 1. Setup the basic tab clicking logic
  gigTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.gig-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.gig-list').forEach(l => l.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(`gig-${tab.dataset.month}`).classList.add('active');
    });
  });

  // 2. Auto-hide past events
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to midnight for fair comparison

  document.querySelectorAll('.gig-list li').forEach(li => {
    const dateString = li.getAttribute('data-date');
    if (dateString) {
      const eventDate = new Date(dateString);
      if (eventDate < today) {
        li.style.display = 'none'; // Hide if the day has passed
      }
    }
  });

  // 3. Hide empty tabs and auto-switch if needed
  let firstVisibleTab = null;
  let activeTabStaysVisible = false;

  gigTabs.forEach(tab => {
    const list = document.getElementById(`gig-${tab.dataset.month}`);
    if (list) {
      // Find how many events in this list are still visible
      const visibleEvents = Array.from(list.querySelectorAll('li')).filter(li => li.style.display !== 'none');
      
      if (visibleEvents.length === 0) {
        tab.style.display = 'none'; // Hide the tab completely
      } else {
        if (!firstVisibleTab) firstVisibleTab = tab; // Remember the first tab with events
        if (tab.classList.contains('active')) activeTabStaysVisible = true;
      }
    }
  });

  // 4. If the month we are currently looking at is empty, click the next available tab
  if (!activeTabStaysVisible && firstVisibleTab) {
    firstVisibleTab.click();
  }
}
// ── Room gallery logic ──
document.querySelectorAll(".room-gallery").forEach(gallery => {
  const track = gallery.querySelector(".room-gallery-track");
  const imgs  = track.querySelectorAll("img");
  const dots  = gallery.querySelectorAll(".gallery-dot");
  let current = 0;

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
  track.addEventListener("touchend",   e => {
    if (startX === null) return;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
    startX = null;
  });
});
