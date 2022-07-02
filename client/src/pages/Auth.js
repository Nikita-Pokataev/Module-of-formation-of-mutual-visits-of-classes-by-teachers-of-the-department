//Компонент с авторизацией
import React, { useContext, useState } from 'react';
import { Button, Container, Card, Form } from "react-bootstrap";
import {REGISTRATION_ROUTE, LOGIN_ROUTE, TEACHERLIST_ROUTE} from '../utils/consts';
import {NavLink, useLocation, useNavigate} from 'react-router-dom';
import { login, registration } from '../http/teacherAPI';
import { observer } from "mobx-react-lite";
import { Context } from "../index";

const Auth = observer (() => {
    const {teacher} = useContext(Context)
    const location = useLocation()
    const navigate = useNavigate();
    const isLogin = location.pathname === LOGIN_ROUTE;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fio, setFio] = useState('');


    const click = async () => {
      try{
        let data;
        if (isLogin){
          data = await login(email, password);
        }else {
          data = await registration(email, password, fio);
        }
        teacher.setIsAuth(true)
        if (data.role === 'ADMIN'){
          teacher.setIsAdmin(true);
        }
        navigate(TEACHERLIST_ROUTE)
      }catch(e){
        alert(e.response.data.message)
      }

    }

    return (
        <Container 
            className='d-flex justify-content-center'
            style={{ height: window.innerHeight - 54, alignContent: 'center', alignItems: 'center'}}
            >
            <Card style={{ width: 600 }} className="p-5">
        <h2 className="m-auto">{isLogin ? "Авторизация" : "Регистрация"}</h2>
        <Form className="d-flex flex-column">
          <Form.Control
            className="mt-3"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Form.Control
            className="mt-3"
            placeholder="Пароль"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {!isLogin ? (
            <React.Fragment>
              <Form.Control
                className="mt-3"
                placeholder="ФИО"
                value={fio}
                onChange={e => setFio(e.target.value)}
              />
            </React.Fragment>
          ) : null}
          <Container className="d-flex justify-content-between mt-3 pl-3 pr-3">
            {isLogin ? (
              <div>
                Нет аккаунта?{" "}
                <NavLink to={REGISTRATION_ROUTE}>Зарегестрируйтесь!</NavLink>
              </div>
            ) : (
              <div>
                Есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войдите!</NavLink>
              </div>
            )}
            <Button 
              variant={"outline-success"}
              onClick={click}
              >
              {isLogin ? "Войти" : "Зарегестрироваться"}
            </Button>
          </Container>
        </Form>
      </Card>
        </Container>
    )
})

export default Auth;