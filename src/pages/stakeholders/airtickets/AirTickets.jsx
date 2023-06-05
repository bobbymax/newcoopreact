import React, { useEffect, useState } from "react";
import PageHeader from "../../../template/includes/PageHeader";
import Alert from "../../../app/services/alert";
import { collection, destroy } from "../../../app/http/controllers";
import TableComponent from "../../../template/components/TableComponent";
import MakeAirTicketRequest from "./MakeAirTicketRequest";

const AirTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const manageTicket = (ticket) => {
    if (ticket.status !== "pending") {
      Alert.error(
        "Denied!!",
        "This ticket has been viewed by the admin already"
      );
    } else {
      Alert.flash(
        "Are You Sure?",
        "warning",
        "You would not be able to revert this!!"
      ).then((result) => {
        if (result.isConfirmed) {
          try {
            destroy("airTickets", ticket.id)
              .then((res) => {
                const response = res.data;

                setTickets(
                  tickets.filter((payment) => payment.id !== response.data.id)
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
    handleClose();
  };

  const handleClose = () => {
    setShow(false);
    setIsLoading(false);
  };

  useEffect(() => {
    try {
      collection("airTickets")
        .then((res) => {
          const response = res.data.data;
          setTickets(response);
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
      <PageHeader
        pageName="Air Tickets"
        text="Make Request"
        handleClick={openModal}
        icon="post_add"
        isLoading={isLoading}
        resource
      />

      {show ? (
        <>
          <MakeAirTicketRequest
            handleClose={handleClose}
            handleSubmit={handleSubmit}
          />
        </>
      ) : (
        <div className="data__content">
          <div className="row">
            <TableComponent
              columns={columns}
              data={tickets}
              destroy={manageTicket}
              isSearchable
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AirTickets;
