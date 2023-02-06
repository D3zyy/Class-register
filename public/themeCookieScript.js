
function toggleTheme() {
    document.body.classList.toggle("light-mode");
    let currentTheme = Cookies.get("theme");
    if (currentTheme === "light-mode") {
      Cookies.set("theme", "light-mode");
    } else {
      Cookies.set("theme", "dark-mode");
    }
  }


