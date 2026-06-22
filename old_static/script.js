document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initStickyHeader();
  initMobileMenu();
  initScrollReveal();
  initCounterAnimations();
  initTestimonialsCarousel();
  initContactForm();
  initBackToTop();
  initMagneticButtons();
});

/* ==========================================
   SCROLL PROGRESS BAR
   ========================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  });

  function updateProgress() {
    const windowScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (windowScroll / height) * 100 : 0;
    progressBar.style.width = scrolled + '%';
    ticking = false;
  }
}

/* ==========================================
   STICKY NAVBAR & ACTIVE LINK TRACKER
   ========================================== */
function initStickyHeader() {
  const header = document.querySelector('.header-nav');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (!header) return;

  // Handle header shrink on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    updateActiveLink();
  });

  // Track active section and update nav highlight
  function updateActiveLink() {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120; // offset for nav height

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  }

  // Active state update on click
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

/* ==========================================
   MOBILE MENU OVERLAY
   ========================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const mobileMenu = document.getElementById('mobile-nav');
  const menuLinks = document.querySelectorAll('#mobile-nav .nav-link, #mobile-nav .btn');

  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = toggleBtn.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : ''; // Disable scroll when menu is open
  });

  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ==========================================
   INTERSECTION OBSERVER - SCROLL REVEALS
   ========================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  const heroContent = document.querySelector('.hero-content');
  const heroVisual = document.querySelector('.hero-visual');

  // Trigger hero animation immediately on load
  if (heroContent) heroContent.classList.add('active');
  if (heroVisual) heroVisual.classList.add('active');

  if (revealElements.length === 0) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // Stagger children inside services grid and blog grid if they are container items
        if (entry.target.classList.contains('services-grid') || entry.target.classList.contains('blog-grid')) {
          const cards = entry.target.querySelectorAll('.service-card, .blog-card');
          cards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.15}s`;
            card.classList.add('active');
          });
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });
}

/* ==========================================
   METRICS COUNTER ANIMATIONS
   ========================================== */
function initCounterAnimations() {
  const counters = document.querySelectorAll('.metric-num');
  if (counters.length === 0) return;

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5
  });

  counters.forEach(counter => {
    counterObserver.observe(counter);
  });

  function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function - easeOutQuad
      const easedProgress = progress * (2 - progress);
      const currentValue = Math.floor(easedProgress * target);
      
      // Add formatting suffix if appropriate
      if (target === 480) {
        counter.textContent = currentValue + '+';
      } else if (target === 200) {
        counter.textContent = currentValue + '+';
      } else if (target === 12) {
        counter.textContent = currentValue + ' Yrs';
      } else if (target === 85) {
        counter.textContent = currentValue + '%';
      } else {
        counter.textContent = currentValue;
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        // Ensure final target value is displayed exactly
        if (target === 480 || target === 200) {
          counter.textContent = target + '+';
        } else if (target === 12) {
          counter.textContent = target + ' Yrs';
        } else if (target === 85) {
          counter.textContent = target + '%';
        } else {
          counter.textContent = target;
        }
      }
    }

    requestAnimationFrame(updateCounter);
  }
}

/* ==========================================
   TESTIMONIALS SLIDER CAROUSEL
   ========================================== */
function initTestimonialsCarousel() {
  const track = document.getElementById('testimonials-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const dotsContainer = document.getElementById('carousel-dots');

  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  const slideCount = slides.length;

  // Initialize dots if dynamic
  const dots = document.querySelectorAll('.carousel-dot');

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update dots
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slideCount;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slideCount) % slideCount;
    updateCarousel();
  }

  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      currentIndex = parseInt(e.target.getAttribute('data-index'), 10);
      updateCarousel();
    });
  });

  // Swipe Gestures Support
  let startX = 0;
  let endX = 0;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50; // pixels
    if (startX - endX > swipeThreshold) {
      nextSlide(); // Swiped left
    } else if (endX - startX > swipeThreshold) {
      prevSlide(); // Swiped right
    }
  }

  // Keyboard accessibility
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    }
  });
}

/* ==========================================
   CONTACT INTAKE FORM (MOCK INTERACTIVE SUBMISSION)
   ========================================= */
function initContactForm() {
  const form = document.getElementById('consultation-form');
  const resultDiv = document.getElementById('form-result');
  const submitBtn = form?.querySelector('button[type="submit"]');

  if (!form || !resultDiv) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const company = document.getElementById('form-company').value.trim();
    const subject = document.getElementById('form-subject').value;
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !company || !subject || !message) {
      showResult('Please complete all form inputs.', 'error');
      return;
    }

    // Set sending animation state
    submitBtn.disabled = true;
    const originalBtnHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      Sending Request...
      <svg class="btn-icon animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="10"></circle>
      </svg>
    `;

    // Simulate Network Request Delay
    setTimeout(() => {
      showResult(`Thank you, ${name}. Your consultation request has been received. Our chief architect will contact you at ${email} shortly.`, 'success');
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
    }, 1800);
  });

  // Newsletter Mock Form
  const newsletterForm = document.getElementById('newsletter-form');
  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = newsletterForm.querySelector('input[type="email"]');
    const subscribeBtn = newsletterForm.querySelector('button');
    
    if (emailInput && emailInput.value.trim() !== '') {
      subscribeBtn.disabled = true;
      const originalHTML = subscribeBtn.innerHTML;
      subscribeBtn.innerHTML = `✓`;
      
      setTimeout(() => {
        alert('Subscription successful! Check your inbox for updates.');
        emailInput.value = '';
        subscribeBtn.disabled = false;
        subscribeBtn.innerHTML = originalHTML;
      }, 1000);
    }
  });

  function showResult(message, type) {
    resultDiv.textContent = message;
    resultDiv.className = `form-message ${type}`;
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Hide message after 8 seconds
    setTimeout(() => {
      resultDiv.style.display = 'none';
      resultDiv.className = 'form-message';
    }, 8000);
  }
}

// Add simple CSS spin keyframe dynamically for submit button spinner
const style = document.createElement('style');
style.textContent = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);

/* ==========================================
   BACK TO TOP BUTTON
   ========================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================
   PREMIUM MICRO-INTERACTION: MAGNETIC BUTTONS
   ========================================== */
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .carousel-arrow, #back-to-top');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const position = btn.getBoundingClientRect();
      // Calculate cursor position relative to button center
      const x = e.clientX - position.left - position.width / 2;
      const y = e.clientY - position.top - position.height / 2;

      // Restrict magnetic pull force
      const forceMultiplier = 0.35;
      btn.style.transform = `translate(${x * forceMultiplier}px, ${y * forceMultiplier}px) scale(1.02)`;
    });

    btn.addEventListener('mouseleave', () => {
      // Smoothly reset button position
      btn.style.transform = '';
    });
  });
}
