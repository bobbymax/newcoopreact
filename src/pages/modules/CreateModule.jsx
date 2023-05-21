/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  CustomSelect,
  CustomSelectOptions,
  TextInput,
} from "../../template/components/Inputs";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { slugify } from "../../app/helpers";
import { alter, store } from "../../app/http/controllers";

const CreateModule = ({
  options = [],
  roles = [],
  isUpdating = false,
  data = null,
  handleSubmit = undefined,
  handleClose = undefined,
}) => {
  const initialState = {
    id: 0,
    name: "",
    label: "",
    icon: "",
    code: "",
    url: "",
    parentId: 0,
    type: "",
  };

  const [state, setState] = useState(initialState);
  const [assigned, setAssigned] = useState([]);

  const animated = makeAnimated();

  const submitForm = (e) => {
    e.preventDefault();

    const data = {
      ...state,
      roles: assigned,
    };

    try {
      if (isUpdating) {
        alter("modules", state.id, data)
          .then((res) => {
            const response = res.data;

            handleSubmit({
              data: response.data,
              message: response.message,
              status: "Updated",
              method: "alter",
            });
          })
          .catch((err) => console.log(err.response.data.message));
      } else {
        store("modules", data)
          .then((res) => {
            const response = res.data;

            handleSubmit({
              data: response.data,
              message: response.message,
              status: "Created",
              method: "store",
            });
          })
          .catch((err) => console.log(err.response.data.message));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cancelForm = () => {
    setState(initialState);
    setAssigned([]);
    handleClose();
  };

  useEffect(() => {
    if (state.name !== "") {
      setState({
        ...state,
        label: slugify(state.name),
      });
    }
  }, [state.name]);

  useEffect(() => {
    if (data !== null && isUpdating) {
      setState({
        ...state,
        id: data?.id,
        name: data?.name,
        label: data?.label,
        icon: data?.icon,
        code: data?.code,
        url: data?.url,
        parentId: data?.parentId,
        type: data?.type,
      });

      const ass = roles.filter((rle) =>
        data?.roles?.map((role) => rle.id === role)
      );

      setAssigned(ass);
    }
  }, [data]);

  return (
    <div className="col-md-12">
      <div className="form__card">
        <form onSubmit={submitForm}>
          <div className="row">
            <div className="col-md-7">
              <TextInput
                label="Name"
                value={state.name}
                onChange={(e) => setState({ ...state, name: e.target.value })}
                placeholder="Enter Module name here"
              />
            </div>
            <div className="col-md-5">
              <TextInput
                label="Label"
                value={state.label}
                onChange={(e) => setState({ ...state, label: e.target.value })}
                placeholder="Slug Name here"
                disabled
              />
            </div>
            <div className="col-md-4">
              <TextInput
                label="Icon"
                value={state.icon}
                onChange={(e) => setState({ ...state, icon: e.target.value })}
                placeholder="Enter Module Icon"
              />
            </div>
            <div className="col-md-4">
              <TextInput
                label="Code"
                value={state.code}
                onChange={(e) => setState({ ...state, code: e.target.value })}
                placeholder="Enter Module Code"
              />
            </div>
            <div className="col-md-4">
              <TextInput
                label="URI"
                value={state.url}
                onChange={(e) => setState({ ...state, url: e.target.value })}
                placeholder="Enter Module URL"
              />
            </div>
            <div className="col-md-6">
              <CustomSelect
                label="Parent"
                value={state.parentId}
                onChange={(e) =>
                  setState({ ...state, parentId: e.target.value })
                }
              >
                <CustomSelectOptions value={0} label="None" />
                {options
                  .filter((opt) => opt.type !== "page")
                  .map((option, i) => (
                    <CustomSelectOptions
                      key={i}
                      value={option?.id}
                      label={option?.name}
                    />
                  ))}
              </CustomSelect>
            </div>
            <div className="col-md-6">
              <CustomSelect
                label="Type"
                value={state.type}
                onChange={(e) => setState({ ...state, type: e.target.value })}
              >
                <CustomSelectOptions
                  value=""
                  label="Select Module Type"
                  disabled
                />
                {["application", "module", "page"].map((option, i) => (
                  <CustomSelectOptions
                    key={i}
                    value={option}
                    label={option?.toUpperCase()}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-12 mb-3">
              <p className="label-font">Roles</p>
              <Select
                components={animated}
                options={roles}
                placeholder="Select Roles"
                value={assigned}
                onChange={setAssigned}
                isSearchable
                isMulti
              />
            </div>
            <div className="col-md-12">
              <div className="custom__btn__group">
                <button
                  type="submit"
                  className="custom__logout__btn bg__primary"
                >
                  <span className="material-icons-sharp">send</span>
                  <p>Submit</p>
                </button>
                <button
                  type="button"
                  className="custom__logout__btn bg__danger"
                  onClick={() => cancelForm()}
                >
                  <span className="material-icons-sharp">close</span>
                  <p>Cancel</p>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateModule;
