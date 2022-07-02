//Компонент со списком учителей
import React, { useEffect, useContext } from "react";
import { Container, Table } from "react-bootstrap";
import { fetchAllTeachers } from "../http/teacherAPI";
import { observer } from "mobx-react-lite";
import TeacherItem from "../components/TeacherItem";
import RowHeader from '../components/RowHeader'
import { Context } from "../index";

const TeachersList = observer(() => {
  const {teacher} = useContext(Context);
  const columns = ['#', 'ФИО', 'Email', 'Должность', 'Кол-во планируемых посещений в месяц'];

  useEffect(() => {
    fetchAllTeachers().then(data => teacher.setTeachers(data.teachers))
    // eslint-disable-next-line
  }, []);

  return (
    <Container className="mt-2">
      <Table striped bordered hover>
        <RowHeader columns={columns} adminElems={true}/>
        <tbody>
          {teacher.teachers.map((teacher, index) => 
            <TeacherItem key={teacher.id} teach={teacher} index={index}/>
            )}
        </tbody>
      </Table>
    </Container>
  );
});

export default TeachersList;
