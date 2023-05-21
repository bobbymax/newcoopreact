import React, { useEffect, useState } from "react";
import Alert from "../../../app/services/alert";
import { collection } from "../../../app/http/controllers";
import TableComponent from "../../../template/components/TableComponent";
import PageHeader from "../../../template/includes/PageHeader";
import AddBudgetHead from "./AddBudgetHead";

const BudgetHeads = () => {
  const [budgetHeads, setBudgetHeads] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    {
      field: "name",
      header: "Name",
      isSortable: true,
    },
    {
      field: "label",
      header: "Label",
      isSortable: false,
    },
  ];

  const manageBudgetHead = (bud) => {
    setData(bud);
    setIsUpdating(true);
    setShow(true);
  };

  const openModal = () => {
    setShow(true);
    setIsLoading(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setBudgetHeads(
        budgetHeads.map((dept) => {
          if (dept.id === response?.data?.id) {
            return response?.data;
          }

          return dept;
        })
      );
    } else {
      setBudgetHeads([response?.data, ...budgetHeads]);
    }

    Alert.success(response?.status, response?.message);
    setIsUpdating(false);
    setShow(false);
    setData(undefined);
  };

  const handleClose = () => {
    setIsUpdating(false);
    setShow(false);
    setData(undefined);
    setIsLoading(false);
  };

  useEffect(() => {
    try {
      collection("budgetHeads")
        .then((res) => {
          const response = res.data.data;
          setBudgetHeads(response);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <AddBudgetHead
        title="Add Budget Head"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        data={data}
      />
      <PageHeader
        pageName="Budget Heads"
        text="Create Budget Head"
        handleClick={openModal}
        icon="post_add"
        isLoading={isLoading}
        resource
      />

      <div className="data__content">
        <div className="row">
          <TableComponent
            columns={columns}
            data={budgetHeads}
            manage
            manageData={manageBudgetHead}
            isSearchable
          />
        </div>
      </div>
    </>
  );
};

export default BudgetHeads;
