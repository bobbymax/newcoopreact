/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import PageHeader from "../../../template/includes/PageHeader";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { collection, store } from "../../../app/http/controllers";
import {
  currency,
  formatSelectOptions,
  generateUniqueString,
} from "../../../app/helpers";
import {
  Button,
  CustomSelect,
  CustomSelectOptions,
  TextInput,
} from "../../../template/components/Inputs";
import {
  calculator,
  getMonths,
  getRange,
  getVariant,
  getYears,
} from "../../../app/helpers/loans/calculator";
import Alert from "../../../app/services/alert";

const ApplyLoan = () => {
  const animated = makeAnimated();

  const initialState = {
    id: 0,
    member_id: 0,
    beneficiary: "",
    sub_budget_head_id: 0,
    sub_budget_head_name: "",
    booked_balance: 0,
    new_balance: 0,
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
    deduction_month: "",
    deduction_year: 0,
    error: "",
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
  const [members, setMembers] = useState([]);
  const [subBudgetHeads, setSubBudgetHeads] = useState([]);
  const [member, setMember] = useState(null);
  const [subBudgetHead, setSubBudgetHead] = useState(null);
  const [feature, setFeature] = useState(null);
  const [variant, setVariant] = useState(null);
  const [tenors, setTenors] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitApplication = (e) => {
    e.preventDefault();

    const requests = {
      ...state,
      user_id: state.member_id,
      request_code: generateUniqueString(subBudgetHead?.properties?.code, 6),
      interestSum: result?.interestSum,
      totalPayable: result?.totalPayable,
      commitment: (result?.commitment / 100) * state.requested_amount,
      interest_rate: result?.interestRate,
      commitment_rate: result?.commitment,
      remittance: result?.remittance,
      deduction: result?.deductable,
      installments: result?.installments,
      status: "registered",
    };

    setLoading(true);

    try {
      store("loans", requests)
        .then((res) => {
          const response = res.data;
          Alert.success("Success", response.message);
          cancelForm();
        })
        .catch((err) => {
          console.log(err.message);
          Alert.error("Oops!!", "Something went wrong!!");
        });
    } catch (error) {
      console.log(error);
    }
  };

  const cancelForm = () => {
    setState(initialState);
    setLoanState(initialLoanState);
    setSubBudgetHead(null);
    setMember(null);
    setTenors([]);
    setFeature(null);
    setVariant(null);
    setResult(null);
  };

  useEffect(() => {
    if (
      subBudgetHead !== null &&
      subBudgetHead?.properties &&
      subBudgetHead?.properties?.attributes
    ) {
      const { fund } = subBudgetHead?.properties?.attributes;
      const { feature } = subBudgetHead?.properties;
      setFeature(feature);
      setState({
        ...state,
        booked_balance: parseFloat(fund?.booked_balance),
        sub_budget_head_id: parseInt(subBudgetHead.value),
        sub_budget_head_name: subBudgetHead?.label,
      });
    }
  }, [subBudgetHead]);

  useEffect(() => {
    if (member !== null) {
      setState({
        ...state,
        member_id: member?.value,
        beneficiary: member?.label,
      });
    }
  }, [member]);

  useEffect(() => {
    if (feature !== null) {
      setTenors(getRange(feature));
    }
  }, [feature]);

  useEffect(() => {
    if (feature !== null && state.preferred_tenor > 0) {
      const varR = getVariant(feature, state.preferred_tenor);
      setVariant(varR);
    }
  }, [feature, state.preferred_tenor]);

  useEffect(() => {
    if (variant !== null) {
      setLoanState({
        ...state,
        subBudgetHead: subBudgetHead?.properties,
        requested: state.requested_amount,
        variant,
        preferred_tenor: parseInt(state.preferred_tenor),
        feature: {
          ...feature,
          deduction_month: state.deduction_month,
          deduction_year: state.deduction_year,
        },
      });
    }
  }, [variant]);

  useEffect(() => {
    const res = calculator(loanState.subBudgetHead, loanState);
    setResult(res);
  }, [loanState]);

  useEffect(() => {
    if (state.booked_balance > 0 && state.requested_amount > 0) {
      const diff = state.booked_balance - parseFloat(state.requested_amount);
      setState({
        ...state,
        new_balance: diff < 0 ? 0 : diff,
        error: diff < 0 ? "You have exceeded the provided amount" : "",
      });
    }
  }, [state.booked_balance, state.requested_amount]);

  useEffect(() => {
    try {
      const urls = ["members", "subBudgetHeads"];

      const requests = urls.map((url) => collection(url));

      Promise.all(requests)
        .then((res) => {
          const response = res[0].data.data;
          const filtered = response.filter(
            (member) => member?.type !== "admin"
          );
          const subs = res[1].data.data;
          const funded = subs.filter(
            (sub) => sub?.fund && sub?.feature !== null
          );
          setMembers(formatSelectOptions(filtered, "id", "name"));
          setSubBudgetHeads(formatSelectOptions(funded, "id", "name"));
        })
        .catch((err) => console.error(err.message));
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <>
      <PageHeader pageName="Apply Loans" headerIcon="real_estate_agent" />

      <div className="row">
        <div className="col-md-7">
          <div className="form__card card__white">
            <div className="row">
              <div className="col-md-12">
                <div className="application__header">
                  <h3>Create Loan Request</h3>
                </div>
              </div>
              <div className="col-md-12 mt-4">
                <form onSubmit={submitApplication}>
                  <div className="row">
                    <div className="col-md-12 mb-4">
                      <p className="label-font">Member</p>
                      <Select
                        components={animated}
                        options={members}
                        placeholder="Select Member"
                        value={member}
                        onChange={setMember}
                        isSearchable
                      />
                    </div>

                    <div className="col-md-12 mb-4">
                      <p className="label-font">Sub Budget Head</p>
                      <Select
                        components={animated}
                        options={subBudgetHeads}
                        placeholder="Select Sub Budget Head"
                        value={subBudgetHead}
                        onChange={setSubBudgetHead}
                        isSearchable
                      />
                    </div>
                    <div className="col-md-6">
                      <TextInput
                        label="Balance"
                        value={state.booked_balance}
                        onChange={(e) =>
                          setState({
                            ...state,
                            booked_balance: parseFloat(e.target.value),
                          })
                        }
                        disabled
                      />
                    </div>
                    <div className="col-md-6">
                      <TextInput
                        label="New Balance"
                        value={state.new_balance}
                        onChange={(e) =>
                          setState({
                            ...state,
                            new_balance: e.target.value ?? 0,
                          })
                        }
                        disabled
                      />
                    </div>
                    <div className="col-md-12">
                      <TextInput
                        label="Requested Amount"
                        value={state.requested_amount}
                        onChange={(e) =>
                          setState({
                            ...state,
                            requested_amount: e.target.value ?? 0,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <CustomSelect
                        label="Start Deduction From"
                        value={state.deduction_month}
                        onChange={(e) =>
                          setState({
                            ...state,
                            deduction_month: e.target.value,
                          })
                        }
                      >
                        <CustomSelectOptions
                          label="Select Preferred Month"
                          value=""
                          disabled
                        />
                        {getMonths().map((month, i) => (
                          <CustomSelectOptions
                            key={i}
                            value={month}
                            label={month}
                          />
                        ))}
                      </CustomSelect>
                    </div>
                    <div className="col-md-6">
                      <CustomSelect
                        label="Deduction Year"
                        value={state.deduction_year}
                        onChange={(e) =>
                          setState({
                            ...state,
                            deduction_year: e.target.value,
                          })
                        }
                      >
                        <CustomSelectOptions
                          label="Select Deduction Year"
                          value={0}
                          disabled
                        />
                        {getYears().map((year, i) => (
                          <CustomSelectOptions
                            key={i}
                            value={year}
                            label={year}
                          />
                        ))}
                      </CustomSelect>
                    </div>
                    <div className="col-md-12">
                      <CustomSelect
                        label="Period for repayment?"
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
                                feature?.frequency === "months"
                                  ? "Months"
                                  : "Years"
                              }`}
                              value={ten}
                              key={i}
                            />
                          ))}
                      </CustomSelect>
                    </div>
                    <div className="col-md-12">
                      <TextInput
                        label="Reason"
                        value={state.reason}
                        onChange={(e) =>
                          setState({
                            ...state,
                            reason: e.target.value,
                          })
                        }
                        placeholder="Enter Description"
                        multiline={3}
                      />
                    </div>
                    <div className="col-md-12 mt-4">
                      <Button
                        type="submit"
                        text="Apply Loan"
                        isLoading={loading}
                        icon="add_circle"
                        disabled={
                          state.member_id < 1 ||
                          state.sub_budget_head_id < 1 ||
                          state.requested_amount < 1 ||
                          state.preferred_tenor < 1 ||
                          state.deduction_month === "" ||
                          state.deduction_year < 1 ||
                          state.reason === ""
                        }
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div className="form__card card__white">
            <div className="col-md-12">
              <div className="application__header mb-3">
                <h3>Loan Details</h3>
              </div>
              <table className="details__section">
                <tbody>
                  <tr>
                    <td>Loan Type:</td>
                    <td>
                      {state.sub_budget_head_name === ""
                        ? "Not Set"
                        : state.sub_budget_head_name}
                    </td>
                  </tr>
                  <tr>
                    <td>Member:</td>
                    <td>
                      {state.beneficiary === "" ? "Not Set" : state.beneficiary}
                    </td>
                  </tr>
                  <tr>
                    <td>Requested Amount:</td>
                    <td>{currency(state.requested_amount)}</td>
                  </tr>
                  <tr>
                    <td>Interest Rate:</td>
                    <td>
                      {result?.interestRate !== undefined
                        ? result?.interestRate + "%"
                        : 0}
                    </td>
                  </tr>
                  <tr>
                    <td>Commitment:</td>
                    <td>
                      {result?.commitment !== undefined
                        ? result?.commitment + "%"
                        : 0}
                    </td>
                  </tr>
                  <tr>
                    <td>Remittance:</td>
                    <td>{currency(result?.remittance)}</td>
                  </tr>
                  <tr>
                    <td>Total Payable:</td>
                    <td>
                      {isNaN(result?.totalPayable)
                        ? 0
                        : currency(result?.totalPayable)}
                    </td>
                  </tr>
                  <tr>
                    <td>Total Monthly Deductions:</td>
                    <td>{result?.installments?.length}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplyLoan;
