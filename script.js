// Active Travel CO₂ Calculator - JavaScript
// Modern, clean interactions and animations

let isInitialized = false;

document.addEventListener("DOMContentLoaded", function () {
  if (isInitialized) return;
  isInitialized = true;

  // Initialize all components
  initNavigation();
  initScrollAnimations();
  initCO2Counter();
  initSmoothScrolling();
  initMobileMenu();
  initInteractiveEffects();
  initScrollProgress();
  createFloatingParticles();
  observeElements();
  initReflectionNavigation(); // Add reflection page navigation
});

// Navigation functionality
let scrollHandlers = [];

function initNavigation() {
  const navbar = document.getElementById("navbar");
  let lastScrollY = window.scrollY;

  // Navbar scroll effect
  function handleScroll() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    lastScrollY = currentScrollY;
  }

  const throttledScroll = throttle(handleScroll, 16);
  window.addEventListener("scroll", throttledScroll);
  scrollHandlers.push(() =>
    window.removeEventListener("scroll", throttledScroll)
  );

  // Active link highlighting
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  function highlightActiveSection() {
    const scrollPos = window.scrollY + 100;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  const throttledHighlight = throttle(highlightActiveSection, 16);
  window.addEventListener("scroll", throttledHighlight);
  scrollHandlers.push(() =>
    window.removeEventListener("scroll", throttledHighlight)
  );
}

// Mobile menu toggle
function initMobileMenu() {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  navToggle.addEventListener("click", function () {
    navMenu.classList.toggle("active");
    navToggle.classList.toggle("active");
  });

  // Close menu when clicking on a link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", function (e) {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navMenu.classList.remove("active");
      navToggle.classList.remove("active");
    }
  });
}

// Scroll animations
let scrollObserver;

function initScrollAnimations() {
  if (scrollObserver) {
    scrollObserver.disconnect();
  }

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  scrollObserver = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");

        // Add staggered animation for grid items
        if (
          entry.target.classList.contains("overview-grid") ||
          entry.target.classList.contains("research-grid") ||
          entry.target.classList.contains("future-grid") ||
          entry.target.classList.contains("team-grid")
        ) {
          const children = entry.target.children;
          Array.from(children).forEach((child, index) => {
            setTimeout(() => {
              child.classList.add("animate-in");
            }, index * 100);
          });
        }

        // Unobserve after animation to prevent memory leaks
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with animation classes
  const animatedElements = document.querySelectorAll(".animate-on-scroll");
  animatedElements.forEach((el) => scrollObserver.observe(el));
}

// CO₂ Counter Animation
let CO2AnimationId;
let meterObserver;

function initCO2Counter() {
  const meterValue = document.getElementById("meterValue");
  const progressBar = document.getElementById("progressBar");

  if (!meterValue || !progressBar) return;

  const targetValue = 127; // kg CO₂ saved
  const animationDuration = 3000; // 3 seconds
  let startTime;
  let isAnimating = false;

  function animateCounter() {
    if (!isAnimating) return;

    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / animationDuration, 1);

    // Easing function for smooth animation
    const easeOut = 1 - Math.pow(1 - progress, 3);

    const currentValue = Math.floor(targetValue * easeOut);
    meterValue.textContent = currentValue;

    if (progress < 1) {
      CO2AnimationId = requestAnimationFrame(animateCounter);
    } else {
      isAnimating = false;
    }
  }

  function startAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    startTime = Date.now();
    animateCounter();
  }

  // Start animation when CO₂ meter comes into view
  if (meterObserver) {
    meterObserver.disconnect();
  }

  meterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(startAnimation, 500); // Delay for visual effect
          meterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  const meterElement = document.querySelector(".co2-meter");
  if (meterElement) {
    meterObserver.observe(meterElement);
  }
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
}

// Utility function for throttling scroll events
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Add interactive hover effects
function initInteractiveEffects() {
  // Card hover effects
  const cards = document.querySelectorAll(
    ".overview-card, .research-card, .future-card, .team-member"
  );

  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-8px)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(-4px)";
    });
  });

  // Button hover effects with ripple
  const buttons = document.querySelectorAll(".btn");

  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.classList.add("ripple");

      this.appendChild(ripple);

      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.remove();
        }
      }, 600);
    });
  });

  // Add CSS for ripple effect (only once)
  if (!document.querySelector("#ripple-styles")) {
    const rippleCSS = `
    .btn {
        position: relative;
        overflow: hidden;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    `;

    // Inject ripple CSS
    const style = document.createElement("style");
    style.id = "ripple-styles";
    style.textContent = rippleCSS;
    document.head.appendChild(style);
  }
}

// Intersection Observer for fade-in animations
let fadeObserver;

function observeElements() {
  const elements = document.querySelectorAll(".animate-fade-up");

  if (fadeObserver) {
    fadeObserver.disconnect();
  }

  fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = "running";
        fadeObserver.unobserve(entry.target);
      }
    });
  });

  elements.forEach((el) => {
    el.style.animationPlayState = "paused";
    fadeObserver.observe(el);
  });
}

// Add floating particles animation
function createFloatingParticles() {
  const particlesContainer = document.querySelector(".floating-particles");
  if (!particlesContainer || particlesContainer.children.length > 5) return;

  // Create additional particles dynamically
  for (let i = 5; i < 15; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.top = Math.random() * 100 + "%";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 6 + "s";
    particle.style.animationDuration = Math.random() * 4 + 4 + "s";
    particlesContainer.appendChild(particle);
  }
}

// Add scroll progress indicator
let progressScrollHandler;

function initScrollProgress() {
  // Don't create multiple progress bars
  if (document.querySelector(".scroll-progress")) return;

  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        z-index: 9999;
        transition: width 0.1s ease;
    `;
  document.body.appendChild(progressBar);

  progressScrollHandler = throttle(() => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + "%";
  }, 10);

  window.addEventListener("scroll", progressScrollHandler);
  scrollHandlers.push(() =>
    window.removeEventListener("scroll", progressScrollHandler)
  );
}

// Reflection page navigation
function initReflectionNavigation() {
  const navLinks = document.querySelectorAll(".nav-link[data-reflect]");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
}

// Reflection page navigation functionality
function initReflectionNavigation() {
  const reflectionNavItems = document.querySelectorAll('.reflection-nav .nav-item');
  
  if (reflectionNavItems.length === 0) return; // Exit if not on reflection page
  
  reflectionNavItems.forEach(navItem => {
    navItem.addEventListener('click', function() {
      const sectionId = this.getAttribute('data-section');
      const targetSection = document.getElementById(sectionId);
      
      if (targetSection) {
        // Remove active state from all nav items
        reflectionNavItems.forEach(item => item.classList.remove('active'));
        
        // Add active state to clicked nav item
        this.classList.add('active');
        
        // Smooth scroll to target section
        const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Update active nav item based on scroll position
  function updateActiveReflectionNav() {
    const scrollPos = window.scrollY + 150; // Offset for better UX
    
    reflectionNavItems.forEach(navItem => {
      const sectionId = navItem.getAttribute('data-section');
      const section = document.getElementById(sectionId);
      
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
          reflectionNavItems.forEach(item => item.classList.remove('active'));
          navItem.classList.add('active');
        }
      }
    });
  }
  
  // Throttled scroll listener for performance
  const throttledReflectionNav = throttle(updateActiveReflectionNav, 16);
  window.addEventListener('scroll', throttledReflectionNav);
  scrollHandlers.push(() => window.removeEventListener('scroll', throttledReflectionNav));
}

// Cleanup function for page unload
function cleanup() {
  // Cancel any ongoing animations
  if (CO2AnimationId) {
    cancelAnimationFrame(CO2AnimationId);
  }

  // Disconnect observers
  if (scrollObserver) scrollObserver.disconnect();
  if (meterObserver) meterObserver.disconnect();
  if (fadeObserver) fadeObserver.disconnect();

  // Remove scroll handlers
  scrollHandlers.forEach((cleanup) => cleanup());
  scrollHandlers = [];
}

// Add cleanup on page unload
window.addEventListener("beforeunload", cleanup);
window.addEventListener("pagehide", cleanup);
