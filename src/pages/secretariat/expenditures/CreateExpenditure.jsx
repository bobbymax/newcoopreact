/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  CustomSelect,
  CustomSelectOptions,
  TextInput,
} from "../../../template/components/Inputs";
import { fetch, store } from "../../../app/http/controllers";
import { generateUniqueString } from "../../../app/helpers";

const CreateExpenditure = ({
  dependencies = undefined,
  handleSubmit = undefined,
  handleClose = undefined,
}) => {
  const initialState = {
    sub_budget_head_id: 0,
    loan_id: 0,
    member_id: 0,
    trxRef: "",
    beneficiary: "",
    description: "",
    amount: 0,
    booked_balance: 0,
    new_balance: 0,
    type: "",
    category: "",
    method: "",
    payment_type: "",
    code: "",
    error: "",
  };

  const [state, setState] = useState(initialState);
  const [subs, setSubs] = useState([]);
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [methods, setMethods] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loan, setLoan] = useState(null);

  const makeExpenditure = (e) => {
    e.preventDefault();

    const requests = {
      ...state,
      means: state.method,
      trxRef: generateUniqueString("LN", 6),
    };

    try {
      store("expenditures", requests)
        .then((res) => {
          const response = res.data;
          handleSubmit({
            data: response.data,
            status: "Created",
            message: response.message,
          });

          closeForm();
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  };

  const closeForm = () => {
    setState(initialState);
    handleClose();
  };

  useEffect(() => {
    if (state.code?.length >= 10) {
      fetch("codes/loans", state.code)
        .then((res) => {
          const loan = res.data.data;
          setLoan(loan);
        })
        .catch((err) => console.log(err.response.data.message));
    }
  }, [state.code]);

  useEffect(() => {
    if (loan !== null) {
      const sub = subs.filter((sub) => sub.id === loan?.sub_budget_head_id)[0];
      setState({
        ...state,
        amount: parseFloat(loan?.approved_amount),
        description: loan?.reason,
        beneficiary: loan?.member,
        loan_id: loan?.id,
        member_id: loan?.member_id,
        sub_budget_head_id: sub?.id,
        booked_balance: parseFloat(sub?.booked_balance),
      });
    }
  }, [loan]);

  useEffect(() => {
    if (state.sub_budget_head_id > 0) {
      const sub = subs.filter((sub) => sub.id === state.sub_budget_head_id)[0];
      setState({
        ...state,
        booked_balance: parseFloat(sub?.booked_balance),
      });
    }
  }, [state.sub_budget_head_id]);

  useEffect(() => {
    if (
      dependencies !== undefined &&
      dependencies?.budgetHeads &&
      dependencies?.types &&
      dependencies?.categories &&
      dependencies?.methods &&
      dependencies?.payments
    ) {
      const { budgetHeads, types, categories, methods, payments } =
        dependencies;

      setSubs(budgetHeads);
      setTypes(types);
      setCategories(categories);
      setMethods(methods);
      setPayments(payments);
    }
  }, [dependencies]);

  useEffect(() => {
    if (
      parseFloat(state.amount) > 0 &&
      parseFloat(state.booked_balance) > 0 &&
      state.type !== ""
    ) {
      const diff =
        state.type === "outflow"
          ? parseFloat(state.booked_balance) - parseFloat(state.amount)
          : parseFloat(state.booked_balance) + parseFloat(state.amount);
      setState({
        ...state,
        new_balance: diff > 0 ? diff : 0,
        error:
          diff < 0
            ? "You have entered an amount larger than the available balance"
            : "",
      });
    } else {
      setState({
        ...state,
        new_balance: 0,
        error: "",
      });
    }
  }, [state.amount, state.booked_balance, state.type]);

  return (
    <>
      <div className="form__card">
        <div className="form__card__title">
          <span className="material-icons-sharp">store</span>
          <h3>Make Expenditure</h3>
          <p className="text-danger">{state.error}</p>
        </div>
        <form onSubmit={makeExpenditure}>
          <div className="row">
            <div className="col-md-3">
              <CustomSelect
                label="Cash Flow"
                value={state.type}
                onChange={(e) =>
                  setState({
                    ...state,
                    type: e.target.value,
                  })
                }
              >
                <CustomSelectOptions
                  label="Choose Cash Flow"
                  value=""
                  disabled
                />

                {types.map((typ, i) => (
                  <CustomSelectOptions
                    label={typ.label}
                    value={typ.key}
                    key={i}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-3">
              <CustomSelect
                label="Category"
                value={state.category}
                onChange={(e) =>
                  setState({
                    ...state,
                    category: e.target.value,
                  })
                }
              >
                <CustomSelectOptions
                  label="Choose Category"
                  value=""
                  disabled
                />

                {categories.map((cat, i) => (
                  <CustomSelectOptions
                    label={cat.label}
                    value={cat.key}
                    key={i}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-3">
              <CustomSelect
                label="Payment Type"
                value={state.payment_type}
                onChange={(e) =>
                  setState({
                    ...state,
                    payment_type: e.target.value,
                  })
                }
              >
                <CustomSelectOptions
                  label="Choose Payment Type"
                  value=""
                  disabled
                />

                {payments.map((pay, i) => (
                  <CustomSelectOptions
                    label={pay.label}
                    value={pay.key}
                    key={i}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-3">
              <CustomSelect
                label="Payment Methods"
                value={state.method}
                onChange={(e) =>
                  setState({
                    ...state,
                    method: e.target.value,
                  })
                }
              >
                <CustomSelectOptions
                  label="Choose Payment Method"
                  value=""
                  disabled
                />

                {methods.map((meth, i) => (
                  <CustomSelectOptions
                    label={meth.label}
                    value={meth.key}
                    key={i}
                  />
                ))}
              </CustomSelect>
            </div>

            <div className="col-md-7">
              <CustomSelect
                label="Budget Head"
                value={state.sub_budget_head_id}
                onChange={(e) =>
                  setState({
                    ...state,
                    sub_budget_head_id: parseInt(e.target.value),
                  })
                }
              >
                <CustomSelectOptions
                  label="Choose Budget Head"
                  value={0}
                  disabled
                />

                {subs.map((sub, i) => (
                  <CustomSelectOptions
                    label={sub.name}
                    value={sub.id}
                    key={i}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-5">
              <TextInput
                label="Reference Code"
                value={state.code}
                onChange={(e) => setState({ ...state, code: e.target.value })}
                placeholder="Enter Ref. Code"
                disabled={state.category !== "loan"}
              />
            </div>

            <div className="col-md-4">
              <TextInput
                label="Amount"
                value={state.amount}
                onChange={(e) => setState({ ...state, amount: e.target.value })}
                placeholder="Enter Amount"
              />
            </div>
            <div className="col-md-4">
              <TextInput
                label="Booked Balance"
                value={state.booked_balance}
                onChange={(e) =>
                  setState({
                    ...state,
                    booked_balance: e.target.value,
                  })
                }
                placeholder="Current Balance"
                disabled
              />
            </div>
            <div className="col-md-4">
              <TextInput
                label="Amount"
                value={state.new_balance}
                onChange={(e) =>
                  setState({
                    ...state,
                    new_balance: e.target.value,
                  })
                }
                placeholder="New Balance"
                disabled
              />
            </div>
            <div className="col-md-12">
              <TextInput
                label="Beneficiary"
                value={state.beneficiary}
                onChange={(e) =>
                  setState({ ...state, beneficiary: e.target.value })
                }
                placeholder="Enter Beneficiary"
              />
            </div>
            <div className="col-md-12">
              <TextInput
                label="Description"
                value={state.description}
                onChange={(e) =>
                  setState({ ...state, description: e.target.value })
                }
                multiline={3}
                placeholder="Enter Description"
              />
            </div>
            <div className="col-md-12">
              <div className="custom__btn__group">
                <button
                  type="submit"
                  className="side__button form__bttn bg__primary"
                >
                  submit
                </button>
                <button
                  type="button"
                  className="side__button form__bttn bg__danger"
                  onClick={() => closeForm()}
                >
                  cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateExpenditure;
