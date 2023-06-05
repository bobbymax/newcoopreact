/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../../../template/includes/PageHeader";
import moment from "moment";
import { currency, getStatus } from "../../../app/helpers";
import AddGuarantor from "./AddGuarantor";
import Alert from "../../../app/services/alert";
import { alter, collection, destroy } from "../../../app/http/controllers";
import ViewBreakdown from "./ViewBreakdown";
import {
  calculator,
  getDateComponents,
  getRange,
  getVariant,
} from "../../../app/helpers/loans/calculator";
import {
  CustomSelect,
  CustomSelectOptions,
  TextInput,
} from "../../../template/components/Inputs";

const ViewLoan = () => {
  const { state, pathname } = useLocation();
  const navigate = useNavigate();

  const initialDetails = {
    requested_amount: 0,
    commitment: 0,
    created_at: "",
    id: 0,
    interestSum: 0,
    interest_rate: 0,
    isArchived: false,
    paid: false,
    car: false,
    yearly_deduction: 0,
    reason: "",
    request_code: "",
    state: "",
    status: "",
    sub_budget_head_id: 0,
    sub_budget_head_name: "",
    sub_budget_head_code: "",
    totalPayable: 0,
    principal: 0,
    remittance: 0,
    deduction: 0,
    user_id: 0,
    preferred_tenor: 0,
    measureIn: "",
    commitment_rate: 0,
    approved_amount: 0,
  };

  const [loan, setLoan] = useState(null);
  const [details, setDetails] = useState(initialDetails);
  const [members, setMembers] = useState([]);
  const [subBudgetHeads, setSubBudgetHeads] = useState([]);
  const [subBudgetHead, setSubBudgetHead] = useState(null);
  const [result, setResult] = useState(null);
  const [tenors, setTenors] = useState([]);
  const [guarantors, setGuarantors] = useState([]);
  const [installments, setInstallments] = useState([]);
  const [show, setShow] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loanState, setLoanState] = useState(null);
  const [url, setUrl] = useState("");
  const [path, setPath] = useState("");

  const closeForm = () => {
    setShow(false);
    setModalShow(false);
  };

  const handlePatchLoanRequest = (e) => {
    e.preventDefault();

    const requests = {
      approved_amount: details.requested_amount,
      commitment: details.commitment,
      commitment_rate: 0,
      interestSum: details.interestSum,
      interest_rate: details.interest_rate,
      sub_budget_head_id: details.sub_budget_head_id,
      totalPayable: details.totalPayable,
      principal: details.principal,
      remittance: details.remittance,
      deduction: details.deduction,
      preferred_tenor: details.preferred_tenor,
      installments,
    };

    try {
      alter("loans", details.id, requests)
        .then((res) => {
          const response = res.data;
          setLoan(response.data);
          setIsUpdating(false);
          Alert.success("Updated!!", response.message);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  };

  const makeLoanDecision = (decision) => {
    const requests = {
      status: decision,
    };

    try {
      alter("respond/loans", details.id, requests)
        .then((res) => {
          const response = res.data;
          setLoan(response.data);
          Alert.success("Updated!!", response.message);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (response) => {
    const loan = response.data;
    setLoan(loan);
    setGuarantors(loan?.guarantors);
    Alert.success(response?.status, response?.message);
    closeForm();
  };

  const removeGuarantor = (guarantor) => {
    Alert.flash(
      "You're about to remove this Guarantor",
      "warning",
      "This action is irriversable"
    ).then((result) => {
      if (result.isConfirmed) {
        try {
          destroy("guarantors", guarantor?.id)
            .then((res) => {
              const id = guarantor?.id;

              setGuarantors(guarantors.filter((gu) => gu.id !== id));
              Alert.success("Removed!!", res.data.message);
            })
            .catch((err) => {
              Alert.error("Oops!!", "Something went wrong!!");
              console.log(err.message);
            });
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const goBack = () => {
    navigate(url);
  };

  const getDetailsAttr = (code) => {
    let subType = {};
    switch (code) {
      case "C004":
        const remittance = details.requested_amount * (88 / 100);
        const duct = details.requested_amount * (12 / 100);
        subType = {
          principal: details.requested_amount,
          remittance,
          deduction: duct,
          car: false,
          yearly_deduction: 0,
        };
        break;

      case "C008":
        const rem = details.requested_amount * (70 / 100);
        const deduc = rem * (96 / 100);
        subType = {
          principal: rem,
          remittance: deduc,
          deduction: rem * (4 / 100),
          yearly_deduction: rem / 3,
          car: true,
        };
        break;

      default:
        subType = {
          principal: details.requested_amount,
          remittance: details.requested_amount,
          deduction: 0,
          car: false,
          yearly_deduction: 0,
        };
        break;
    }

    return subType;
  };

  useEffect(() => {
    if (details.sub_budget_head_id > 0) {
      const sub = subBudgetHeads.filter(
        (sub) => sub?.id === details.sub_budget_head_id
      )[0];
      setSubBudgetHead(sub);
      setDetails({
        ...details,
        sub_budget_head_code: sub?.code,
      });
    }
  }, [details.sub_budget_head_id]);

  useEffect(() => {
    if (
      state !== null &&
      state?.loan &&
      state?.members &&
      state?.url !== "" &&
      pathname !== ""
    ) {
      const { loan, members, url } = state;
      setLoan(loan);
      setMembers(members);
      setUrl(url);
      setPath(pathname);
    }
  }, [state, pathname]);

  // console.log(details.approved_amount);

  useEffect(() => {
    if (loan !== null && subBudgetHeads?.length > 0) {
      const amount =
        parseFloat(loan?.approved_amount) > 0
          ? parseFloat(loan?.approved_amount)
          : parseFloat(loan?.requested_amount);

      setDetails({
        ...details,
        requested_amount: amount,
        commitment: parseFloat(loan?.commitment),
        created_at: moment(loan?.created_at).format("LL"),
        id: loan?.id,
        interestSum: parseFloat(loan?.interestSum),
        isArchived: parseInt(loan?.isArchived) === 1,
        paid: parseInt(loan?.paid) === 1,
        reason: loan?.reason,
        request_code: loan?.request_code,
        preferred_tenor: loan?.preferred_tenor,
        state: loan?.state,
        status: loan?.status,
        sub_budget_head_name: loan?.sub_budget_head_name,
        sub_budget_head_id: loan?.sub_budget_head_id,
        sub_budget_head_code: loan?.sub_budget_head_code,
        totalPayable: parseFloat(loan?.totalPayable),
        user_id: parseInt(loan?.user_id),
        approved_amount: parseFloat(loan?.requested_amount),
      });
      setGuarantors(loan?.guarantors);
      setInstallments(loan?.installments);
      // console.log(loan?.installments);
      setSubBudgetHead(
        subBudgetHeads?.filter((sub) => sub?.id === loan?.sub_budget_head_id)[0]
      );
    }
  }, [loan, subBudgetHeads]);
  // console.log(installments);

  useEffect(() => {
    try {
      collection("subBudgetHeads")
        .then((res) => {
          const subs = res.data.data;
          setSubBudgetHeads(
            subs.filter((sub) => sub?.category_label === "loan")
          );
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (subBudgetHead !== null && subBudgetHead?.feature) {
      const { feature } = subBudgetHead;
      const variant = getVariant(feature, details.preferred_tenor);
      const dateComp = getDateComponents();
      setTenors(getRange(feature));
      setDetails({
        ...details,
        measureIn: feature?.frequency,
      });
      const loanObject = {
        subBudgetHead,
        feature: {
          ...feature,
          deduction_month: dateComp.month,
          deduction_year: dateComp.year,
        },
        variant,
        preferred_tenor: details.preferred_tenor,
        requested: details.requested_amount,
      };
      setLoanState(loanObject);
    }
  }, [subBudgetHead, details.requested_amount, details.preferred_tenor]);

  useEffect(() => {
    if (loanState !== null && subBudgetHead !== null) {
      const res = calculator(subBudgetHead, loanState);
      setResult(res);
      setInstallments(res?.installments);
    }
  }, [loanState, subBudgetHead]);

  useEffect(() => {
    if (result !== null && installments?.length > 0) {
      const commitment =
        (parseInt(result?.commitment) / 100) * details.requested_amount;
      const subType = getDetailsAttr(subBudgetHead?.code);

      setDetails({
        ...details,
        interestSum: result?.interestSum,
        interest_rate: result?.interestRate,
        commitment,
        commitment_rate: result?.commitment,
        totalPayable: result?.totalPayable,
        ...subType,
      });
    }
  }, [result, installments]);

  // console.log(installments);

  return (
    <>
      <PageHeader
        pageName="Loan Details"
        headerIcon="info"
        text="Go Back"
        icon="arrow_back"
        handleClick={goBack}
        resource
      />

      <AddGuarantor
        title="Loan Guarantors"
        show={show}
        handleClose={closeForm}
        handleSubmit={handleSubmit}
        data={loan}
        dependencies={{ members }}
        maximum={3 - guarantors?.length}
      />

      <ViewBreakdown
        title="Installmental Payments"
        show={modalShow}
        data={installments}
        handleClose={closeForm}
      />

      <div className="details__card">
        <div className="row">
          <div className="col-md-8">
            <div className="loan__details__card">
              <div className="loan__details__title">
                <span className="material-icons-sharp">article</span>
                <div className="writings">
                  <h3>{`${details.sub_budget_head_name}`}</h3>
                  <p>
                    {details.request_code} requested on {details.created_at}
                  </p>
                </div>
              </div>
              <div className="loan__details__content">
                <div className="row">
                  <div className="col-md-6">
                    <small>Requested Amount</small>
                    <h2>{currency(details.requested_amount)}</h2>
                  </div>
                  {details.car && (
                    <div className="col-md-6">
                      <small>Yearly Deduction (upfront)</small>
                      <h2>{currency(details.yearly_deduction)}</h2>
                    </div>
                  )}
                </div>

                <div className="row mt-4 mb-4">
                  <div className="col-md-4">
                    <small>Interest Sum</small>
                    <h3>{currency(details.interestSum)}</h3>
                  </div>
                  <div className="col-md-4">
                    <small>Commitment</small>
                    <h3>{currency(details.commitment)}</h3>
                  </div>
                  <div className="col-md-4">
                    <small>Total Payable</small>
                    <h3>{currency(details.totalPayable)}</h3>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4">
                    <small>Principal</small>
                    <h3>{currency(details.principal)}</h3>
                  </div>
                  <div className="col-md-4">
                    <small>Deduction</small>
                    <h3>{currency(details.deduction)}</h3>
                  </div>
                  <div className="col-md-4">
                    <small>Remittance</small>
                    <h3>{currency(details.remittance)}</h3>
                  </div>
                </div>
              </div>
              <div className="divider mt-4"></div>
              <div className="guarantors__details__card">
                <div className="loan__details__title">
                  <h2>Guarantors</h2>
                  <button
                    type="button"
                    className="guarantor__bttn"
                    onClick={() => setShow(true)}
                    disabled={
                      details.status !== "pending" || guarantors?.length === 3
                    }
                  >
                    <span className="material-icons-sharp">person_add</span>
                  </button>
                </div>
                <div className="guarantors mt-4">
                  {guarantors?.map((guan, i) => (
                    <div className="item mb-4" key={i}>
                      <div className="info__section">
                        <small className={`${getStatus(guan?.status)}`}>
                          {guan?.status}
                        </small>
                        <h3 className="mt-2 mb-1">{guan.surety}</h3>
                        <p>{guan.membership_no}</p>
                      </div>
                      <div className="modify__section">
                        <button
                          type="button"
                          className="guarantor__bttn"
                          disabled={
                            details.status !== "pending" ||
                            guan.status !== "pending"
                          }
                          onClick={() => removeGuarantor(guan)}
                        >
                          <span className="material-icons-sharp">
                            person_remove
                          </span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="installments__section mb-4">
              <h3 className="mb-4 title">Installmental Payments</h3>
              {installments?.map(
                (ins, i) =>
                  i <= 4 && (
                    <div className="installment__item" key={i}>
                      <div className="ins__details">
                        <h3>{currency(parseFloat(ins?.fee))}</h3>
                        <p>Due Date: {moment(ins?.due_date).format("LL")}</p>
                      </div>
                      <div className="status__section">
                        <div
                          className={`status__bar ${getStatus(ins?.status)}`}
                        ></div>
                      </div>
                    </div>
                  )
              )}

              {installments?.length > 5 && (
                <div className="view__breakdown mt-5">
                  <button
                    type="button"
                    className="breakdown__btn"
                    onClick={() => setModalShow(true)}
                  >
                    <span className="material-icons-sharp">visibility</span>
                    <p>View Breakdown</p>
                  </button>
                </div>
              )}
            </div>
            {path === "/secretariat/loan/details" && (
              <div className="admin__functions">
                <div className="card__title__loan mb-4">
                  <h3 className="title">Official Use</h3>
                  <button
                    type="button"
                    className="side__button bg__secondary"
                    disabled={isUpdating || details.approved_amount > 0}
                    onClick={() => setIsUpdating(true)}
                  >
                    Manage Loan Request
                  </button>
                </div>

                <div className="decision__actions">
                  {isUpdating ? (
                    <form
                      onSubmit={handlePatchLoanRequest}
                      className="form__manage__loan"
                    >
                      <div className="row">
                        <div className="col-md-12">
                          <CustomSelect
                            label="Loan Type"
                            value={details.sub_budget_head_id}
                            onChange={(e) =>
                              setDetails({
                                ...details,
                                sub_budget_head_id: parseInt(e.target.value),
                              })
                            }
                            disabled={!isUpdating}
                          >
                            <CustomSelectOptions
                              value={0}
                              label="Select Loan Type"
                              disabled
                            />

                            {subBudgetHeads?.map((sub) => (
                              <CustomSelectOptions
                                value={sub?.id}
                                label={sub?.name}
                                key={sub?.id}
                              />
                            ))}
                          </CustomSelect>
                        </div>
                        <div className="col-md-12">
                          <TextInput
                            label="Approved Amount"
                            value={details.requested_amount}
                            onChange={(e) =>
                              setDetails({
                                ...details,
                                requested_amount: parseFloat(e.target.value),
                              })
                            }
                            disabled={!isUpdating}
                          />
                        </div>
                        <div className="col-md-12">
                          <CustomSelect
                            label="Approved Tenor"
                            value={details.preferred_tenor}
                            onChange={(e) =>
                              setDetails({
                                ...details,
                                preferred_tenor: parseInt(e.target.value),
                              })
                            }
                            disabled={!isUpdating}
                          >
                            <CustomSelectOptions
                              value={0}
                              label="Select Prefered Tenor"
                              disabled
                            />

                            {tenors?.map((tenor, i) => (
                              <CustomSelectOptions
                                value={tenor}
                                label={tenor + " " + details.measureIn}
                                key={i}
                              />
                            ))}
                          </CustomSelect>
                        </div>
                        <div className="col-md-12 mb-2">
                          <button
                            type="submit"
                            className="side__button block__bttn bg__primary"
                            disabled={!isUpdating}
                          >
                            Update Loan Request
                          </button>
                        </div>
                        <div className="col-md-12">
                          <button
                            type="button"
                            className="side__button block__bttn bg__danger"
                            onClick={() => setIsUpdating(false)}
                            disabled={!isUpdating}
                          >
                            Cancel Update
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="row">
                      <div className="col-md-12 mb-3">
                        <button
                          type="button"
                          className="side__button block__bttn bg__danger"
                          disabled={
                            isUpdating || details.status !== "registered"
                          }
                          onClick={() => makeLoanDecision("denied")}
                        >
                          Decline Loan Request
                        </button>
                      </div>
                      <div className="col-md-12">
                        <button
                          type="button"
                          className="side__button block__bttn bg__primary"
                          disabled={
                            isUpdating || details.status !== "registered"
                          }
                          onClick={() => makeLoanDecision("approved")}
                        >
                          Approve Loan Request
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewLoan;
