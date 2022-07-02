import {makeAutoObservable} from "mobx"

export default class TeacherStore {
    constructor(){
        this._isAuth = false;
        this._isAdmin = false;
        this._teachers = [];//Список учителей
        makeAutoObservable(this)

    }

    setIsAuth(bool){
        this._isAuth = bool;
    }

    setIsAdmin(bool){
        this._isAdmin = bool
    }

    setTeachers(teachers){
        this._teachers = teachers
    }

    get isAuth(){
        return this._isAuth;
    }

    get isAdmin(){
        return this._isAdmin
    }

    get teachers(){
        return this._teachers
    }
}