// SIGNUP
function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Fill all fields");
    return;
  }

  if (localStorage.getItem(email)) {
    alert("User already exists");
    return;
  }

  localStorage.setItem(email, JSON.stringify({
    password,
    subjects: []
  }));

  alert("Account created!");
  window.location.href = "index.html";
}

// LOGIN
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const user = JSON.parse(localStorage.getItem(email));

  if (user && user.password === password) {
    localStorage.setItem("currentUser", email);
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("msg").innerText = "Invalid login";
  }
}

// ADD SUBJECT
function addSubject() {
  const email = localStorage.getItem("currentUser");
  const user = JSON.parse(localStorage.getItem(email));

  const name = document.getElementById("subject").value;
  const present = parseInt(document.getElementById("present").value);
  const absent = parseInt(document.getElementById("absent").value);

  if (!name || isNaN(present) || isNaN(absent)) {
    alert("Fill all fields");
    return;
  }

  const total = present + absent;
  const percent = total === 0 ? 0 : ((present / total) * 100).toFixed(2);

  user.subjects.push({ name, present, absent, percent });

  localStorage.setItem(email, JSON.stringify(user));

  render();
}

// RENDER LIST
function render() {
  const email = localStorage.getItem("currentUser");
  const user = JSON.parse(localStorage.getItem(email));

  const list = document.getElementById("list");
  list.innerHTML = "";

  user.subjects.forEach((sub, index) => {
    const li = document.createElement("li");
    li.innerText = `${sub.name} - ${sub.percent}% (P:${sub.present}, A:${sub.absent})`;
    list.appendChild(li);
  });
}

// LOGOUT
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

// DELETE ACCOUNT
function deleteAccount() {
  const email = localStorage.getItem("currentUser");

  if (confirm("Are you sure you want to delete your account?")) {
    localStorage.removeItem(email);
    localStorage.removeItem("currentUser");
    alert("Account deleted!");
    window.location.href = "index.html";
  }
}

// AUTO LOAD DATA
if (window.location.pathname.includes("dashboard.html")) {
  render();
}