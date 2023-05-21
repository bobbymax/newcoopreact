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

const MakeDecision = ({
  title = "",
  show = false,
  lg = false,
  handleClose = undefined,
  handleSubmit = undefined,
  data = undefined,
}) => {
  const initialState = {
    id: 0,
    remark: "",
    status: "",
  };

  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      remark: state.remark === "" ? "Please Approve" : state.remark,
      status: state.status,
    };

    // console.log(requests);

    try {
      setLoading(true);
      alter("guarantors", state.id, requests)
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
    if (data !== undefined) {
      setState({
        ...state,
        id: data?.id,
      });
    }
  }, [data]);

  return (
    <>
      <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
        <form onSubmit={handleFormSubmit}>
          <div className="row">
            <div className="col-md-12">
              <CustomSelect
                label="Decision"
                value={state.status}
                onChange={(e) => setState({ ...state, status: e.target.value })}
              >
                <CustomSelectOptions label="Make Decision" value="" disabled />
                {[
                  { key: "approved", label: "Approve" },
                  { key: "denied", label: "Deny" },
                ].map((decide, i) => (
                  <CustomSelectOptions
                    value={decide.key}
                    label={decide.label}
                    key={i}
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
                  placeholder="Enter Description Here"
                  multiline={3}
                />
              </div>
            )}

            <div className="col-md-12">
              <Button
                type="submit"
                text="Make Decision"
                isLoading={loading}
                icon="send"
                disabled={state.remark === "" && state.status === "denied"}
              />
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default MakeDecision;
