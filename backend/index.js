const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const mysql = require('mysql');
const path = require('path');

const PORT = process.env.PORT || 3001;



const app = express();

app.use('/photos', express.static(path.join(__dirname, 'photos')));

app.get('/photos/drone_video.mp4', (req, res) => {
    res.setHeader('Content-Type', 'video/mp4');
    res.sendFile(path.join(__dirname, 'public/photos/drone_video.mp4'));
});

// Middleware для парсингу JSON і URL-кодованих даних
app.use(bodyParser.json());
// Підключаємо bodyParser для отримання даних з форм
app.use(bodyParser.urlencoded({ extended: true }));



// Налаштування EJS як шаблонізатора
app.set('view engine', 'ejs');
// Сервіс для статичних файлів (CSS, JS, зображення)
app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Server starting on port ${PORT}`);
});

// Головний маршрут, що рендерить HTML сторінку
app.get('/', (req, res) => {
    res.render('index'); // рендеринг index.ejs
});

// Маршрут для тестування
app.get('/testing', (req, res) => {
    res.render('testing'); // рендеринг testing.ejs
});

// Налаштування підключення до MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '***',
    database: 'drone_test'
});

// Підключення до бази даних
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to MySQL');
});

// Обробка POST-запиту на збереження відповідей
app.post('/submit-test', (req, res) => {
    console.log(req.body); // Логування тіла запиту
    const { username, question1, question2, question3, question4, question5 } = req.body;

    // SQL-запит для вставки відповідей у таблицю test_answers
    const sql = `INSERT INTO test_answers (username, question1, question2, question3, question4, question5) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [username, question1, question2, question3, question4, question5];

    db.query(sql, values, (err, results) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send('Error saving answers');
        }
        res.send('Ваші відповіді збережено!');
    });
});

// API маршрут
app.get('/api', (req, res) => {
    res.json({
        message: "Made by Iuliana Zimirska FEI-21c"
    });
});

// Рендеринг інших сторінок
const renderPages = ['maindetails', 'rama', 'propelers', 'motors', 'controler', 'spin', 'video', 'camera', 'radio', 'antena', 'battery', 'adding', 'drone_video'];
renderPages.forEach(page => {
    app.get(`/${page}`, (req, res) => {
        res.render(page); // рендеринг відповідної EJS сторінки
    });
});

