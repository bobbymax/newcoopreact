/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import PageHeader from "../../../template/includes/PageHeader";
import { collection, store } from "../../../app/http/controllers";
import {
  batchRules,
  currency,
  generateUniqueString,
} from "../../../app/helpers";
import moment from "moment";
import {
  CustomSelect,
  CustomSelectOptions,
} from "../../../template/components/Inputs";
import { useNavigate } from "react-router-dom";
import Alert from "../../../app/services/alert";

const Batch = () => {
  const [rule, setRule] = useState("");
  const [expenditures, setExpenditures] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [group, setGroup] = useState([]);
  const [stage, setStage] = useState(null);
  const [batchNo, setBatchNo] = useState("");
  const [total, setTotal] = useState(0);
  const [subBudgetHeadCode, setSubBudgetHeadCode] = useState("");

  const navigate = useNavigate();

  const resetComponent = () => {
    setGroup([]);
    setFiltered([]);
    setTotal(0);
  };

  const batchPayments = () => {
    const body = {
      noOfPayments: group?.length,
      sub_budget_head_code: subBudgetHeadCode,
      total_amount: total,
      expenditures: group,
      code: batchNo,
    };

    try {
      store("batches", body)
        .then((res) => {
          const response = res.data;

          Alert.success("Payments Batched", response.message);
          resetComponent();
          navigate("/secretariat/payments");
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  };

  const generateBatchNo = () => {
    const code = generateUniqueString(stage.prefix, stage.generated);
    setBatchNo(code);
  };

  const switchStage = (label) => {
    return batchRules.filter((bth) => bth.name === label)[0];
  };

  const addToBatch = (exp) => {
    const exists = group.filter((grp) => grp.id === exp.id);
    if (exists.length < 1) {
      setGroup([exp, ...group]);
      setFiltered(filtered.filter((fil) => fil?.id !== exp?.id));
    }
  };

  const removeFromBatch = (exp) => {
    setGroup(group.filter((gr) => gr.id !== exp.id));
    setFiltered([exp, ...filtered]);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setRule(value);
    setStage(switchStage(value));
  };

  useEffect(() => {
    if (group.length === 1) {
      const exp = group[0];
      setSubBudgetHeadCode(exp?.sub_budget_head_code);
    }

    if (group?.length < 1) {
      setBatchNo("");
    }

    setTotal(
      group
        .map((grp) => parseFloat(grp.amount))
        .reduce((sum, curr) => sum + curr, 0)
    );
  }, [group]);

  useEffect(() => {
    try {
      const stg = batchRules.filter((rul) => rul.default)[0];
      setStage(stg);
      setRule(stg.name);
      setGroup([]);
      setBatchNo("");
      collection("batch/expenditures")
        .then((res) => {
          const response = res.data.data;
          setExpenditures(response);
          setFiltered(response.filter((exp) => exp.payment_type === stg.name));
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (stage !== null && rule !== "") {
      setFiltered(
        expenditures.filter((exp) => exp?.payment_type === stage.name)
      );
    }
  }, [stage, rule]);

  return (
    <>
      <PageHeader
        pageName="Batch Payments"
        text="Batch Payments"
        handleClick={batchPayments}
        icon="group_work"
        isLoading={group?.length < 1 || batchNo === ""}
        resource
      />

      <div className="batch__section">
        <div className="batch__top__section">
          <div className="row">
            <div className="col-md-3">
              <CustomSelect
                label="Payment Type"
                value={rule}
                onChange={handleChange}
                disabled={group?.length > 0}
              >
                <CustomSelectOptions
                  label="Select Payment Type"
                  value=""
                  disabled
                />

                {batchRules.map((bth, i) => (
                  <CustomSelectOptions
                    key={i}
                    label={bth.display_name}
                    value={bth.name}
                  />
                ))}
              </CustomSelect>
            </div>
          </div>
        </div>
        <div className="expenses">
          <div className="row">
            <div className="col-md-8">
              <div className="row">
                {filtered?.length > 0 ? (
                  filtered.map((exp, i) => (
                    <div className="col-md-6" key={i}>
                      <div className="exp__card" key={i}>
                        <small>{`${exp?.trxRef} - ${exp?.sub_budget_head_code}`}</small>
                        <h3>{exp?.beneficiary}</h3>
                        <p>{exp?.description}</p>
                        <h3 className="amount">{currency(exp?.amount)}</h3>
                        <small className="bttm__small">
                          Raised At: {moment(exp?.created_at).format("LL")}
                        </small>
                        <button
                          type="button"
                          className="side__button block__bttn bg__primary"
                          onClick={() => addToBatch(exp)}
                          disabled={
                            subBudgetHeadCode !== "" &&
                            exp?.sub_budget_head_code !== subBudgetHeadCode
                          }
                        >
                          Add To Batch
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-md-12">
                    <div className="error__badge">
                      <p>There are no payments to be batched here!!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-4">
              <div className="generate__btn mb-3">
                <button
                  type="button"
                  className="side__button block__bttn bg__primary"
                  disabled={group?.length < 1 || subBudgetHeadCode === ""}
                  onClick={() => generateBatchNo()}
                >
                  Generate Batch Number
                </button>
              </div>
              <div className="batch">
                {batchNo !== "" && (
                  <div className="batch__no__section mb-3">
                    <h3>{batchNo}</h3>
                  </div>
                )}

                {group?.length > 0 ? (
                  group?.map((gr, i) => (
                    <div className="batch__container" key={i}>
                      <div className="batch__card mb-3">
                        <div className="icon__area">
                          <span className="material-icons-sharp">verified</span>
                        </div>
                        <div className="details">
                          <h3>{gr?.beneficiary}</h3>
                          <p>{gr?.description}</p>
                          <h3 className="batch__amount">
                            {currency(gr?.amount)}
                          </h3>
                          <small className="bttm__small">
                            Raised At: {moment(gr?.created_at).format("LL")}
                          </small>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="side__button block__bttn bg__dark"
                        onClick={() => removeFromBatch(gr)}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <h3 className="batch__amount">
                    No Payments have been added to the batch yet!!
                  </h3>
                )}
              </div>

              <div className="summations mt-4">
                <div className="top__total">
                  <small>Total Amount</small>
                  <h3>{currency(total)}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Batch;
