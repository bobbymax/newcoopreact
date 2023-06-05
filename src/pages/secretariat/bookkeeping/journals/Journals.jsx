/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import PageHeader from "../../../../template/includes/PageHeader";
import {
  Button,
  CustomSelect,
  CustomSelectOptions,
  TextInput,
} from "../../../../template/components/Inputs";
import {
  batchRequests,
  collection,
  fetch,
  store,
} from "../../../../app/http/controllers";
import axios from "axios";
import Alert from "../../../../app/services/alert";

const Journals = () => {
  const initialState = {
    id: 0,
    expenditure_id: 0,
    chart_of_account_id: 0,
    credit_account_id: 0,
    debit_account_id: 0,
    depositor: "",
    beneficiary: "",
    amount: 0,
    type: "",
  };

  const [state, setState] = useState(initialState);
  const [code, setCode] = useState("");
  const [expenditure, setExpenditure] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [charts, setCharts] = useState([]);
  const [debitAccs, setDebitAccs] = useState([]);
  const [creditAccs, setCreditAccs] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchExpenditure = () => {
    try {
      fetch("fetch/expenditures", code)
        .then((res) => {
          const response = res.data.data;

          if (response?.journal) {
            setError("This transaction has been posted allready");
          } else {
            setExpenditure(response);
            setError("");
          }
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  };

  const stage = (obj) => {
    const { expType, org, ben } = obj;

    switch (expType) {
      case "inflow":
        setDebitAccs(ben?.accounts);
        setCreditAccs(org?.accounts);
        break;

      default:
        setDebitAccs(org?.accounts);
        setCreditAccs(ben?.accounts);
        break;
    }
  };

  const resetForm = () => {
    setExpenditure(null);
    setDebitAccs([]);
    setCreditAccs([]);
    setLedgers([]);
    setLoading(false);
    setError("");
    setCode("");
    setState(initialState);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const body = {
      expenditure_id: state.expenditure_id,
      chart_of_account_id: state.chart_of_account_id,
      credit_account_id: state.credit_account_id,
      debit_account_id: state.debit_account_id,
      ledgers,
    };

    try {
      store("journals", body)
        .then((res) => {
          const response = res.data;
          Alert.success("Posted!!", response.message);
          resetForm();
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (
      state.debit_account_id > 0 &&
      state.credit_account_id > 0 &&
      state.amount > 0
    ) {
      const ledgerD = {
        account_id: state.debit_account_id,
        amount: state.amount,
        type: "D",
      };

      const ledgerC = {
        account_id: state.credit_account_id,
        amount: state.amount,
        type: "C",
      };

      setLedgers([ledgerD, ledgerC]);
    }
  }, [state.debit_account_id, state.amount, state.credit_account_id]);

  useEffect(() => {
    if (
      expenditure !== null &&
      expenditure?.attributes &&
      expenditure?.attributes?.beneficiary &&
      organization !== null &&
      organization?.accounts?.length > 0
    ) {
      const { beneficiary } = expenditure?.attributes;
      const { accounts } = organization;

      const buildUp = {
        expType: expenditure.type,
        org: {
          name: organization.name,
          accounts: accounts,
        },
        ben: {
          name: beneficiary?.name,
          accounts: beneficiary?.accounts,
        },
      };

      stage(buildUp);
      setState({
        ...state,
        depositor:
          expenditure?.type === "inflow" ? beneficiary.name : organization.name,
        beneficiary:
          expenditure?.type === "inflow" ? organization.name : beneficiary.name,
        amount: parseFloat(expenditure?.amount),
        expenditure_id: expenditure?.id,
        type: expenditure?.type,
      });
    }
  }, [expenditure, organization]);

  useEffect(() => {
    try {
      const chartsData = collection("chartOfAccounts");
      const org = collection("retrieve/owner");

      batchRequests([chartsData, org])
        .then(
          axios.spread((...res) => {
            setCharts(res[0].data.data);
            setOrganization(res[1].data.data);
          })
        )
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <PageHeader pageName="Journals" />

      <div className="row">
        {error !== "" && (
          <div className="col-md-12 mb-4">
            <p className="text-danger text-center">{error}</p>
          </div>
        )}
        <div className="col-md-4">
          <div className="input__div">
            <TextInput
              label="Transaction ID"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter Ref Code"
            />
            <Button
              type="button"
              text="Fetch Expenditure"
              isLoading={loading}
              icon="add_circle"
              disabled={code === ""}
              handleClick={fetchExpenditure}
            />
          </div>
        </div>
        <div className="col-md-8">
          <div className="input__div">
            <div className="top__journal__section mb-4">
              <p>{state.type}</p>
            </div>
            <div className="journal__main">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-12">
                    <TextInput
                      label="Amount"
                      value={state.amount}
                      onChange={(e) =>
                        setState({
                          ...state,
                          amount: parseFloat(e.target.value),
                        })
                      }
                      disabled
                    />
                  </div>
                  <div className="col-md-12">
                    <CustomSelect
                      label="Chart of Accounts"
                      value={state.chart_of_account_id}
                      onChange={(e) =>
                        setState({
                          ...state,
                          chart_of_account_id: parseInt(e.target.value),
                        })
                      }
                    >
                      <CustomSelectOptions
                        label="Select Chart of Account"
                        value={0}
                        disabled
                      />

                      {charts.map((chart) => (
                        <CustomSelectOptions
                          key={chart.id}
                          label={chart.name}
                          value={chart.id}
                        />
                      ))}
                    </CustomSelect>
                  </div>
                  <div className="col-md-12 mb-4">
                    <p className="mb-3 sections_journals">Debit</p>
                    <div className="form__actions">
                      <TextInput
                        label="Depositor"
                        value={state.depositor}
                        onChange={(e) =>
                          setState({ ...state, depositor: e.target.value })
                        }
                        placeholder="Depositor Name"
                        disabled
                      />
                      <CustomSelect
                        label="Account"
                        value={state.debit_account_id}
                        onChange={(e) =>
                          setState({
                            ...state,
                            debit_account_id: parseInt(e.target.value),
                          })
                        }
                      >
                        <CustomSelectOptions
                          value={0}
                          label="Select Debit Account"
                          disabled
                        />

                        {debitAccs.map((deb, i) => (
                          <CustomSelectOptions
                            key={i}
                            value={deb?.id}
                            label={`${deb.account_number} - ${deb.bank_name}`}
                          />
                        ))}
                      </CustomSelect>
                    </div>
                  </div>

                  <div className="col-md-12 mb-5">
                    <p className="mb-3 sections_journals">Credit</p>
                    <div className="form__actions">
                      <TextInput
                        label="Beneficiary"
                        value={state.beneficiary}
                        onChange={(e) =>
                          setState({ ...state, beneficiary: e.target.value })
                        }
                        placeholder="Beneficiary Name"
                        disabled
                      />
                      <CustomSelect
                        label="Account"
                        value={state.credit_account_id}
                        onChange={(e) =>
                          setState({
                            ...state,
                            credit_account_id: parseInt(e.target.value),
                          })
                        }
                      >
                        <CustomSelectOptions
                          value={0}
                          label="Select Credit Account"
                          disabled
                        />

                        {creditAccs.map((account, i) => (
                          <CustomSelectOptions
                            key={i}
                            value={account?.id}
                            label={`${account.account_number} - ${account.bank_name}`}
                          />
                        ))}
                      </CustomSelect>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <Button
                      type="submit"
                      text="Post Payment"
                      isLoading={loading}
                      icon="post_add"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Journals;
