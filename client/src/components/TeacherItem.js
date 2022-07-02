import React, {useState, useContext} from "react";
import { Button } from "react-bootstrap";
import ChangeTeacher from './modals/ChangeTeacher';
import { Context } from "../index";

const TeacherItem = ({teach, index}) => {
  const [changeVisible, setChangeVisible] = useState(false);
  const {teacher} = useContext(Context);

  return (
    <tr key={teach.id}>
      <td>{index}</td>
      <td>{teach.fio}</td>
      <td>{teach.email}</td>
      <td>{teach.job_title}</td>
      <td>{teach.visits_number}</td>
      {teacher.isAdmin ? (
      <td>
        <Button 
          variant={"outline-dark"}
          onClick={() => setChangeVisible(true)}
          >
            Изменить
        </Button>
        <ChangeTeacher id={teach.id} show={changeVisible} onHide={() => setChangeVisible(false)}/>
      </td>
      ) : (
        null
      )}
    </tr>

  );
};

export default TeacherItem;
