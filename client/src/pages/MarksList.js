//Компонент с отметками
import React, { useEffect, useContext } from "react";
import { Container, Table } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import RowHeader from '../components/RowHeader'
import MarkItem from "../components/MarkItem";
import { getVisits } from "../http/visitsAPI";
import jwt_decode from 'jwt-decode';
import { Context } from "../index";

const MarksList = observer(() => {
  const {marks} = useContext(Context);
  // eslint-disable-next-line no-unused-vars

  let now = new Date();

  const columns = ['#', 'Дата посещения', "Отметка", ""];
  let userId = jwt_decode(localStorage.getItem('token')).id;

  useEffect(() => {
    //Здесь передаём id преподавателя
    getVisits(userId).then(data => marks.setMarks(data.visits))
    // eslint-disable-next-line
  }, [])

  return (
    <Container>
        <Table striped bordered hover>
        <RowHeader columns={columns} adminElems={false}/>
        <tbody>
        {marks.marks.map((mark, index) => 
            <MarkItem key={mark.id} mark={mark} index={index} date={now.toDateString()}/>
            )}
        </tbody>
      </Table>
    </Container>
  );
});

export default MarksList;