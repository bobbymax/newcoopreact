import React, { useEffect, useState } from "react";
import Alert from "../../app/services/alert";
import { collection } from "../../app/http/controllers";
import PageHeader from "../../template/includes/PageHeader";
import TableComponent from "../../template/components/TableComponent";
import AddAccount from "./AddAccount";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    {
      field: "bank_name",
      header: "Bank",
      isSortable: true,
    },
    {
      field: "account_number",
      header: "Account Number",
      isSortable: true,
    },
    {
      field: "owner",
      header: "Owner",
      isSortable: true,
    },
  ];

  const manageAccount = (account) => {
    setData(account);
    setIsUpdating(true);
    setShow(true);
  };

  const openModal = () => {
    setShow(true);
    setIsLoading(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setAccounts(
        accounts.map((vendor) => {
          if (vendor.id === response?.data?.id) {
            return response?.data;
          }

          return vendor;
        })
      );
    } else {
      setAccounts([response?.data, ...accounts]);
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
      collection("accounts")
        .then((res) => {
          const response = res.data.data;
          setAccounts(response);
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
      <AddAccount
        title="Add Account"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        data={data}
      />
      <PageHeader
        pageName="Accounts"
        text="Add Account Details"
        handleClick={openModal}
        icon="post_add"
        isLoading={isLoading}
        resource
      />

      <div className="data__content">
        <div className="row">
          <TableComponent
            columns={columns}
            data={accounts}
            manage
            manageData={manageAccount}
            isSearchable
          />
        </div>
      </div>
    </>
  );
};

export default Accounts;
