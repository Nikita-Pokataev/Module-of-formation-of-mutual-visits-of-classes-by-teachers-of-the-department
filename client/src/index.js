import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import TeacherStore from "./store/TeacherStore"
import MarksStore from "./store/MarksStore"

//Прокидывание глобального состояния в компонеты 
export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{
        teacher: new TeacherStore(),
        marks: new MarksStore()
    }}>
    <App />
    </Context.Provider>
);

