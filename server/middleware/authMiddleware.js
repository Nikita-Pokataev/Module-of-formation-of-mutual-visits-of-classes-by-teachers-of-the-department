//Middleware(посредник) - механизм для фильтрации HTTP-запросов.
//Данный Middleware проверяет токен на валидность
const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {//Проверяем метод запроса. Нас интересуют только методы POST, GET, PUT, DELETE 
        next()
    }
    try{
        //Из headers.authorization (туда его обычно помещают), по 1 индексу и с помощью разделения по пробелу  получаем токен
        const token = req.headers.authorization.split(' ')[1] // Bearer asfasnfkajsfnjk
        if (!token){//Если токена нет, возвращаем ошибку
            return res.status(401).json({message: "Не авторизован"})
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY)//Декодируем токен
        req.user = decoded//В req в поле user помещаем декодированный токен. Id пользвателя можно достать с помощью req.user.id
        next()//Вызов функции аргумента
    }catch(e){
        res.status(401).json({message: "Не авторизован"})
    }
}
