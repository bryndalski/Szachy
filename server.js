const express = require("express"),
  path = require("path"),
  colname = "users",
  expressWs = require("express-ws"),
  clientName = "szachy",
  session = require("express-session"),
  MongoOperations = require("./components/MongoOperations"),
  mongoClient = require("mongodb").MongoClient,
  router = require("./components/routes/routing.js");
port = process.env.PORT || 5500;
require("colors");
ObjectID = require("mongodb").ObjectID;

//===================MIDDLE ================

const app = express();
app.use(express.json()); // obsługa jsonów
app.use(express.static(path.join(__dirname, "static", "/")));
expressWs(app);

app.use(
  session({
    secret: "keyboard cat", //session
    resave: true,
    saveUninitialized: false,
    cookie: { secure: true, httpOnly: true },
  })
);
//* ============= ROUTING ===========
app.use("/sockets", require("./components/routes/websockets")); //Sockets
app.use(router); // routing

//Connecting to mongoDB && starting server if success
mongoClient
  .connect("mongodb://localhost:27017", {
    useUnifiedTopology: true,
  })
  .then((client) => {
    console.log("mongo podłączone".zebra);
    const db = client.db(clientName);
    db.listCollections().toArray((er, names) => {
      if (names.findIndex((element) => element.name == colname) === -1) {
        db.createCollection(colname).then((collection) =>
          MongoOperations.selectCollection(collection, ObjectID)
        );
      } else MongoOperations.selectCollection(db.collection(colname), ObjectID);
      app.listen(port, () =>
        console.log(`Example app listening on port ${port}!`.rainbow)
      );
    });
  })
  .catch((error) => console.log("error").red);
