{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww12720\viewh7800\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // Dynamic counter\
let count = 0;\
const counterElement = document.getElementById("counter");\
\
// Simple demo increment every 2 seconds\
setInterval(() => \{\
    count++;\
    counterElement.textContent = count;\
\}, 2000);\
\
// Email form submission\
const form = document.getElementById("emailForm");\
const confirmation = document.getElementById("confirmation");\
\
form.addEventListener("submit", (e) => \{\
    e.preventDefault();\
    const email = document.getElementById("email").value;\
    if(email) \{\
        // For MVP, we just confirm submission locally\
        confirmation.textContent = `Thanks! $\{email\} has been added to the waitlist.`;\
        form.reset();\
    \}\
\});\
}