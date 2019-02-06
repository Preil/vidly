const {Rental, validate} = require('../models/rental');
const {Movie} = require('../models/movie');
const {Customer} = require('../models/customer');

const mongoose = require('mongoose');
const express = require('express');
const router = express.Router(express);

router.get('/', async (res, req) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

router.post('/', async (res, req) =>{
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error).message(error.detail[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send('Invalid customer');

    const movie = Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalide movie');

    if (movie.numberInstock ===0) return res.status(400).send('Movie is not available');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });
    rental.save();
    movie.numberInstock--;
    movie.save();
    res.send(rental);
});

exports.router;