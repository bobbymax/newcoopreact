/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Modal from "../../../../template/modals/Modal";
import { between, breakRangeFigures } from "../../../../app/helpers";
import { alter, store } from "../../../../app/http/controllers";
import {
  Button,
  CustomSelect,
  CustomSelectOptions,
  TextInput,
} from "../../../../template/components/Inputs";

const AddChartOfAccount = ({
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
    account_code_id: 0,
    code: 0,
    name: "",
    description: "",
  };

  const [state, setState] = useState(initialState);
  const [accCodes, setAccCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isBetween, setIsBetween] = useState(true);
  const [error, setError] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      name: state.name,
      description: state.description,
      code: state.code.toString(),
      account_code_id: state.account_code_id,
    };

    try {
      setLoading(true);
      if (isUpdating) {
        alter("chartOfAccounts", state.id, requests)
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
        store("chartOfAccounts", requests)
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
    setError("");
    handleClose();
  };

  useEffect(() => {
    if (state.code > 0 && state.account_code_id > 0) {
      const code = accCodes?.filter((cd) => state.account_code_id === cd.id)[0];

      const figures = breakRangeFigures(code?.range);
      setIsBetween(between(state.code, figures.start, figures.end));
    }
  }, [state.code, state.account_code_id]);

  useEffect(() => {
    setError(!isBetween ? "This code does not fall within range" : "");
  }, [isBetween]);

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        id: data?.id,
        account_code_id: parseInt(data?.account_code_id),
        code: parseInt(data?.code),
        name: data?.name,
        description: data?.description,
      });
    }
  }, [data]);

  useEffect(() => {
    if (dependencies !== undefined && dependencies?.codes?.length > 0) {
      const { codes } = dependencies;
      setAccCodes(codes);
    }
  }, [dependencies]);

  return (
    <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
      {error !== "" && (
        <div className="error_section">
          <p className="text-danger text-center m-3">{error}</p>
        </div>
      )}
      <form onSubmit={handleFormSubmit}>
        <div className="row">
          <div className="col-md-12">
            <CustomSelect
              label="Account Code"
              value={state.account_code_id}
              onChange={(e) =>
                setState({
                  ...state,
                  account_code_id: parseInt(e.target.value),
                })
              }
            >
              <CustomSelectOptions
                label="Select Account Code"
                value={0}
                disabled
              />
              {accCodes.map((acc) => (
                <CustomSelectOptions
                  key={acc?.id}
                  label={`${acc?.range} - ${acc?.name}`}
                  value={acc?.id}
                />
              ))}
            </CustomSelect>
          </div>
          <div className="col-md-5">
            <TextInput
              label="Code"
              type="number"
              value={state.code}
              onChange={(e) =>
                setState({ ...state, code: parseInt(e.target.value) })
              }
            />
          </div>
          <div className="col-md-7">
            <TextInput
              label="Name"
              value={state.name}
              onChange={(e) => setState({ ...state, name: e.target.value })}
              placeholder="Enter Name"
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
            <Button
              type="submit"
              text={`${isUpdating ? "Update" : "Add"} Chart of Account`}
              isLoading={loading}
              icon="add_circle"
              disabled={
                state.code < 1 ||
                state.name === "" ||
                state.account_code_id < 1 ||
                error !== ""
              }
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddChartOfAccount;
