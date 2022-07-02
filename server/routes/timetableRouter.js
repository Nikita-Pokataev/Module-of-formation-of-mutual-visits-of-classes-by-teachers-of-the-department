const Router = require('express')//Импортируем Router из express
const router = new Router()
const timetableController = require('../controllers/timetableController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.get('/timetable', checkRole('ADMIN'), timetableController.updateTimetable)//Получение расписания


module.exports = router