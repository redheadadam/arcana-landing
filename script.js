const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw9kbEwUnNYCM540qiaIsk09RFj8D7sp5d3Lgg_0v5nnVf7z1jk9yt1D5Ie00nkeLC5cQ/exec";

// -----------------------------------------------------
// ODOMETER ENGINE
// -----------------------------------------------------

function renderOdometer(container, number) {
    const str = String(number);
    container.innerHTML = ""; // clear old digits

    for (let char of str) {
        const digitContainer = document.createElement("div");
        digitContainer.className = "odometer-digit";

        const stack = document.createElement("div");
        stack.className = "digit-stack";

        // create digits 0–9
        for (let i = 0; i < 10; i++) {
            const d = document.createElement("div");
            d.className = "digit";
            d.textContent = i;
            stack.appendChild(d);
        }

        digitContainer.appendChild(stack);
        container.appendChild(digitContainer);

        // animate to correct position
        requestAnimationFrame(() => {
            stack.style.transform = `translateY(-${char * 32}px)`;
        });
    }
}

function animateOdometer(container, oldNum, newNum) {
    const duration = 400; // ms
    const steps = 20;
    const diff = newNum - oldNum;

    let i = 0;
    const interval = setInterval(() => {
        const value = Math.round(oldNum + (diff * (i / steps)));
        renderOdometer(container, value);

        if (i >= steps) clearInterval(interval);
        i++;
    }, duration / steps);
}

// -----------------------------------------------------
// LOAD COUNT (GET)
// -----------------------------------------------------
async function loadCount() {
    try {
        const response = await fetch(WEB_APP_URL);
        const text = await response.text();
        const data = JSON.parse(text);

        console.log("Loaded count:", data);

        const od = document.getElementById("odometer");
        const oldValue = parseInt(od.dataset.value || 0);

        animateOdometer(od, oldValue, data.count);
        od.dataset.value = data.count;

    } catch (err) {
        console.error("Error loading count:", err);
    }
}

// -----------------------------------------------------
// SUBMIT EMAIL (POST)
// -----------------------------------------------------
async function submitEmail(email) {
    try {
        const response = await fetch(WEB_APP_URL, {
            method: "POST",
            body: new URLSearchParams({ email })
        });

        const text = await response.text();
        const data = JSON.parse(text);

        console.log("Submit result:", data);

        if (data.error) {
            document.getElementById("confirmation").textContent =
                "Error: " + data.error;
            return;
        }

        const od = document.getElementById("odometer");
        const oldValue = parseInt(od.dataset.value || 0);

        animateOdometer(od, oldValue, data.count);
        od.dataset.value = data.count;

        document.getElementById("confirmation").textContent =
            "You're on the waitlist! ✅";

    } catch (err) {
        console.error("Submit error:", err);
        document.getElementById("confirmation").textContent =
            "Something went wrong.";
    }
}

// -----------------------------------------------------
// SETUP BUTTON
// -----------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    loadCount();

    const joinButton = document.getElementById("joinButton");
    const emailInput = document.getElementById("email");
    const confirmation = document.getElementById("confirmation");

    joinButton.addEventListener("click", async (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        if (!email) {
            confirmation.textContent = "Please enter a valid email.";
            return;
        }

        confirmation.textContent = "Submitting...";
        await submitEmail(email);

        emailInput.value = "";
    });
});
