import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { getPlan } from "../../http/visitsAPI";

const ChooseSemester = ({ show, onHide }) => {
    const [semester, setSemester] = useState('')
    const [year, setYear] = useState('');

  const chooseTime = () => {
    getPlan(semester, year).then(data => {
        onHide()
    })
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Выберите год и семестр для генерации отчёта
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='d-flex justify-content-center'>
        <Form className='mt-2'>
            <Form.Control
            value={year}
            onChange={e => setYear(e.target.value)}
                placeholder={"Год, например: 2022"}
                />
        </Form>
      </Modal.Body>
      <Modal.Footer className='d-flex justify-content-center'>
      <Button variant={"outline-dark"}  style={{marginRight: 10}} onClick={() => setSemester(0)}>Осенний семестр</Button>
        <Button variant={"outline-dark"} style={{marginLeft: 10}} onClick={() => setSemester(1)}>Весенний семестр</Button>
        <Button variant={"outline-success"} style={{marginLeft: 10}} onClick={chooseTime}>Подтвердить</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChooseSemester;
