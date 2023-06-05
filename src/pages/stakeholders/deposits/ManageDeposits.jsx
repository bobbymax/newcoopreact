import React, { useEffect, useState } from "react";
import { alter, collection } from "../../../app/http/controllers";
import TableComponent from "../../../template/components/TableComponent";
import PageHeader from "../../../template/includes/PageHeader";
import Alert from "../../../app/services/alert";

const ManageDeposits = () => {
  const [deposits, setDeposits] = useState([]);

  const columns = [
    {
      field: "trxRef",
      header: "Ref.",
      isSortable: true,
    },
    {
      field: "member",
      header: "Member",
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

  const handleConfirmation = (dept, status) => {
    // console.log(dept, status);
    Alert.flash(
      `${status === "verified" ? "Confirm" : "Cancel"} Payment`,
      `${status === "verified" ? "info" : "warning"}`,
      "You would not be able to revert this!!"
    ).then((result) => {
      if (result.isConfirmed) {
        try {
          const requests = {
            status,
            resolved: true,
          };

          alter("deposits", dept?.id, requests)
            .then((res) => {
              const response = res.data;
              setDeposits(
                deposits.map((dept) => {
                  if (dept.id === response.data.id) {
                    return response.data;
                  }

                  return dept;
                })
              );
              Alert.success("Updated", response.message);
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
      collection("collect/all/deposits")
        .then((res) => {
          const response = res.data.data;
          setDeposits(response);
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
      <PageHeader pageName="Manage Deposits" />
      <div className="data__content">
        <div className="row">
          <TableComponent
            columns={columns}
            data={deposits}
            deposit={handleConfirmation}
            isSearchable
          />
        </div>
      </div>
    </>
  );
};

export default ManageDeposits;
