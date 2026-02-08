(function () {
  'use strict';

  // Navbar: add .scrolled on scroll for glass effect
  var nav = document.querySelector('.navbar');
  if (nav) {
    function onScroll() {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Scroll reveal: add .visible when elements enter viewport
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // Close mobile menu when a nav link is clicked
  var check = document.getElementById('check');
  var navLinks = document.querySelectorAll('.navbar .list-in a');
  if (check && navLinks.length) {
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        check.checked = false;
      });
    });
  }

  // Stats count-up when section is in view (respect reduced motion)
  var statsSection = document.getElementById('stats');
  var statNumbers = document.querySelectorAll('.stat-number[data-target]');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (statsSection && statNumbers.length && !reducedMotion && 'IntersectionObserver' in window) {
    var countObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          countObserver.unobserve(entry.target);
          statNumbers.forEach(function (el) {
            var target = parseInt(el.getAttribute('data-target'), 10);
            if (isNaN(target)) return;
            var duration = 1500;
            var start = 0;
            var startTime = null;
            function step(timestamp) {
              if (!startTime) startTime = timestamp;
              var progress = Math.min((timestamp - startTime) / duration, 1);
              var easeOut = 1 - Math.pow(1 - progress, 2);
              var current = Math.round(start + (target - start) * easeOut);
              el.textContent = current;
              if (progress < 1) {
                window.requestAnimationFrame(step);
              } else {
                el.textContent = target;
              }
            }
            window.requestAnimationFrame(step);
          });
        });
      },
      { threshold: 0.2 }
    );
    countObserver.observe(statsSection);
  } else if (statNumbers.length) {
    statNumbers.forEach(function (el) {
      var target = el.getAttribute('data-target');
      if (target) el.textContent = target;
    });
  }
})();
