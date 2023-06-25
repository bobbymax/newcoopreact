/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { alter, fetch, store } from "../../../app/http/controllers";
import Modal from "../../../template/modals/Modal";
import { Button, CustomSelect, CustomSelectOptions, TextInput } from "../../../template/components/Inputs";
import { useStateContext } from "../../../context/ContextProvider";
import { generateUniqueString } from "../../../app/helpers";

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

  const {auth} = useStateContext()

  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      ...state,
      user_id: auth?.id,
      code: generateUniqueString("LIQ", 5),
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
    if (state.type === "complete") {
      setState({
        ...state,
        amount: state.loan_amount
      })
    } else {
      setState({
        ...state,
        amount: 0
      })
    }
  }, [state.type])

  useEffect(() => {
    const diff = state.loan_amount - state.amount

    setState({
      ...state,
      balance: diff >= 0 ? diff : 0  
    })

  }, [state.loan_amount, state.amount])

  useEffect(() => {
    if (state.loan_code?.length >= 10) {
      try {
        fetch("codes/loans", state.loan_code)
        .then(res => {
          const response = res.data.data
          setState({
            ...state,
            loan_id: response?.id,
            loan_amount: parseFloat(response?.approved_amount),
          })
        })
        .catch(err => console.log(err.message))
      } catch (error) {
        console.log(error)
      }
    }
  }, [state.loan_code])

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
                label="Loan Ref Code"
                value={state.loan_code}
                onChange={(e) => setState({ ...state, loan_code: e.target.value })}
                placeholder="Enter Loan Ref Code"
              />
            </div>
            <div className="col-md-12">
              <TextInput
                label="Loan Amount"
                value={state.loan_amount}
                onChange={(e) => setState({ ...state, loan_amount: e.target.value })}
                placeholder="Enter Loan Amount"
                disabled
              />
            </div>
            <div className="col-md-12">
              <CustomSelect
                label="Type"
                value={state.type}
                onChange={e => setState({...state, type: e.target.value})}
              >
                <CustomSelectOptions 
                  value=""
                  label="Select Luquidation Type"
                  disabled
                />
                {["partial", "complete"].map((typ, i) => (
                  <CustomSelectOptions 
                    key={i}
                    label={typ?.toUpperCase()}
                    value={typ}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-12">
              <TextInput
                label="Amount"
                value={state.amount}
                onChange={(e) => setState({ ...state, amount: e.target.value })}
                placeholder="Enter Amount"
              />
            </div>
            <div className="col-md-12">
              <TextInput
                label="New Balance"
                value={state.balance}
                onChange={(e) => setState({ ...state, balance: e.target.value })}
                placeholder="Enter New Balance"
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
