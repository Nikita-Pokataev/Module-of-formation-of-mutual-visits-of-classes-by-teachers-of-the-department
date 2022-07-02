const {Sequelize} = require('sequelize')//Импорт ORM для БД

//На выходе экспортируем объект, который создаём из класса Sequelize
//Указываем в конструкторе конфигурацию (пользователь, пароль и тд)
module.exports = new Sequelize(
    //Переменные из .env передаём в конструктор Sequelize
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    //Объект для настройки сервера
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
    }

)

