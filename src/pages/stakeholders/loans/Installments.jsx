import React, { useEffect, useState } from "react";
import TableComponent from "../../../template/components/TableComponent";
import Modal from "../../../template/modals/Modal";

const Installments = ({
  title = "",
  show = false,
  lg = false,
  installments = [],
  handleClose = undefined,
}) => {
  const [insts, setInsts] = useState([]);

  const columns = [
    {
      field: "fee",
      header: "Fee",
      isSortable: false,
      currency: true,
    },
    {
      field: "due_date",
      header: "Due Date",
      isSortable: false,
      currency: false,
    },
  ];

  const handleModalClose = () => {
    // setInsts([]);
    handleClose();
  };

  useEffect(() => {
    setInsts(installments);
  }, [installments]);

  return (
    <>
      <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
        <div className="row">
          <TableComponent data={insts} columns={columns} />
        </div>
      </Modal>
    </>
  );
};

export default Installments;
