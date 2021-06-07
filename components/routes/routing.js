const router = require("express").Router(),
  path = require("path"),
  MongoOperations = require("../MongoOperations"),
  User = require("../User"),
  Room = require("../Room"),
  Session = require("../Session");
require("colors");
// const User = require()
require("colors");

//* ============= Pages GET ===============
router.get("/", (req, res) => {
  console.log("Current route : /".blue);
  res.sendFile(
    path.join(__dirname, "..", "..", "static", "pages", "login.html")
  );
});

router.get("/lobby", (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", "..", "static", "pages", "lobby.html")
  );
});
//* ============= DATA GET ============

router.get("/userInfo", (req, res) => {
  console.log(req.session.user);
  req.session.user === undefined
    ? res.sendStatus(403)
    : res.json(req.session.user);
});

//* ========== POSTS ======================

//*Przejmuje logowania
router.post("/login", async (req, res) => {
  //TODO dokończ autoryzajce
  let user = await User.logIn(req.body.nickname, req.body.password);
  if (typeof user === "boolean") res.json({ success: false });
  else {
    req.session.user = new Session(req.body.nickname);
    console.log(req.session.user);
    res.json({ success: true, next: "/lobby" });
  }
});
//*Przejmuje rejestracje
router.post("/register", async (req, res) => {
  if (await User.register(req.body.nickname, req.body.password))
    res.status(301).redirect("/lobby");
  else res.json({ success: false });
});

//*Przejmuje tworzenie nowego lobby

router.post("/addRoom", async (req, res) => {
  //TODO odkomentuj ZABEZPIECZENIE WAŻNE
  if (req.session.user === undefined) res.sendStatus(403);
  else {
    let room = new Room(req.session.user.roomUser, req.body.roomName);
    console.log(room);
  }
});

module.exports = router;
