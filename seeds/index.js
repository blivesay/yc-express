const mongoose = require('mongoose');
const cities = require('./cities');
const {places, descriptors} = require('./seedHelpers');
const imageChoices = require('./imageHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// random selection within seedHelpers array for camp name
const sample = (array) => array[Math.floor(Math.random() * array.length)]



const seedDB = async () => {
    await Campground.deleteMany({});
   for(let i = 0; i < 120; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const file1 = sample(imageChoices);
    const file2 = sample(imageChoices);
    const c = new Campground({
        author: "649c47c94e997b404094824a",
        title: `${sample(descriptors)} ${sample(places)}`,
        location: `${cities[random1000].city}, ${cities[random1000].state}`, 
        geometry: { "type": "Point", "coordinates": [
          cities[random1000].longitude, 
          cities[random1000].latitude
        ]},
        images: [
            {
              url: file1.url,
              filename: file1.filename
            },
            {
              url: file2.url,
              filename: file2.filename
            }
          ],           
          description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolore delectus minima incidunt eveniet vero amet quis consequatur hic veritatis ratione ut repellat distinctio totam quaerat placeat aspernatur, numquam in asperiores?', price
    });
    await c.save();
}
}


seedDB().then(() => {
    mongoose.connection.close();
});