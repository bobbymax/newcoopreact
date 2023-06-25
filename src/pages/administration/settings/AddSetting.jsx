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
import { groups, inputTypes } from "../../../app/helpers";

const AddSetting = ({
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
    key: "",
    display_name: "",
    input_type: "",
    group: "",
    details: "",
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
        alter("settings", state.id, requests)
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
        store("settings", requests)
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
        key: data?.key,
        display_name: data?.display_name,
        input_type: data?.input_type,
        group: data?.group,
        details: data?.details,
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
                label="Key"
                value={state.key}
                onChange={(e) => setState({ ...state, key: e.target.value })}
                placeholder="Enter Config Key"
              />
            </div>
            <div className="col-md-12">
              <TextInput
                label="Display Name"
                value={state.display_name}
                onChange={(e) =>
                  setState({ ...state, display_name: e.target.value })
                }
                placeholder="Enter Config Display Name"
              />
            </div>
            <div className="col-md-12">
              <CustomSelect
                label="Input Type"
                value={state.input_type}
                onChange={(e) =>
                  setState({ ...state, input_type: e.target.value })
                }
              >
                <CustomSelectOptions
                  label="Select Input Type"
                  value=""
                  disabled
                />
                {inputTypes.map((typ, i) => (
                  <CustomSelectOptions
                    label={typ.label}
                    value={typ.key}
                    key={i}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-12">
              <CustomSelect
                label="Group"
                value={state.group}
                onChange={(e) => setState({ ...state, group: e.target.value })}
              >
                <CustomSelectOptions label="Select Group" value="" disabled />
                {groups.map((grp, i) => (
                  <CustomSelectOptions
                    label={grp.label}
                    value={grp.key}
                    key={i}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-12">
              <TextInput
                label="Details"
                value={state.details}
                onChange={(e) =>
                  setState({ ...state, details: e.target.value })
                }
                placeholder="Enter Config Details"
                multiline={3}
              />
            </div>
            <div className="col-md-12">
              <Button
                type="submit"
                text={`${isUpdating ? "Update" : "Add"} Setting`}
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

export default AddSetting;
