import React, { useEffect, useState } from "react";
import PageHeader from "../../../template/includes/PageHeader";
import {
  CustomSelect,
  CustomSelectOptions,
  TextInput,
} from "../../../template/components/Inputs";
import * as XLSX from "xlsx";
import { convertToJson, getExtension } from "../../../app/helpers";
import TableComponent from "../../../template/components/TableComponent";
import { formatCompactNumber } from "../../../app/helpers";
import {
  batchRequests,
  collection,
  fetch,
} from "../../../app/http/controllers";
import axios from "axios";
import Alert from "../../../app/services/alert";

const CreditMembers = () => {
  const initialState = {
    expenditure_id: 0,
    sub_budget_head_id: 0,
    debit_account_id: 0,
    type: "credit-members",
    chart_of_account_id: 0,
    exp_code: "",
  };

  const [state, setState] = useState(initialState);
  const [cols, setCols] = useState([]);
  const [data, setData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [owner, setOwner] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [subBudgetHeads, setSubBudgetHeads] = useState([]);
  const [charts, setCharts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileUpload, setFileUpload] = useState("");
  const [members, setMembers] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [expenditure, setExpenditure] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    const requests = {
      ...state,
      data,
    };

    console.log(requests);
  };

  const resetComponent = () => {
    setIsLoading(false);
    setCols([]);
    setData([]);
    setFileUpload("");
    setExpenditure(null);
    setState(initialState);
  };

  const importExcel = (e) => {
    const file = e.target.files[0];

    setFileUpload(e.target.value);

    const reader = new FileReader();
    reader.onload = (event) => {
      const bstr = event.target.result;
      const workBook = XLSX.read(bstr, { type: "binary" });

      // get first sheet
      const workSheetName = workBook.SheetNames[0];
      const workSheet = workBook.Sheets[workSheetName];

      // convert to array
      const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 });
      const headers = fileData[0];
      const heads = headers.map((head) => ({
        header: head,
        field: head,
      }));
      setCols(heads);

      fileData.splice(0, 1);
      setData(convertToJson(headers, fileData));
    };

    if (file) {
      if (getExtension(file)) {
        reader.readAsBinaryString(file);
      } else {
        alert("Invalid file input, Select Excel or CSV file");
      }
    } else {
      setData([]);
      setCols([]);
    }
  };

  const fetExp = () => {
    try {
      fetch("fetch/expenditures", state.exp_code)
        .then((res) => {
          const exp = res.data.data;

          if (exp?.journal) {
            Alert.error("Sad", "You have posted this payment already");
            setState({ ...state, exp_code: "" });
          } else {
            setExpenditure(exp);
            setState({
              ...state,
              expenditure_id: exp?.id,
              sub_budget_head_id: exp?.sub_budget_head_id,
            });
          }
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const total = data
      ?.map((dt) => parseFloat(dt?.amount))
      .reduce((sum, curr) => sum + curr, 0);
    setMembers(data?.length);
    setTotalAmount(total);
  }, [cols, data]);

  useEffect(() => {
    try {
      const owner = collection("retrieve/owner");
      const subsData = collection("subBudgetHeads");
      const chartsData = collection("chartOfAccounts");

      batchRequests([owner, subsData, chartsData])
        .then(
          axios.spread((...res) => {
            const own = res[0].data.data;
            const subs = res[1].data.data;
            const chars = res[2].data.data;

            setOwner(own);
            setAccounts(own?.accounts);
            setSubBudgetHeads(subs);
            setCharts(chars);
          })
        )
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <PageHeader pageName="Credit Members" headerIcon="savings" />

      <div className="data__content">
        <div className="row">
          <div className="col-md-7">
            <div className="form__card mb-5">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-md-9">
                        <TextInput
                          label="Expenditure"
                          value={state.exp_code}
                          onChange={(e) =>
                            setState({ ...state, exp_code: e.target.value })
                          }
                          placeholder="Enter Code"
                        />
                      </div>
                      <div className="col-md-3">
                        <button
                          type="button"
                          className="input__bttn bg__secondary"
                          onClick={fetExp}
                          disabled={
                            state.exp_code === "" || expenditure !== null
                          }
                        >
                          <span className="material-icons-sharp">
                            compare_arrows
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <CustomSelect
                      label="Chart of Account"
                      value={state.chart_of_account_id}
                      onChange={(e) =>
                        setState({
                          ...state,
                          chart_of_account_id: parseInt(e.target.value),
                        })
                      }
                      disabled={expenditure === null}
                    >
                      <CustomSelectOptions
                        label="Select Chart of Account"
                        value={0}
                        disabled
                      />
                      {charts.map((chart) => (
                        <CustomSelectOptions
                          key={chart.id}
                          value={chart.id}
                          label={`${chart.code} - ${chart.name}`}
                        />
                      ))}
                    </CustomSelect>
                  </div>
                  <div className="col-md-12">
                    <CustomSelect
                      label="Budget Head"
                      value={state.sub_budget_head_id}
                      onChange={(e) =>
                        setState({
                          ...state,
                          sub_budget_head_id: parseInt(e.target.value),
                        })
                      }
                      disabled={state.chart_of_account_id < 1}
                    >
                      <CustomSelectOptions
                        label="Select Budget Head"
                        value={0}
                        disabled
                      />
                      {subBudgetHeads.map((sub) => (
                        <CustomSelectOptions
                          key={sub.id}
                          value={sub.id}
                          label={`${sub.code} - ${sub.name}`}
                        />
                      ))}
                    </CustomSelect>
                  </div>
                  <div className="col-md-12">
                    <CustomSelect
                      label="Debit Amount From"
                      value={state.debit_account_id}
                      onChange={(e) =>
                        setState({
                          ...state,
                          debit_account_id: parseInt(e.target.value),
                        })
                      }
                      disabled={state.sub_budget_head_id < 1}
                    >
                      <CustomSelectOptions
                        label="Select Account"
                        value={0}
                        disabled
                      />
                      {accounts.map((account) => (
                        <CustomSelectOptions
                          key={account.id}
                          value={account.id}
                          label={`${account?.account_number} - ${account?.bank_name}`}
                        />
                      ))}
                    </CustomSelect>
                  </div>
                  <div className="col-md-12">
                    <TextInput
                      type="file"
                      label="Upload Contributions"
                      value={fileUpload}
                      onChange={importExcel}
                      disabled={state.debit_account_id < 1}
                    />
                  </div>
                  <div className="col-md-12 mt-3">
                    <button
                      type="submit"
                      className="import__bttn import_bg_dark"
                      disabled={
                        cols?.length < 1 || data?.length < 1 || isLoading
                      }
                    >
                      <span className="material-icons-sharp">mail</span>
                      <p>Credit Members</p>
                    </button>
                  </div>
                  <div className="col-md-12 mt-3">
                    <button
                      type="button"
                      className="import__bttn bg__danger"
                      onClick={resetComponent}
                    >
                      <span className="material-icons-sharp">history</span>
                      <p>Reset Form</p>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-5">
            <div className="form__card">
              <div className="credit__items">
                <h3>Expenditure Amount</h3>
                <h1>
                  {formatCompactNumber(parseFloat(expenditure?.amount)) ?? 0}
                </h1>
              </div>

              <div className="credit__items">
                <h3>Total Members</h3>
                <h1>{members}</h1>
              </div>

              <div className="credit__items">
                <h3>Total Contributions</h3>
                <h1>{formatCompactNumber(totalAmount)}</h1>
              </div>

              <div className="credit__items">
                <h3>Purpose</h3>
                <p>{expenditure?.description ?? "N/A"}</p>
              </div>
            </div>
          </div>
          {cols?.length > 0 && data?.length > 0 && (
            <TableComponent data={data} columns={cols} />
          )}
        </div>
      </div>
    </>
  );
};

export default CreditMembers;
