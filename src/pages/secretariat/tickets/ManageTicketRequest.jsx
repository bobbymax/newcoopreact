/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { alter, collection } from "../../../app/http/controllers";
import {
  Button,
  CustomSelect,
  CustomSelectOptions,
  TextInput,
} from "../../../template/components/Inputs";
import Modal from "../../../template/modals/Modal";

const ManageTicketRequest = ({
  title = "",
  show = false,
  lg = false,
  handleClose = undefined,
  handleSubmit = undefined,
  data = undefined,
}) => {
  const initialState = {
    id: 0,
    airplane_id: 0,
    amount: 0,
    status: "",
  };

  const [state, setState] = useState(initialState);
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      ...state,
    };

    try {
      setLoading(true);
      alter("airTickets", state.id, requests)
        .then((res) => {
          const response = res.data;

          handleSubmit({
            status: "Updated!!",
            data: response.data,
            message: response.message,
            action: "alter",
          });
          setState(initialState);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err.message);
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalClose = () => {
    setState(initialState);
    handleClose();
  };

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        id: data?.id,
        airplane_id: data?.airplane_id,
        amount: parseFloat(data?.amount),
        status: data?.status === "pending" ? "" : data?.status,
      });
    }
  }, [data]);

  useEffect(() => {
    try {
      collection("airplanes")
        .then((res) => {
          setAirlines(res.data.data);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
        <form onSubmit={handleFormSubmit}>
          <div className="row">
            <div className="col-md-12">
              <TextInput
                label="Amount"
                value={state.amount}
                onChange={(e) => setState({ ...state, amount: e.target.value })}
                placeholder="Enter Amount"
              />
            </div>
            <div className="col-md-12">
              <CustomSelect
                label="Airline"
                value={state.airplane_id}
                onChange={(e) =>
                  setState({ ...state, airplane_id: parseInt(e.target.value) })
                }
              >
                <CustomSelectOptions
                  label="Select Airline"
                  value={0}
                  disabled
                />

                {airlines.map((airline) => (
                  <CustomSelectOptions
                    key={airline.id}
                    value={airline.id}
                    label={airline.name}
                  />
                ))}
              </CustomSelect>
            </div>

            <div className="col-md-12">
              <CustomSelect
                label="Status"
                value={state.status}
                onChange={(e) => setState({ ...state, status: e.target.value })}
              >
                <CustomSelectOptions label="Select Status" value="" disabled />

                {["approved", "denied"].map((status, i) => (
                  <CustomSelectOptions
                    key={i}
                    value={status}
                    label={status?.toUpperCase()}
                  />
                ))}
              </CustomSelect>
            </div>

            <div className="col-md-12">
              <Button
                type="submit"
                text="Update Request"
                isLoading={loading}
                icon="add_circle"
              />
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ManageTicketRequest;
