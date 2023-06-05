import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

import { FilterMatchMode } from "primereact/api";
import { InputText } from "primereact/inputtext";
import { currency } from "../../app/helpers";
import moment from "moment";

const TableComponent = ({
  columns,
  data,
  manageData = undefined,
  viewData = undefined,
  print = undefined,
  reverse = undefined,
  isSearchable = false,
  manage = false,
  guarantors = false,
  destroy = undefined,
  postPayment = undefined,
  deposit = undefined,
}) => {
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const actionBodyTemplate = (raw) => {
    return (
      <button
        type="button"
        className="table__action__btn"
        onClick={() => manageData(raw)}
      >
        <span className="material-icons-sharp">settings</span>
      </button>
    );
  };

  const postPaymentTemplate = (raw) => {
    return (
      <button
        type="button"
        className="table__action__btn bg__primary"
        onClick={() => postPayment(raw)}
      >
        <span className="material-icons-sharp">post_add</span>
      </button>
    );
  };

  const printBodyTemplate = (raw) => {
    return (
      <button
        type="button"
        className="table__print__btn bg__dark"
        onClick={() => print(raw)}
      >
        <span className="material-icons-sharp">print</span>
      </button>
    );
  };

  const reverseBodyTemplate = (raw) => {
    return (
      <button
        type="button"
        className="table__print__btn bg__danger"
        onClick={() => reverse(raw)}
        disabled={!raw?.canBeReversed || raw?.status !== "pending"}
      >
        <span className="material-icons-sharp">history</span>
      </button>
    );
  };

  const destroyBodyTemplate = (raw) => {
    return (
      <button
        type="button"
        className="table__print__btn bg__danger"
        onClick={() => destroy(raw)}
      >
        <span className="material-icons-sharp">delete</span>
      </button>
    );
  };

  const checkVerification = (raw) => {
    for (const property in raw) {
      if (property === "updated_at") {
        return raw["status"] !== "verified" ? (
          <p className="text-danger">Not Verified</p>
        ) : (
          moment(raw[property]).format("LL")
        );
      }
    }
  };

  const dateBodyTemplate = (raw) => {
    for (const property in raw) {
      if (
        property === "created_at" ||
        property === "updated_at" ||
        property === "post_date" ||
        property === "due_date" ||
        property === "paid_at"
      ) {
        return moment(raw[property]).format("LL");
      }
    }
  };

  const approveBodyTemplate = (raw) => {
    return (
      <button
        type="button"
        className="table__print__btn bg__primary"
        onClick={() => deposit(raw, "verified")}
        disabled={raw?.status !== "pending"}
      >
        <span className="material-icons-sharp">done</span>
      </button>
    );
  };

  const declinedBodyTemplate = (raw) => {
    return (
      <button
        type="button"
        className="table__print__btn bg__danger"
        onClick={() => deposit(raw, "failed")}
        disabled={raw?.status !== "pending"}
      >
        <span className="material-icons-sharp">do_not_disturb_on</span>
      </button>
    );
  };

  const actionGuarantorsTemplate = (raw) => {
    return (
      <>
        {raw?.guarantors?.length < 3 ? (
          <button
            type="button"
            className="table__action__btn bg__primary"
            onClick={() => manageData(raw)}
          >
            <span className="material-icons-sharp">groups</span>
          </button>
        ) : (
          <div className="verified_badge">
            <span className="material-icons-sharp">verified</span>
          </div>
        )}
      </>
    );
  };

  const viewDataTemplate = (raw) => {
    return (
      <button
        type="button"
        className="view__action__btn"
        onClick={() => viewData(raw)}
      >
        <span className="material-icons-sharp">visibility</span>
      </button>
    );
  };

  const currencyTemplate = (raw) => {
    for (const property in raw) {
      if (
        property === "fee" ||
        property === "contribution_fee" ||
        property === "booked_expenditure" ||
        property === "requested_amount" ||
        property === "amount"
      ) {
        return currency(raw[property]);
      }
    }
  };

  const specialCurrency = (raw) => {
    for (const property in raw) {
      if (property === "approved_amount" || property === "total_amount") {
        return currency(raw[property]);
      }
    }
  };

  const statusTemplate = (raw) => {
    for (const property in raw) {
      if (property === "status") {
        return (
          <span className={`stat_badge ${getStatus(raw[property])}`}></span>
        );
      }
    }
  };

  const getStatus = (text) => {
    let status;

    switch (text) {
      case "pending":
        status = "stat_warning";
        break;

      case "registered" || "completed":
        status = "stat_secondary";
        break;

      case "approved" || "verified" || "awarded":
        status = "stat_primary";
        break;

      case "denied" || "incomplete":
        status = "stat_danger";
        break;

      default:
        status = "stat_info";
        break;
    }

    return status;
  };

  const percentageTemplate = (raw) => {
    const keys = Object.keys(raw);
    console.log(keys, raw);
    return `${raw[getPercentageKey(keys)]}%`;
  };

  const getPercentageKey = (keys) => {
    switch (keys) {
      case keys.includes("interest_rate"):
        return "interest_rate";

      default:
        return "commitment";
    }
  };

  return (
    <div className="col-md-12">
      <div className="responsive__table">
        {isSearchable && (
          <InputText
            className="serach__bar"
            placeholder="Search Record"
            onInput={(e) =>
              setFilters({
                global: {
                  value: e.target.value,
                  matchMode: FilterMatchMode.CONTAINS,
                },
              })
            }
          />
        )}

        <DataTable
          value={data}
          filters={filters}
          paginator
          rows={10}
          rowsPerPageOptions={[2, 10, 25, 50, 100]}
          totalRecords={data?.length}
        >
          {columns.map((col, i) => {
            if (col?.currency) {
              return (
                <Column
                  key={i}
                  field={col.field}
                  header={col.header}
                  sortable={col.isSortable}
                  body={currencyTemplate}
                />
              );
            } else if (col?.approved_currency) {
              return (
                <Column
                  key={i}
                  field={col.field}
                  header={col.header}
                  sortable={col.isSortable}
                  body={specialCurrency}
                />
              );
            } else if (col?.percentage) {
              return (
                <Column
                  key={i}
                  field={col.field}
                  header={col.header}
                  sortable={col.isSortable}
                  body={percentageTemplate}
                />
              );
            } else if (col?.status) {
              return (
                <Column
                  key={i}
                  field={col.field}
                  header={col.header}
                  sortable={col.isSortable}
                  body={statusTemplate}
                />
              );
            } else if (col?.date) {
              return (
                <Column
                  key={i}
                  field={col.field}
                  header={col.header}
                  sortable={col.isSortable}
                  body={dateBodyTemplate}
                />
              );
            } else if (col?.verified) {
              return (
                <Column
                  key={i}
                  field={col.field}
                  header={col.header}
                  sortable={col.isSortable}
                  body={checkVerification}
                />
              );
            } else {
              return (
                <Column
                  key={i}
                  field={col.field}
                  header={col.header}
                  sortable={col.isSortable}
                />
              );
            }
          })}
          {manage && <Column body={actionBodyTemplate} />}
          {guarantors && <Column body={actionGuarantorsTemplate} />}
          {viewData && <Column body={viewDataTemplate} />}
          {print !== undefined && <Column body={printBodyTemplate} />}
          {reverse !== undefined && <Column body={reverseBodyTemplate} />}
          {destroy !== undefined && <Column body={destroyBodyTemplate} />}
          {postPayment !== undefined && <Column body={postPaymentTemplate} />}
          {deposit !== undefined && <Column body={approveBodyTemplate} />}
          {deposit !== undefined && <Column body={declinedBodyTemplate} />}
        </DataTable>
      </div>
    </div>
  );
};

export default TableComponent;
