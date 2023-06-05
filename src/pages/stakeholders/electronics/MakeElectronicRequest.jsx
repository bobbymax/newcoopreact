/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { store } from "../../../app/http/controllers";
import Modal from "../../../template/modals/Modal";
import {
  Button,
  CustomSelect,
  CustomSelectOptions,
  TextInput,
} from "../../../template/components/Inputs";
import { useStateContext } from "../../../context/ContextProvider";
import { generateUniqueString, range } from "../../../app/helpers";

const MakeElectronicRequest = ({
  title = "",
  show = false,
  lg = false,
  handleClose = undefined,
  handleSubmit = undefined,
}) => {
  const initialState = {
    id: 0,
    user_id: 0,
    device: "",
    requested_amount: 0,
    duration: 0,
    status: "",
  };
  const { auth } = useStateContext();
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      ...state,
      user_id: auth.id,
      code: generateUniqueString("ELEC", 5),
    };

    try {
      setLoading(true);

      store("electronics", requests)
        .then((res) => {
          const response = res.data;

          handleSubmit({
            status: "Created!!",
            data: response.data,
            message: response.message,
            action: "store",
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

  return (
    <>
      <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
        <form onSubmit={handleFormSubmit}>
          <div className="row">
            <div className="col-md-12">
              <TextInput
                label="Item"
                value={state.device}
                onChange={(e) => setState({ ...state, device: e.target.value })}
                placeholder="Enter Item Description"
                multiline={2}
              />
            </div>
            <div className="col-md-12">
              <TextInput
                label="Requested Amount"
                value={state.requested_amount}
                onChange={(e) =>
                  setState({
                    ...state,
                    requested_amount: parseFloat(e.target.value),
                  })
                }
                placeholder="Enter Amount"
              />
            </div>

            <div className="col-md-12">
              <CustomSelect
                label="Duration"
                value={state.duration}
                onChange={(e) =>
                  setState({ ...state, duration: parseInt(e.target.value) })
                }
              >
                <CustomSelectOptions
                  label="Select Duration"
                  value={0}
                  disabled
                />

                {range(1, 24, 1).map((rr, i) => (
                  <CustomSelectOptions
                    key={i}
                    value={rr}
                    label={`${rr} Months`}
                  />
                ))}
              </CustomSelect>
            </div>

            <div className="col-md-12">
              <Button
                type="submit"
                text="Make Purchase Request"
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

export default MakeElectronicRequest;
