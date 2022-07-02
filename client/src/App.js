import { BrowserRouter } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import AppRouter from "./components/AppRouter";
import NavBar from './components/NavBar';
import {observer} from 'mobx-react-lite'
import { Context } from "./index";
import { check } from "./http/teacherAPI";
import { Spinner } from "react-bootstrap";
import jwt_decode from 'jwt-decode';

const App = observer(() => {
  const {teacher} = useContext(Context)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    check().then((data) => {
      teacher.setIsAuth(true)
      teacher.setIsAdmin((jwt_decode(localStorage.token).role === "ADMIN") ? true : false)
    }).finally(() => setLoading(false))
    // eslint-disable-next-line
  }, [])

  if (loading){
    return <Spinner animation={'grow'}/>
  }

  return (
    <BrowserRouter>
      <NavBar/>
      <AppRouter/>
    </BrowserRouter>
  );
})

export default App;
