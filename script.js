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