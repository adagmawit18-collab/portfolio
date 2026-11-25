document.addEventListener("DOMContentLoaded", () => {

  /* ===== 1. Mobile navigation ===== */
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  navToggle.addEventListener("click", () => {
    const open = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", open);
  });
  navMenu.querySelectorAll("a").forEach(link =>
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    })
  );

  /* ===== 2. Interactive feature: dark / light theme toggle ===== */
  const themeBtn = document.getElementById("themeToggle");
  const root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    themeBtn.textContent = theme === "dark" ? "🌙" : "☀️";
  }
  let saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) { /* storage unavailable */ }
  applyTheme(saved || "dark");

  themeBtn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("theme", next); } catch (e) { /* ignore */ }
  });

  /* ===== 3. Interactive feature: project filter ===== */
  const filterBtns = document.querySelectorAll(".filter");
  const projects = document.querySelectorAll(".project");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      projects.forEach(p => {
        p.classList.toggle("hide", f !== "all" && p.dataset.category !== f);
      });
    });
  });

  /* ===== 4. Interactive feature: animated skill bars on scroll ===== */
  const fills = document.querySelectorAll(".bar-fill");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.level + "%";
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    fills.forEach(f => observer.observe(f));
  } else {
    fills.forEach(f => (f.style.width = f.dataset.level + "%"));
  }

  /* ===== 5. Typing effect in hero ===== */
  const typedEl = document.getElementById("typed");
  const words = ["CS student", "problem solver", "future software engineer"];
  let w = 0, c = 0, deleting = false;

  function type() {
    const word = words[w];
    typedEl.textContent = word.slice(0, c);
    if (!deleting && c < word.length) { c++; setTimeout(type, 90); }
    else if (!deleting) { deleting = true; setTimeout(type, 1400); }
    else if (c > 0) { c--; setTimeout(type, 45); }
    else { deleting = false; w = (w + 1) % words.length; setTimeout(type, 300); }
  }
  type();

  /* ===== 6. Contact form validation ===== */
  const form = document.getElementById("contactForm");
  const nameEl = document.getElementById("name");
  const emailEl = document.getElementById("email");
  const msgEl = document.getElementById("message");
  const counter = document.getElementById("count");
  const success = document.getElementById("formSuccess");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  msgEl.addEventListener("input", () => {
    counter.textContent = msgEl.value.length + "/500";
  });

  function setError(input, message) {
    document.getElementById(input.id + "Error").textContent = message;
    input.closest(".field").classList.toggle("invalid", Boolean(message));
    input.setAttribute("aria-invalid", Boolean(message));
    return !message;
  }

  const validators = {
    name: () => setError(nameEl,
      nameEl.value.trim().length < 30? "Please enter your name (at least 4 characters)." : ""),
    email: () => setError(emailEl,
      !emailPattern.test(emailEl.value.trim()) ? "Please enter a valid email address." : ""),
    message: () => setError(msgEl,
      msgEl.value.trim().length < 50 ? "Message must be at least 20 characters." : "")
  };

  [nameEl, emailEl, msgEl].forEach(el =>
    el.addEventListener("blur", validators[el.id])
  );

  form.addEventListener("submit", e => {
    e.preventDefault();
    success.textContent = "";
    const ok = [validators.name(), validators.email(), validators.message()].every(Boolean);
    if (ok) {
      // No backend: in a real deployment, send the data to a server or form service here.
      success.textContent = "Thanks! Your message has been validated and is ready to send. ✅";
      form.reset();
      counter.textContent = "0/500";
    }
  });

  /* ===== 7. Footer year ===== */
  document.getElementById("year").textContent = new Date().getFullYear();
});
