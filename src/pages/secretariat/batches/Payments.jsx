import React, { useEffect, useState } from "react";
import PageHeader from "../../../template/includes/PageHeader";
import TableComponent from "../../../template/components/TableComponent";
import { collection, destroy } from "../../../app/http/controllers";
import Alert from "../../../app/services/alert";
import { useNavigate } from "react-router-dom";

const Payments = () => {
  const [payments, setPayments] = useState([]);

  const navigate = useNavigate();

  const columns = [
    {
      field: "code",
      header: "Batch No.",
      isSortable: true,
      currency: false,
      status: false,
      approved_currency: false,
      date: false,
    },
    {
      field: "sub_budget_head_code",
      header: "Budget Code",
      isSortable: true,
      currency: false,
      status: false,
      approved_currency: false,
      date: false,
    },
    {
      field: "total_amount",
      header: "Amount",
      isSortable: false,
      currency: false,
      status: false,
      approved_currency: true,
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

  const printBatch = (payment) => {
    Alert.flash("Notice!!", "info", "You are about to leave this page!!").then(
      (result) => {
        if (result.isConfirmed) {
          navigate("/secretariat/print/payment", {
            state: {
              payment,
            },
          });
        }
      }
    );
  };

  const reversePayment = (payment) => {
    console.log(payment);

    Alert.flash(
      "Are you sure?",
      "warning",
      "You would not be able to revert this!!"
    ).then((result) => {
      if (result.isConfirmed) {
        try {
          destroy("batches", payment?.id)
            .then((res) => {
              const response = res.data;
              setPayments(payments.filter((pay) => pay?.id !== payment?.id));
              Alert.success("Reversed", response.message);
            })
            .catch((err) => console.log(err.message));
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  useEffect(() => {
    try {
      collection("batches")
        .then((res) => {
          setPayments(res.data.data);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <>
      <PageHeader pageName="Payments" />

      <div className="row">
        <TableComponent
          columns={columns}
          data={payments}
          print={printBatch}
          reverse={reversePayment}
        />
      </div>
    </>
  );
};

export default Payments;
