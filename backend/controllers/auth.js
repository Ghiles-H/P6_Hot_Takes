let dataBasePass;


/* ------- Require ------- */

const User = require('../models/usersModel');
const bcrypt = require('bcrypt');
const token = require("../middelware/token");

/* ---- Require - END ---- */

/* ------- Middelware ------- */

exports.signUp = async (req, res) => {
  bcrypt.hash(req.body.password, 10)
          .then(hash => {
            const user = new User({
              email: req.body.email,
              password: hash
            });
            user.save()
              .then(() => res.status(201).send({ message: 'User created successfully !' }))
              .catch(error => res.status(400).json({ error }))
          })
          .catch(error => res.status(500).json({ error }))
};

exports.login = async (req, res) => {
  User.findOne({ email: req.body.email })
    .then(async (users) => {
      if (!users) {
        return res.status(404).send({ message: 'User inconnu' });
      } else {
        dataBasePass = users.password;
        const hashCompare = await bcrypt.compare(req.body.password, dataBasePass);
        console.log("hashCompare = ", hashCompare);
            if (hashCompare) {
              const user = {
                id: users._id,
                email: users.email
              }
              const accessToken = token.generateAccessToken(user);
              
              return res.status(200).json({
                userId: user.id,
                token: accessToken
              });
            } else {
              return res.status(401).json({ message: "Password error" });
            };
      };
    })
    .catch((err) => res.status(500).send(console.log(err)))
};

exports.getAllUsers = (req, res) => {
  User.find()
    .then(users => res.json(users))
    .catch(error => res.status(400).json({ error }))
};

/* ---- Middelware - END ---- */




