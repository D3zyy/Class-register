// functions to set and get theme from session storage
window.onload = setThemeFromSessionStorage;

function setThemeFromSessionStorage() {
  var theme = sessionStorage.getItem("theme");
  if (theme === "light") {
    setLightMode();
  } else {
    setDarkMode();
  }
}

function setSessionStorage(name, value) {
  sessionStorage.setItem(name, value);
}

function getSessionStorage(name) {
  return sessionStorage.getItem(name);
}

// functions to toggle theme
function toggleTheme() {
  var body = document.querySelector("body");
  var ul = document.querySelector("ul");
  var form = document.querySelector(".box");
  if (body.classList.contains("light-mode")) {
    setSessionStorage("theme", "dark");
    setDarkMode();
  } else {
    setSessionStorage("theme", "light");
    setLightMode();
  }
}

// functions to set light and dark mode
function setLightMode() {
  var body = document.querySelector("body");
  var ul = document.querySelector("ul");
  var form = document.querySelector(".box");



  
  body.classList.add('light-mode');
  

  ul.classList.add("light-ul");
}


function setDarkMode() {
  var body = document.querySelector("body");
  var ul = document.querySelector("ul");
  var form = document.querySelector(".box");
  
  form.classList.remove("light-mode");
 
  body.classList.remove("light-mode");
 
  ul.classList.remove("light-ul");
 
}


// call the function on page load
setThemeFromSessionStorage();
