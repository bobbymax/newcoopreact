import { lazy } from "react";

const Login = lazy(() => import("../../pages/Login"));
const Dashboard = lazy(() => import("../../pages/Dashboard"));
const PageModule = lazy(() => import("../../pages/Module"));
const Modules = lazy(() => import("../../pages/modules/Modules"));
const Import = lazy(() => import("../../pages/Import"));

const Categories = lazy(() =>
  import("../../pages/secretariat/categories/Categories")
);
const AccountCodes = lazy(() =>
  import("../../pages/secretariat/bookkeeping/AccountCodes")
);
const ChartOfAccounts = lazy(() =>
  import("../../pages/secretariat/bookkeeping/chartofaccounts/ChartOfAccounts")
);
const BudgetHeads = lazy(() =>
  import("../../pages/secretariat/budget-heads/BudgetHeads")
);
const SubBudgetHeads = lazy(() =>
  import("../../pages/secretariat/sub-budget-heads/SubBudgetHeads")
);
const Funds = lazy(() => import("../../pages/secretariat/funds/Funds"));
const Features = lazy(() =>
  import("../../pages/secretariat/features/Features")
);
const Expenditures = lazy(() =>
  import("../../pages/secretariat/expenditures/Expenditures")
);

const Batch = lazy(() => import("../../pages/secretariat/batches/Batch"));
const Payments = lazy(() => import("../../pages/secretariat/batches/Payments"));
const PrintPayment = lazy(() =>
  import("../../pages/secretariat/batches/PrintPayment")
);

const Loans = lazy(() => import("../../pages/stakeholders/loans/Loans"));
const ViewLoan = lazy(() => import("../../pages/stakeholders/loans/ViewLoan"));
const Surety = lazy(() => import("../../pages/stakeholders/activities/Surety"));
const RegisteredLoans = lazy(() =>
  import("../../pages/secretariat/loans/RegisteredLoans")
);

export const routes = {
  guest: [
    {
      name: "Login",
      element: <Login />,
      url: "/auth/login",
    },
  ],

  protected: [
    {
      name: "Insights",
      element: <Dashboard />,
      url: "/dashboard",
    },
    {
      name: "Administration",
      element: <PageModule />,
      url: "/administration",
    },
    {
      name: "Secretariat",
      element: <PageModule />,
      url: "/secretariat",
    },
    {
      name: "Registered Loans",
      element: <RegisteredLoans />,
      url: "/secretariat/registered-loans",
    },
    {
      name: "Account Codes",
      element: <AccountCodes />,
      url: "/secretariat/account-codes",
    },
    {
      name: "Chart of Accounts",
      element: <ChartOfAccounts />,
      url: "/secretariat/chart-of-accounts",
    },
    {
      name: "Batch Payments",
      element: <Batch />,
      url: "/secretariat/batches",
    },
    {
      name: "Payments",
      element: <Payments />,
      url: "/secretariat/payments",
    },
    {
      name: "Print Payment",
      element: <PrintPayment />,
      url: "/secretariat/print/payment",
    },
    {
      name: "Stakeholders",
      element: <PageModule />,
      url: "/stakeholders",
    },
    {
      name: "Loan Requests",
      element: <Loans />,
      url: "/stakeholders/loans",
    },
    {
      name: "Sureties",
      element: <Surety />,
      url: "/stakeholders/sureties",
    },
    {
      name: "Loan Details",
      element: <ViewLoan />,
      url: "/stakeholders/loan/details",
    },
    {
      name: "Manage Registered Loans",
      element: <ViewLoan />,
      url: "/secretariat/loan/details",
    },
    {
      name: "Modules",
      element: <Modules />,
      url: "/administration/modules",
    },
    {
      name: "Import Dependencies",
      element: <Import />,
      url: "/administration/import",
    },
    {
      name: "Categories",
      element: <Categories />,
      url: "/secretariat/categories",
    },
    {
      name: "Budget Heads",
      element: <BudgetHeads />,
      url: "/secretariat/budget-heads",
    },
    {
      name: "Sub Budget Heads",
      element: <SubBudgetHeads />,
      url: "/secretariat/sub-budget-heads",
    },
    {
      name: "Funds",
      element: <Funds />,
      url: "/secretariat/funds",
    },
    {
      name: "Expenditures",
      element: <Expenditures />,
      url: "/secretariat/expenditures",
    },
    {
      name: "Features",
      element: <Features />,
      url: "/secretariat/features",
    },
  ],
};
