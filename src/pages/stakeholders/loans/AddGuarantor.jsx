/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { store } from "../../../app/http/controllers";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Modal from "../../../template/modals/Modal";
import { Button } from "../../../template/components/Inputs";

const AddGuarantor = ({
  title = "",
  show = false,
  lg = false,
  handleClose = undefined,
  handleSubmit = undefined,
  dependencies = undefined,
  data = undefined,
  maximum = 3,
}) => {
  const animated = makeAnimated();
  const initialState = {
    loan_id: 0,
  };

  const [state, setState] = useState(initialState);
  const [mems, setMems] = useState([]);
  const [guarantors, setGuarantors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      ...state,
      guarantors,
    };

    try {
      setLoading(true);

      store("guarantors", requests)
        .then((res) => {
          const response = res.data;

          handleSubmit({
            status: "Created!!",
            data: response.data,
            message: response.message,
            action: "store",
          });
          setState(initialState);
          setGuarantors([]);
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
    setGuarantors([]);
    handleClose();
  };

  useEffect(() => {
    if (
      dependencies !== undefined &&
      Object.keys(dependencies)?.length > 0 &&
      data !== undefined
    ) {
      const { members } = dependencies;
      setMems(members);
      setState({
        ...state,
        loan_id: data?.id,
      });
    }
  }, [dependencies, data]);

  return (
    <>
      <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
        <form onSubmit={handleFormSubmit}>
          <div className="row">
            <div className="col-md-12 mb-2">
              <p className="label-font">Guarantors</p>
              <Select
                closeMenuOnSelect={true}
                components={animated}
                options={mems}
                placeholder="Add Loan Guarantors"
                value={guarantors}
                onChange={setGuarantors}
                isSearchable
                isMulti
                isDisabled={guarantors?.length === maximum}
              />
            </div>
            <div className="col-md-12 mt-4">
              <Button
                type="submit"
                text="Add Guarantors"
                isLoading={loading}
                icon="group"
                disabled={guarantors?.length < maximum}
              />
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddGuarantor;
