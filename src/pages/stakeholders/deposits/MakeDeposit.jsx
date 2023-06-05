/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { store } from "../../../app/http/controllers";
import { generateUniqueString } from "../../../app/helpers";
import { Button, TextInput } from "../../../template/components/Inputs";
import Modal from "../../../template/modals/Modal";
import { useStateContext } from "../../../context/ContextProvider";

const MakeDeposit = ({
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
    trxRef: "",
    amount: 0,
  };

  const { auth } = useStateContext();

  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      ...state,
      trxRef: generateUniqueString("TRX", 6),
      user_id: auth?.id,
    };

    try {
      setLoading(true);

      store("deposits", requests)
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

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        id: data?.id,
        trxRef: data?.trxRef,
        amount: parseFloat(data?.amount),
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
                label="Amount"
                value={state.amount}
                onChange={(e) =>
                  setState({ ...state, amount: parseFloat(e.target.value) })
                }
              />
            </div>

            <div className="col-md-12">
              <Button
                type="submit"
                text="Make Deposit"
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

export default MakeDeposit;
