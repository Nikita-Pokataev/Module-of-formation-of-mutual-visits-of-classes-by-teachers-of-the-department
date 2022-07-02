import {makeAutoObservable} from "mobx"

export default class MarksStore {
    constructor(){
        this._marks = [];//Список отметок
        makeAutoObservable(this)

    }

    setMarks(marks){
        this._marks = marks
    }

    get marks(){
        return this._marks
    }
}