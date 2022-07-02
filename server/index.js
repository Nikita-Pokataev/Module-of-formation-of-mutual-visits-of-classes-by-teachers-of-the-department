const express = require('express') //Импорт express
require('dotenv').config() //Импорт файла .env
const sequelize = require('./db') //Импорт объекта с конфигурацией к БД
const models = require('./models/models') //Импорт моделей БД
const cors = require('cors');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandingMiddleware');
const cron = require('node-cron'); //Модуль для работы со временем


const PORT = process.env.PORT || 5000 //Из .env берём номер порта или ставим 5000

const app = express() //Объект express для запуска приложения

//Регистрация модулей
app.use(cors());
app.use(express.json()) //Парсинг JSON
app.use('/api', router)

app.use(errorHandler); //Middleware с обработкой ошибок регистрируется в конце

//Функция запуска 
const start = async () => {
    try {
        await sequelize.authenticate() //Подключение к базе данных
        await sequelize.sync() //Слияние состояния БД со схемой данных

        

        app.listen(PORT, () => console.log(`Server started on port ${PORT}`)) //Слушаем порт
    } catch (e) {
        console.log(e)
    }
}

start()
