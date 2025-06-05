// Language Demo: Generate example proto-words for core concepts
const protoWords = [
    { concept: 'MEAT', word: 'Gro' },
    { concept: 'BERRY', word: 'Kama' },
    { concept: 'WATER', word: 'Zul' },
    { concept: 'FIRE', word: 'Nak' },
    { concept: 'DANGER', word: 'Fep' },
    { concept: 'POP', word: 'See' },
    { concept: 'YES', word: 'Voo' },
    { concept: 'NO', word: 'Ril' }
];

// --- FIRE ICON FOR FIRE PROTO-WORD ---
const origRenderProtoWords = (list, protoWords) => {
  list.innerHTML = '';
  protoWords.forEach(item => {
    const li = document.createElement('li');
    if(item.concept === 'FIRE') {
      li.innerHTML = `<strong>${item.concept}:</strong> <span class="tribal-word">${item.word}<span class='fire-emoji'>🔥</span></span>`;
    } else {
      li.innerHTML = `<strong>${item.concept}:</strong> <span class="tribal-word">${item.word}</span>`;
    }
    list.appendChild(li);
  });
};

// Only add event listener if the element exists (prevents JS errors on pages without the demo button)
const showLangDemoBtn = document.getElementById('show-language-demo');
if (showLangDemoBtn) {
  showLangDemoBtn.addEventListener('click', function() {
    const demo = document.getElementById('language-demo');
    demo.classList.toggle('hidden');
    if (!demo.classList.contains('hidden')) {
      const list = document.getElementById('proto-words-list');
      origRenderProtoWords(list, protoWords);
    }
  });
}

// Section fade-in on scroll (robust: always reveal on load, even if later JS fails)
const sections = document.querySelectorAll('section');
function revealSections() {
  const trigger = window.innerHeight * 0.85;
  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    // Always add 'visible' on load, and toggle on scroll
    if (rect.top < trigger) sec.classList.add('visible');
    else sec.classList.remove('visible');
  });
}
window.addEventListener('scroll', revealSections);
window.addEventListener('DOMContentLoaded', () => {
  revealSections(); // Always reveal sections first
  const heroH2 = document.querySelector('#hero h2');
  const heroPitch = document.querySelector('#hero .elevator-pitch');
  if (heroH2) heroH2.style.animationPlayState = 'running';
  if (heroPitch) heroPitch.style.animationPlayState = 'running';
});

// Smooth scroll for nav links
function enableSmoothScroll() {
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// Back to top button
const backToTop = document.createElement('button');
backToTop.id = 'back-to-top';
backToTop.title = 'Back to top';
backToTop.innerHTML = '🡹';
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Navigation highlighting for multi-page site
// Highlights the nav link for the current page once the header is loaded
function highlightCurrentNav() {
  const navLinks = document.querySelectorAll('nav a');
  const current = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    if (
      (current === 'index.html' && (link.getAttribute('href') === 'index.html' || link.getAttribute('href') === '' || link.getAttribute('href') === '/')) ||
      link.getAttribute('href') === current
    ) {
      link.classList.add('active');
    }
  });
}

// --- CONTACT FORM SUBMISSION HANDLING ---
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    // Fade out the form
    contactForm.classList.add('fade-out');
    // After fade, show thank you message
    setTimeout(() => {
      contactForm.style.display = 'none';
      let thankYou = document.getElementById('contact-thankyou');
      if (!thankYou) {
        thankYou = document.createElement('div');
        thankYou.id = 'contact-thankyou';
        thankYou.innerHTML = '<h2>Thank you</h2><p>Your form has been submitted successfully.</p>';
        contactForm.parentNode.appendChild(thankYou);
      }
      thankYou.classList.add('visible');
    }, 600);

    // Send email via Formspree (or similar service)
    // NOTE: Replace 'YOUR_FORMSPREE_ENDPOINT' with your actual Formspree endpoint
    const formData = new FormData(contactForm);
    fetch('https://formspree.io/f/YOUR_FORMSPREE_ENDPOINT', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    // No need to await, UX is instant
  });
}

// --- MOBILE NAVIGATION & LOGIN/ACCOUNT BUTTON LOGIC ---
// Handled by updateLoginArea() after the header loads

// Load universal header with error handling
function loadHeader() {
    return fetch('header.html')
        .then(response => {
            if (!response.ok) {
                console.error(`Failed to load header: ${response.status} ${response.statusText}`);
                return '';
            }
            return response.text();
        })
        .then(data => {
            if (data) {
                document.querySelector('header').innerHTML = data;
                setupNavToggle();
                highlightCurrentNav();
                enableSmoothScroll();
                updateLoginArea();
            }
        })
        .catch(error => {
            console.error('Error loading header:', error);
        });
}

// Setup nav toggle for mobile
function setupNavToggle() {
    const navToggle = document.getElementById('nav-toggle');
    const mainNav = document.getElementById('main-nav');
    if (navToggle) {
        navToggle.style.display = 'block';
        navToggle.addEventListener('click', () => {
            mainNav.classList.toggle('open');
        });
    }
}

// Populate login area
function updateLoginArea() {
    const loginArea = document.getElementById('login-area');
    if (loginArea) {
        const isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';
        const username = sessionStorage.getItem('username') || 'Guest';
        const role = sessionStorage.getItem('role') || 'user';
        const mainNav = document.getElementById('main-nav');
        let adminLink = document.getElementById('nav-admin');
        if (mainNav) {
            if (role === 'admin') {
                if (!adminLink) {
                    adminLink = document.createElement('a');
                    adminLink.href = 'admin.html';
                    adminLink.id = 'nav-admin';
                    adminLink.textContent = 'Admin Center';
                    mainNav.appendChild(adminLink);
                }
            } else if (adminLink) {
                adminLink.remove();
            }
        }

        if (isLoggedIn) {
            loginArea.innerHTML = `
                <div class="account-welcome-label" style="text-align:center; font-size:0.98em; color:#ffe7a0; font-weight:600; margin-bottom:0.1em;">Welcome, ${username}!</div>
                <a href="#" class="nav-link account-nav-link" id="account-btn" style="padding:0.18em 0.85em; font-size:1em; color:#ffe7a0; font-weight:bold;">Account</a>
                <a href="#" class="nav-link account-nav-link" id="logout-btn" style="padding:0.18em 0.85em; font-size:1em; color:#ffe7a0; font-weight:bold;">Logout</a>
            `;

            const accountBtn = document.getElementById('account-btn');
            if (accountBtn) {
                accountBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.location.href = 'account.html';
                });
            }

            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    sessionStorage.clear(); // Clear session storage to log out
                    window.location.reload(); // Reload the page to reflect the logged-out state
                });
            }
        } else {
            loginArea.innerHTML = '<button class="nav-link account-nav-link" id="login-btn">Login</button>';
            const loginButton = document.getElementById('login-btn');
            if (loginButton) {
                loginButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    window.location.href = 'login.html';
                });
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
  loadHeader().then(() => {
    const nav = document.getElementById('main-nav');
    if (nav) {
      nav.setAttribute('role', 'navigation');
      nav.setAttribute('aria-label', 'Main navigation');
    }
    const navToggle = document.getElementById('nav-toggle');
    if (navToggle) {
      navToggle.setAttribute('aria-label', 'Toggle navigation');
    }
  });
});
