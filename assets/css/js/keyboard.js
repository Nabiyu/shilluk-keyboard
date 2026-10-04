// ==========================================
// SHILLUK KEYBOARD — DATA-DRIVEN RENDERER
// ==========================================

const keyboard = document.getElementById("keyboard");

let layoutData = {};
let currentLayer = "normal";

// Physical keyboard rows
const rows = [
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
    ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
    ["Caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
    ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift"],
    ["Ctrl", "Win", "Alt", "Space", "AltGr", "Menu", "Ctrl"]
];

// ------------------------------------------
// Load layout.json
// ------------------------------------------

async function loadKeyboard() {

    try {

        const response = await fetch("./assets/css/data/layout.json");

        if (!response.ok) {
            throw new Error("Could not load layout.json");
        }

        layoutData = await response.json();

        renderKeyboard(currentLayer);

    } catch (error) {

        console.error("Keyboard loading error:", error);

        if (keyboard) {
            keyboard.innerHTML = `
                <div class="keyboard-error">
                    Unable to load the keyboard layout.
                </div>
            `;
        }

    }

}

// ------------------------------------------
// Get character for a key
// ------------------------------------------

function getCharacter(key, layer) {

    if (!layoutData[key]) {

        // Normal letters should be lowercase
        if (layer === "normal" && /^[A-Z]$/.test(key)) {
            return key.toLowerCase();
        }

        return key;
    }

    // AltGr uses "altGr" in layout.json
    if (layer === "altgr") {
        return layoutData[key].altGr || key.toLowerCase();
    }

    return layoutData[key][layer] || key.toLowerCase();
}

// ------------------------------------------
// Render keyboard
// ------------------------------------------

function renderKeyboard(layer) {

    if (!keyboard) return;

    currentLayer = layer;

    keyboard.innerHTML = "";

    rows.forEach(row => {

        const rowDiv = document.createElement("div");
        rowDiv.className = "keyboard-row";

        row.forEach(key => {

            const keyDiv = document.createElement("button");

            keyDiv.type = "button";
            keyDiv.className = "key";

            // Special key sizes
            if (key === "Backspace") {
                keyDiv.classList.add("key-backspace");
            }

            if (key === "Tab") {
                keyDiv.classList.add("key-tab");
            }

            if (key === "Caps") {
                keyDiv.classList.add("key-caps");
            }

            if (key === "Enter") {
                keyDiv.classList.add("key-enter");
            }

            if (key === "Shift") {
                keyDiv.classList.add("key-shift");
            }

            if (key === "Space") {
                keyDiv.classList.add("key-space");
            }

            if (key === "Ctrl") {
                keyDiv.classList.add("key-control");
            }

            if (key === "Alt") {
                keyDiv.classList.add("key-alt");
            }

            if (key === "AltGr") {
                keyDiv.classList.add("key-altgr");
            }

            // Show mapped character
            keyDiv.textContent = getCharacter(key, layer);

            // Click key
            keyDiv.addEventListener("click", () => {

                showCharacterInfo(key, layer);

            });

            rowDiv.appendChild(keyDiv);

        });

        keyboard.appendChild(rowDiv);

    });

}

// ------------------------------------------
// Character information
// ------------------------------------------

function showCharacterInfo(key, layer) {

    const character = getCharacter(key, layer);

    const preview = document.querySelector(".character-preview");
    const shortcut = document.getElementById("shortcut");
    const unicode = document.getElementById("unicode");

    if (preview) {
        preview.textContent = character;
    }

    if (shortcut) {

        if (layer === "normal") {
            shortcut.textContent = key;
        } else if (layer === "altgr") {
            shortcut.textContent = `ALTGR + ${key}`;
        } else {
            shortcut.textContent = `${layer.toUpperCase()} + ${key}`;
        }

    }

    if (unicode) {

        if (character && character.length > 0) {

            const codePoint =
                character.codePointAt(0)
                    .toString(16)
                    .toUpperCase()
                    .padStart(4, "0");

            unicode.textContent = `U+${codePoint}`;

        } else {

            unicode.textContent = "—";

        }

    }

}

// ------------------------------------------
// Layer buttons
// ------------------------------------------

document.querySelectorAll(".layer-btn").forEach(button => {

    button.addEventListener("click", () => {

        document
            .querySelectorAll(".layer-btn")
            .forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        renderKeyboard(button.dataset.layer);

    });

});

// ------------------------------------------
// Copy button
// ------------------------------------------

const copyButton = document.getElementById("copyBtn");

if (copyButton) {

    copyButton.addEventListener("click", async () => {

        const preview =
            document.querySelector(".character-preview");

        if (!preview) return;

        const character = preview.textContent;

        try {

            await navigator.clipboard.writeText(character);

            const originalText = copyButton.textContent;

            copyButton.textContent = "Copied!";

            setTimeout(() => {
                copyButton.textContent = originalText;
            }, 1500);

        } catch (error) {

            console.error("Copy failed:", error);

        }

    });

}

// ------------------------------------------
// Start
// ------------------------------------------

loadKeyboard();