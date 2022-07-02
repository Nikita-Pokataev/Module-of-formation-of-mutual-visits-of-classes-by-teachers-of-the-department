import React, { useContext, useState } from "react";
// eslint-disable-next-line
import { Navbar, Nav, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Context } from "../index";
import { LOGIN_ROUTE, MARKS_ROUTE, TEACHERLIST_ROUTE } from "../utils/consts";
import { observer } from "mobx-react-lite";
import ChooseSemester from "./modals/ChooseSemester";
import { updateTimetable } from "../http/timetableAPI";
import { downloadReport, downloadStatement } from "../http/visitsAPI";

const NavBar = observer(() => {
  const { teacher } = useContext(Context);
  const navigate = useNavigate();
  const [chooseVisible, setChooseVisible] = useState(false);


  //Функция выхода
  const logOut = () => {
    teacher.setIsAuth(false);
    teacher.setIsAdmin(false);
    localStorage.removeItem("token");
    navigate(LOGIN_ROUTE);
  };

  const update = () => {
    updateTimetable();
  }

  const download = (type) => {
    if (type === 'report'){
      downloadReport();
    }else if (type === 'statement'){
      downloadStatement();
    }
  }
 

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
      <Navbar.Brand>TM</Navbar.Brand>
          {teacher.isAdmin && teacher.isAuth ? (
            <Nav className="ml-auto" style={{ color: "white" }}>
            <Nav.Link variant={"outline-light"} onClick={() => download('report')}>Скачать отчёт</Nav.Link>
            <Nav.Link variant={"outline-light"} onClick={() => download('statement')}>Скачать план-ведомость</Nav.Link>
            <Nav.Link variant={"outline-light"} onClick={() => setChooseVisible(true)}>Сгенерировать план-ведомость</Nav.Link>
            <Nav.Link variant={"outline-light"} onClick={() => navigate(TEACHERLIST_ROUTE)}>Преподаватели</Nav.Link>
            <Nav.Link variant={"outline-light"} onClick={() => navigate(MARKS_ROUTE)}>Отметки</Nav.Link>
            <Nav.Link variant={"outline-light"} onClick={() => update()} >Обновить расписание</Nav.Link>
            <Nav.Link variant={"outline-light"} onClick={() => logOut()}>
              Выйти
            </Nav.Link>
            </Nav>
          ) : teacher.isAuth ? (
            <Nav className="ml-auto" style={{ color: "white" }}>
            <Nav.Link variant={"outline-light"} onClick={() => download('statement')}>Скачать план-ведомость</Nav.Link>
            <Nav.Link variant={"outline-light"} onClick={() => navigate(TEACHERLIST_ROUTE)}>Преподаватели</Nav.Link>
            <Nav.Link variant={"outline-light"} onClick={() => navigate(MARKS_ROUTE)}>Отметки</Nav.Link>
            <Nav.Link variant={"outline-light"} onClick={() => logOut()}>
              Выйти
            </Nav.Link>
            </Nav>
          ) : (
            <Nav className="ml-auto" style={{ color: "white" }}>
            <Nav.Link variant={"outline-light"} onClick={() => navigate(LOGIN_ROUTE)}>Войти</Nav.Link>
            </Nav>
          )}
        <ChooseSemester show={chooseVisible} onHide={() => setChooseVisible(false)}/>
      </Container>
    </Navbar>
  );
});

export default NavBar;
