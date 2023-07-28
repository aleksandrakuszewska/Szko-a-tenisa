// const mongoose = require("mongoose")
// const jwt = require("jsonwebtoken")
// const Joi = require("joi")
// // Zdefiniuj schemat danych dla wydarzeń
// const eventSchema = new mongoose.Schema({
//     title: String,
//     start: Date,
//     end: Date,
//     place: String,
//   });
//   const Event = mongoose.model('Event', eventSchema);
// const addEventToDatabase = (newEvent) => {
//     // Utwórz nową instancję modelu Event na podstawie danych wydarzenia
//     const event = new Event(newEvent);
  
//     // Zapisz wydarzenie w bazie danych
//     event.save()
//       .then(() => {
//         console.log('Dodano wydarzenie do bazy danych');
//       })
//       .catch((error) => {
//         console.error('Błąd podczas dodawania wydarzenia do bazy danych:', error);
//       });
//   };
//   module.exports = {Event}

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const eventSchema = new mongoose.Schema({
  title: String,
  start: Date,
  end: Date,
  place: String,
  email: String,
});

const Event = mongoose.model('Event', eventSchema);

const addEventToDatabase = (newEvent) => {
  
  // Utwórz nową instancję modelu Event na podstawie danych wydarzenia
  const event = new Event(newEvent);

  // Zapisz wydarzenie w bazie danych
  event.save()
    .then(() => {
      console.log('Dodano wydarzenie do bazy danych');
    })
    .catch((error) => {
      console.error('Błąd podczas dodawania wydarzenia do bazy danych:', error);
    });
};

module.exports = { Event, addEventToDatabase };
