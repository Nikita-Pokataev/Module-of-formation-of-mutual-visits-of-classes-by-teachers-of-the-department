import React, {useEffect, useState} from "react";
import { Button, Form, Modal } from "react-bootstrap";
import {fetchOneTeacher, deleteOneTeacher, changeOneTeacher} from "../../http/teacherAPI";

const ChangeTeacher = ({show, onHide, id}) => {
  const [fio, setFio] = useState('');
  const [email, setEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('')
  const [visits, setVisits] = useState('');

  useEffect(() => {
    fetchOneTeacher(id).then(data => {
      setFio(data.teacher.fio);
      setEmail(data.teacher.email);
      setJobTitle(data.teacher.job_title);
      setVisits(data.teacher.visits_number);
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  const deleteTeacher = () => {
    deleteOneTeacher(id).then(data => {
      onHide()
    })
  }

  const changeData = () => {
    changeOneTeacher(id, fio, email, visits, jobTitle);
    onHide();
  }

  return (
    <Modal
    show={show}
    onHide={onHide}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Изменить данные
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
            <Form.Control
            value={fio}
            onChange={e => setFio(e.target.value)}
                placeholder={"Введите ФИО"}
                />
        </Form>
        <Form className='mt-2'>
            <Form.Control
            value={email}
            onChange={e => setEmail(e.target.value)}
                placeholder={"Введите Email"}
                />
        </Form>
        <Form className='mt-2'>
            <Form.Control
            value={jobTitle}
            onChange={e => setJobTitle(e.target.value)}
                placeholder={"Введите должность"}
                />
        </Form>
        <Form className='mt-2'>
            <Form.Control
            value={visits}
            onChange={e => setVisits(e.target.value)}
                placeholder={"Введите количество посещений в месяц"}
                />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant={"outline-danger"} onClick={deleteTeacher} >Удалить пользователя</Button>
        <Button variant={"outline-success"} onClick={changeData}>Изменить данные</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangeTeacher;