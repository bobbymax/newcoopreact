import React, { useEffect, useState } from "react";
import { alter, collection } from "../../../../app/http/controllers";
import PageHeader from "../../../../template/includes/PageHeader";
import TableComponent from "../../../../template/components/TableComponent";
import Alert from "../../../../app/services/alert";

const Ledgers = () => {
  const columns = [
    {
      field: "ac_no",
      header: "Account",
      isSortable: true,
    },
    {
      field: "bank",
      header: "Bank",
      isSortable: true,
    },
    {
      field: "amount",
      header: "Amount",
      isSortable: false,
      currency: true,
    },
    {
      field: "type",
      header: "Type",
      isSortable: true,
    },
    {
      field: "post_date",
      header: "Posted",
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

  const [collections, setCollections] = useState([]);

  const manageLedger = (ledger) => {
    Alert.flash(
      "Confirm Payment?",
      "info",
      "You are about to fulfill this payment!!"
    ).then((result) => {
      if (result.isConfirmed) {
        try {
          const requests = {
            status: "fulfilled",
          };
          alter("ledgers", ledger?.id, requests)
            .then((res) => {
              const response = res.data;
              setCollections(
                collections.map((collect) => {
                  if (collect.id === response.data.id) {
                    return response.data;
                  }

                  return collect;
                })
              );
              Alert.success("Fulfilled", response.message);
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
      collection("ledgers")
        .then((res) => {
          setCollections(res.data.data);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <PageHeader pageName="Ledgers" />

      <div className="data__content">
        <div className="row">
          <TableComponent
            columns={columns}
            data={collections}
            postPayment={manageLedger}
            isSearchable
          />
        </div>
      </div>
    </>
  );
};

export default Ledgers;
