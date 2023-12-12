const Joi = require('joi');
const mongoose = require('mongoose');
const moment = require('moment');//Moved here from returns.js-Lesson 14.17

//Lesson 14.16-Set rentalSchema to code below as new Mongoose.Schema
const rentalSchema = new mongoose.Schema({
  customer: { 
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      },
      isGold: {
        type: Boolean,
        default: false
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      }      
    }),  
    required: true
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true, 
        minlength: 5,
        maxlength: 255
      },
      dailyRentalRate: { 
        type: Number, 
        required: true,
        min: 0,
        max: 255
      }   
    }),
    required: true
  },
  dateOut: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  dateReturned: { 
    type: Date
  },
  rentalFee: { 
    type: Number, 
    min: 0
  }
});

rentalSchema.statics.lookup = function(customerId, movieId) {//Added in Lesson 14.16
  return this.findOne({//'this' references the Rental class - This logic from returns.js
    'customer._id': customerId,
    'movie._id': movieId,
  });
}

rentalSchema.methods.return = function() {//Lesson 14.17-'methods' property used instead of statics property
  this.dateReturned = new Date();//Sets the dateReturned of rental
//Line break - 2 lines below calculate rental fee
  const rentalDays = moment().diff(this.dateOut, 'days');
  this.rentalFee = rentalDays * this.movie.dailyRentalRate;
}

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  };

  return Joi.validate(rental, schema);
}

exports.Rental = Rental; 
exports.validate = validateRental;