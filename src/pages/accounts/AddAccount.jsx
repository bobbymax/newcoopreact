/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { alter, collection, store } from "../../app/http/controllers";
import Modal from "../../template/modals/Modal";
import {
  Button,
  CustomSelect,
  CustomSelectOptions,
  TextInput,
} from "../../template/components/Inputs";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { banks, formatSelectOptions } from "../../app/helpers";

const AddAccount = ({
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
    accountable_id: 0,
    bank_name: "",
    account_number: "",
    type: "organization",
  };

  const [state, setState] = useState(initialState);
  const [vendors, setVendors] = useState([]);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(false);

  const animated = makeAnimated();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      ...state,
      accountable_id: vendor?.value,
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
            setVendor(null);
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
            setVendor(null);
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
    setVendor(null);
    setLoading(false);
    handleClose();
  };

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        id: data?.id,
        user_id: data?.user_id,
        sub_budget_head_id: data?.sub_budget_head_id,
        title: data?.title,
        code: data?.code,
        duration: parseInt(data?.duration),
        description: data?.description ?? "",
        status: data?.status,
      });
    }
  }, [data]);

  useEffect(() => {
    try {
      collection("organizations")
        .then((res) => {
          const response = res.data.data;
          setVendors(formatSelectOptions(response, "id", "name"));
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
      <form onSubmit={handleFormSubmit}>
        <div className="row">
          <div className="col-md-12 mb-4">
            <p className="label-font">Vendor</p>
            <Select
              components={animated}
              options={vendors}
              placeholder="Select Vendor"
              value={vendor}
              onChange={setVendor}
              isSearchable
            />
          </div>
          <div className="col-md-12">
            <CustomSelect
              label="Bank"
              value={state.bank_name}
              onChange={(e) =>
                setState({
                  ...state,
                  bank_name: e.target.value,
                })
              }
            >
              <CustomSelectOptions label="Select Bank" value="" disabled />
              {banks?.map((bank, i) => (
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
          <div className="col-md-12 mt-4">
            <Button
              type="submit"
              text={`${isUpdating ? "Update" : "Add"} Account`}
              isLoading={loading}
              icon="add_circle"
              disabled={
                state.bank_name === "" ||
                state.account_number === "" ||
                vendor === null
              }
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddAccount;
