import React, { useEffect, useState } from "react";
import { collection, destroy } from "../../../app/http/controllers";
import Alert from "../../../app/services/alert";
import PageHeader from "../../../template/includes/PageHeader";
import TableComponent from "../../../template/components/TableComponent";
import MakeElectronicRequest from "./MakeElectronicRequest";

const ElectronicRequests = () => {
  const [electronics, setElectronics] = useState([]);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    {
      field: "requisitor",
      header: "Beneficiary",
      isSortable: true,
    },
    {
      field: "device",
      header: "Item",
      isSortable: false,
    },
    {
      field: "requested_amount",
      header: "Item",
      isSortable: false,
      currency: true,
    },
    {
      field: "duration",
      header: "Duration",
      isSortable: false,
    },
    {
      field: "status",
      header: "Status",
      isSortable: false,
      status: true,
    },
  ];

  const manageElectronicRequest = (req) => {
    Alert.flash(
      "Are you sure?",
      "warning",
      "You would not be able to revert this!!"
    ).then((result) => {
      if (result.isConfirmed) {
        try {
          destroy("electronics", req?.id)
            .then((res) => {
              const response = res.data;
              setElectronics(
                electronics.filter((elec) => elec?.id !== req?.id)
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

  const openModal = () => {
    setShow(true);
    setIsLoading(true);
  };

  const handleSubmit = (response) => {
    setElectronics([response?.data, ...electronics]);
    setIsLoading(false);
    Alert.success(response?.status, response?.message);
    setShow(false);
  };

  const handleClose = () => {
    setShow(false);
    setIsLoading(false);
  };

  useEffect(() => {
    try {
      collection("electronics")
        .then((res) => {
          const response = res.data.data;
          setElectronics(response);
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
      <MakeElectronicRequest
        title="Make Purchase Request"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
      />
      <PageHeader
        pageName="Electronic Purchase"
        text="Make Purchase Request"
        handleClick={openModal}
        icon="post_add"
        isLoading={isLoading}
        resource
      />

      <div className="data__content">
        <div className="row">
          <TableComponent
            columns={columns}
            data={electronics}
            destroy={manageElectronicRequest}
            isSearchable
          />
        </div>
      </div>
    </>
  );
};

export default ElectronicRequests;
