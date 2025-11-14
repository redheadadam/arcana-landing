const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw9kbEwUnNYCM540qiaIsk09RFj8D7sp5d3Lgg_0v5nnVf7z1jk9yt1D5Ie00nkeLC5cQ/exec";

// --------------------------
// Utility: Smooth count-up animation
// --------------------------
function animateCounter(el, start, end, duration = 1500) {
    let startTimestamp = null;

    function step(timestamp) {
        if (!startTimestamp) startTimestamp = timestamp;
        let progress = Math.min((timestamp - startTimestamp) / duration, 1);

        // Ease-out curve (cubic)
        const eased = 1 - Math.pow(1 - progress, 3);

        el.textContent = Math.floor(start + (end - start) * eased);

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

// --------------------------
// GET: Load Count + Animate
// --------------------------
async function loadCount() {
    const counterEl = document.getElementById("counter");

    try {
        const response = await fetch(WEB_APP_URL);
        const text = await response.text();
        const data = JSON.parse(text);

        const realCount = Number(data.count) || 0;

        // Animate from 0 → real count
        animateCounter(counterEl, 0, realCount, 1500);

    } catch (err) {
        console.error("Error loading count", err);
    }
}

// --------------------------
// POST: Submit Email
// --------------------------
async function submitEmail(email) {
    const confirmation = document.getElementById("confirmation");
    confirmation.textContent = "Submitting...";

    try {
        const response = await fetch(WEB_APP_URL, {
            method: "POST",
            body: new URLSearchParams({ email })
        });

        const text = await response.text();
        const data = JSON.parse(text);

        if (data.error) {
            confirmation.textContent = "Something went wrong. Try again.";
            return;
        }

        // Show success
        confirmation.textContent = "You're on the waitlist! ✅";

        // Animate counter update
        const counterEl = document.getElementById("counter");
        const current = Number(counterEl.textContent) || 0;
        animateCounter(counterEl, current, data.count, 1000);

    } catch (err) {
        confirmation.textContent = "Something went wrong.";
        console.error(err);
    }
}

// --------------------------
// Event Listener
// --------------------------
document.addEventListener("DOMContentLoaded", () => {
    loadCount();

    const joinButton = document.getElementById("joinButton");
    const emailInput = document.getElementById("email");

    joinButton.addEventListener("click", (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();

        if (!email) {
            document.getElementById("confirmation").textContent =
                "Please enter a valid email.";
            return;
        }

        submitEmail(email);
        emailInput.value = "";
    });
});
