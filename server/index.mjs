// imports
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import crypto from 'crypto';
import multer from 'multer';
import path from 'path'; // Importa il modulo path
import fs from 'fs';

import {body, check, validationResult } from 'express-validator';

import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';

import UserDAO from './dao/dao-user.mjs';
import TrailDAO from './dao/dao-trail.mjs';
import ReviewDAO from './dao/dao-review.mjs';

const userDao = new UserDAO();
const trailDao = new TrailDAO();
const reviewDao = new ReviewDAO();

// init express
const app = new express();
const port = 3001;

// middlewares
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('./public')); 

// set up and enable CORS
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

// Authentication
passport.use(new LocalStrategy(async (username, password, cb) => {
  const user = await userDao.getUsers(username, password);
  if (!user) 
    return cb(null, false, 'Incorrect username or password.');
  
  return cb(null, user);
})); 
passport.serializeUser(function (user, cb) {
  cb(null, user);
});
passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
      return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}
app.use(session({
  secret:"Your compass to the outdoors",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

//gestione immagini

const uploadDir = path.resolve('./public'); // Percorso assoluto
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite di 5MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase()); // Usa path
    const mimeType = fileTypes.test(file.mimetype);
    if (mimeType && extName) {
      return cb(null, true);
    }
    cb(new Error('File type not supported'));
  },
});

// Validation

// TRAIL ROUTES

app.get('/api/trails/', 
    (req, res) => {
        trailDao.getTrails()
        .then((trails) => {res.status(201).json(trails);})
        .catch((err) => {res.status(500).json({ error: err });});
    }
);

app.get('/api/trails/:startpoint', 
    (req, res) => {

        trailDao.getTrailsMoreInformation(req.params.startpoint)
        .then((trails) => {res.status(201).json(trails);})
        .catch((err) => {res.status(500).json({ error: err });});
    }
);

app.get('/api/trail/:id', 
    (req, res) => {
        trailDao.getTrail(req.params.id)
        .then((trail) => {res.status(201).json(trail);})
        .catch((err) => {res.status(500).json({ error: err });});
    }
);

app.post(
  '/api/trail',
  upload.single('image'), // Middleware per un singolo file immagine
  
  async (req, res) => {
      const trail = JSON.parse(req.body.trail); // Dati del trail inviati come stringa JSON
      const files = req.file; // File caricati
      trail.image = `${Date.now()}_${files.originalname}`;

      console.log("Dati del trail:", trail);

      trailDao.createTrail(trail)
      .then((id) => {res.status(201).json(id);})
      .catch((err) => {res.status(500).json({ error: err });});

    }
);





//REVIEWS ROUTES

app.post('/api/review', 
    (req, res) => {
        reviewDao.submitReview(req.body)
        .then((review) => {res.status(201).json(review);})
        .catch((err) => {res.status(500).json({ error: err });});
    }
);

app.get('/api/reviews/:trail_id',
    (req, res) => {
        reviewDao.getReviewsByTrail(req.params.trail_id)
        .then((reviews) => {res.status(201).json(reviews);})
        .catch((err) => {res.status(500).json({ error: err });});
    }
);

// SESSION ROUTES
app.post('/api/sessions', 
    function(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            // display wrong login messages
            return res.status(401).send(info);
        }
        // success, perform the login
        req.login(user, (err) => {
            if (err)
                return next(err);
            // req.user contains the authenticated user, we send all the user info back
            return res.status(201).json(req.user);
        });
    })(req, res, next);
  });
  
app.get('/api/sessions/current', (req, res) => {
if(req.isAuthenticated()) {
    res.status(200).json(req.user);}
else
    res.status(401).json({error: 'Not authenticated'});
});

app.delete('/api/sessions/current', (req, res) => {
req.logout(() => {res.end();});
});
// API Route per registrare un nuovo utente
app.post(
'/api/register',
[
    body('email').isEmail().withMessage('Inserisci un indirizzo email valido.'),
    body('password').isLength({ min: 8 }).withMessage('La password deve essere lunga almeno 8 caratteri.'),
    body('name').notEmpty().withMessage('Il nome è obbligatorio.'),
    body('surname').notEmpty().withMessage('Il cognome è obbligatorio.')
],
(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name, surname } = req.body;

    if (!email || !password || !name || !surname) {
        return res.status(400).json({ error: "Dati mancanti. Inserisci email e password." });
    }

    try {
        // Genera un salt unico
        const salt = crypto.randomBytes(16).toString('hex');
        // Hash della password con il salt
        crypto.scrypt(password, salt, 32, async (err, hashedPassword) => {
            if (err) return res.status(500).json({ error: "Errore nella generazione dell'hash." });

            const hashedPasswordHex = hashedPassword.toString('hex');

            // Salva l'utente nel database
            try {
                await userDao.createUser(email, hashedPasswordHex, salt, name, surname);
                res.status(201).json({ message: "Utente registrato con successo!" });
            } catch (dbErr) {
                if (dbErr.code === 'SQLITE_CONSTRAINT') {
                    res.status(409).json({ error: "Email già registrata." });
                } else {
                    res.status(500).json({ error: "Errore nel salvataggio dell'utente." });
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: "Errore durante la registrazione." });
    }
}
);

// activate the server
app.listen(port, () => {console.log(`Server listening at http://localhost:${port}`);});