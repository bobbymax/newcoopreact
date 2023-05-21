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

const AddFeatures = ({
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
    sub_budget_head_id: 0,
    tenor: 0,
    frequency: "",
    interest_rate: 0,
    commitment: 0,
    max_repayment_tenor: 0,
    percentage_deduction: 0,
    offer_limit: 0,
    payable_from: "",
  };

  const [state, setState] = useState(initialState);
  const [subs, setSubs] = useState([]);
  const [variants, setVariants] = useState([]);
  const [addingVariant, setAddVariant] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      ...state,
      variants,
    };

    try {
      setLoading(true);
      if (isUpdating) {
        alter("features", state.id, requests)
          .then((res) => {
            const response = res.data;

            handleSubmit({
              status: "Updated!!",
              data: response.data,
              message: response.message,
              action: "alter",
            });
            closeAfterSubmit();
          })
          .catch((err) => {
            console.log(err.message);
            setLoading(false);
          });
      } else {
        store("features", requests)
          .then((res) => {
            const response = res.data;

            handleSubmit({
              status: "Created!!",
              data: response.data,
              message: response.message,
              action: "store",
            });
            closeAfterSubmit();
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

  const closeAfterSubmit = () => {
    setState(initialState);
    setLoading(false);
    setAddVariant(false);
    setVariants([]);
    setSubs([]);
  };

  const handleModalClose = () => {
    setState(initialState);
    setVariants([]);
    setSubs([]);
    setAddVariant(false);
    setLoading(false);
    handleClose();
  };

  const addVariantComponent = () => {
    // console.log("gere");

    const vR = {
      interest_rate: state.interest_rate,
      tenor: state.tenor,
    };

    setVariants([vR, ...variants]);
    setState({
      ...state,
      interest_rate: 0,
      tenor: 0,
    });

    setAddVariant(false);
  };

  useEffect(() => {
    if (data !== undefined) {
      const vars = data?.variants;
      const vals = [];
      setState({
        ...state,
        id: data?.id,
        sub_budget_head_id: parseInt(data?.sub_budget_head_id),
        frequency: data?.frequency,
        commitment: parseInt(data?.commitment),
        max_repayment_tenor: parseInt(data?.max_repayment_tenor),
        offer_limit: parseFloat(data?.offer_limit),
        payable_from: data?.payable_from,
        percentage_deduction: parseInt(data?.percentage_deduction),
      });

      vars?.map((va) =>
        vals.push({
          interest_rate: va?.interest_rate,
          tenor: va.tenor,
        })
      );

      setVariants(vals);
    }
  }, [data]);

  useEffect(() => {
    if (
      dependencies !== undefined &&
      dependencies?.subBudgetHeads?.length > 0
    ) {
      const { subBudgetHeads } = dependencies;
      setSubs(subBudgetHeads);
    }
  }, [dependencies]);

  return (
    <>
      <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
        <form onSubmit={handleFormSubmit}>
          <div className="row">
            <div className="col-md-12">
              <CustomSelect
                label="Sub Budget Head"
                value={state.sub_budget_head_id}
                onChange={(e) =>
                  setState({ ...state, sub_budget_head_id: e.target.value })
                }
              >
                <CustomSelectOptions
                  value={0}
                  label="Select Sub Budget Head"
                  disabled
                />
                {subs.map((bud, i) => (
                  <CustomSelectOptions
                    key={i}
                    label={bud?.name}
                    value={bud?.id}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-5">
              <CustomSelect
                label="Frequency"
                value={state.frequency}
                onChange={(e) =>
                  setState({ ...state, frequency: e.target.value })
                }
              >
                <CustomSelectOptions
                  value=""
                  label="Select Frequency"
                  disabled
                />
                {["months", "years"].map((freq, i) => (
                  <CustomSelectOptions
                    key={i}
                    label={freq?.toUpperCase()}
                    value={freq}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-7">
              <CustomSelect
                label="Deducted From"
                value={state.payable_from}
                onChange={(e) =>
                  setState({ ...state, payable_from: e.target.value })
                }
              >
                <CustomSelectOptions
                  value=""
                  label="Select Deduction Source"
                  disabled
                />
                {["salary", "upfront", "special", "custom"].map((deduct, i) => (
                  <CustomSelectOptions
                    key={i}
                    label={deduct?.toUpperCase()}
                    value={deduct}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-12">
              <TextInput
                label="Offer Limit"
                value={state.offer_limit}
                onChange={(e) =>
                  setState({
                    ...state,
                    offer_limit: parseFloat(e.target.value),
                  })
                }
                placeholder="Enter Offer Limit"
              />
            </div>
            <div className="col-md-4">
              <TextInput
                label="Commitment %"
                value={state.commitment}
                onChange={(e) =>
                  setState({
                    ...state,
                    commitment: parseInt(e.target.value),
                  })
                }
                placeholder="Enter Commitment"
              />
            </div>
            <div className="col-md-4">
              <TextInput
                label="Max Repayment"
                type="number"
                value={state.max_repayment_tenor}
                onChange={(e) =>
                  setState({
                    ...state,
                    max_repayment_tenor: parseInt(e.target.value),
                  })
                }
                placeholder="Enter Max Repayment"
              />
            </div>
            <div className="col-md-4">
              <TextInput
                label="Deduction %"
                type="number"
                value={state.percentage_deduction}
                onChange={(e) =>
                  setState({
                    ...state,
                    percentage_deduction: parseInt(e.target.value),
                  })
                }
                placeholder="Enter Deduction"
              />
            </div>

            <div className="col-md-12">
              <div className="divider"></div>
            </div>

            <div className="col-md-12 mb-3">
              <div className="top__section__modal">
                <h3>Variants</h3>
                <button
                  type="button"
                  className="custom__logout__btn bg__secondary"
                  onClick={() => setAddVariant(true)}
                >
                  <span className="material-icons-sharp">add</span>
                  {/* <p>Add Variant</p> */}
                </button>
              </div>
            </div>

            {!addingVariant ? (
              <div className="col-md-12">
                {variants?.length < 1 ? (
                  <>
                    <div className="modal__error__mssg">
                      <p>There are no variants added yet!!</p>
                    </div>
                  </>
                ) : (
                  <div className="loaddd">
                    {variants.map((vari, i) => (
                      <div className="row" key={i}>
                        <div className="col-md-6">
                          <h3>
                            <span className="loaddd_header">
                              Interest Rate:
                            </span>{" "}
                            {vari.interest_rate}
                          </h3>
                        </div>
                        <div className="col-md-6">
                          <h3>
                            <span className="loaddd_header">Loan Tenor:</span>{" "}
                            {vari.tenor}
                          </h3>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="col-md-12">
                <div className="variant__form">
                  <div className="row">
                    <div className="col-md-6">
                      <TextInput
                        label="Interest Rate"
                        value={state.interest_rate}
                        onChange={(e) =>
                          setState({
                            ...state,
                            interest_rate: parseFloat(e.target.value),
                          })
                        }
                        placeholder="Enter Interest Rate"
                      />
                    </div>
                    <div className="col-md-6">
                      <TextInput
                        label="Tenor"
                        type="number"
                        value={state.tenor}
                        onChange={(e) =>
                          setState({
                            ...state,
                            tenor: parseInt(e.target.value),
                          })
                        }
                        placeholder="Enter Tenor"
                      />
                    </div>
                    <div className="col-md-12 mt-2 mb-2">
                      <Button
                        type="button"
                        text="Add Variant"
                        isLoading={loading}
                        icon="add_circle"
                        handleClick={addVariantComponent}
                        variant="secondary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="col-md-12 mt-5">
              <Button
                type="submit"
                text={`${isUpdating ? "Update" : "Add"} Feature`}
                isLoading={loading}
                icon="add_circle"
                disabled={variants?.length < 1}
              />
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddFeatures;
