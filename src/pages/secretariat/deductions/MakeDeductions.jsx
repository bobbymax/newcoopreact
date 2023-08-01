import React, { useEffect, useState } from "react";
import PageHeader from "../../../template/includes/PageHeader";
import { batchRequests, collection } from "../../../app/http/controllers";
import axios from "axios";
import TableComponent from "../../../template/components/TableComponent";
import {
  CustomSelect,
  CustomSelectOptions,
} from "../../../template/components/Inputs";

const MakeDeductions = () => {
  const initialState = {
    sub_budget_head_id: 0,
    credit_account_id: 0,
    chart_of_account_id: 0,
  };

  const [state, setState] = useState(initialState);
  // eslint-disable-next-line no-unused-vars
  const [owner, setOwner] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [subBudgetHeads, setSubBudgetHeads] = useState([]);
  const [charts, setCharts] = useState([]);
  const [installments, setInstallments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [day, setDay] = useState(0);

  const columns = [
    {
      field: "membership_no",
      header: "Member ID",
      isSortable: true,
    },
    {
      field: "name",
      header: "Name",
      isSortable: true,
    },
    {
      field: "fee",
      header: "Amount",
      isSortable: false,
      currency: true,
    },
    {
      field: "due_date",
      header: "Date Due",
      isSortable: false,
      date: true,
    },
    {
      field: "status",
      header: "Status",
      isSortable: false,
      status: true,
    },
  ];

  const resetComponent = () => {
    setIsLoading(false);
    setState(initialState);
  };

  const makeLoanDeductions = (e) => {
    e.preventDefault();

    const requests = {
      ...state,
      data: installments,
    };

    console.log(requests);
  };

  useEffect(() => {
    try {
      const ownerData = collection("retrieve/owner");
      const subsData = collection("subBudgetHeads");
      const chartsData = collection("chartOfAccounts");
      const installmentsData = collection("installments");
      setIsLoading(true);

      batchRequests([ownerData, subsData, chartsData, installmentsData])
        .then(
          axios.spread((...res) => {
            const own = res[0].data.data;
            const subs = res[1].data.data;
            const chars = res[2].data.data;
            const ins = res[3].data.data;

            setOwner(own);
            setAccounts(own?.accounts ?? []);
            setSubBudgetHeads(subs);
            setCharts(chars);
            setInstallments(ins);
            setIsLoading(false);
          })
        )
        .catch((err) => {
          console.log(err.message);
          setIsLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const date = new Date();
    setDay(date.getDate());
  }, []);

  return (
    <>
      <PageHeader pageName="Deduct Members" headerIcon="apps" />

      <div className="row mb-4">
        <div className="col-md-5">
          <div className="form__card">
            <form onSubmit={makeLoanDeductions}>
              <div className="row">
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
                    disabled={day < 26}
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
                    label="Credit Amount To"
                    value={state.credit_account_id}
                    onChange={(e) =>
                      setState({
                        ...state,
                        credit_account_id: parseInt(e.target.value),
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
                <div className="col-md-12 mt-3">
                  <button
                    type="submit"
                    className="import__bttn import_bg_dark"
                    disabled={
                      isLoading ||
                      state.chart_of_account_id < 1 ||
                      state.credit_account_id < 1 ||
                      day < 26
                    }
                  >
                    <span className="material-icons-sharp">mail</span>
                    <p>Make Deductions</p>
                  </button>
                </div>
                <div className="col-md-12 mt-3">
                  <button
                    type="button"
                    className="import__bttn bg__danger"
                    onClick={resetComponent}
                    disabled={day < 26}
                  >
                    <span className="material-icons-sharp">history</span>
                    <p>Reset Form</p>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="data__content">
        <div className="row">
          <TableComponent columns={columns} data={installments} isSearchable />
        </div>
      </div>
    </>
  );
};

export default MakeDeductions;
