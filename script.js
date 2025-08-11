// ---------- Helpers ----------
const $ = (id) => document.getElementById(id);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// E.164 total check: + followed by 8–15 digits
const e164Pattern = /^\+\d{8,15}$/;

// Forms
const loginForm  = $("loginForm");
const signupForm = $("signupForm");
const resetForm  = $("resetForm");

// Links
const toSignup = $("toSignup");
const toLogin  = $("toLogin");
const toReset  = $("toReset");
const backToLoginFromReset = $("backToLoginFromReset");

// Country codes (large but trimmed list + Custom option)
const COUNTRY_CODES = [
  { n:"Rwanda", c:"+250", f:"🇷🇼" },
  { n:"Uganda", c:"+256", f:"🇺🇬" },
  { n:"Kenya", c:"+254", f:"🇰🇪" },
  { n:"Tanzania", c:"+255", f:"🇹🇿" },
  { n:"Burundi", c:"+257", f:"🇧🇮" },
  { n:"DR Congo", c:"+243", f:"🇨🇩" },
  { n:"Ethiopia", c:"+251", f:"🇪🇹" },
  { n:"South Sudan", c:"+211", f:"🇸🇸" },
  { n:"South Africa", c:"+27", f:"🇿🇦" },
  { n:"Nigeria", c:"+234", f:"🇳🇬" },
  { n:"Ghana", c:"+233", f:"🇬🇭" },
  { n:"Ivory Coast", c:"+225", f:"🇨🇮" },
  { n:"Morocco", c:"+212", f:"🇲🇦" },
  { n:"Algeria", c:"+213", f:"🇩🇿" },
  { n:"Tunisia", c:"+216", f:"🇹🇳" },
  { n:"Egypt", c:"+20", f:"🇪🇬" },

  { n:"USA/Canada", c:"+1", f:"🇺🇸" },
  { n:"Jamaica", c:"+1876", f:"🇯🇲" },
  { n:"Mexico", c:"+52", f:"🇲🇽" },
  { n:"Brazil", c:"+55", f:"🇧🇷" },
  { n:"Argentina", c:"+54", f:"🇦🇷" },
  { n:"Chile", c:"+56", f:"🇨🇱" },
  { n:"Colombia", c:"+57", f:"🇨🇴" },
  { n:"Peru", c:"+51", f:"🇵🇪" },
  { n:"Dominican Rep.", c:"+1", f:"🇩🇴" },

  { n:"UK", c:"+44", f:"🇬🇧" },
  { n:"Ireland", c:"+353", f:"🇮🇪" },
  { n:"France", c:"+33", f:"🇫🇷" },
  { n:"Germany", c:"+49", f:"🇩🇪" },
  { n:"Netherlands", c:"+31", f:"🇳🇱" },
  { n:"Belgium", c:"+32", f:"🇧🇪" },
  { n:"Spain", c:"+34", f:"🇪🇸" },
  { n:"Portugal", c:"+351", f:"🇵🇹" },
  { n:"Italy", c:"+39", f:"🇮🇹" },
  { n:"Switzerland", c:"+41", f:"🇨🇭" },
  { n:"Austria", c:"+43", f:"🇦🇹" },
  { n:"Sweden", c:"+46", f:"🇸🇪" },
  { n:"Norway", c:"+47", f:"🇳🇴" },
  { n:"Denmark", c:"+45", f:"🇩🇰" },
  { n:"Finland", c:"+358", f:"🇫🇮" },
  { n:"Iceland", c:"+354", f:"🇮🇸" },
  { n:"Poland", c:"+48", f:"🇵🇱" },
  { n:"Czechia", c:"+420", f:"🇨🇿" },
  { n:"Hungary", c:"+36", f:"🇭🇺" },
  { n:"Greece", c:"+30", f:"🇬🇷" },
  { n:"Romania", c:"+40", f:"🇷🇴" },
  { n:"Bulgaria", c:"+359", f:"🇧🇬" },
  { n:"Serbia", c:"+381", f:"🇷🇸" },
  { n:"Croatia", c:"+385", f:"🇭🇷" },
  { n:"Slovenia", c:"+386", f:"🇸🇮" },
  { n:"Slovakia", c:"+421", f:"🇸🇰" },
  { n:"Ukraine", c:"+380", f:"🇺🇦" },

  { n:"Turkey", c:"+90", f:"🇹🇷" },
  { n:"Russia", c:"+7", f:"🇷🇺" },
  { n:"Georgia", c:"+995", f:"🇬🇪" },
  { n:"Armenia", c:"+374", f:"🇦🇲" },
  { n:"Azerbaijan", c:"+994", f:"🇦🇿" },
  { n:"Israel", c:"+972", f:"🇮🇱" },
  { n:"Jordan", c:"+962", f:"🇯🇴" },
  { n:"Lebanon", c:"+961", f:"🇱🇧" },
  { n:"Saudi Arabia", c:"+966", f:"🇸🇦" },
  { n:"UAE", c:"+971", f:"🇦🇪" },
  { n:"Qatar", c:"+974", f:"🇶🇦" },
  { n:"Kuwait", c:"+965", f:"🇰🇼" },
  { n:"Oman", c:"+968", f:"🇴🇲" },
  { n:"Bahrain", c:"+973", f:"🇧🇭" },
  { n:"Yemen", c:"+967", f:"🇾🇪" },

  { n:"India", c:"+91", f:"🇮🇳" },
  { n:"Pakistan", c:"+92", f:"🇵🇰" },
  { n:"Bangladesh", c:"+880", f:"🇧🇩" },
  { n:"Sri Lanka", c:"+94", f:"🇱🇰" },
  { n:"Nepal", c:"+977", f:"🇳🇵" },
  { n:"Bhutan", c:"+975", f:"🇧🇹" },

  { n:"China", c:"+86", f:"🇨🇳" },
  { n:"Japan", c:"+81", f:"🇯🇵" },
  { n:"South Korea", c:"+82", f:"🇰🇷" },
  { n:"Philippines", c:"+63", f:"🇵🇭" },
  { n:"Indonesia", c:"+62", f:"🇮🇩" },
  { n:"Malaysia", c:"+60", f:"🇲🇾" },
  { n:"Singapore", c:"+65", f:"🇸🇬" },
  { n:"Thailand", c:"+66", f:"🇹🇭" },
  { n:"Vietnam", c:"+84", f:"🇻🇳" },
  { n:"Cambodia", c:"+855", f:"🇰🇭" },
  { n:"Laos", c:"+856", f:"🇱🇦" },
  { n:"Myanmar", c:"+95", f:"🇲🇲" },
  { n:"Mongolia", c:"+976", f:"🇲🇳" },
  { n:"Taiwan", c:"+886", f:"🇹🇼" },
  { n:"Hong Kong", c:"+852", f:"🇭🇰" },
  { n:"Macau", c:"+853", f:"🇲🇴" },

  { n:"Australia", c:"+61", f:"🇦🇺" },
  { n:"New Zealand", c:"+64", f:"🇳🇿" },
  { n:"Fiji", c:"+679", f:"🇫🇯" },
  { n:"Papua New Guinea", c:"+675", f:"🇵🇬" },

  // Fallback / custom:
  { n:"Other (enter custom)", c:"custom", f:"🌍" }
];

// Populate dropdown
const countrySel = $("countryCode");
if (countrySel) {
  COUNTRY_CODES.forEach(({n,c,f}) => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = `${f} ${c} ${n}`;
    if (c === "+250") opt.selected = true;
    countrySel.appendChild(opt);
  });
  // Show custom input if "custom" chosen
  countrySel.addEventListener("change", () => {
    $("customCodeWrap").style.display = (countrySel.value === "custom") ? "block" : "none";
  });
}

// Password toggles (Show/Hide)
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("toggle")) {
    const targetId = e.target.dataset.target;
    const inp = $(targetId);
    if (!inp) return;
    if (inp.type === "password") { inp.type = "text"; e.target.textContent = "Hide"; }
    else { inp.type = "password"; e.target.textContent = "Show"; }
  }
});

// Toggle among forms
function showForm(which) {
  if (loginForm)  loginForm.style.display  = (which === "login")  ? "block" : "none";
  if (signupForm) signupForm.style.display = (which === "signup") ? "block" : "none";
  if (resetForm)  resetForm.style.display  = (which === "reset")  ? "block" : "none";
  ["loginError","signupError","resetError","resetSuccess"].forEach(id => {
    const el = $(id);
    if (el) el.textContent = "";
  });
}
if (toSignup) toSignup.addEventListener("click", (e) => { e.preventDefault(); showForm("signup"); });
if (toLogin)  toLogin.addEventListener("click",  (e) => { e.preventDefault(); showForm("login"); });
if (toReset)  toReset.addEventListener("click",  (e) => { e.preventDefault(); showForm("reset"); });
if (backToLoginFromReset) backToLoginFromReset.addEventListener("click", (e) => { e.preventDefault(); showForm("login"); });

// Storage
function getUsers(){ try { return JSON.parse(localStorage.getItem("lng_users") || "{}"); } catch { return {}; } }
function setUsers(obj){ localStorage.setItem("lng_users", JSON.stringify(obj)); }
function setCurrentUser(email, remember=false){
  localStorage.setItem("lng_current_user", email);
  localStorage.setItem("lng_remember", remember ? "1" : "0");
}
function getCurrentUser(){ return localStorage.getItem("lng_current_user"); }
function getRemember(){ return localStorage.getItem("lng_remember") === "1"; }

// Hashing (with fallback for file://)
async function hashPassword(plain) {
  try {
    if (!crypto || !crypto.subtle) throw new Error("No WebCrypto");
    const enc = new TextEncoder().encode(plain);
    const buf = await crypto.subtle.digest("SHA-256", enc);
    return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
  } catch(e) {
    console.warn("Hash fallback in use (demo only). Open via HTTPS for WebCrypto.", e);
    return "plain:" + plain; // demo fallback
  }
}

// Password strength meter
const pwInput = $("signupPassword");
const pwBar   = $("pwBar");
const hLen    = $("hLen");
const hMix    = $("hMix");
const hUpper  = $("hUpper");
const hSpecial= $("hSpecial");

function assessStrength(value) {
  let score = 0;
  const okLen = value.length >= 8;
  const okMix = /[A-Za-z]/.test(value) && /\d/.test(value);
  const okUpper= /[A-Z]/.test(value);
  const okSpecial = /[^A-Za-z0-9]/.test(value);

  if (okLen) score++;
  if (okMix) score++;
  if (okUpper) score++;
  if (okSpecial) score++;

  hLen?.classList.toggle("ok", okLen);
  hMix?.classList.toggle("ok", okMix);
  hUpper?.classList.toggle("ok", okUpper);
  hSpecial?.classList.toggle("ok", okSpecial);

  const pct = [0,25,50,75,100][score];
  if (pwBar) {
    pwBar.style.width = pct + "%";
    pwBar.style.background = score <= 1 ? "#ffadad" : score === 2 ? "#ffd76a" : score === 3 ? "#b5e48c" : "#3cb371";
  }
}
pwInput?.addEventListener("input", (e) => assessStrength(e.target.value));

// SIGN UP
signupForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = $("signupEmail").value.trim().toLowerCase();
  const selCode = $("countryCode").value;
  const customCode = $("customCode")?.value.trim();
  const localPart = $("signupPhone").value.replace(/\D+/g, ""); // digits only
  const pass  = $("signupPassword").value;
  const err   = $("signupError"); err.textContent = "";

  if (!emailPattern.test(email)) { err.textContent = "Please enter a valid email."; return; }

  let fullCode = selCode === "custom" ? (customCode || "") : selCode;
  if (!fullCode.startsWith("+")) fullCode = "+" + fullCode.replace(/\D+/g,"");

  const fullPhone = fullCode + localPart;
  if (!e164Pattern.test(fullPhone)) { err.textContent = "Enter a valid phone (include correct country code)."; return; }

  if (pass.length < 8) { err.textContent = "Password must be at least 8 characters."; return; }

  const users = getUsers();
  if (users[email]) { err.textContent = "This email is already registered. Try logging in."; return; }

  const passHash = await hashPassword(pass);
  users[email] = { phone: fullPhone, passHash, createdAt: Date.now() };
  setUsers(users);
  setCurrentUser(email, true);
  window.location.href = "dashboard.html";
});

// LOG IN
loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = $("loginEmail").value.trim().toLowerCase();
  const pass  = $("loginPassword").value;
  const err   = $("loginError"); err.textContent = "";
  const remember = document.getElementById("rememberMe")?.checked || false;

  if (!emailPattern.test(email)) { err.textContent = "Enter a valid email."; return; }

  const users = getUsers();
  const user  = users[email];
  if (!user) { err.textContent = "Account not found. Create one first."; return; }

  const passHash = await hashPassword(pass);
  if (passHash !== user.passHash) { err.textContent = "Incorrect password."; return; }

  setCurrentUser(email, remember);
  window.location.href = "dashboard.html";
});

// RESET PASSWORD
resetForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = $("resetEmail").value.trim().toLowerCase();
  const phone = $("resetPhone").value.replace(/\s+/g,"");
  const p1    = $("resetPassword").value;
  const p2    = $("resetPassword2").value;

  const err = $("resetError");
  const ok  = $("resetSuccess");
  err.textContent = ""; ok.textContent = "";

  if (!emailPattern.test(email)) { err.textContent = "Enter a valid email."; return; }
  if (!e164Pattern.test(phone)) { err.textContent = "Enter phone in international format, e.g., +2507..."; return; }
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

// Default view + auto-redirect if remembered
showForm("login");
const already = localStorage.getItem("lng_current_user");
if (already && localStorage.getItem("lng_remember") === "1") {
  window.location.href = "dashboard.html";
}
