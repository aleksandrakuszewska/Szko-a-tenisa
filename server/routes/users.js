const router = require("express").Router()
const { User, validate } = require("../models/user")
const { Event } = require('../models/calendar')
const bcrypt = require("bcrypt")
const validateToken = require('../middleware/tokenVerification')

router.post("/", async (req, res) => {
try {
const { error } = validate(req.body)
if (error)
return res.status(400).send({ message: error.details[0].message })
const user = await User.findOne({ email: req.body.email })
if (user)
return res
.status(409)
.send({ message: "User with given email already Exist!" })
const salt = await bcrypt.genSalt(Number(process.env.SALT))
const hashPassword = await bcrypt.hash(req.body.password, salt)
await new User({ ...req.body, password: hashPassword }).save()
res.status(201).send({ message: "User created successfully" })
} catch (error) {
res.status(500).send({ message: "Internal Server Error" })
}
})

router.get("/", async (req, res) => {
 //pobranie wszystkich użytkowników z bd:
 User.find().exec()
 .then(async () => {
 const users = await User.find();
 //konfiguracja odpowiedzi res z przekazaniem listy użytkowników:
 res.status(200).send({ data: users, message: "Lista uzytkownikow" });
 })
 .catch(error => {
 res.status(500).send({ message: error.message });
 });
})

router.get("/account-details",validateToken, async (req, res) => {
  try {
    // Pobranie szczegółów konta aktualnie zalogowanego użytkownika na podstawie req.user._id
    const userId = req.user._id;
    const user = await User.findOne({ _id: userId });

    if (user) {
      // Konfiguracja odpowiedzi z przekazaniem szczegółów konta
      res.status(200).send({ data: user, message: "Szczegoly konta" });
    } else {
      res.status(404).send({ message: "Nie znaleziono użytkownika" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
router.put("/change-password", validateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    // Pobranie użytkownika z bazy danych na podstawie jego identyfikatora
    const user = await User.findById(userId);

    // Sprawdzenie, czy podane obecne hasło jest poprawne
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
    
      return res.status(300).send({ message: "Obecne hasło jest nieprawidłowe" , reloadForm: true });
      // res.status(200).send({ message: "Obecne hasło jest nieprawidłowe" });
      // window.location.reload();
      // res.render("change-password", { message: errorMessage });
    }
    console.log(newPassword.length)
  
    if (newPassword.length < 8) {
      return res.status(300).send({ message: "Nowe hasło nie spełnia wymagań" , reloadForm: true });
    }

    // Generowanie soli i hashowanie nowego hasła
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(newPassword, salt);

    // Aktualizacja hasła użytkownika w bazie danych
    await User.findByIdAndUpdate(userId, { password: hashPassword });

    res.status(200).send({ message: "Hasło zostało zmienione pomyślnie" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});
router.get('/calendar', async (req, res) => {
  try {
    // Pobieranie wszystkich wydarzeń z bazy danych
    const events = await Event.find();

    res.json(events); // Zwracanie wydarzeń w odpowiedzi
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/calendar', async (req, res) => {
  try {
    const eventData = req.body[0]; // Dane nowego wydarzenia przekazane z żądania
    const userId = req.body[1]; // ID osoby dodającej wydarzenie
    const event = new Event({ ...eventData}); // Tworzenie nowego obiektu Event z dodanym polem addedBy

    // Zapisywanie nowego wydarzenia w bazie danych
    const savedEvent = await event.save();

    res.status(201).json(savedEvent); // Zwracanie zapisanego wydarzenia w odpowiedzi
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/", async (req, res) => {
  try {
    const userId = req.user._id;

    // Usunięcie konta użytkownika z bazy danych na podstawie jego identyfikatora
    await User.findByIdAndDelete(userId);

    // Konfiguracja odpowiedzi res po pomyślnym usunięciu konta
    res.status(200).send({ message: "Konto zostało usunięte" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});


module.exports = router