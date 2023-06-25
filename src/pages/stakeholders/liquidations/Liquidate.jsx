import React, { useEffect, useState } from "react";
import Alert from "../../../app/services/alert";
import { collection } from "../../../app/http/controllers";
import PageHeader from "../../../template/includes/PageHeader";
import TableComponent from "../../../template/components/TableComponent";
import LiquidateRequest from "./LiquidateRequest";

const Liquidate = () => {
  const [liquidations, setLiquidations] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    {
      field: "name",
      header: "Member",
      isSortable: true,
    },
    {
      field: "loan",
      header: "Loan Code",
      isSortable: false,
    },
    {
      field: "code",
      header: "Request Code",
      isSortable: false,
    },
    {
      field: "type",
      header: "Type",
      isSortable: false,
    },
    {
      field: "amount",
      header: "Liquid Amount",
      isSortable: false,
      currency: true,
    },
    {
      field: "approved_amount",
      header: "Loan Amount",
      isSortable: false,
      approved_currency: true,
    },
    {
      field: "status",
      header: "Status",
      isSortable: false,
      status: true,
    },
  ];

  const manageLiquidation = (liq) => {
    //
  };

  const openModal = () => {
    setShow(true);
    setIsLoading(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setLiquidations(
        liquidations.map((dept) => {
          if (dept.id === response?.data?.id) {
            return response?.data;
          }

          return dept;
        })
      );
    } else {
      setLiquidations([response?.data, ...liquidations]);
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
      collection("liquidations")
        .then((res) => {
          const response = res.data.data;
          setLiquidations(response);
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
      <LiquidateRequest
        title="Liquidate Loan"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        data={data}
      />

      <PageHeader
        pageName="Liquidations"
        text="Liquidate Loan"
        handleClick={openModal}
        icon="post_add"
        isLoading={isLoading}
        resource
      />
      <div className="data__content">
        <div className="row">
          <TableComponent
            columns={columns}
            data={liquidations}
            manage
            manageData={manageLiquidation}
            isSearchable
          />
        </div>
      </div>
    </>
  );
};

export default Liquidate;
