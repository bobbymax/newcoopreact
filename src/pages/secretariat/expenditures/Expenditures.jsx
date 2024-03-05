import React, { useEffect, useState } from "react";
import PageHeader from "../../../template/includes/PageHeader";
import { collection, destroy } from "../../../app/http/controllers";
import {
  expenditureTypes,
  expenditureCategories,
  expenditureMethods,
  paymentTypes,
} from "../../../app/helpers";
import CreateExpenditure from "./CreateExpenditure";
import TableComponent from "../../../template/components/TableComponent";
import Alert from "../../../app/services/alert";

const Expenditures = () => {
  const [expenditures, setExpenditures] = useState([]);
  const [subBudgetHeads, setSubBudgetHeads] = useState([]);
  const [members, setMembers] = useState([]);
  const [vendors, setVendors] = useState([]);
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
    Alert.flash(
      "Are you sure?",
      "warning",
      "You would not be able to revert this!!"
    ).then((result) => {
      if (result.isConfirmed) {
        try {
          destroy("expenditures", exp?.id)
            .then((res) => {
              const response = res.data;
              setExpenditures(
                expenditures.filter((pay) => pay?.id !== exp?.id)
              );
              Alert.success("Deleted", response.message);
            })
            .catch((err) => console.log(err.message));
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const handleSubmit = (response) => {
    setExpenditures([response?.data, ...expenditures]);
    Alert.success(response?.status, response?.message);
  };

  const closeForm = () => {
    setShow(false);
    setIsLoading(false);
  };

  useEffect(() => {
    try {
      const urls = [
        "expenditures",
        "subBudgetHeads",
        "members",
        "organizations",
      ];

      const requests = urls.map((url) => collection(url));

      Promise.all(requests)
        .then((res) => {
          setExpenditures(res[0].data.data);
          setSubBudgetHeads(res[1].data.data);
          setMembers(res[2].data.data);
          setVendors(res[3].data.data);
        })
        .catch((err) => console.error(err.message));
    } catch (error) {
      console.error(error);
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
            members,
            vendors,
          }}
          handleSubmit={handleSubmit}
          handleClose={closeForm}
        />
      ) : (
        <div className="row">
          <TableComponent
            columns={columns}
            data={expenditures}
            destroy={manageExpenditure}
            isSearchable
          />
        </div>
      )}
    </>
  );
};

export default Expenditures;
