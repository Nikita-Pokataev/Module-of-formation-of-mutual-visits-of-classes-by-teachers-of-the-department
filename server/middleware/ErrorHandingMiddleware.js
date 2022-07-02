//Middleware(посредник) - механизм для фильтрации HTTP-запросов.
//Данный Middleware нужен для обработки непредвиденных ошибок
const ApiError = require('../error/ApiError')//Импорт нашего обработчика ошибок 


//Импорт функции. Функция next - нужна для передачи управления следующей по цепочке функии middleware
module.exports = function(err, req, res, next){
    if (err instanceof ApiError){//Если класс ошибки ApiError
        return res.status(err.status).json({message: err.message})//Возвращаем ответ со статус кодом из ошибки
    }
    //Сообщение для необработанной ошибки
    return res.status(500).json({message: "Непредвиденная ошибка!"})
}
