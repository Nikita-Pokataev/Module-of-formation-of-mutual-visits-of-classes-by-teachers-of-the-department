const Router = require('express')//Импортируем Router из express
const router = new Router()
const teacherController = require('../controllers/teacherController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/registration', teacherController.registration)//Регистрация
router.post('/login', teacherController.login)//Вход в аккаунт
router.get('/auth', authMiddleware, teacherController.check)//Проверка авторизованности пользователя
router.get('/', authMiddleware, teacherController.getAll)//Получение пользователей
router.get('/one', checkRole('ADMIN'), teacherController.getOne)//Получение пользователя для модального окна. Админка
router.post('/one', checkRole('ADMIN'), teacherController.changeOne)//Изменение пользователя из модального окна
router.delete('/', checkRole('ADMIN'), teacherController.deleteOne)//Удаление пользователя. Админка

module.exports = router