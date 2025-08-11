// List y'abantu bafite uburenganzira (uzayihindura)
const validIDs = ["NG001", "NG002", "NG003"];

document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  
  const idNumber = document.getElementById("idNumber").value.trim();
  const errorMsg = document.getElementById("errorMsg");

  if (validIDs.includes(idNumber)) {
    // Ohereza umuntu kuri dashboard
    window.location.href = "dashboard.html";
  } else {
    errorMsg.textContent = "Invalid ID Number. Please try again.";
  }
});
