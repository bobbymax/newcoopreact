import React, { useEffect, useState } from "react";
import PageHeader from "../template/includes/PageHeader";
import { formatCompactNumber } from "../app/helpers";
import DashboardCards from "../components/DashboardCards";
import { useStateContext } from "../context/ContextProvider";
import { collection } from "../app/http/controllers";
import moment from "moment";

const Dashboard = () => {
  const { auth } = useStateContext();
  const [roles, setRoles] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [dashCards, setDashCards] = useState(undefined);

  const [members, setMembers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [budgetHeads, setBudgetHeads] = useState([]);
  const [installments, setInstallments] = useState([]);
  const [expenditures, setExpenditures] = useState([]);
  const [total, setTotal] = useState(0);

  const cards = [
    {
      name: "Registered Members",
      icon: "groups",
      value: members.length,
      vairiant: "card__dark",
      currency: false,
      isAdmin: true,
    },
    {
      name: "Approved Budget",
      icon: "account_balance",
      value: total,
      vairiant: "card__white",
      currency: true,
      isAdmin: true,
    },
    {
      name: "Current Loans",
      icon: "wallet",
      value: loans
        .map((loan) => parseFloat(loan?.approved_amount))
        .reduce((sum, curr) => sum + curr, 0),
      vairiant: "card__white",
      currency: true,
      isAdmin: true,
    },
    {
      name: "Amount Spent",
      icon: "payments",
      value: expenditures
        .filter((exp) => exp?.status === "paid")
        .map((exp) => parseFloat(exp?.amount))
        .reduce((sum, curr) => sum + curr, 0),
      vairiant: "card__dark",
      currency: true,
      isAdmin: true,
    },
    {
      name: "Amount Received",
      icon: "savings",
      value: installments
        .map((ins) => parseFloat(ins?.fee))
        .reduce((sum, curr) => sum + curr, 0),
      vairiant: "card__white",
      currency: true,
      isAdmin: true,
    },
    {
      name: "Payments Pending",
      icon: "pending",
      value: expenditures
        .filter((exp) => exp?.status !== "paid")
        .map((exp) => parseFloat(exp?.amount))
        .reduce((sum, curr) => sum + curr, 0),
      vairiant: "card__white",
      currency: true,
      isAdmin: true,
    },
  ];

  useEffect(() => {
    if (auth !== null && auth?.attributes?.roles?.length > 0) {
      const { roles } = auth?.attributes;
      setRoles(roles);

      try {
        const urls = ["member/transactions", "dashboard/cards"];

        const requests = urls.map((url) => collection(url));

        Promise.all(requests)
          .then((res) => {
            const transactions = res[0].data.data;
            const dashboards = res[1].data.data;
            setTransactions(transactions);
            setDashCards(dashboards);

            // console.log(rles);
          })
          .catch((err) => console.error(err.message));
      } catch (error) {
        console.error(error);
      }
    }
  }, [auth]);

  useEffect(() => {
    if (dashCards !== undefined) {
      const { members, loans, expenditures, installments, budgetHeads } =
        dashCards;

      setMembers(members);
      setLoans(loans);
      setExpenditures(expenditures);
      setInstallments(installments);
      setBudgetHeads(budgetHeads);
    }
  }, [dashCards]);

  useEffect(() => {
    if (budgetHeads.length > 0) {
      const sum = budgetHeads
        .map((head) => parseFloat(head?.fund?.approved_amount))
        .reduce((sum, curr) => sum + curr, 0);

      setTotal(sum);
    }
  }, [budgetHeads]);

  return (
    <>
      <PageHeader pageName="Insights" headerIcon="dashboard" />

      {/* Insights for Admin Users */}
      {(roles?.length > 1 || roles.includes("super-administrator")) && (
        <div className="insights">
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                {cards.map((card, i) => (
                  <div className="col-md-3" key={i}>
                    <DashboardCards
                      icon={card.icon}
                      name={card.name}
                      value={card.value}
                      variant={card.vairiant}
                      currency={card.currency}
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* <div className="col-md-4">
              <div className="insight__cards card__white">
                <Pie />
              </div>
            </div> */}

            <div className="col-md-12">
              <div className="table__cards card__white">
                <div className="transactions">
                  <h3>Transaction History</h3>

                  <table className="recent__transactions mt-3">
                    <tbody>
                      {transactions.map(
                        (payment, i) =>
                          i <= 5 && (
                            <tr key={payment.id}>
                              <td>
                                <div className="beneficiary">
                                  <span className="material-icons-sharp">
                                    person
                                  </span>
                                  <h3>{payment.beneficiary}</h3>
                                </div>
                              </td>
                              <td className="payment_type">
                                {payment.payment_type}
                              </td>
                              <td>{moment(payment.posted_at).format("LL")}</td>
                              <td>
                                <h3>
                                  NGN{" "}
                                  {formatCompactNumber(
                                    parseFloat(payment.amount)
                                  )}
                                </h3>
                              </td>
                            </tr>
                          )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
