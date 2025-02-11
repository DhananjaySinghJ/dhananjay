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

gsap.fromTo(
    ".scroll-text",
    { opacity: 0, y: 50 }, // Start hidden & lower
    {
        opacity: 1,
        y: 0,
        scrollTrigger: {
            trigger: ".scroll-text",
            start: "top 80%",
            end: "top 40%",
            scrub: true,
        },
    }
);

gsap.to(".scroll-text", {
    opacity: 0,
    y: -50, // Moves up while fading out
    scrollTrigger: {
        trigger: ".scroll-text",
        start: "top 40%",
        end: "top 10%",
        scrub: true,
    },
});
