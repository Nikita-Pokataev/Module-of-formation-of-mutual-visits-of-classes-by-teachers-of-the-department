import axios from 'axios'//Библиотека, позволяющая делать HTTP-запросы

//Instanse для обычных запросов без авторизации
const $host = axios.create({
    baseURL: process.env.REACT_APP_API_URL//URL для отправки запросов
})

//Instanse для запросов с авторизацией, где в каждый запрос подставляется header Autorization
const $authHost = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})

//autoInterceptor(Функция для подставки токена к каждому запросу)
const authInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`//Токен берём из localStorage по ключу token
    return config
}

//Interceptor для запроса, для подставки токена
$authHost.interceptors.request.use(authInterceptor)

export {//Экспортируем Interceptor
    $host,
    $authHost
}