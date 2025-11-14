const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyTSwUZCR3EoCsY864OUOAkOakXy1uS4KZaRoH4rQyLDTrCFjwpGNiVDER7nn2qUXwg/exec"; 

// -----------------------
// Load Current Count (GET)
// -----------------------
function loadCount() {
    const script = document.createElement("script");
    script.src = `${WEB_APP_URL}?callback=handleCount`;
    document.body.appendChild(script);
}

function handleCount(data) {
    console.log("🔥 handleCount fired with:", data);

    const counter = document.getElementById("counter");

    if (data && data.count !== undefined) {
        counter.textContent = data.count;
    } else {
        console.error("Invalid count data:", data);
    }
}


// -----------------------
// Submit Email (POST via JSONP)
// -----------------------
function submitEmail(email) {
    const script = document.createElement("script");
    script.src = `${WEB_APP_URL}?callback=handleSubmit&email=${encodeURIComponent(email)}`;
    document.body.appendChild(script);
}

function handleSubmit(data) {
    console.log("Submit response:", data);

    const confirmation = document.getElementById("confirmation");
    const counter = document.getElementById("counter");

    if (data.error) {
        confirmation.textContent = "Something went wrong. Try again.";
    } else {
        confirmation.textContent = "You're on the waitlist! ✅";
        counter.textContent = data.count;
    }
}

// -----------------------
// Setup Button
// -----------------------
document.addEventListener("DOMContentLoaded", () => {
    const joinButton = document.getElementById("joinButton");
    const emailInput = document.getElementById("email");

    loadCount(); // Load initial count immediately

    joinButton.addEventListener("click", (e) => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const confirmation = document.getElementById("confirmation");

        if (!email) {
            confirmation.textContent = "Please enter a valid email.";
            return;
        }

        confirmation.textContent = "Submitting...";
        submitEmail(email);

        emailInput.value = "";
    });
});
