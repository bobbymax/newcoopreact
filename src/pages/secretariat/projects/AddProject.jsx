/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { alter, collection, store } from "../../../app/http/controllers";
import { useStateContext } from "../../../context/ContextProvider";
import { generateUniqueString } from "../../../app/helpers";
import Modal from "../../../template/modals/Modal";
import {
  Button,
  CustomSelect,
  CustomSelectOptions,
  TextInput,
} from "../../../template/components/Inputs";

const AddProject = ({
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
    sub_budget_head_id: 0,
    title: "",
    code: "",
    duration: 0,
    description: "",
    status: "",
  };

  const { auth } = useStateContext();
  const [state, setState] = useState(initialState);
  const [subBudgetHeads, setSubBudgetHeads] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      ...state,
      user_id: auth?.id,
    };

    try {
      setLoading(true);
      if (isUpdating) {
        alter("projects", state.id, requests)
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
        store("projects", requests)
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
    if (state.sub_budget_head_id > 0) {
      setState({
        ...state,
        code: generateUniqueString("PY", 8),
      });
    }
  }, [state.sub_budget_head_id]);

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
      collection("subBudgetHeads")
        .then((res) => {
          setSubBudgetHeads(res.data.data);
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
          <div className="col-md-12">
            <TextInput
              label="Title"
              value={state.title}
              onChange={(e) => setState({ ...state, title: e.target.value })}
              placeholder="Enter Project Title"
            />
          </div>
          <div className="col-md-12">
            <CustomSelect
              label="Sub Budget Head"
              value={state.sub_budget_head_id}
              onChange={(e) =>
                setState({
                  ...state,
                  sub_budget_head_id: parseInt(e.target.value),
                })
              }
            >
              <CustomSelectOptions
                label="Select Sub Budget Head"
                value={0}
                disabled
              />
              {subBudgetHeads?.map((sub) => (
                <CustomSelectOptions
                  key={sub?.id}
                  value={sub?.id}
                  label={`${sub?.code} - ${sub?.name}`}
                />
              ))}
            </CustomSelect>
          </div>
          <div className="col-md-8">
            <TextInput
              label="Code"
              value={state.code}
              onChange={(e) => setState({ ...state, code: e.target.value })}
              placeholder="Enter Project Code"
              disabled
            />
          </div>
          <div className="col-md-4">
            <TextInput
              label="Duration"
              type="number"
              value={state.duration}
              onChange={(e) =>
                setState({ ...state, duration: parseInt(e.target.value) })
              }
            />
          </div>
          <div className="col-md-12">
            <TextInput
              label="Description"
              value={state.description}
              onChange={(e) =>
                setState({ ...state, description: e.target.value })
              }
              placeholder="Enter Project Description"
              multiline={4}
            />
          </div>
          <div className="col-md-12 mt-4">
            <Button
              type="submit"
              text={`${isUpdating ? "Update" : "Add"} Project`}
              isLoading={loading}
              icon="add_circle"
              disabled={
                state.code === "" ||
                state.title === "" ||
                state.sub_budget_head_id < 1 ||
                state.description === "" ||
                state.duration < 1
              }
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddProject;
