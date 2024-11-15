/* INCLUDES */

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
require('dotenv').config()
const multer = require('multer');

/* ----------------------- */


/* CONTROLLERS */

const errorController = require('./controllers/error');

/* ----------------------- */

const app = express();



app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.set('view engine', 'ejs');
app.set('views', 'views');

const fileFilter = (req, file, cb) => {

  if(file.mimetype === 'text/plain')
  {
    cb(null, true);
    req.fileValidationError = false
  }
  else
  {
    cb(null, false)
    req.fileValidationError = true
  }

}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    const uploadsDir = path.join(__dirname, 'uploads', 'data');
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
    }
    cb(null, uploadsDir); 
    },
    filename: (req, file, cb) => {
        
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
})

const upload = multer({ storage: storage });

app.post('/', upload.single('file'));

/* ROUTES */

const mainRoutes = require('./routes/main');

/* ----------------------- */



app.use(mainRoutes);

app.get('/401', errorController.get401);
app.get('/500', errorController.get500); 
app.use(errorController.get404); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
