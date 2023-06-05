import React, { useEffect, useState } from "react";
import PageHeader from "../../../template/includes/PageHeader";
import { collection } from "../../../app/http/controllers";
import TableComponent from "../../../template/components/TableComponent";
import Alert from "../../../app/services/alert";
import ManageTicketRequest from "./ManageTicketRequest";

const TicketRequests = () => {
  const columns = [
    {
      field: "code",
      header: "Code",
      isSortable: false,
    },
    {
      field: "name",
      header: "Member",
      isSortable: false,
      currency: false,
    },
    {
      field: "airline",
      header: "Preffered Airline",
      isSortable: false,
      currency: false,
    },
    {
      field: "route",
      header: "Route",
      isSortable: false,
      currency: false,
    },
    {
      field: "type",
      header: "Type",
      isSortable: false,
      currency: false,
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

  const [tickets, setTickets] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);

  const manageTicket = (ticket) => {
    setData(ticket);
    setIsUpdating(true);
    setShow(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setTickets(
        tickets.map((dept) => {
          if (dept.id === response?.data?.id) {
            return response?.data;
          }

          return dept;
        })
      );
    } else {
      setTickets([response?.data, ...tickets]);
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
  };

  useEffect(() => {
    try {
      collection("tickets/all")
        .then((res) => {
          setTickets(res.data.data);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <ManageTicketRequest
        title="Manage Ticket Request"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        data={data}
      />

      <PageHeader pageName="Ticket Requests" headerIcon="airplane_ticket" />

      <div className="data__content">
        <div className="row">
          <TableComponent
            columns={columns}
            data={tickets}
            manage
            manageData={manageTicket}
            isSearchable
          />
        </div>
      </div>
    </>
  );
};

export default TicketRequests;
