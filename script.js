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
      this.originalText = el.innerText || el.innerText;
      this.update = this.update.bind(this);
      this.isLooping = false;
  }
  
  setText(newText) {
      const oldText = this.el.innerText;
      const length = Math.max(oldText.length, newText.length);
      const promise = new Promise((resolve) => this.resolve = resolve);
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
          if (this.isLooping) {
              // Wait for 2 seconds before starting the next loop
              setTimeout(() => {
                  this.startLoop();
              }, 2000);
          }
      } else {
          this.frameRequest = requestAnimationFrame(this.update);
          this.frame++;
      }
  }
  
  randomChar() {
      return this.chars[Math.floor(Math.random() * this.chars.length)];
  }

  startLoop() {
      this.isLooping = true;
      this.setText(this.originalText);
  }

  stopLoop() {
      this.isLooping = false;
  }
}

// Initialize and start the looping effect
const textElements = {
  name: {
      element: document.querySelector('.name-text'),
      text: 'Dhananjay Singh'
  },
  profession: {
      element: document.querySelector('.profession-text'),
      text: 'AI Specialist'
  },
  description: {
      element: document.querySelector('.description-text'),
      text: 'FullStack Developer'
  }
};

// Initialize scramble effect for each element
Object.values(textElements).forEach(({ element, text }) => {
  if (element) {
      const fx = new TextScramble(element);
      // Store original text
      element.originalText = text;
      // Start loop with delay based on index
      setTimeout(() => {
          fx.startLoop();
      }, 500); // Add slight delay between elements
  }
});