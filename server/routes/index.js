//Основной роутер нашего приложения
const Router = require('express')//Импортируем Router из express
const router = new Router()//Объект Router
//Импорт всех подроутеров
const timetableRouter = require('./timetableRouter')
const teacherRouter = require('./teacherRouter')
const visitRouter = require('./visitRouter');

//Здесь все подроутеры, которые мы создали в routes
//Аргументы - путь к файлу и роутер
router.use('/teacher', teacherRouter)
router.use('/timetable', timetableRouter)
router.use('/visits', visitRouter)

//Экспортируем созданный нами router
module.exports = router