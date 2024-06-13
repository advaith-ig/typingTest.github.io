const typingText = document.querySelector(".typing-text p"),
    inpField = document.querySelector(".wrapper .input-field"),
    tryAgainBtn = document.querySelector(".tryagain"),
    timeTag = document.querySelector(".time"),
    wpmTag = document.querySelector(".wpm");

let timer,
    maxTime = 60,
    timeLeft = maxTime,
    charIndex = 0,
    mistakes = 0,
    isTyping = false;

function loadParagraph() {
    typingText.innerHTML = "";
    for (let i = 0; i < 50; i++) {
        const ranIndex = Math.floor(Math.random() * words.length);
        words[ranIndex].split("").forEach(char => {
            let span = `<span>${char}</span>`;
            typingText.innerHTML += span;
        });
        if (i !== 49) {
            typingText.innerHTML += "<span> </span>";
        }
    }
    typingText.querySelectorAll("span")[0].classList.add("active");
    document.addEventListener("keydown", handleKeydown);
    typingText.addEventListener("click", () => inpField.focus());
}

function handleKeydown(e) {
    inpField.focus();
    if (e.ctrlKey && e.key === "Backspace") {
        e.preventDefault();
    }
}

function typingF() {
    let characters = typingText.querySelectorAll("span");
    let typedChar = inpField.value.charAt(charIndex);
    if (charIndex < characters.length && timeLeft > 0) {
        if (!isTyping) {
            timer = setInterval(timeF, 1000);
            isTyping = true;
        }
        if (typedChar === "") {
            if (charIndex > 0) {
                charIndex--;
                characters[charIndex].classList.remove("correct", "incorrect", "incorrect-space");
            }
        } else {
            if (characters[charIndex].innerText === typedChar) {
                characters[charIndex].classList.add("correct");
            } else {
                if (typedChar !== " " && characters[charIndex].innerText === " ") {
                    characters[charIndex].classList.add("incorrect-space");
                } else {
                    characters[charIndex].classList.add("incorrect");
                }
                mistakes++;
            }
            charIndex++;
        }
        characters.forEach(span => span.classList.remove("active"));
        if (charIndex < characters.length) {
            characters[charIndex].classList.add("active");
        }

        let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;

        wpmTag.innerText = wpm;

        if (charIndex === characters.length) {
            clearInterval(timer);
            inpField.value = "";
        }
    } else {
        clearInterval(timer);
        inpField.value = "";
    }
}


function timeF() {
    if (timeLeft > 0) {
        timeLeft--;
        timeTag.innerText = timeLeft;
        let wpm = Math.round(((charIndex - mistakes) / 5) / (maxTime - timeLeft) * 60);
        wpmTag.innerText = wpm;
    } else {
        clearInterval(timer);
    }
}

function resetGame() {
    loadParagraph();
    clearInterval(timer);
    timeLeft = maxTime;
    charIndex = mistakes = 0;
    isTyping = false;
    inpField.value = "";
    timeTag.innerText = timeLeft;
    wpmTag.innerText = 0;
}

loadParagraph();
inpField.addEventListener("input", typingF);
tryAgainBtn.addEventListener("click", resetGame);
