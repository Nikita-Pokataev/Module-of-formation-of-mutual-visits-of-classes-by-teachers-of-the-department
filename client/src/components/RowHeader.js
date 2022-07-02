import React, { useContext } from "react";
import { Context } from "../index";


const RowHeader = ({columns, adminElems}) => {
  const {teacher} = useContext(Context);
  
    return (
        <thead>
          <tr>
            {columns.map((column, index) => 
              <th key={index}>{column}</th>
            )}
            {teacher.isAdmin && adminElems ? (
            <th></th>
            ) : (
              null
            )}
          </tr>
        </thead>
    )
}
export default RowHeader;