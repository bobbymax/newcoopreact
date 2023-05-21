import React, { useEffect, useState } from "react";
import PageHeader from "../../../template/includes/PageHeader";
import { batchRequests, collection } from "../../../app/http/controllers";
import axios from "axios";
import {
  expenditureTypes,
  expenditureCategories,
  expenditureMethods,
  paymentTypes,
} from "../../../app/helpers";
import CreateExpenditure from "./CreateExpenditure";
import TableComponent from "../../../template/components/TableComponent";

const Expenditures = () => {
  const [expenditures, setExpenditures] = useState([]);
  const [subBudgetHeads, setSubBudgetHeads] = useState([]);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    {
      field: "trxRef",
      header: "Reference",
      isSortable: false,
      currency: false,
      status: false,
      approved_currency: false,
      date: false,
    },
    {
      field: "sub_budget_head_name",
      header: "Budget Code",
      isSortable: true,
      currency: false,
      status: false,
      approved_currency: false,
      date: false,
    },
    {
      field: "amount",
      header: "Amount",
      isSortable: true,
      currency: true,
      status: false,
      approved_currency: false,
      date: false,
    },
    {
      field: "type",
      header: "Type",
      isSortable: false,
      currency: false,
      status: false,
      approved_currency: false,
      date: false,
    },
    {
      field: "method",
      header: "Method",
      isSortable: false,
      currency: false,
      status: false,
      approved_currency: false,
      date: false,
    },
    {
      field: "created_at",
      header: "Posted On",
      isSortable: false,
      currency: false,
      status: false,
      approved_currency: false,
      date: true,
    },
    {
      field: "status",
      header: "Status",
      isSortable: false,
      currency: false,
      status: true,
      approved_currency: false,
      date: false,
    },
  ];

  const handleForm = () => {
    setShow(true);
    setIsLoading(true);
  };

  const manageExpenditure = (exp) => {
    // setShow(true);
    // setIsLoading(true);
    console.log("Here");
  };

  const handleSubmit = (response) => {
    console.log(response);
  };

  const closeForm = () => {
    setShow(false);
    setIsLoading(false);
  };

  useEffect(() => {
    try {
      const expsData = collection("expenditures");
      const subsData = collection("subBudgetHeads");

      batchRequests([expsData, subsData])
        .then(
          axios.spread((...res) => {
            setExpenditures(res[0].data.data);
            setSubBudgetHeads(res[1].data.data);
          })
        )
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <PageHeader
        pageName="Expenditures"
        headerIcon="shopping_cart"
        icon="layers"
        text="Create Expenditure"
        handleClick={handleForm}
        isLoading={isLoading}
        resource
      />

      {show ? (
        <CreateExpenditure
          dependencies={{
            budgetHeads: subBudgetHeads,
            types: expenditureTypes,
            categories: expenditureCategories,
            methods: expenditureMethods,
            payments: paymentTypes,
          }}
          handleSubmit={handleSubmit}
          handleClose={closeForm}
        />
      ) : (
        <div className="row">
          <TableComponent
            columns={columns}
            data={expenditures}
            manageData={manageExpenditure}
            isSearchable
            manage
          />
        </div>
      )}
    </>
  );
};

export default Expenditures;
