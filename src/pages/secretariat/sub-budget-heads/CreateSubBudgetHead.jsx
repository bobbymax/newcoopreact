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

const CreateSubBudgetHead = ({
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
    budget_head_id: 0,
    category_id: 0,
    name: "",
    code: "",
    type: "",
    group: "",
  };

  const [state, setState] = useState(initialState);
  const [cats, setCats] = useState([]);
  const [buds, setBuds] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      ...state,
    };

    try {
      setLoading(true);
      if (isUpdating) {
        alter("subBudgetHeads", state.id, requests)
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
        store("subBudgetHeads", requests)
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
        name: data?.name,
        budget_head_id: data?.budget_head_id,
        category_id: data?.category_id,
        code: data?.code,
        type: data?.type,
        group: data?.group,
      });
    }
  }, [data]);

  useEffect(() => {
    if (
      dependencies !== undefined &&
      dependencies?.categories?.length > 0 &&
      dependencies?.budgetHeads?.length > 0
    ) {
      const { categories, budgetHeads } = dependencies;
      setBuds(budgetHeads);
      setCats(categories);
    }
  }, [dependencies]);

  return (
    <>
      <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
        <form onSubmit={handleFormSubmit}>
          <div className="row">
            <div className="col-md-12">
              <CustomSelect
                label="Budget Head"
                value={state.budget_head_id}
                onChange={(e) =>
                  setState({ ...state, budget_head_id: e.target.value })
                }
              >
                <CustomSelectOptions
                  value={0}
                  label="Select Budget Head"
                  disabled
                />
                {buds.map((bud, i) => (
                  <CustomSelectOptions
                    key={i}
                    label={bud?.name}
                    value={bud?.id}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-12">
              <CustomSelect
                label="Category"
                value={state.category_id}
                onChange={(e) =>
                  setState({ ...state, category_id: e.target.value })
                }
              >
                <CustomSelectOptions
                  value={0}
                  label="Select Category"
                  disabled
                />
                {cats.map((cat, i) => (
                  <CustomSelectOptions
                    key={i}
                    label={cat?.name}
                    value={cat?.id}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-8">
              <TextInput
                label="Name"
                value={state.name}
                onChange={(e) => setState({ ...state, name: e.target.value })}
                placeholder="Enter Name"
              />
            </div>
            <div className="col-md-4">
              <TextInput
                label="Code"
                value={state.code}
                onChange={(e) => setState({ ...state, code: e.target.value })}
                placeholder="Enter Code"
              />
            </div>
            <div className="col-md-6">
              <CustomSelect
                label="Type"
                value={state.type}
                onChange={(e) => setState({ ...state, type: e.target.value })}
              >
                <CustomSelectOptions
                  value=""
                  label="Select Sub Budget Type"
                  disabled
                />
                {["capital", "recurrent", "personnel"].map((typ, i) => (
                  <CustomSelectOptions
                    key={i}
                    label={typ?.toUpperCase()}
                    value={typ}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-6">
              <CustomSelect
                label="Group"
                value={state.group}
                onChange={(e) => setState({ ...state, group: e.target.value })}
              >
                <CustomSelectOptions
                  value=""
                  label="Select Sub Budget Group"
                  disabled
                />
                {["inflow", "outflow"].map((grp, i) => (
                  <CustomSelectOptions
                    key={i}
                    label={grp?.toUpperCase()}
                    value={grp}
                  />
                ))}
              </CustomSelect>
            </div>

            <div className="col-md-12">
              <Button
                type="submit"
                text={`${isUpdating ? "Update" : "Add"} Budget Head`}
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

export default CreateSubBudgetHead;
