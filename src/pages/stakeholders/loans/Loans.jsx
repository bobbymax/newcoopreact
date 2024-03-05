import React, { useEffect, useState } from "react";
import Alert from "../../../app/services/alert";
import { collection } from "../../../app/http/controllers";
import TableComponent from "../../../template/components/TableComponent";
import PageHeader from "../../../template/includes/PageHeader";
import { formatSelectOptions } from "../../../app/helpers";
import LoanRequest from "./LoanRequest";
import AddGuarantor from "./AddGuarantor";
import { useLocation, useNavigate } from "react-router-dom";

const Loans = () => {
  const [subBudgetHeads, setSubBudgetHeads] = useState([]);
  const [members, setMembers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [show, setShow] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [single, setSingle] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { pathname } = useLocation();

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
      header: "Requested",
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

  const addGuarantors = (loan) => {
    setSingle(loan);
    setModalShow(true);
    setIsLoading(true);
  };

  const loanApplication = (response) => {
    const { data, message, status, method } = response;

    if (method === "alter") {
      setLoans(
        loans.map((mod) => {
          if (mod?.id === data?.id) {
            return data;
          }

          return mod;
        })
      );
    } else {
      setLoans([data, ...loans]);
    }

    Alert.success(status, message);
    closeForm();
  };

  const viewLoanData = (loan) => {
    navigate("/stakeholders/loan/details", {
      state: {
        loan,
        members,
        url: pathname,
      },
    });
  };

  const closeForm = () => {
    setShow(false);
    setModalShow(false);
    setIsLoading(false);
    setIsUpdating(false);
    setSingle(null);
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
      const urls = ["loans", "subBudgetHeads", "members"];

      const requests = urls.map((url) => collection(url));

      Promise.all(requests)
        .then((res) => {
          const lns = res[0].data.data;
          const subs = res[1].data.data;
          const mems = res[2].data.data;

          setMembers(formatSelectOptions(mems, "id", "name", "membership_no"));
          setLoans(lns);
          setSubBudgetHeads(
            subs?.filter((sub) => sub?.category_label === "loan")
          );
        })
        .catch((err) => console.error(err.message));
    } catch (error) {
      console.error(error);
    }
  }, []);

  const requestLoan = () => {
    setIsLoading(true);
    setShow(true);
  };

  return (
    <>
      <PageHeader
        pageName="Loans"
        text="Request for A Loan"
        handleClick={requestLoan}
        icon="payments"
        isLoading={isLoading}
        resource
      />

      <AddGuarantor
        title="Loan Guarantors"
        show={modalShow}
        handleClose={closeForm}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        data={single}
        dependencies={{ members }}
        maximum={3}
      />

      <div className="data__content">
        <div className="row">
          {show ? (
            <LoanRequest
              options={{ subBudgetHeads }}
              handleSubmit={loanApplication}
              isUpdating={isUpdating}
              data={single}
              handleClose={closeForm}
            />
          ) : (
            <TableComponent
              data={loans}
              columns={columns}
              guarantors
              manageData={addGuarantors}
              viewData={viewLoanData}
              isSearchable
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Loans;
