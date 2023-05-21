/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { alter, store } from "../../../app/http/controllers";
import {
  Button,
  CustomSelect,
  CustomSelectOptions,
  TextInput,
} from "../../../template/components/Inputs";
import Modal from "../../../template/modals/Modal";

const AddFund = ({
  title = "",
  show = false,
  lg = false,
  isUpdating = false,
  handleClose = undefined,
  handleSubmit = undefined,
  data = undefined,
  dependencies = undefined,
}) => {
  const initialState = {
    id: 0,
    sub_budget_head_id: 0,
    approved_amount: 0,
    booked_balance: 0,
    actual_balance: 0,
    year: 0,
  };

  const [state, setState] = useState(initialState);
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      ...state,
    };

    try {
      setLoading(true);
      if (isUpdating) {
        alter("funds", state.id, requests)
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
        store("funds", requests)
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
        sub_budget_head_id: data?.sub_budget_head_id,
        approved_amount: data?.approved_amount,
        booked_balance: data?.booked_balance,
        actual_balance: data?.actual_balance,
        year: data?.year,
      });
    }
  }, [data]);

  useEffect(() => {
    if (
      dependencies !== undefined &&
      dependencies?.subBudgetHeads?.length > 0
    ) {
      const { subBudgetHeads } = dependencies;
      setSubs(subBudgetHeads);
    }
  }, [dependencies]);

  useEffect(() => {
    if (state.approved_amount > 0) {
      setState({
        ...state,
        booked_balance: state.approved_amount,
        actual_balance: state.approved_amount,
      });
    } else {
      setState({
        ...state,
        booked_balance: 0,
        actual_balance: 0,
      });
    }
  }, [state.approved_amount]);

  return (
    <>
      <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
        <form onSubmit={handleFormSubmit}>
          <div className="row">
            <div className="col-md-12">
              <CustomSelect
                label="Budget Head"
                value={state.sub_budget_head_id}
                onChange={(e) =>
                  setState({ ...state, sub_budget_head_id: e.target.value })
                }
              >
                <CustomSelectOptions
                  value={0}
                  label="Select Sub Budget Head"
                  disabled
                />
                {subs.map((bud, i) => (
                  <CustomSelectOptions
                    key={i}
                    label={bud?.name}
                    value={bud?.id}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-12">
              <TextInput
                label="Approved Amount"
                value={state.approved_amount}
                onChange={(e) =>
                  setState({
                    ...state,
                    approved_amount: parseFloat(e.target.value),
                  })
                }
                placeholder="Enter Approved Amount"
              />
            </div>
            <div className="col-md-12">
              <TextInput
                label="Booked Balance"
                value={state.booked_balance}
                onChange={(e) =>
                  setState({
                    ...state,
                    booked_balance: parseFloat(e.target.value),
                  })
                }
                placeholder="Enter Booked Balance"
                disabled
              />
            </div>
            <div className="col-md-12">
              <TextInput
                label="Actual Balance"
                value={state.actual_balance}
                onChange={(e) =>
                  setState({
                    ...state,
                    actual_balance: parseFloat(e.target.value),
                  })
                }
                placeholder="Enter Actual Balance"
                disabled
              />
            </div>
            <div className="col-md-12">
              <TextInput
                label="Period"
                value={state.year}
                onChange={(e) =>
                  setState({
                    ...state,
                    year: parseInt(e.target.value),
                  })
                }
                placeholder="Enter Period"
              />
            </div>

            <div className="col-md-12">
              <Button
                type="submit"
                text={`${isUpdating ? "Update" : "Add"} Fund`}
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

export default AddFund;
