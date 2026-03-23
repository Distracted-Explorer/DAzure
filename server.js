const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const DB = "users.json";

function readDB() {
  if (!fs.existsSync(DB)) return [];
  return JSON.parse(fs.readFileSync(DB));
}

function writeDB(data) {
  fs.writeFileSync(DB, JSON.stringify(data, null, 2));
}

// SIGNUP
app.post("/signup", (req, res) => {
  const { email, password } = req.body;
  let users = readDB();

  if (users.find(u => u.email === email)) {
    return res.json({ message: "User already exists" });
  }

  users.push({ email, password, subjects: [] });
  writeDB(users);

  res.json({ message: "Account created" });
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  let users = readDB();

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) return res.json({ message: "Invalid login" });

  res.json({ message: "Login success", email });
});

// ADD SUBJECT
app.post("/add-subject", (req, res) => {
  const { email, name, present, absent } = req.body;
  let users = readDB();

  let user = users.find(u => u.email === email);

  const total = present + absent;
  const percent = total === 0 ? 0 : ((present / total) * 100).toFixed(2);

  user.subjects.push({ name, present, absent, percent });

  writeDB(users);

  res.json({ message: "Added" });
});

// GET SUBJECTS
app.get("/subjects/:email", (req, res) => {
  let users = readDB();
  let user = users.find(u => u.email === req.params.email);

  res.json(user ? user.subjects : []);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});