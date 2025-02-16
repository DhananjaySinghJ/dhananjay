// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
    smooth: true,
    duration: 1.2,
    easing: (t) => 1 - Math.pow(1 - t, 3),
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Text scramble class
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.originalText = el.innerText;
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText || '';
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.el.style.opacity = 1; // Make sure it's visible when animation starts
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;

    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += char;
      } else {
        output += from;
      }
    }

    this.el.innerText = output;

    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Animate hero letters
  gsap.from('.letter-container', {
    opacity: 0,
    y: 100,
    rotateX: -90,
    stagger: 0.1,
    duration: 1,
    delay: 3,
    ease: 'power3.out'
  });

  // Get all SVG paths
  const paths = document.querySelectorAll('.hero_letter-path');
  
  // Calculate and set the correct dash values for each path
  paths.forEach(path => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
  });

  // Setup video unmute button
  const video = document.querySelector('.video-container video');
  if (video) {
    const unmuteButton = document.createElement('button');
    
    // Create and style unmute button
    unmuteButton.innerHTML = 'Unmute';
    unmuteButton.classList.add('unmute-btn');
    document.querySelector('.video-container').appendChild(unmuteButton);
    
    // Toggle mute/unmute
    unmuteButton.addEventListener('click', () => {
      video.muted = !video.muted;
      unmuteButton.innerHTML = video.muted ? 'Unmute' : 'Mute';
    });
  }

  // Text elements configuration for main animation
  const mainTextElements = {
    name: {
      element: document.querySelector('.name-text'),
      text: 'Dhananjay Singh',
    },
    profession: {
      element: document.querySelector('.profession-text'),
      text: 'AI Specialist',
    },
    description: {
      element: document.querySelector('.description-text'),
      text: 'FullStack Developer',
    },
    freelance: {
      element: document.querySelector('.freelance-text'),
      text: 'Freelance Developer',
    },
    scrolldown: {
      element: document.querySelector('.scrolldown-text'),
      text: 'Scroll Down',
    },
  };

  // Initialize TextScramble instances for main animation
  const mainFxInstances = {};
  Object.entries(mainTextElements).forEach(([key, { element, text }]) => {
    if (element) {
      element.innerText = ''; // Ensure text is empty at start
      element.style.opacity = 0;
      const fx = new TextScramble(element);
      fx.originalText = text;
      mainFxInstances[key] = fx;
    }
  });

  // Navigation elements with their original text
  const navElements = {
    menuBtn: {
      element: document.querySelector('#menuBtn'),
      text: 'MENU'
    },
    homeBtn: {
      element: document.querySelector('#homeBtn'),
      text: 'HOME'
    },
    casesBtn: {
      element: document.querySelector('#casesBtn'),
      text: 'CASES'
    },
    contactsBtn: {
      element: document.querySelector('#contactsBtn'),
      text: 'CONTACTS'
    }
  };

  // Create separate map to track scrambling state for each nav button
  const isScrambling = {
    menuBtn: false,
    homeBtn: false,
    casesBtn: false,
    contactsBtn: false
  };

  // Add hover effect to all nav buttons
  Object.entries(navElements).forEach(([id, {element, text}]) => {
    if (element) {
      const fx = new TextScramble(element);
      fx.originalText = text;
      
      // Make sure the original text is set
      element.innerText = text;
      
      element.addEventListener('mouseenter', () => {
        if (!isScrambling[id]) {
          isScrambling[id] = true;
          fx.setText(text).then(() => {
            isScrambling[id] = false;
          });
        }
      });
    }
  });

  // Animation sequence control for main texts
  const animationOrder = ['name', 'profession', 'description', 'freelance', 'scrolldown'];

  async function runSequentialAnimation() {
    while (true) {
      for (const key of animationOrder) {
        const fx = mainFxInstances[key];
        if (!fx) continue;

        // Animate text in
        await fx.setText(fx.originalText);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Display duration
        
        // Animate text out
        await fx.setText('');
        await new Promise((resolve) => setTimeout(resolve, 250)); // Pause between elements
      }
    }
  }

  // Replace the menu button section with this updated code
const menuBtn = document.getElementById('menuBtn');
if (menuBtn) {
  const navLinks = document.getElementById('navLinks');
  const navLinksItems = document.querySelectorAll('.nav-link');

  // Toggle menu state
  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
    // Toggle visibility of nav links
    navLinksItems.forEach(link => {
      link.style.opacity = navLinks.classList.contains('active') ? '1' : '0';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
      menuBtn.classList.remove('active');
      navLinks.classList.remove('active');
      // Hide nav links when clicking outside
      navLinksItems.forEach(link => {
        link.style.opacity = '0';
      });
    }
  });
}

  // Start the animation sequence
  runSequentialAnimation();
});