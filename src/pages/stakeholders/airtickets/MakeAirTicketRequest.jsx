import React, { useEffect, useState } from "react";
import { collection, store } from "../../../app/http/controllers";
import { useStateContext } from "../../../context/ContextProvider";
import {
  Button,
  CustomSelect,
  CustomSelectOptions,
  TextInput,
} from "../../../template/components/Inputs";
import { generateUniqueString, locations } from "../../../app/helpers";
import AddPassenger from "./AddPassenger";
import Alert from "../../../app/services/alert";

const MakeAirTicketRequest = ({
  handleClose = undefined,
  handleSubmit = undefined,
}) => {
  const initialState = {
    airplane_id: 0,
    code: "",
    noOfPassengers: 0,
    type: "",
    route: "",
    from: "",
    to: "",
    period: "",
    date_to_takeoff: "",
    date_to_destination: "",
  };

  const { auth } = useStateContext();

  const [state, setState] = useState(initialState);
  const [airlines, setAirlines] = useState([]);
  const [show, setShow] = useState(false);
  const [passengers, setPassengers] = useState([]);
  const [isPassengerUpdating, setIsPassengerUpdating] = useState(false);
  const [passenger, setPassenger] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    setLoading(false);
    const body = {
      ...state,
      user_id: auth?.id,
      code: generateUniqueString("AIR", 5),
      noOfPassengers: passengers?.length,
      passengers,
    };

    // console.log(body);

    try {
      store("airTickets", body)
        .then((res) => {
          const response = res.data;

          handleSubmit({
            status: "Created!!",
            data: response?.data,
            message: response?.message,
            action: "store",
          });

          setState(initialState);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err.message);
          Alert.error("Oops!!", err.response.data.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const managePassenger = (passenger) => {
    setPassenger(passenger);
    setIsPassengerUpdating(true);
    setShow(true);
  };

  const handlePassengerSubmit = (response) => {
    if (response?.action === "alter") {
      setPassengers(
        passengers.map((passenger) => {
          if (passenger.id === response?.data?.id) {
            return response?.data;
          }

          return passenger;
        })
      );
    } else {
      const count = passengers.length;

      const dats = {
        ...response.data,
        id: count + 1,
      };

      setPassengers([dats, ...passengers]);
    }

    handleFormClose();
  };

  const handleModalClose = () => {
    handleFormClose();
    setState(initialState);
    handleClose();
  };

  const handleFormClose = () => {
    setShow(false);
    setPassenger(null);
    setIsPassengerUpdating(false);
  };

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
      <AddPassenger
        title="Add Passenger"
        show={show}
        handleClose={handleFormClose}
        handleSubmit={handlePassengerSubmit}
        isUpdating={isPassengerUpdating}
        data={passenger}
      />
      <form onSubmit={handleFormSubmit}>
        <div className="air__ticket card__white">
          <div className="row">
            <div className="col-md-4">
              <CustomSelect
                label="Type"
                value={state.type}
                onChange={(e) => setState({ ...state, type: e.target.value })}
              >
                <CustomSelectOptions
                  label="Select Ticket Type"
                  value=""
                  disabled
                />

                {["local", "international"].map((typ, i) => (
                  <CustomSelectOptions
                    label={typ?.toUpperCase()}
                    value={typ}
                    key={i}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-4">
              <CustomSelect
                label="Route"
                value={state.route}
                onChange={(e) => setState({ ...state, route: e.target.value })}
              >
                <CustomSelectOptions
                  label="Select Ticket Route"
                  value=""
                  disabled
                />

                {[
                  { key: "one-way", label: "One Way" },
                  { key: "return", label: "Return" },
                ].map((route, i) => (
                  <CustomSelectOptions
                    label={route.label}
                    value={route.key}
                    key={i}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-4">
              <CustomSelect
                label="Preffered Airline"
                value={state.airplane_id}
                onChange={(e) =>
                  setState({ ...state, airplane_id: parseInt(e.target.value) })
                }
              >
                <CustomSelectOptions
                  label="Select Preffered Airline"
                  value={0}
                  disabled
                />

                {airlines.map((airline, i) => (
                  <CustomSelectOptions
                    label={airline.name}
                    value={airline.id}
                    key={i}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-4">
              <CustomSelect
                label="From"
                value={state.from}
                onChange={(e) => setState({ ...state, from: e.target.value })}
              >
                <CustomSelectOptions
                  label="Select Takeoff Location"
                  value=""
                  disabled
                />

                {locations.map((location, i) => (
                  <CustomSelectOptions
                    label={location}
                    value={location}
                    key={i}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-4">
              <CustomSelect
                label="To"
                value={state.to}
                onChange={(e) => setState({ ...state, to: e.target.value })}
              >
                <CustomSelectOptions
                  label="Select Destination"
                  value=""
                  disabled
                />

                {locations.map(
                  (location, i) =>
                    state.from !== location && (
                      <CustomSelectOptions
                        label={location}
                        value={location}
                        key={i}
                      />
                    )
                )}
              </CustomSelect>
            </div>
            <div className="col-md-4">
              <CustomSelect
                label="Preffered Period"
                value={state.period}
                onChange={(e) => setState({ ...state, period: e.target.value })}
              >
                <CustomSelectOptions label="Select Period" value="" disabled />

                {["morning", "afternoon", "evening"].map((typ, i) => (
                  <CustomSelectOptions
                    label={typ?.toUpperCase()}
                    value={typ}
                    key={i}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-6">
              <TextInput
                label="Departure"
                type="date"
                value={state.date_to_takeoff}
                onChange={(e) =>
                  setState({ ...state, date_to_takeoff: e.target.value })
                }
              />
            </div>
            <div className="col-md-6">
              <TextInput
                label="Return"
                type="date"
                value={state.date_to_destination}
                onChange={(e) =>
                  setState({ ...state, date_to_destination: e.target.value })
                }
                disabled={state.route === "one-way"}
              />
            </div>

            <div className="col-md-12">
              <div className="passenger__section mt-4">
                <div className="passenger__bttn__grp">
                  <h3>Passengers</h3>
                  <button
                    type="button"
                    className="group__bttn"
                    onClick={() => setShow(true)}
                  >
                    <span className="material-icons-sharp">person_add</span>
                  </button>
                </div>

                <div className="passengers__bdy mt-4">
                  <div className="row">
                    <div className="col-md-12">
                      {passengers?.length > 0 ? (
                        passengers.map((pass, i) => (
                          <div className="pass__item mb-3" key={i}>
                            <h3>{pass.name}</h3>
                            <h3>{pass.email}</h3>
                            <h3>{pass.mobile}</h3>
                            <div className="line__manage">
                              <button
                                type="button"
                                className="group__bttn"
                                onClick={() => managePassenger(pass)}
                              >
                                <span className="material-icons-sharp">
                                  edit
                                </span>
                              </button>
                              {/* <button
                                type="button"
                                className="group__bttn bg__danger"
                              >
                                <span className="material-icons-sharp">
                                  delete
                                </span>
                              </button> */}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="no__display">
                          <p className="text-danger">
                            No Passenger has been added
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12 mt-4">
              <Button
                type="submit"
                text="Make Ticket Request"
                isLoading={loading}
                icon="add_circle"
              />
              <Button
                text="Close Request"
                isLoading={loading}
                icon="cancel"
                variant="danger"
                handleClick={handleModalClose}
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default MakeAirTicketRequest;
