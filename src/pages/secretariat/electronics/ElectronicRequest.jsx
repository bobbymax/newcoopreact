/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { alter } from "../../../app/http/controllers";
import Modal from "../../../template/modals/Modal";
import {
  Button,
  CustomSelect,
  CustomSelectOptions,
  TextInput,
} from "../../../template/components/Inputs";
import { range } from "../../../app/helpers";

const ElectronicRequest = ({
  title = "",
  show = false,
  lg = false,
  handleClose = undefined,
  handleSubmit = undefined,
  data = undefined,
}) => {
  const initialState = {
    id: 0,
    requisitor: "",
    user_id: 0,
    device: "",
    requested_amount: 0,
    approved_amount: 0,
    duration: 0,
    remark: "",
    status: "",
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
      alter("electronics", state.id, requests)
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
    if (state.requested_amount > 0 && state.approved_amount < 1) {
      setState({
        ...state,
        approved_amount: state.requested_amount,
      });
    }
  }, [state.requested_amount, state.approved_amount]);

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        id: data?.id,
        requisitor: data?.requisitor,
        user_id: parseInt(data?.user_id),
        device: data?.device,
        requested_amount: parseFloat(data?.requested_amount),
        approved_amount: parseFloat(data?.approved_amount),
        duration: parseInt(data?.duration),
        remark: data?.remark ?? "",
        status: data?.status,
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
                label="Beneficiary"
                value={state.requisitor}
                onChange={(e) =>
                  setState({ ...state, requisitor: e.target.value })
                }
                placeholder="Enter Beneficiary"
                disabled
              />
            </div>
            <div className="col-md-12">
              <TextInput
                label="Item"
                value={state.device}
                onChange={(e) => setState({ ...state, device: e.target.value })}
                placeholder="Enter Item"
                disabled
              />
            </div>

            <div className="col-md-12">
              <TextInput
                label="Requested Amount"
                value={state.requested_amount}
                onChange={(e) =>
                  setState({ ...state, requested_amount: e.target.value })
                }
                placeholder="Enter Amount"
                disabled
              />
            </div>

            <div className="col-md-12">
              <TextInput
                label="Approved Amount"
                value={state.approved_amount}
                onChange={(e) =>
                  setState({ ...state, approved_amount: e.target.value })
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
              <CustomSelect
                label="Status"
                value={state.status}
                onChange={(e) => setState({ ...state, status: e.target.value })}
              >
                <CustomSelectOptions
                  label="Select Duration"
                  value="pending"
                  disabled
                />

                {["approved", "denied"].map((status, i) => (
                  <CustomSelectOptions
                    key={i}
                    value={status}
                    label={status?.toUpperCase()}
                  />
                ))}
              </CustomSelect>
            </div>

            {state.status === "denied" && (
              <div className="col-md-12">
                <TextInput
                  label="Remark"
                  value={state.remark}
                  onChange={(e) =>
                    setState({ ...state, remark: e.target.value })
                  }
                  placeholder="Enter Remark"
                  multiline={3}
                />
              </div>
            )}

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

export default ElectronicRequest;
