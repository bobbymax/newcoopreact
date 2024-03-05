import React, { useEffect, useState } from "react";
import Alert from "../../../app/services/alert";
import { collection } from "../../../app/http/controllers";
import PageHeader from "../../../template/includes/PageHeader";
import TableComponent from "../../../template/components/TableComponent";
import AddVendor from "./AddVendor";

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    {
      field: "reg_no",
      header: "RC No.",
      isSortable: false,
    },
    {
      field: "name",
      header: "Name",
      isSortable: true,
    },
    {
      field: "code",
      header: "Pymt Code",
      isSortable: false,
    },
    {
      field: "type",
      header: "Type",
      isSortable: true,
    },
    {
      field: "status",
      header: "Status",
      isSortable: true,
      status: true,
    },
    {
      field: "created_at",
      header: "Reg. At",
      isSortable: false,
      date: true,
    },
    {
      field: "updated_at",
      header: "Verified",
      isSortable: false,
      verified: true,
    },
  ];

  const manageVendor = (vendor) => {
    setData(vendor);
    setIsUpdating(true);
    setShow(true);
  };

  const openModal = () => {
    setShow(true);
    setIsLoading(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setVendors(
        vendors.map((vendor) => {
          if (vendor.id === response?.data?.id) {
            return response?.data;
          }

          return vendor;
        })
      );
    } else {
      setVendors([response?.data, ...vendors]);
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

  const handleAddAccount = (raw) => {
    console.log(raw);
  };

  useEffect(() => {
    try {
      collection("organizations")
        .then((res) => {
          const response = res.data.data;
          setVendors(response);
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
      <AddVendor
        title="Add Vendor"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        data={data}
      />

      <PageHeader
        pageName="Vendors"
        text="Create Vendor"
        handleClick={openModal}
        icon="post_add"
        isLoading={isLoading}
        resource
      />

      <div className="data__content">
        <div className="row">
          <TableComponent
            columns={columns}
            data={vendors}
            manage
            manageData={manageVendor}
            account={handleAddAccount}
            isSearchable
          />
        </div>
      </div>
    </>
  );
};

export default Vendors;
