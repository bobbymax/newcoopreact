/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { alter, store } from "../../../app/http/controllers";
import { between, breakRangeFigures, slugify } from "../../../app/helpers";
import Modal from "../../../template/modals/Modal";
import { Button, TextInput } from "../../../template/components/Inputs";

const AddAccountCode = ({
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
    range: "",
    start: 0,
    end: 0,
    name: "",
    label: "",
  };

  const [state, setState] = useState(initialState);
  const [accCodes, setAccCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      name: state.name,
      label: state.label,
      range: state.range,
    };

    try {
      setLoading(true);
      if (isUpdating) {
        alter("accountCodes", state.id, requests)
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
        store("accountCodes", requests)
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
    if (data !== undefined) {
      const ranges = breakRangeFigures(data?.range);
      setState({
        ...state,
        id: data?.id,
        range: data?.range,
        start: ranges.start,
        end: ranges.end,
        name: data?.name,
        label: data?.label,
      });
    }
  }, [data]);

  useEffect(() => {
    if (dependencies !== undefined && dependencies?.codes?.length > 0) {
      const { codes } = dependencies;
      setAccCodes(codes);
    }
  }, [dependencies]);

  useEffect(() => {
    if (state.name !== "") {
      setState({
        ...state,
        label: slugify(state.name),
      });
    } else {
      setState({
        ...state,
        label: "",
      });
    }
  }, [state.name]);

  useEffect(() => {
    let isExists = false;
    if (state.start > 0 && accCodes?.length > 0 && !isUpdating) {
      accCodes.map((cd) => {
        const figures = breakRangeFigures(cd?.range);
        isExists = between(state.start, figures.start, figures.end);

        return isExists;
      });

      setError(
        isExists ? "The start value already falls within an existing range" : ""
      );
    }
  }, [state.start, accCodes]);

  useEffect(() => {
    let isExists = false;
    if (state.end > 0 && accCodes?.length > 0 && !isUpdating) {
      accCodes.map((cd) => {
        const figures = breakRangeFigures(cd?.range);
        isExists = between(state.end, figures.start, figures.end);

        return isExists;
      });

      setError(
        isExists ? "The end value already falls within an existing range" : ""
      );
    }
  }, [state.end, accCodes]);

  useEffect(() => {
    if (state.start > 0 && state.end > 0 && error === "") {
      setState({
        ...state,
        range: `${state.start} - ${state.end}`,
      });
    }
  }, [state.start, state.end, error]);

  return (
    <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
      {error !== "" && (
        <div className="error_section">
          <p className="text-danger text-center m-3">{error}</p>
        </div>
      )}
      <form onSubmit={handleFormSubmit}>
        <div className="row">
          <div className="col-md-6">
            <TextInput
              label="Start"
              type="number"
              value={state.start}
              onChange={(e) =>
                setState({ ...state, start: parseInt(e.target.value) })
              }
            />
          </div>
          <div className="col-md-6">
            <TextInput
              label="End"
              type="number"
              value={state.end}
              onChange={(e) =>
                setState({ ...state, end: parseInt(e.target.value) })
              }
            />
          </div>
          <div className="col-md-12">
            <TextInput
              label="Range"
              value={state.range}
              onChange={(e) => setState({ ...state, range: e.target.value })}
              placeholder="Enter Account Code Range"
              disabled
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
          <div className="col-md-5">
            <TextInput
              label="Label"
              value={state.label}
              onChange={(e) => setState({ ...state, label: e.target.value })}
              placeholder="Enter Label"
              disabled
            />
          </div>

          <div className="col-md-12">
            <Button
              type="submit"
              text={`${isUpdating ? "Update" : "Add"} Account Code`}
              isLoading={loading}
              icon="add_circle"
              disabled={error !== "" || state.range === "" || state.name === ""}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddAccountCode;
