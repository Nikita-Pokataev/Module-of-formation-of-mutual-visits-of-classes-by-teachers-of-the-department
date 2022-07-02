import {$authHost, $host} from './index'
import jwt_decode from 'jwt-decode';

export const registration = async (email, password, fio) => {
    const {data} = await $host.post('api/teacher/registration', {email, password, fio, role: 'USER'});
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token);
}

export const login = async (email, password) => {
    const {data} = await $host.post('api/teacher/login', {email, password});
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token);
}

export const check = async () => {
    const {data} = await $authHost.get('api/teacher/auth');
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token);
}

export const fetchAllTeachers = async () => {
    const {data} = await $authHost.get('api/teacher');
    return data;
}

export const fetchOneTeacher = async (id) => {
    const {data} = await $authHost.get('api/teacher/one', {params: {id: id}});
    return data
}

export const changeOneTeacher = async (id, fio, email, visits_number, job_title) => {
    const {data} = await $authHost.post('api/teacher/one', {id, fio, email, visits_number, job_title});
    return data
}

export const deleteOneTeacher = async (id) => {
    const {data} = await $authHost.delete('api/teacher', {params: {id}});
    return data
}

