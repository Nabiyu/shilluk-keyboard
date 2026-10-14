
const themeToggle = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("shilluk-theme") || "light";

document.documentElement.setAttribute("data-theme", savedTheme);

function updateThemeButton(theme) {
    if (!themeToggle) return;

    themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
    themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
}

updateThemeButton(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const currentTheme =
            document.documentElement.getAttribute("data-theme") || "light";

        const newTheme = currentTheme === "dark" ? "light" : "dark";

        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("shilluk-theme", newTheme);

        updateThemeButton(newTheme);
    });
}
