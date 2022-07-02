//Middleware(посредник) - механизм для фильтрации HTTP-запросов.
//Данный Middleware проверяет роль юзера

const jwt = require('jsonwebtoken')

//Экспортируем функцию, принимающую параметром роль
module.exports = function(role){
    return function (req, res, next) {
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
            if (decoded.role !== role ){//Декодированную роль сравниваем с ролью в middleware
                return res.status(403).json({message: "Нет доступа"})
            }
            req.user = decoded//В req в поле user помещаем декодированный токен
            next()//Вызов функции аргумента
        }catch(e){
            res.status(401).json({message: "Не авторизован"})
        }
    }
}
