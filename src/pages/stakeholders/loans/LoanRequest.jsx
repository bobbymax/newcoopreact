/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  CustomSelect,
  CustomSelectOptions,
  TextInput,
} from "../../../template/components/Inputs";
import { useStateContext } from "../../../context/ContextProvider";
import {
  calculator,
  checkOfferLimit,
  getDateComponents,
  getRange,
  getVariant,
} from "../../../app/helpers/loans/calculator";
import { currency, generateUniqueString } from "../../../app/helpers";
import Installments from "./Installments";
import { store } from "../../../app/http/controllers";

const LoanRequest = ({
  options = undefined,
  handleSubmit = undefined,
  handleClose = undefined,
}) => {
  const initialState = {
    sub_budget_head_id: 0,
    request_code: "",
    requested_amount: 0,
    reason: "",
    capitalSum: 0,
    commitment: 0,
    interestSum: 0,
    totalPayable: 0,
    preferred_tenor: 0,
    installments: [],
    commitment_rate: 0,
    interest_rate: 0,
    remittance: 0,
    deduction: 0,
  };

  const initialLoanState = {
    subBudgetHead: null,
    requested: 0,
    preferred_tenor: 0,
    feature: null,
    variant: null,
  };

  const [state, setState] = useState(initialState);
  const [loanState, setLoanState] = useState(initialLoanState);
  const [subs, setSubs] = useState([]);
  const [subBudgetHead, setSubBudgetHead] = useState(null);
  const [feature, setFeature] = useState(null);
  const [eligibility, setEligibility] = useState(0);
  const [tenors, setTenors] = useState([]);
  const [eligibilityStatus, setEligibilityStatus] = useState(false);
  const [fundsAvailable, setFundsAvailable] = useState(false);
  const [variant, setVariant] = useState(null);
  const [result, setResult] = useState(null);
  const [installments, setInstallments] = useState([]);
  const [show, setShow] = useState(false);

  const { auth, loans, wallet } = useStateContext();

  const submitApplication = (e) => {
    e.preventDefault();

    const requests = {
      ...state,
      user_id: auth?.id,
      request_code: generateUniqueString(subBudgetHead?.code, 6),
      interestSum: result?.interestSum,
      totalPayable: result?.totalPayable,
      commitment: (result?.commitment / 100) * state.requested_amount,
      interest_rate: result?.interestRate,
      commitment_rate: result?.commitment,
      remittance: result?.remittance,
      deduction: result?.deductable,
      installments,
    };

    try {
      store("loans", requests)
        .then((res) => {
          const response = res.data;
          handleSubmit({
            data: response.data,
            message: response.message,
            status: "Almost There!!",
            method: "store",
          });

          cancelForm();
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }

    console.log(requests);
  };

  const cancelForm = () => {
    setState(initialState);
    setLoanState(initialLoanState);
    setTenors([]);
    setSubs([]);
    handleClose();
    setFeature(null);
    setVariant(null);
    setResult(null);
    setInstallments([]);
  };

  const calculateLoans = () => {
    const amounts = [];
    const active = loans.filter((loan) => loan?.state === "active");

    active.map((ln) => {
      const lnAmt = parseFloat(ln?.approved_amount);
      const { installments } = ln;

      const insAmt = installments
        ?.filter((ins) => ins?.status !== "paid")
        ?.map((ins) => parseFloat(ins?.fee))
        .reduce((sum, curr) => sum + curr, 0);

      return amounts.push({
        loanAmount: lnAmt,
        installmentsBal: insAmt,
      });
    });

    return amounts;
  };

  const handleModalClose = () => {
    setShow(false);
  };

  useEffect(() => {
    if (options !== undefined && Object.keys(options)?.length > 0) {
      const { subBudgetHeads } = options;
      setSubs(subBudgetHeads);
    }
  }, [options]);

  useEffect(() => {
    const amounts = calculateLoans();

    const loanTotal = amounts
      ?.map((amt) => amt?.installmentsBal)
      ?.reduce((sum, curr) => sum + curr, 0);

    const savings = parseFloat(wallet?.savings);
    const eligible = savings * 2 - loanTotal;
    setEligibility(eligible);
  }, []);

  useEffect(() => {
    if (state.sub_budget_head_id > 0) {
      const sub = subs.filter((su) => su?.id === state.sub_budget_head_id)[0];
      const dateComp = getDateComponents();
      setSubBudgetHead(sub);
      setFeature(sub?.feature);
      setLoanState({
        ...loanState,
        subBudgetHead: sub,
        feature: {
          ...sub?.feature,
          deduction_month: dateComp.month,
          deduction_year: dateComp.year,
        },
      });
    }
  }, [state.sub_budget_head_id]);

  useEffect(() => {
    if (eligibility <= 0 || eligibility < state.requested_amount) {
      setEligibilityStatus(false);
    } else {
      setEligibilityStatus(true);
    }
  }, [eligibility, state.requested_amount]);

  useEffect(() => {
    if (subBudgetHead !== null && state.requested_amount > 0) {
      const booked_balance = parseFloat(subBudgetHead?.booked_balance) ?? 0;
      if (booked_balance < state.requested_amount) {
        setFundsAvailable(false);
      } else {
        setFundsAvailable(true);
      }
    }
  }, [subBudgetHead, state.requested_amount]);

  useEffect(() => {
    if (feature !== null && state.requested_amount > 0) {
      if (!checkOfferLimit(feature, state.requested_amount)) {
        setEligibilityStatus(false);
      }

      setTenors(getRange(feature));
      setLoanState({
        ...loanState,
        requested: state.requested_amount,
      });
    }
  }, [feature, state.requested_amount]);

  useEffect(() => {
    if (feature !== null && state.preferred_tenor > 0) {
      const varR = getVariant(feature, state.preferred_tenor);
      setVariant(varR);
      setLoanState({
        ...loanState,
        variant: varR,
        preferred_tenor: state.preferred_tenor,
      });
    }
  }, [feature, state.preferred_tenor]);

  useEffect(() => {
    if (variant !== null) {
      const res = calculator(subBudgetHead, loanState);
      setResult(res);
      setInstallments(res?.installments);
      console.log(res);
    }
  }, [variant, subBudgetHead, state.requested_amount]);

  return (
    <>
      <Installments
        title="Loan Breakdown"
        show={show}
        installments={installments}
        handleClose={handleModalClose}
      />

      <div className="col-md-5">
        <div className="form__card">
          <form onSubmit={submitApplication}>
            <div className="row">
              <div className="col-md-12">
                <CustomSelect
                  label="What type of Load would you like?"
                  value={state.sub_budget_head_id}
                  onChange={(e) =>
                    setState({
                      ...state,
                      sub_budget_head_id: parseInt(e.target.value),
                    })
                  }
                >
                  <CustomSelectOptions
                    label="Select Loan Type"
                    value={0}
                    disabled
                  />
                  {subs.map((sub) => (
                    <CustomSelectOptions
                      label={sub?.name}
                      value={sub?.id}
                      key={sub?.id}
                    />
                  ))}
                </CustomSelect>
              </div>
              <div className="col-md-12">
                <TextInput
                  label="How much would you like to take?"
                  value={state.requested_amount}
                  onChange={(e) =>
                    setState({
                      ...state,
                      requested_amount: parseFloat(e.target.value) ?? 0,
                    })
                  }
                />
              </div>
              <div className="col-md-12">
                <CustomSelect
                  label="Your preffered period for repayment?"
                  value={state.preferred_tenor}
                  onChange={(e) =>
                    setState({
                      ...state,
                      preferred_tenor: parseInt(e.target.value),
                    })
                  }
                  disabled={feature === null || tenors?.length < 1}
                >
                  <CustomSelectOptions
                    label="Select Preferred Tenor"
                    value={0}
                    disabled
                  />
                  {feature !== null &&
                    tenors.map((ten, i) => (
                      <CustomSelectOptions
                        label={`${ten} ${
                          feature?.frequency === "months" ? "Months" : "Years"
                        }`}
                        value={ten}
                        key={i}
                      />
                    ))}
                </CustomSelect>
              </div>
              <div className="col-md-12">
                <TextInput
                  label="Purpose for loan request?"
                  value={state.reason}
                  onChange={(e) =>
                    setState({
                      ...state,
                      reason: e.target.value,
                    })
                  }
                  placeholder="Why do you need this loan?"
                  multiline={3}
                />
              </div>
              <div className="custom__btn__group space__between">
                <button
                  type="submit"
                  className="custom__logout__btn bg__primary"
                  disabled={
                    !fundsAvailable ||
                    !eligibilityStatus ||
                    state.requested_amount < 1 ||
                    state.sub_budget_head_id === 0 ||
                    state.reason === ""
                  }
                >
                  <span className="material-icons-sharp">send</span>
                  <p>Request</p>
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
          </form>
        </div>
      </div>
      <div className="col-md-7">
        <div className="loan__badge__section">
          <div className="top__badge__section">
            <span className="material-icons-sharp nav_icons">token</span>
            <h3>Loan Status</h3>
          </div>
          <div className="mid__section">
            <table className="loan__custom__table">
              <tbody>
                <tr>
                  <td>Type of Loan:</td>
                  <td>
                    {subBudgetHead !== null ? subBudgetHead?.name : "Not Set"}
                  </td>
                </tr>
                <tr>
                  <td>Requested Amount:</td>
                  <td>{currency(state.requested_amount)}</td>
                </tr>
                <tr>
                  <td>Preffered Repayment Tenor:</td>
                  <td>
                    {state.preferred_tenor + " " + feature?.frequency ?? ""}
                  </td>
                </tr>
                <tr>
                  <td>Interest Rate:</td>
                  <td>{result?.interestRate + "%"}</td>
                </tr>
                <tr>
                  <td>Commitment:</td>
                  <td>{result?.commitment + "%"}</td>
                </tr>
                <tr>
                  <td>Remittance:</td>
                  <td>{currency(result?.remittance ?? 0)}</td>
                </tr>
                <tr>
                  <td>Deduction:</td>
                  <td>{currency(result?.deductable ?? 0)}</td>
                </tr>
              </tbody>
            </table>
            <div className="badge__bttn__section">
              <button
                type="button"
                className="badge__bttn"
                disabled={installments?.length < 1 && result === null}
                onClick={() => setShow(true)}
              >
                <span className="material-icons-sharp nav_icons">insights</span>
                View Breakdown
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoanRequest;
