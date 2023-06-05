/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { alter, store } from "../../../app/http/controllers";
import Modal from "../../../template/modals/Modal";
import {
  Button,
  CustomSelect,
  CustomSelectOptions,
  TextInput,
} from "../../../template/components/Inputs";
import { generateUniqueString } from "../../../app/helpers";

const AddVendor = ({
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
    reg_no: "",
    tin_no: "",
    name: "",
    code: "",
    email: "",
    mobile: "",
    type: "",
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
      if (isUpdating) {
        alter("organizations", state.id, requests)
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
        store("organizations", requests)
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
    if (state.name !== "" && state.reg_no !== "" && state.tin_no !== "") {
      setState({
        ...state,
        code: generateUniqueString("PY", 5),
      });
    }
  }, [state.name, state.reg_no, state.tin_no]);

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        id: data?.id,
        reg_no: data?.reg_no,
        tin_no: data?.tin_no,
        name: data?.name,
        code: data?.code,
        email: data?.email,
        mobile: data?.mobile,
        type: data?.type,
        status: data?.status,
      });
    }
  }, [data]);

  return (
    <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
      <form onSubmit={handleFormSubmit}>
        <div className="row">
          <div className="col-md-6">
            <TextInput
              label="RC Number"
              value={state.reg_no}
              onChange={(e) => setState({ ...state, reg_no: e.target.value })}
              placeholder="RC Number"
            />
          </div>
          <div className="col-md-6">
            <TextInput
              label="Tin Number"
              value={state.tin_no}
              onChange={(e) => setState({ ...state, tin_no: e.target.value })}
              placeholder="Enter Tin Number"
            />
          </div>
          <div className="col-md-12">
            <TextInput
              label="Vendor Name"
              value={state.name}
              onChange={(e) => setState({ ...state, name: e.target.value })}
              placeholder="Vendor Name"
            />
          </div>
          <div className="col-md-8">
            <TextInput
              label="Email"
              value={state.email}
              onChange={(e) => setState({ ...state, email: e.target.value })}
              placeholder="Enter Email Address"
            />
          </div>

          <div className="col-md-4">
            <TextInput
              label="Payment Code"
              value={state.code}
              onChange={(e) => setState({ ...state, code: e.target.value })}
              placeholder="Payment Code"
              disabled
            />
          </div>
          <div className="col-md-12">
            <TextInput
              label="Vendor Mobile"
              value={state.mobile}
              onChange={(e) => setState({ ...state, mobile: e.target.value })}
              placeholder="Mobile Number"
            />
          </div>
          <div className="col-md-6">
            <CustomSelect
              label="Type"
              value={state.type}
              onChange={(e) => setState({ ...state, type: e.target.value })}
            >
              <CustomSelectOptions
                label="Select Vendor Type"
                value=""
                disabled
              />
              {["vendor", "self", "support"].map((typ, i) => (
                <CustomSelectOptions
                  label={typ?.toLocaleUpperCase()}
                  value={typ}
                  key={i}
                />
              ))}
            </CustomSelect>
          </div>
          <div className="col-md-6">
            <CustomSelect
              label="Status"
              value={state.status}
              onChange={(e) => setState({ ...state, status: e.target.value })}
            >
              <CustomSelectOptions label="Select Status" value="" disabled />
              {["pending", "verified"].map((stat, i) => (
                <CustomSelectOptions
                  label={stat?.toLocaleUpperCase()}
                  value={stat}
                  key={i}
                />
              ))}
            </CustomSelect>
          </div>

          <div className="col-md-12 mt-4">
            <Button
              type="submit"
              text={`${isUpdating ? "Update" : "Add"} Vendor`}
              isLoading={loading}
              icon="add_circle"
              disabled={
                state.name === "" || state.reg_no === "" || state.tin_no === ""
              }
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddVendor;
