// Dynamic counter
let count = 0;
const counterElement = document.getElementById("counter");

// Simple demo increment every 2 seconds
setInterval(() => {
    count++;
    counterElement.textContent = count;
}, 2000);

// Email form submission
const form = document.getElementById("emailForm");
const confirmation = document.getElementById("confirmation");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    if(email) {
        // For MVP, we just confirm submission locally
        confirmation.textContent = `Thanks! ${email} has been added to the waitlist.`;
        form.reset();
    }
});
