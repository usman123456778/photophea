document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 1000, // Default animation duration
        once: true,     // Animation happens only once
        offset: 50,     // Offset from original trigger point
    });

    // --- Theme Toggle ---
    const themeToggleBtn = document.querySelector('.theme-toggle-btn');
    const body = document.body;
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

    // Function to apply theme
    function applyTheme(theme) {
        body.classList.remove('light-mode', 'dark-mode');
        body.classList.add(theme + '-mode'); // Add correct class

        if (theme === 'dark') {
            body.style.setProperty('--current-bg', 'var(--bg-dark)');
            body.style.setProperty('--current-text', 'var(--text-dark)');
            body.style.setProperty('--current-primary', 'var(--primary-dark-theme)');
            body.style.setProperty('--current-primary-darker', 'var(--primary-dark-dark)');
            body.style.setProperty('--current-secondary', 'var(--secondary-dark)');
            body.style.setProperty('--current-accent', 'var(--accent-dark)');
            body.style.setProperty('--current-card-bg', 'var(--card-bg-dark)');
            body.style.setProperty('--current-text-muted', 'var(--text-muted-dark)');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        } else { // Light mode
            body.style.setProperty('--current-bg', 'var(--bg-light)');
            body.style.setProperty('--current-text', 'var(--text-light)');
            body.style.setProperty('--current-primary', 'var(--primary-light)');
            body.style.setProperty('--current-primary-darker', 'var(--primary-dark-light)');
            body.style.setProperty('--current-secondary', 'var(--secondary-light)');
            body.style.setProperty('--current-accent', 'var(--accent-light)');
            body.style.setProperty('--current-card-bg', 'var(--card-bg-light)');
            body.style.setProperty('--current-text-muted', 'var(--text-muted-light)');
            if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        }
         // For HRO overlay, which uses --primary-rgb
        if (theme === 'dark') {
            body.style.setProperty('--primary-rgb', '255, 127, 80'); // Coral RGB
        } else {
            body.style.setProperty('--primary-rgb', '255, 102, 0'); // Orange RGB
        }
    }

    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('musicologyTheme') || 'light';
    applyTheme(savedTheme); // Apply theme on load

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const newTheme = body.classList.contains('light-mode') ? 'dark' : 'light';
            applyTheme(newTheme);
            localStorage.setItem('musicologyTheme', newTheme);
        });
    }


    // --- Mobile Navigation Toggle ---
    const menuToggle = document.querySelector('.menu-toggle-btn');
    const navUl = document.querySelector('.navbar nav ul');
    const menuIcon = menuToggle ? menuToggle.querySelector('i') : null;


    if (menuToggle && navUl && menuIcon) {
        menuToggle.addEventListener('click', () => {
            navUl.classList.toggle('active');
            if (navUl.classList.contains('active')) {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-times');
                menuToggle.setAttribute('aria-expanded', 'true');
            } else {
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close mobile menu when a link is clicked
        navUl.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navUl.classList.contains('active')) {
                    navUl.classList.remove('active');
                    menuIcon.classList.remove('fa-times');
                    menuIcon.classList.add('fa-bars');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // --- Active Navigation Link Highlighting on Scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinksAnchors = document.querySelectorAll('.navbar nav ul a');
    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 70;

    function changeNavActiveState() {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - navbarHeight - 50) { // Adjusted offset
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinksAnchors.forEach(anchor => {
            anchor.classList.remove('active');
            if (anchor.getAttribute('href') === `#${currentSectionId}`) {
                anchor.classList.add('active');
            }
        });
        // Special case for home link when at the very top
        if (pageYOffset < sections[0].offsetTop - navbarHeight - 50) {
            const homeLink = document.querySelector('.navbar nav ul a[href="#hero"]');
            if (homeLink) {
                 navLinksAnchors.forEach(a => a.classList.remove('active'));
                 homeLink.classList.add('active');
            }
        }
    }
    if (sections.length > 0 && navLinksAnchors.length > 0) {
      window.addEventListener('scroll', changeNavActiveState);
      changeNavActiveState(); // Initial check
    }


    // --- Animated Statistics Counter ---
    const counters = document.querySelectorAll('.statistics .counter');
    const counterSpeed = 200; // Lower is faster

    const animateCounter = (counter) => {
        const target = +counter.dataset.target;
        const updateCount = () => {
            const currentValue = +counter.innerText.replace(/,/g, ''); // Remove existing commas for calculation
            const increment = target / counterSpeed;

            if (currentValue < target) {
                counter.innerText = Math.ceil(currentValue + increment).toLocaleString(); // Add commas
                setTimeout(updateCount, 15); // Adjust timing for smoother animation
            } else {
                counter.innerText = target.toLocaleString(); // Ensure final target is set with commas
            }
        };
        updateCount();
    };

    const counterObserverOptions = { root: null, threshold: 0.5 };
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                animateCounter(entry.target);
                entry.target.dataset.animated = "true";
                observer.unobserve(entry.target); // Animate only once
            }
        });
    }, counterObserverOptions);

    counters.forEach(counter => counterObserver.observe(counter));


    // --- Dynamic Copyright Year ---
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

});