const router = require("express").Router(),
  path = require("path"),
  User = require("../User"),
  Room = require("../Room"),
  Session = require("../Session"),
  lobby = require("../data/Lobby");
require("colors");

//* ============= Pages GET ===============
router.get("/", (req, res) => {
  console.log(`Address : ${req.url}, method: ${req.method}`.blue);
  res.sendFile(
    path.join(__dirname, "..", "..", "static", "pages", "login.html")
  );
});

router.get("/lobby", (req, res) => {
  console.log(`Address : ${req.url}, method: ${req.method}`.blue);
  if (req.session.user !== undefined)
    res.sendFile(
      path.join(__dirname, "..", "..", "static", "pages", "lobby.html")
    );
  else res.redirect("/");
});
//* ============= DATA GET ============

router.get("/userInfo", (req, res) => {
  console.log(`Address : ${req.url}, method: ${req.method}`.blue);
  req.session.user === undefined
    ? res.sendStatus(403)
    : res.json(req.session.user.sendableUser);
});

//* ========== POSTS ======================

//*Przejmuje logowania
router.post("/login", async (req, res) => {
  console.log(`Address : ${req.url}, method: ${req.method}`.blue);

  //TODO dokończ autoryzajce
  let user = await User.logIn(req.body.nickname, req.body.password);
  if (typeof user === "boolean") res.json({ success: false });
  else {
    req.session.user = new Session(user);
    res.json({ success: true, next: "/lobby" });
  }
});
//*Przejmuje rejestracje
router.post("/register", async (req, res) => {
  console.log(`Address : ${req.url}, method: ${req.method}`.blue);

  if (await User.register(req.body.nickname, req.body.password)) {
    req.session.user = await User.logIn(req.body.nickname, req.body.password);
    res.json({ success: true, next: "/lobby" });
  } else res.json({ success: false });
});
//*Przejmuje tworzenie nowego lobby

router.post("/addRoom", async (req, res) => {
  console.log(`Address : ${req.url}, method: ${req.method}`.blue);
  //TODO odkomentuj ZABEZPIECZENIE WAŻNE
  if (req.session.user === undefined) res.sendStatus(403);
  else {
    console.log(req.body);
    let room = new Room(
      req.session.user.nickname,
      req.body.name,
      req.body.passwordRequired,
      req.body.password
    );
    lobby.add(room);
    req.session.user.sendableUser.gameID = room.roomId;
    console.log(req.session.user);
  }
});

module.exports = router;
