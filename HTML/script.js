// Dropdown navigation
const dropdown = document.getElementById("navigate");
if (dropdown) {
  dropdown.addEventListener("change", () => {
    const page = dropdown.value;
    if (page) {
      window.location.href = page;
    }
  });
}

// Input display
const input = document.getElementById("userInput");
const button = document.getElementById("showBtn");
const box = document.getElementById("displayBox");

if (input && button && box) {
  button.addEventListener("click", () => {
    const text = input.value.trim();
    box.textContent = text ? `You entered: ${text}` : "Please enter something!";
    input.value = ""; // Clear after entering
  });
}
