document.addEventListener("DOMContentLoaded", () => {
    const counter = document.getElementById("counter");
    const targetCount = 127; // 👈 Set your real or placeholder count here
    const duration = 2000;   // total time for animation in ms
    let current = 0;
    const stepTime = Math.abs(Math.floor(duration / targetCount));

    const timer = setInterval(() => {
        current += 1;
        counter.textContent = current;
        if (current >= targetCount) {
            clearInterval(timer);
        }
    }, stepTime);
});
