const Joi = require('joi');
const validate = require('../middleware/validate');
const {Rental} = require('../models/rental');//Needed for '404 if no rental found'
const {Movie} = require('../models/movie');//Import Movie class from movie module
const auth = require('../middleware/auth');//Import auth middleware
const express = require('express');
const router = express.Router();

router.post('/', [auth, validate(validateReturn)], async (req, res) => {//auth passed as arg to POST()
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send('Rental not found.');//Needed for '404 if no rental found'test

  if (rental.dateReturned) return res.status(400).send('Return already processed.');//Needed for '400 if already processed' test

  rental.return();
  await rental.save();

  await Movie.update({ _id: rental.movie._id }, {//Query object { } - Must await update before returning response
    $inc: { numberInStock: 1 }//$Inc is the increment operator
  });

  return res.send(rental);//Return response
});

function validateReturn(req) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  };

  return Joi.validate(req, schema);
}

module.exports = router;
