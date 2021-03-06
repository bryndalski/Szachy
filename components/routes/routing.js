const MongoOperations = require("../MongoOperations");

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

router.get("/user", (req, res) => {
  if (req.session.user !== undefined)
    res.sendFile(
      path.join(__dirname, "..", "..", "static", "pages", "user.html")
    );
  else res.redirect("/");
});

router.get("/game", (req, res) => {
  if (req.session.user === undefined) res.redirect("/ ");
  else if (req.session.user.sendableUser.gameID === null)
    res.redirect("/lobby");
  else
    res.sendFile(
      path.join(__dirname, "..", "..", "static", "pages", "game.html")
    );
});
//* ============= DATA GET ============

router.get("/userInfo", (req, res) => {
  console.log(`Address : ${req.url}, method: ${req.method}`.blue);
  req.session.user === undefined
    ? res.sendStatus(403)
    : res.json(req.session.user.sendableUser);
});

//* log out

router.get("/logOut", (req, res) => {
  if (req.session.user === undefined) res.sendStatus(401);
  else req.session.destroy();
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
    let user = await User.logIn(req.body.nickname, req.body.password);
    req.session.user = new Session(user);
    res.json({ success: true, next: "/lobby" });
  } else res.json({ success: false });
});
//*Przejmuje tworzenie nowego lobby

router.post("/addRoom", async (req, res) => {
  console.log(`Address : ${req.url}, method: ${req.method}`.blue);
  //TODO odkomentuj ZABEZPIECZENIE WAŻNE
  if (req.session.user === undefined) res.sendStatus(403);
  else {
    console.log(req.session.user.nickname);
    let room = new Room(
      req.session.user.user.nickname,
      req.body.name,
      req.body.passwordRequired,
      req.body.password
    );
    lobby.add(room);
    req.session.user.sendableUser.gameID = room.roomId;
    res.json({ success: true });
  }
});

router.post("/changePassword", async (req, res) => {
  console.log(`Address : ${req.url}, method: ${req.method}`.blue);
  await User.changePassword(req.session.user.user._id, req.body.password);
  req.session.destroy();
  res.sendStatus(200);
});

//*Przyjmuje dodawanie do nowego lobbu

router.post("/addToRoom", async (req, res) => {
  console.log(`Address : ${req.url}, method: ${req.method}`.blue);
  //!!! to może walnąc sprawdź czy nie walnie a jak walnie to solidnie
  //if user owns room
  // if (
  //   req.session.user === undefined ||
  //   req.session.user.sendableUser.gameID !== null
  // )
  //   return res.sendStatus(403);
  // console.log("essa");
  // console.log(req.body, req.session);
  if (
    lobby.addPlayerToRoomLobby(
      req.body.roomId,
      req.session.user.user.nickname,
      req.body.password
    )
  ) {
    req.session.user.sendableUser.gameID = req.body.roomId;
    res.json({ success: true });
  } else res.json({ success: false });
});

router.get("/TEST", async (req, res) => {
  console.log(
    await MongoOperations.increment("60c213360b6c360f287cc738", "stats.played"), //req.session.user.user._id
    await MongoOperations.increment("60c213360b6c360f287cc738", "stats.wins") //req.session.user.user._id
  );
  res.json({ xd: "ddd" });
});

//* LAST CHANCE
router.get("*", (req, res) => res.redirect("/"));

module.exports = router;
