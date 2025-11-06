document.addEventListener("DOMContentLoaded", () => {
    const counter = document.getElementById("counter");
    const targetCount = 127; // 👈 change this to your real number
    const duration = 2000;   // total animation time in ms
    let current = 0;

    // Start hidden and slightly scaled down
    counter.style.opacity = 0;
    counter.style.transform = "scale(0.9)";

    // Fade + zoom-in animation
    counter.animate(
        [
            { opacity: 0, transform: "scale(0.9)" },
            { opacity: 1, transform: "scale(1)" }
        ],
        {
            duration: 800,
            fill: "forwards",
            easing: "ease-out"
        }
    );

    // Count up animation
    const stepTime = Math.max(10, Math.floor(duration / targetCount));

    const timer = setInterval(() => {
        current += 1;
        counter.textContent = current;

        if (current >= targetCount) {
            clearInterval(timer);
        }
    }, stepTime);
});
