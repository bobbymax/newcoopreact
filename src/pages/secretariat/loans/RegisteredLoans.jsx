import React, { useEffect, useState } from "react";
import PageHeader from "../../../template/includes/PageHeader";
import { batchRequests, collection } from "../../../app/http/controllers";
import TableComponent from "../../../template/components/TableComponent";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const RegisteredLoans = () => {
  const columns = [
    {
      field: "request_code",
      header: "REF",
      isSortable: true,
      currency: false,
      status: false,
      approved_currency: false,
    },
    {
      field: "sub_budget_head_name",
      header: "Type",
      isSortable: false,
      currency: false,
      status: false,
      approved_currency: false,
    },
    {
      field: "requested_amount",
      header: "Amount",
      isSortable: false,
      currency: true,
      status: false,
      approved_currency: false,
    },
    {
      field: "approved_amount",
      header: "Approved",
      isSortable: false,
      currency: false,
      status: false,
      approved_currency: true,
    },
    {
      field: "status",
      header: "Status",
      isSortable: false,
      currency: false,
      status: true,
      approved_currency: false,
    },
  ];

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [loans, setLoans] = useState([]);
  const [members, setMembers] = useState([]);

  const viewLoan = (loan) => {
    navigate("/secretariat/loan/details", {
      state: {
        loan,
        members,
        url: pathname,
      },
    });
  };

  useEffect(() => {
    try {
      const membersData = collection("members");
      const registeredLoans = collection("registered/loans");
      batchRequests([membersData, registeredLoans])
        .then(
          axios.spread((...res) => {
            const mems = res[0].data.data;
            const regs = res[1].data.data;

            setMembers(mems.filter((mem) => mem?.type === "member"));
            setLoans(regs);
          })
        )
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <PageHeader pageName="Registered Loans" headerIcon="leaderboard" />

      <div className="row">
        <TableComponent columns={columns} data={loans} viewData={viewLoan} />
      </div>
    </>
  );
};

export default RegisteredLoans;
