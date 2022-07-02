//Папка с моделями хранения информации в БД. Модели создаются в БД в качестве таблиц автоматически.

const sequelize = require('../db')//Импорт объекта с конфигурацией к БД
const {DataTypes} = require('sequelize')//Импорт класса DataTypes для описания типов String, int и тд

//Описание моделей. Аргументы define - название модели и объект с полями этой модели
const Teacher = sequelize.define('teacher', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING, allowNull: false},
    fio: {type: DataTypes.STRING, allowNull: false},
    job_title: {type: DataTypes.STRING},
    visits_number: {type: DataTypes.INTEGER, defaultValue: 1},

    role: {type: DataTypes.STRING, defaultValue: "USER"},
})

//Внешние ключи sequelize подставит сам, во время создания типов связей
const Timetable = sequelize.define('timetable', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    lesson_name: {type: DataTypes.STRING, allowNull: false},
    lesson_type: {type: DataTypes.STRING, allowNull: false},
    lesson_time_number: {type: DataTypes.INTEGER, allowNull: false},
    cabinet: {type: DataTypes.STRING, allowNull: false},
    week_type: {type: DataTypes.INTEGER, allowNull: false},
    week_day: {type: DataTypes.INTEGER, allowNull: false}
})

//Внешние ключи sequelize подставит сам, во время создания типов связей
const Visit = sequelize.define('visit', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    checked: {type: DataTypes.BOOLEAN, defaultValue: false},
    date: {type: DataTypes.STRING, allowNull: false}
})

Teacher.hasMany(Timetable)
Timetable.belongsTo(Teacher)

Teacher.hasMany(Visit)
Visit.belongsTo(Teacher)

Timetable.hasMany(Visit)
Visit.belongsTo(Timetable)

//Экспортируем все эти модели. 
module.exports = {
    Teacher,
    Timetable,
    Visit,
}