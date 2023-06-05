import React, { useEffect, useState } from "react";
import Alert from "../../../app/services/alert";
import { collection } from "../../../app/http/controllers";
import PageHeader from "../../../template/includes/PageHeader";
import TableComponent from "../../../template/components/TableComponent";
import AwardContract from "./AwardContract";

const Contracts = () => {
  const [awards, setAwards] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    {
      field: "code",
      header: "Code",
      isSortable: false,
    },
    {
      field: "title",
      header: "Title",
      isSortable: true,
    },
    {
      field: "approved_amount",
      header: "BOQ",
      isSortable: true,
      approved_currency: true,
    },
    {
      field: "vendor",
      header: "Awarded To",
      isSortable: true,
      status: false,
    },
    {
      field: "duration",
      header: "Period",
      isSortable: true,
      status: false,
    },
    {
      field: "date_awarded",
      header: "Issued",
      isSortable: true,
      date: true,
    },
    {
      field: "created_at",
      header: "Posted At",
      isSortable: false,
      date: true,
    },
  ];

  const manageContract = (contract) => {
    setData(contract);
    setIsUpdating(true);
    setShow(true);
  };

  const openModal = () => {
    setShow(true);
    setIsLoading(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setAwards(
        awards.map((vendor) => {
          if (vendor.id === response?.data?.id) {
            return response?.data;
          }

          return vendor;
        })
      );
    } else {
      setAwards([response?.data, ...awards]);
    }

    Alert.success(response?.status, response?.message);
    handleClose();
  };

  const handleClose = () => {
    setIsUpdating(false);
    setShow(false);
    setData(undefined);
    setIsLoading(false);
  };

  useEffect(() => {
    try {
      collection("awards")
        .then((res) => {
          const response = res.data.data;
          setAwards(response);
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
      <AwardContract
        title="Award Contract"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        data={data}
      />

      <PageHeader
        pageName="Contracts"
        text="Award Contract"
        handleClick={openModal}
        icon="post_add"
        isLoading={isLoading}
        resource
      />

      <div className="data__content">
        <div className="row">
          <TableComponent
            columns={columns}
            data={awards}
            manage
            manageData={manageContract}
            isSearchable
          />
        </div>
      </div>
    </>
  );
};

export default Contracts;
