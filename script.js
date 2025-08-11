// ---------- Helpers ----------
const $ = (id) => document.getElementById(id);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Accept + then 10-15 digits OR just 10-15 digits
const phonePattern = /^(?:\+?\d{10,15})$/;

// Forms
const loginForm  = $("loginForm");
const signupForm = $("signupForm");
const resetForm  = $("resetForm");

// Links (toggles)
const toSignup = $("toSignup");
const toLogin  = $("toLogin");
const toReset  = $("toReset");
const backToLoginFromReset = $("backToLoginFromReset");

// ---------- Toggle among forms ----------
function showForm(which) {
  loginForm.style.display  = (which === "login")  ? "block" : "none";
  signupForm.style.display = (which === "signup") ? "block" : "none";
  resetForm.style.display  = (which === "reset")  ? "block" : "none";
  // clear messages
  ["loginError","signupError","resetError","resetSuccess"].forEach(id => {
    const el = $(id);
    if (el) el.textContent = "";
  });
}
if (toSignup) toSignup.addEventListener("click", (e) => { e.preventDefault(); showForm("signup"); });
if (toLogin)  toLogin.addEventListener("click",  (e) => { e.preventDefault(); showForm("login"); });
if (toReset)  toReset.addEventListener("click",  (e) => { e.preventDefault(); showForm("reset"); });
if (backToLoginFromReset) backToLoginFromReset.addEventListener("click", (e) => { e.preventDefault(); showForm("login"); });

// ---------- Storage ----------
function getUsers() {
  try { return JSON.parse(localStorage.getItem("lng_users") || "{}"); }
  catch { return {}; }
}
function setUsers(obj) { localStorage.setItem("lng_users", JSON.stringify(obj)); }
function setCurrentUser(email) { localStorage.setItem("lng_current_user", email); }
function getCurrentUser() { return localStorage.getItem("lng_current_user"); }

// ---------- Password hashing (SHA-256) ----------
async function hashPassword(plain) {
  const enc = new TextEncoder().encode(plain);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

// ---------- SIGN UP ----------
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = $("signupEmail").value.trim().toLowerCase();
  const phone = $("signupPhone").value.trim();
  const pass  = $("signupPassword").value;
  const err   = $("signupError");

  err.textContent = "";

  if (!emailPattern.test(email)) { err.textContent = "Please enter a valid email."; return; }
  if (!phonePattern.test(phone)) { err.textContent = "Enter a valid phone number (10–15 digits, optional +)."; return; }
  if (pass.length < 8) { err.textContent = "Password must be at least 8 characters."; return; }

  const users = getUsers();
  if (users[email]) { err.textContent = "This email is already registered. Try logging in."; return; }

  const passHash = await hashPassword(pass);
  users[email] = { phone, passHash, createdAt: Date.now() };
  setUsers(users);
  setCurrentUser(email);

  window.location.href = "dashboard.html";
});

// ---------- LOG IN ----------
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = $("loginEmail").value.trim().toLowerCase();
  const pass  = $("loginPassword").value;
  const err   = $("loginError");
  err.textContent = "";

  if (!emailPattern.test(email)) { err.textContent = "Enter a valid email."; return; }

  const users = getUsers();
  const user  = users[email];
  if (!user) { err.textContent = "Account not found. Create one first."; return; }

  const passHash = await hashPassword(pass);
  if (passHash !== user.passHash) { err.textContent = "Incorrect password."; return; }

  setCurrentUser(email);
  window.location.href = "dashboard.html";
});

// ---------- RESET PASSWORD ----------
resetForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = $("resetEmail").value.trim().toLowerCase();
  const phone = $("resetPhone").value.trim();
  const p1    = $("resetPassword").value;
  const p2    = $("resetPassword2").value;

  const err = $("resetError");
  const ok  = $("resetSuccess");
  err.textContent = ""; ok.textContent = "";

  if (!emailPattern.test(email)) { err.textContent = "Enter a valid email."; return; }
  if (!phonePattern.test(phone)) { err.textContent = "Enter a valid phone number (10–15 digits, optional +)."; return; }
  if (p1.length < 8) { err.textContent = "New password must be at least 8 characters."; return; }
  if (p1 !== p2) { err.textContent = "Passwords do not match."; return; }

  const users = getUsers();
  const user  = users[email];
  if (!user) { err.textContent = "No account with this email."; return; }

  if ((user.phone || "").trim() !== phone) {
    err.textContent = "Phone number does not match this account.";
    return;
  }

  user.passHash = await hashPassword(p1);
  users[email]  = user;
  setUsers(users);

  ok.textContent = "Password updated. You can now log in.";
  setTimeout(() => showForm("login"), 1500);
});

// ---------- Default view ----------
showForm("login");

// Optional: if someone is already logged in, auto-redirect to dashboard
// const existing = getCurrentUser();
// if (existing) window.location.href = "dashboard.html";
