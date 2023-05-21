import React, { useEffect, useState } from "react";
import PageHeader from "../../../template/includes/PageHeader";
import { collection } from "../../../app/http/controllers";
import TableComponent from "../../../template/components/TableComponent";
import Alert from "../../../app/services/alert";
import MakeDecision from "./MakeDecision";

const Surety = () => {
  const [loans, setLoans] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);

  const columns = [
    {
      field: "owner",
      header: "Beneficiary",
      isSortable: false,
      currency: false,
      status: false,
      date: false,
    },
    {
      field: "amount",
      header: "Amount",
      isSortable: false,
      currency: true,
      status: false,
      date: false,
    },
    {
      field: "reason",
      header: "Reason",
      isSortable: false,
      currency: false,
      status: false,
      date: false,
    },
    {
      field: "created_at",
      header: "Requested At",
      isSortable: false,
      currency: false,
      status: false,
      date: true,
    },
    {
      field: "status",
      header: "Status",
      isSortable: false,
      currency: false,
      status: true,
      date: false,
    },
  ];

  const makeDecision = (raw) => {
    if (raw?.status === "pending") {
      setData(raw);
      setShow(true);
    } else {
      Alert.warning("Notice!!", "Your decision has already been made.");
    }
  };

  const closeForm = () => {
    setShow(false);
    setData(undefined);
  };

  const handleSubmit = (response) => {
    setLoans(
      loans.map((loan) => {
        if (loan.id === response?.data?.id) {
          return response?.data;
        }

        return loan;
      })
    );

    Alert.success(response?.status, response?.message);
    closeForm();
  };

  useEffect(() => {
    try {
      collection("guarantors")
        .then((res) => {
          setLoans(res.data.data);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <PageHeader pageName="Sureties" />
      <MakeDecision
        title="Make Guarantor Decision"
        show={show}
        handleClose={closeForm}
        handleSubmit={handleSubmit}
        data={data}
      />
      <div className="row">
        <TableComponent
          data={loans}
          columns={columns}
          manageData={makeDecision}
          manage
        />
      </div>
    </>
  );
};

export default Surety;
