const { static, Router } = require("express");
const api = Router();
const fs = require("fs");
const { join } = require("path");
const fetch = require('node-fetch');

const RoutesPath = join(__dirname, "Routes");

fs.readdir(RoutesPath, (err, files) => {
  if (err) return console.log(err);
  files.forEach((file) => {
    api.use("/api/" + file.split(".")[0], require(RoutesPath + "/" + file));
  });
});

api.use("/", static(join(__dirname, "..", "assets")));

// Handle Login and other stuff

const session = require("express-session");
const DiscordStrategy = require("passport-discord").Strategy;
const passport = require("passport");

let config;
try {
  // Config for testing
  config = require("../dev-config");
} catch {
  // Config for production
  config = require("../botconfig");
}

passport.use(
  new DiscordStrategy(
    {
      clientID: config.ClientID,
      clientSecret: config.ClientSecret,
      callbackURL: config.Website + config.CallbackURL,
      scope: "identify guilds",
    },
    function (accessToken, refreshToken, profile, done) {
      // User logged in yay!
      process.nextTick(function () {
        return done(null, profile);
      });
    }
  )
);

api.use(
  session({
    secret: config.CookieSecret,
    resave: false,
    saveUninitialized: false,
  })
);

api.use(passport.initialize());
api.use(passport.session());

api.get(
  config.CallbackURL,
  passport.authenticate("discord", {
    failureRedirect: "/",
  }),
  function (req, res) {
    res.redirect("/dashboard");
  }
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

api.use("/", require("./routes"));

// Keepalive function to prevent the Repl from sleeping
const keepAlive = () => {
  setInterval(() => {
    fetch('https://live-music-2.beammers.repl.co') // Replace with the URL of your Repl
      .then(() => console.log('Pinged the Repl.'))
      .catch(console.error);
  }, 3 * 60 * 1000); // Ping every 5 minutes
};

keepAlive();

module.exports = api;
