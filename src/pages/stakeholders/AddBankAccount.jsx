/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";
import { alter, destroy, store } from "../../app/http/controllers";
import Modal from "../../template/modals/Modal";
import {
  Button,
  CustomSelect,
  CustomSelectOptions,
  TextInput,
} from "../../template/components/Inputs";
import { banks } from "../../app/helpers";
import Alert from "../../app/services/alert";

const AddBankAccount = ({
  title = "",
  show = false,
  lg = false,
  isUpdating = false,
  handleClose = undefined,
  handleSubmit = undefined,
  handleDestroy = undefined,
  data = undefined,
}) => {
  const { auth } = useStateContext();

  const initialState = {
    id: 0,
    bank_name: "",
    account_number: "",
    type: "member",
  };
  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      ...state,
      accountable_id: auth?.id,
    };

    try {
      setLoading(true);
      if (isUpdating) {
        alter("accounts", state.id, requests)
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
        store("accounts", requests)
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

  const destroyAccount = () => {
    Alert.flash(
      "Are you sure?",
      "warning",
      "You would not be able to revert this!!"
    ).then((result) => {
      if (result.isConfirmed) {
        try {
          destroy("accounts", state.id)
            .then((res) => {
              const response = res.data;
              handleDestroy({
                status: "Deleted!!",
                data: state.id,
                message: response.message,
                action: "destroy",
              });
              setState(initialState);
              setLoading(false);
            })
            .catch((err) => console.log(err.message));
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        id: data?.id,
        bank_name: data?.bank_name,
        account_number: data?.account_number,
      });
    }
  }, [data]);

  return (
    <>
      <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
        <form onSubmit={handleFormSubmit}>
          <div className="row">
            <div className="col-md-12">
              <CustomSelect
                label="Bank"
                value={state.bank_name}
                onChange={(e) =>
                  setState({ ...state, bank_name: e.target.value })
                }
              >
                <CustomSelectOptions label="Select Bank" value="" disabled />
                {banks.map((bank, i) => (
                  <CustomSelectOptions key={i} value={bank} label={bank} />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-12">
              <TextInput
                label="Account Number"
                value={state.account_number}
                onChange={(e) =>
                  setState({ ...state, account_number: e.target.value })
                }
                placeholder="Enter Account Number"
              />
            </div>

            <div className="col-md-12">
              <Button
                type="submit"
                text={`${isUpdating ? "Update" : "Add"} Account`}
                isLoading={loading}
                icon="add_circle"
              />
            </div>
            {isUpdating && (
              <div className="col-md-12">
                <Button
                  type="button"
                  text="Delete Account"
                  isLoading={loading}
                  icon="add_circle"
                  variant="danger"
                  handleClick={destroyAccount}
                />
              </div>
            )}
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddBankAccount;
