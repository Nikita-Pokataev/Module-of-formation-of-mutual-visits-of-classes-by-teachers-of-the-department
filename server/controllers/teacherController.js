const {Teacher, Timetable, Visit} = require('../models/models');
const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}


class TeacherController {
    //Регистрация учителя
    async registration(req, res, next){
        const {email, password, fio, role} = req.body//Берём данные из тела запроса к серверу
        if (!email || !password || !fio){//Введёна ли почта или пароль
            return next(ApiError.badRequest('Введены не все данные'))
        }
        const candidate = await Teacher.findOne({where: {email}})//Проверяем существует ли email
        if (candidate){
            return next(ApiError.badRequest('Пользователь с такие email уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const teacher = await Teacher.create({email, password: hashPassword, role, fio})
        const token = generateJwt(teacher.id, teacher.email, teacher.role);
        return res.json({token});
    }
    //Вход в аккаунт
    async login(req, res, next){
        const {email, password} = req.body;
        const teacher = await Teacher.findOne({where: {email}})
        if (!teacher){
            return next(ApiError.internal('Пользователь с таким email не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, teacher.password);
        if (!comparePassword){
            return next(ApiError.internal('Неверный пароль'))
        }
        const token = generateJwt(teacher.id, teacher.email, teacher.role);
        return res.json({token});
    }
    //Проверка авторизованности. По факту генерируем токен и отправляем его на клиент
    async check(req, res, next){
        const token = generateJwt(req.user.id, req.user.email, req.user.role);
        return res.json({token});
    }
    //Получение списка учителей
    async getAll(req, res){
        const teachers = await Teacher.findAll()
        return res.json({teachers});
    }
    //Получение информации об учителе в модальном окне
    async getOne(req, res, next){
        const {id} = req.query
        const teacher = await Teacher.findOne({where: {id}});
        if (!teacher){
            next(ApiError.internal('Пользователь не найден'))
        }
        return res.json({teacher});
    }

    //Изменение информации об учителе
    async changeOne(req, res, next){
        const {id, fio, email, visits_number, job_title, role} = req.body
        if (!email || !fio){//Введёна ли почта или пароль
            return next(ApiError.badRequest('Введены не все данные'))
        }
        const candidate = await Teacher.findAndCountAll({where: {email}})//Проверяем существует ли email
        if (candidate.count > 2){
            return next(ApiError.badRequest('Пользователь с такие email уже существует'))
        }
        const {password} = await Teacher.findOne({where: {id}})
        await Teacher.destroy({where: {id}});
        const teacher = await Teacher.create({id, email, role, fio, visits_number, job_title, password: password})
        return res.json({teacher});
    }

    //Удаление информации об учителе
    async deleteOne(req, res, next){
        const {id} = req.query
        const del =  await Teacher.destroy({where: {id}});
        return res.json({del})
}
}

module.exports = new TeacherController();