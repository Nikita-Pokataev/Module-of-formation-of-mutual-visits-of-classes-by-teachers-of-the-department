import React, { useContext } from 'react';
import {Routes, Route} from 'react-router-dom'
import {authRoutes, publicRoutes} from "../routes";
import { TEACHERLIST_ROUTE } from '../utils/consts';
import { Context } from '../index';
import TeachersList from '../pages/TeachersList';


const AppRouter = () => {
    //Получаем состояние авторизованности из глобального хранилища
    //В любом месте из него можно получать данные
    const {teacher} = useContext(Context);

    return (
            <Routes>
        {teacher.isAuth && authRoutes.map(({path, Component}) => 
            <Route key={path} path={path} element={Component} exact/>
        )}
        {publicRoutes.map(({path, Component}) => 
            <Route key={path} path={path} element={Component} exact/>
        )}
        {/*Если путь не найден. Правильной является только эта конструкция, тк в противном случае происходит бесконечный рендеринг*/}
        <Route path={TEACHERLIST_ROUTE} element={<TeachersList/>}/>
      </Routes>
    )
}

export default AppRouter;