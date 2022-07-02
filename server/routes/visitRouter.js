const Router = require('express')//Импортируем Router из express
const router = new Router()
const authMiddleware = require('../middleware/authMiddleware');
const visitsController = require('../controllers/visitsController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.get('/visits', checkRole('ADMIN'), visitsController.getStatement);
router.get('/', authMiddleware, visitsController.getVisits);
router.post('/', authMiddleware, visitsController.setCheck);
router.get('/statement', authMiddleware, visitsController.writeAndSendStatement);
router.get('/report', checkRole('ADMIN'), visitsController.writeAndSendReport);


module.exports = router