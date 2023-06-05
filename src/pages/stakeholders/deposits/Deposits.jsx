import React, { useEffect, useState } from "react";
import Alert from "../../../app/services/alert";
import { collection, destroy } from "../../../app/http/controllers";
import PageHeader from "../../../template/includes/PageHeader";
import TableComponent from "../../../template/components/TableComponent";
import MakeDeposit from "./MakeDeposit";

const Deposits = () => {
  const [payments, setPayments] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    {
      field: "trxRef",
      header: "Transaction Ref.",
      isSortable: true,
    },
    {
      field: "amount",
      header: "Amount",
      isSortable: false,
      currency: true,
    },
    {
      field: "created_at",
      header: "Posted At",
      isSortable: false,
      date: true,
    },
    {
      field: "status",
      header: "Status",
      isSortable: false,
      status: true,
    },
  ];

  const managePayment = (cat) => {
    if (cat?.status !== "pending") {
      Alert.error("Denied!!", "This pending has been acted upon already!!");
    } else {
      Alert.flash(
        "Are You Sure?",
        "warning",
        "You would not be able to revert this!!"
      ).then((result) => {
        if (result.isConfirmed) {
          try {
            destroy("deposits", cat.id)
              .then((res) => {
                const response = res.data;

                setPayments(
                  payments.filter((payment) => payment.id !== response.data.id)
                );
                Alert.success("Removed!!", response.message);
              })
              .catch((err) => {
                console.log(err.message);
                Alert.error("Oops!!", err.response.data.message);
              });
          } catch (error) {
            console.log(error);
          }
        }
      });
    }
  };

  const openModal = () => {
    setShow(true);
    setIsLoading(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setPayments(
        payments.map((dept) => {
          if (dept.id === response?.data?.id) {
            return response?.data;
          }

          return dept;
        })
      );
    } else {
      setPayments([response?.data, ...payments]);
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
      collection("deposits")
        .then((res) => {
          const response = res.data.data;
          setPayments(response);
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
      <MakeDeposit
        title="Make Deposit"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        data={data}
      />

      <PageHeader
        pageName="Deposits"
        text="Make Deposit"
        handleClick={openModal}
        icon="post_add"
        isLoading={isLoading}
        resource
      />
      <div className="data__content">
        <div className="row">
          <TableComponent
            columns={columns}
            data={payments}
            manage
            manageData={managePayment}
            isSearchable
          />
        </div>
      </div>
    </>
  );
};

export default Deposits;
