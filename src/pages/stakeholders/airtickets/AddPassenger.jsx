/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Modal from "../../../template/modals/Modal";
import {
  Button,
  CustomSelect,
  CustomSelectOptions,
  TextInput,
} from "../../../template/components/Inputs";

const AddPassenger = ({
  title = "",
  show = false,
  lg = false,
  isUpdating = false,
  handleClose = undefined,
  handleSubmit = undefined,
  data = undefined,
}) => {
  const initialPassengerState = {
    id: 0,
    name: "",
    email: "",
    mobile: "",
    type: "",
  };

  const [passengerState, setPassengerState] = useState(initialPassengerState);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      ...passengerState,
    };

    try {
      setLoading(true);
      if (isUpdating) {
        handleSubmit({
          data: requests,
          action: "alter",
        });
      } else {
        handleSubmit({
          data: requests,
          action: "store",
        });
      }
      setLoading(false);
      setPassengerState(initialPassengerState);
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalClose = () => {
    setPassengerState(initialPassengerState);
    setLoading(false);
    handleClose();
  };

  useEffect(() => {
    if (data !== undefined) {
      setPassengerState({
        ...passengerState,
        id: data?.id,
        name: data?.name,
        email: data?.email,
        mobile: data?.mobile,
        type: data?.type,
      });
    }
  }, [data]);

  return (
    <>
      <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
        <form onSubmit={handleFormSubmit}>
          <div className="row">
            <div className="col-md-12">
              <TextInput
                label="Name"
                value={passengerState.name}
                onChange={(e) =>
                  setPassengerState({ ...passengerState, name: e.target.value })
                }
                placeholder="Enter Name"
              />
            </div>
            <div className="col-md-12">
              <TextInput
                label="Email"
                type="email"
                value={passengerState.email}
                onChange={(e) =>
                  setPassengerState({
                    ...passengerState,
                    email: e.target.value,
                  })
                }
                placeholder="Enter Email Address"
              />
            </div>
            <div className="col-md-12">
              <TextInput
                label="Mobile"
                value={passengerState.mobile}
                onChange={(e) =>
                  setPassengerState({
                    ...passengerState,
                    mobile: e.target.value,
                  })
                }
                placeholder="Enter Mobile Number"
              />
            </div>

            <div className="col-md-12">
              <CustomSelect
                label="Type"
                value={passengerState.type}
                onChange={(e) =>
                  setPassengerState({ ...passengerState, type: e.target.value })
                }
              >
                <CustomSelectOptions
                  label="Select Passenger Type"
                  value=""
                  disabled
                />
                {["adult", "child", "infant"].map((type, i) => (
                  <CustomSelectOptions
                    label={type?.toUpperCase()}
                    value={type}
                    key={i}
                  />
                ))}
              </CustomSelect>
            </div>

            <div className="col-md-12">
              <Button
                type="submit"
                text={`${isUpdating ? "Update" : "Add"} Passenger`}
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

export default AddPassenger;
