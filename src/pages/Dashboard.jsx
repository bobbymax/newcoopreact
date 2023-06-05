import React from "react";
import PageHeader from "../template/includes/PageHeader";
import { formatCompactNumber } from "../app/helpers";
import Pie from "./charts/Pie";

const Dashboard = () => {
  return (
    <>
      <PageHeader pageName="Insights" headerIcon="dashboard" />

      {/* Insights for Admin Users */}
      <div className="insights">
        <div className="row">
          <div className="col-md-8">
            <div className="row">
              <div className="col-md-4">
                <div className="insight__cards card__text-white card__dark">
                  <span className="material-icons-sharp span__dark-shade">
                    groups
                  </span>
                  <small>Registered Members</small>
                  <h1>{formatCompactNumber(253)}</h1>
                </div>
              </div>
              <div className="col-md-4">
                <div className="insight__cards card__text-mute card__white">
                  <span className="material-icons-sharp span__dark-shade">
                    account_balance
                  </span>
                  <small>Approved Budget</small>
                  <h1>{formatCompactNumber(369032190)}</h1>
                </div>
              </div>
              <div className="col-md-4">
                <div className="insight__cards card__text-mute card__white">
                  <span className="material-icons-sharp span__dark-shade">
                    wallet
                  </span>
                  <small>Current Loans</small>
                  <h1>{formatCompactNumber(120000000)}</h1>
                </div>
              </div>
              <div className="col-md-4">
                <div className="insight__cards card__text-white card__warning">
                  <span className="material-icons-sharp span__info-shade">
                    payments
                  </span>
                  <small>Amount Spent</small>
                  <h1>{formatCompactNumber(28930211)}</h1>
                </div>
              </div>
              <div className="col-md-4">
                <div className="insight__cards card__text-mute card__white">
                  <span className="material-icons-sharp span__dark-shade">
                    savings
                  </span>
                  <small>Amount Received</small>
                  <h1>{formatCompactNumber(623454924)}</h1>
                </div>
              </div>
              <div className="col-md-4">
                <div className="insight__cards card__text-mute card__white">
                  <span className="material-icons-sharp span__dark-shade">
                    pending
                  </span>
                  <small>Payments Pending</small>
                  <h1>{formatCompactNumber(10)}</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="insight__cards card__white">
              <Pie />
            </div>
          </div>

          <div className="col-md-12">
            <div className="table__cards card__white">
              <div className="transactions">
                <h3>Transaction History</h3>

                <table className="recent__transactions mt-3">
                  <tbody>
                    <tr>
                      <td>
                        <div className="beneficiary">
                          <span className="material-icons-sharp">person</span>
                          <h3>Victor Babarinde</h3>
                        </div>
                      </td>
                      <td>Debit</td>
                      <td>10th May, 2023</td>
                      <td>
                        <h3>NGN {formatCompactNumber(500000)}</h3>
                      </td>
                      <td>status</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
