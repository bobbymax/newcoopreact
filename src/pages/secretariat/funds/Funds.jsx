import React, { useEffect, useState } from "react";
import Alert from "../../../app/services/alert";
import { batchRequests, collection } from "../../../app/http/controllers";
import TableComponent from "../../../template/components/TableComponent";
import PageHeader from "../../../template/includes/PageHeader";
import AddFund from "./AddFund";
import axios from "axios";

const Funds = () => {
  const [subBudgetHeads, setSubBudgetHeads] = useState([]);
  const [funds, setFunds] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    {
      field: "sub_budget_head_id",
      header: "Sub ID",
      isSortable: false,
      currency: false,
    },
    {
      field: "approved_amount",
      header: "Name",
      isSortable: true,
      currency: true,
    },
    {
      field: "year",
      header: "Period",
      isSortable: false,
      currency: false,
    },
  ];

  const manageFund = (sub) => {
    setData(sub);
    setIsUpdating(true);
    setShow(true);
  };

  const openModal = () => {
    setShow(true);
    setIsLoading(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setFunds(
        funds.map((fund) => {
          if (fund.id === response?.data?.id) {
            return response?.data;
          }

          return fund;
        })
      );
    } else {
      setFunds([response?.data, ...funds]);
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
      const subsData = collection("subBudgetHeads");
      const fundsData = collection("funds");

      batchRequests([subsData, fundsData])
        .then(
          axios.spread((...res) => {
            const response = res[0].data.data;
            setSubBudgetHeads(response?.filter((sub) => !sub?.fund));
            setFunds(res[1].data.data);
          })
        )
        .catch((err) => {
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <AddFund
        title="Add Fund"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        data={data}
        dependencies={{ subBudgetHeads }}
      />
      <PageHeader
        pageName="Funds"
        text="Credit Sub Budget Head"
        handleClick={openModal}
        icon="post_add"
        isLoading={isLoading}
        resource
      />

      <div className="data__content">
        <div className="row">
          <TableComponent
            columns={columns}
            data={funds}
            manage
            manageData={manageFund}
            isSearchable
          />
        </div>
      </div>
    </>
  );
};

export default Funds;
