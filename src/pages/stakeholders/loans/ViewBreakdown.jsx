import React, { useEffect, useState } from "react";
import Modal from "../../../template/modals/Modal";
import TableComponent from "../../../template/components/TableComponent";

const ViewBreakdown = ({
  title = "",
  show = false,
  lg = false,
  data = [],
  handleClose = undefined,
}) => {
  const columns = [
    {
      field: "fee",
      header: "FEE",
      isSortable: false,
      currency: true,
      status: false,
      date: false,
    },
    {
      field: "due_date",
      header: "DUE DATE",
      isSortable: false,
      currency: false,
      status: false,
      date: true,
    },
    {
      field: "status",
      header: "STATUS",
      isSortable: false,
      currency: false,
      status: true,
      date: false,
    },
  ];

  const [insts, setInsts] = useState([]);

  // console.log(insts);

  useEffect(() => {
    if (data?.length > 0) {
      const insts = [];
      data?.map((iins) =>
        insts.push({
          ...iins,
          status: "pending",
        })
      );
      setInsts(insts);
    }
  }, [data]);

  return (
    <>
      <Modal title={title} show={show} handleClose={handleClose} lg={lg}>
        <div className="row">
          <TableComponent data={insts} columns={columns} />
        </div>
      </Modal>
    </>
  );
};

export default ViewBreakdown;
