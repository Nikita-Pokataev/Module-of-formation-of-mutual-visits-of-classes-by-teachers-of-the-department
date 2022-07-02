import React from "react";
import { Button, InputGroup, FormControl } from "react-bootstrap";
import { setCheck } from "../http/visitsAPI";

const MarkItem = ({ mark, index, date }) => {
  const setMarked = () => {
    setCheck(mark.id, date).then((data) => {});
  };

  return (
    <tr key={mark.id}>
      <td>{index}</td>
      <td>{mark.date}</td>
      {mark.checked ? (
        <td>
          <Button
            variant="outline-success"
            onClick={() => alert("Это посещение уже было проведено")}
          >
            Посещено
          </Button>
        </td>
      ) : (
        <td>
          <Button variant="outline-danger" onClick={setMarked}>
            Не посещено
          </Button>
        </td>
      )}
      <td>
        <InputGroup className="mb-3">
        <FormControl as="textarea" aria-label="With textarea" />
        </InputGroup>
      </td>
    </tr>
  );
};

export default MarkItem;
