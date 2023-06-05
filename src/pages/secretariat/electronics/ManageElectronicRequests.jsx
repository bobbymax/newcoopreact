import React, { useEffect, useState } from "react";
import Alert from "../../../app/services/alert";
import { collection, destroy } from "../../../app/http/controllers";
import PageHeader from "../../../template/includes/PageHeader";
import TableComponent from "../../../template/components/TableComponent";
import ElectronicRequest from "./ElectronicRequest";

const ManageElectronicRequests = () => {
  const [electronics, setElectronics] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);

  const columns = [
    {
      field: "code",
      header: "Code",
      isSortable: false,
    },
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
      header: "Requested Amount",
      isSortable: false,
      currency: true,
    },
    {
      field: "approved_amount",
      header: "Approved Amount",
      isSortable: false,
      approved_currency: true,
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

  // eslint-disable-next-line no-unused-vars
  const destroyElectronicRequest = (req) => {
    if (req?.status !== "pending") {
      Alert.error("Not Permitted!!", "You cannot perform this action.");
    } else {
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
    }
  };

  const manageElectronicRequest = (req) => {
    if (req?.status !== "pending") {
      Alert.error("Not Permitted!!", "You cannot update this request");
    } else {
      setData(req);
      setShow(true);
    }
  };

  const handleSubmit = (response) => {
    const elec = response.data;

    setElectronics(
      electronics.map((ele) => {
        if (ele.id === elec?.id) {
          return elec;
        }

        return ele;
      })
    );

    Alert.success(response?.status, response?.message);
    setShow(false);
  };

  const handleClose = () => {
    setShow(false);
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
      <ElectronicRequest
        title="Manage Purchase Request"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        data={data}
      />

      <PageHeader pageName="Manage Electronic Purchase Requests" />

      <div className="data__content">
        <div className="row">
          <TableComponent
            columns={columns}
            data={electronics}
            manage
            manageData={manageElectronicRequest}
            isSearchable
          />
        </div>
      </div>
    </>
  );
};

export default ManageElectronicRequests;
