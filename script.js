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

// Animate each letter with a slight delay
gsap.from('.letter-container', {
  opacity: 0,
  y: 100,
  rotateX: -90,
  stagger: 0.1,
  duration: 1,
  delay: 3,
  ease: 'power3.out'
});

// Add hover effect
document.querySelectorAll('.letter-container').forEach(letter => {
  letter.addEventListener('mouseenter', () => {
    gsap.to(letter, {
      rotateY: 180,
      duration: 0.5,
      ease: 'power2.inOut'
    });
  });
  
  letter.addEventListener('mouseleave', () => {
    gsap.to(letter, {
      rotateY: 0,
      duration: 0.5,
      ease: 'power2.inOut'
    });
  });
});

// Scramble text

class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.originalText = el.innerText;
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText || ''; // Ensure it starts empty
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

// Text elements configuration
const textElements = {
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

// Initialize TextScramble instances & hide text
const fxInstances = {};
Object.entries(textElements).forEach(([key, { element, text }]) => {
  if (element) {
    element.innerText = ''; // Ensure text is empty at start
    element.style.opacity = 0; // Hide text until animation starts
    const fx = new TextScramble(element);
    fx.originalText = text;
    fxInstances[key] = fx;
  }
});

// Animation sequence control
const animationOrder = ['name', 'profession', 'description', 'freelance', 'scrolldown'];

async function runSequentialAnimation() {
  while (true) {
    for (const key of animationOrder) {
      const fx = fxInstances[key];
      if (!fx) continue;

      // Animate text in
      await fx.setText(fx.originalText);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Display duration
      
      // Animate text out
      await fx.setText('');
      await new Promise((resolve) => setTimeout(resolve, 500)); // Pause between elements
    }
  }
}

// Start the animation sequence after page loads
document.addEventListener('DOMContentLoaded', () => {
  runSequentialAnimation();
});
