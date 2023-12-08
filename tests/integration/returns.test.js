const moment = require('moment');
const request = require('supertest');
const {Rental} = require('../../models/rental');
const {Movie} = require('../../models/movie');
const {User} = require('../../models/user');
const mongoose = require('mongoose');//Import Mongoose

describe('/api/returns', () => {
  let server;//Define/load the sever 
  let customerId;//Defind variable customerId 
  let movieId;
  let rental;
  let movie; 
  let token;

  const exec = () => {
    return request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId, movieId });
  };
  
  beforeEach(async () => {//beforeEach is an asynchronous function 
    server = require('../../index'); 

    customerId = mongoose.Types.ObjectId();//Set customerId to new ObjectId
    movieId = mongoose.Types.ObjectId();//Set movieId to new ObjectId
    token = new User().generateAuthToken();

    movie = new Movie({
      _id: movieId,//movieId use here
      title: '12345',//Using '12345' for all names and numbers 
      dailyRentalRate: 2,
      genre: { name: '12345' },
      numberInStock: 10 
    });
    await movie.save();//Save rental object to database - async function -> await

    rental = new Rental({
      customer: {
        _id: customerId,//customerId variable used again here 
        name: '12345',
        phone: '12345'
      },
      movie: {
        _id: movieId,
        title: '12345',
        dailyRentalRate: 2
      }
    });
    await rental.save();//Save rental object ot database - async function -> await
  });

  afterEach(async () => { 
    await server.close();//Close the server after test - async function -> await 
    await Rental.remove({});//async function -> await
    await Movie.remove({});//async function -> await
  });  
//***All of the code above is the setup code for the tests below***
  //The 'It should work!' test below is run first to make sure the above code works before other
  //tests below it are created.
  it('Should work!', async () =>  {
    const result = await Rental.findById(rental._id);
    expect(result).not.toBeNull();
  });
  // it('should return 401 if client is not logged in', async () => {
  //   token = '';

  //   const res = await exec();

  //   expect(res.status).toBe(401);
  // });

  // it('should return 400 if customerId is not provided', async () => {
  //   customerId = ''; 
    
  //   const res = await exec();

  //   expect(res.status).toBe(400);
  // });

  // it('should return 400 if movieId is not provided', async () => {
  //   movieId = ''; 

  //   const res = await exec();

  //   expect(res.status).toBe(400);
  // });

  // it('should return 404 if no rental found for the customer/movie', async () => {
  //   await Rental.remove({});

  //   const res = await exec();

  //   expect(res.status).toBe(404);
  // });

  // it('should return 400 if return is already processed', async () => {
  //   rental.dateReturned = new Date();
  //   await rental.save();

  //   const res = await exec();

  //   expect(res.status).toBe(400);
  // });

  // it('should return 200 if we have a valid request', async () => {
  //   const res = await exec();

  //   expect(res.status).toBe(200);
  // });

  // it('should set the returnDate if input is valid', async () => {
  //   const res = await exec();

  //   const rentalInDb = await Rental.findById(rental._id);
  //   const diff = new Date() - rentalInDb.dateReturned;
  //   expect(diff).toBeLessThan(10 * 1000);
  // });

  // it('should set the rentalFee if input is valid', async () => {
  //   rental.dateOut = moment().add(-7, 'days').toDate();
  //   await rental.save();

  //   const res = await exec();

  //   const rentalInDb = await Rental.findById(rental._id);
  //   expect(rentalInDb.rentalFee).toBe(14);
  // });

  // it('should increase the movie stock if input is valid', async () => {
  //   const res = await exec();

  //   const movieInDb = await Movie.findById(movieId);
  //   expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  // });

  // it('should return the rental if input is valid', async () => {
  //   const res = await exec();

  //   const rentalInDb = await Rental.findById(rental._id);

  //   expect(Object.keys(res.body)).toEqual(
  //     expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee',
  //     'customer', 'movie']));
  // });
});