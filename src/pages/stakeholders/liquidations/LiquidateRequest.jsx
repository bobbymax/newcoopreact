/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { alter, store } from "../../../app/http/controllers";
import Modal from "../../../template/modals/Modal";
import { Button, TextInput } from "../../../template/components/Inputs";

const LiquidateRequest = ({
  title = "",
  show = false,
  lg = false,
  isUpdating = false,
  handleClose = undefined,
  handleSubmit = undefined,
  data = undefined,
}) => {
  const initialState = {
    id: 0,
    user_id: 0,
    loan_id: 0,
    code: "",
    loan_code: "",
    amount: 0,
    type: "",
    loan_amount: 0,
    balance: 0,
  };

  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      ...state,
    };

    try {
      setLoading(true);
      if (isUpdating) {
        alter("liquidations", state.id, requests)
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
      } else {
        store("liquidations", requests)
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
      }
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
        name: data?.name,
        label: data?.label,
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
                value={state.name}
                onChange={(e) => setState({ ...state, name: e.target.value })}
                placeholder="Enter Name"
              />
            </div>
            <div className="col-md-12">
              <TextInput
                label="Label"
                value={state.label}
                onChange={(e) => setState({ ...state, label: e.target.value })}
                placeholder="Enter Label"
                disabled
              />
            </div>

            <div className="col-md-12">
              <Button
                type="submit"
                text={`${isUpdating ? "Update Request" : "Liquidate Loan"}`}
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

export default LiquidateRequest;
