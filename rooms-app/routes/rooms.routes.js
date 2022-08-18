const router = require('express').Router();
const Room = require('../models/Room.model');
const User = require('../models/User.model');
const { isLoggedIn } = require('../middleware/route-guard');

router.get('/', (req, res) => {
  Room.find()
    .then((rooms) => {
      console.log(rooms);
      res.render('rooms/room-list', { rooms });
    })
    .catch((err) =>
      console.log('Error while getting the rooms from the DB', err)
    );
});


router.get('/create', isLoggedIn, (req, res) => {
    User.find()
      .then((users) => {
        res.render('rooms/create', { users });
      })
      .catch((err) =>
        console.error(err)
    );
});

router.post('/create', isLoggedIn, (req, res, next) => {
  const { name, description, imageUrl, owner } = req.body;
  Room.create({ name, description, imageUrl, owner })
    .then(() => res.redirect('/rooms'))
    .catch((err) => console.log('Error while creating a new room', err));
});

router.get('/:id/edit', isLoggedIn, (req, res) => {
    const user = req.session.currentUser
    const {id} = req.params
    Room.findById(id) 
    .then((room) => {
        console.log(room.owner.valueOf())
        console.log(user._id)
        if(room.owner.valueOf() === user._id) {
            res.render('rooms/edit', room)
        } else {
            throw Error('You cannot edit the room')
        }
    })
    .catch((err) => console.log('Error while getting the room to edit', err))
})

router.post('/:id/edit', isLoggedIn, (req, res) => {
    const {id} = req.params
    Room.findByIdAndUpdate(id, { name, description, imageUrl, owner }, {new: true})
    .then(() => res.redirect('/rooms'))
    .catch((err) => console.log('Error while updating the room', err))
})

router.get('/:id/delete', isLoggedIn, (req, res) => {
    const user = req.session.currentUser
    const {id} = req.params
    Room.findByIdAndDelete(id) 
    .then((room) => {
        // console.log(room.owner.valueOf())
        // console.log(user._id)
        // console.log({ _id: room._id })
        // console.log({ _id: room._id.valueOf() })
        if(room.owner.valueOf() === user._id) {
            console.log(room._id.valueOf())
            // Room.deleteOne(id)
            console.log("ssf")

            //res.redirect('/rooms')
        } else {
            throw Error('You cannot delete the room')
        }
    })
    .catch((err) => console.log('Error while getting the room to delete', err))
})

module.exports = router;
