//Файл со всеми маршрутами в приложении. Сами маршруты берём из utils/consts.js
import TeachersList from "./pages/TeachersList";
import Auth from './pages/Auth';
import MarksList from './pages/MarksList';
import { REGISTRATION_ROUTE, LOGIN_ROUTE, TEACHERLIST_ROUTE, MARKS_ROUTE } from "./utils/consts";

export const authRoutes = [
    {
        path: TEACHERLIST_ROUTE,
        Component: <TeachersList/>
    },
    {
        path: MARKS_ROUTE,
        Component: <MarksList/>
    }
]

export const publicRoutes = [
    {
        path: LOGIN_ROUTE,
        Component: <Auth/>
    },
    {
        path: REGISTRATION_ROUTE,
        Component: <Auth/>
    }
]