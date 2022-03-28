const Sauce = require("../models/saucesModel");
const fs = require('fs');

//Routes GET
exports.getAllSauces = (req, res) => {
    Sauce.find()
        .then(sauces => res.json(sauces))
        .catch(error => res.status(400).json({ error }))
};

exports.getSingleSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }))
};

//Routes POST
exports.createNewSauce = async(req, res) => {
    try{
        const sauceObject = JSON.parse(req.body.sauce);
        console.log("sauces params");
        console.log(sauceObject);
        delete sauceObject._id;
        const sauce = new Sauce({
            userId: req.userId,
            ...sauceObject,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
            likes: 0,
            dislikes: 0
        });
        console.log(sauce);
        sauce.save()
            .then(() => res.status(201).send({ message: 'Sauce created successfully !'}))
            .catch(error => res.status(400).json({ error }))
    }catch(error){
        res.status(400).json({error})
    }
};

exports.likeDislikeSauce = (req, res, next) => {
    let like = req.body.like
    let userId = req.userId
    let sauceId = req.params.id
    console.log('userID = ', req.body);
    switch (like) {
      case 1 :
          Sauce.findOne({_id: sauceId})
            .then((sauce) => {
                if(userId && !sauce.usersLiked.includes(userId)){
                    Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 }})
                      .then(() => res.status(200).json({ message: `J'aime` }))
                      .catch((error) => res.status(400).json({ error }))
                }else{
                    console.log("Le user a déjà like");
                    res.status(400).json({error})
                }
            })
            .catch((error) => res.status(400).json({error}))
              
        break;
  
      case 0 :
          Sauce.findOne({ _id: sauceId })
             .then((sauce) => {
              if (sauce.usersLiked.includes(userId)) { 
                Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 }})
                  .then(() => res.status(200).json({ message: `Neutre` }))
                  .catch((error) => res.status(400).json({ error }))
              };
              if (sauce.usersDisliked.includes(userId)) { 
                Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 }})
                  .then(() => res.status(200).json({ message: `Neutre` }))
                  .catch((error) => res.status(400).json({ error }))
              };
            })
            .catch((error) => res.status(404).json({ error }))
        break;
  
      case -1 :
        Sauce.findOne({_id: sauceId})
          .then((sauce) => {
              if(userId && !sauce.usersDisliked.includes(userId)){
                Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 }})
                .then(() => res.status(200).json({ message: `Je n'aime pas` }))
                .catch((error) => res.status(400).json({ error })) 
              }else{
                  console.log("Le user a déjà dislike");
                  res.status(400).json({error})
              }
          })
          .catch((error) => res.status(400).json({error}))              
                
        break;
        
        default:
          console.log(error);
    }
};

//Route DELETE
exports.deleteSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            console.log("req.userId= ", req.userId)
            if(sauce.userId !== req.userId){
                
                res.status(403).json({error: "Vous n'etes pas le créateur de cette sauce !"})
            }else{
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce delete success'}))
                        .catch(error => res.status(400).json({ error }))
                });
            }
            
        })
        .catch((error) => {
            console.log("body= ", req.body)
            res.status(500).json({ error })
        })
};

//Route PUT
exports.updateSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if(sauce.userId !== req.userId){
                res.status(403).json({error: "Vous n'etes pas le créateur de cette sauce !"});
            }else{
                Sauce.updateOne({ _id: req.params.id }, {...req.body, _id: req.params.id })
                    .then(() => {
                        res.status(200).json({ message: 'Sauce updated success'});
                    })
                    .catch(error => res.status(400).json({ error }))
            }
        })
        .catch(error => res.status(500).json({error}))
};