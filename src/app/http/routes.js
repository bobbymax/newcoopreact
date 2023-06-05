import { lazy } from "react";

const Login = lazy(() => import("../../pages/Login"));
const Dashboard = lazy(() => import("../../pages/Dashboard"));
const PageModule = lazy(() => import("../../pages/Module"));
const Modules = lazy(() => import("../../pages/modules/Modules"));
const Import = lazy(() => import("../../pages/Import"));
const Roles = lazy(() => import("../../pages/secretariat/roles/Roles"));

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
const Journals = lazy(() =>
  import("../../pages/secretariat/bookkeeping/journals/Journals")
);
const Ledgers = lazy(() =>
  import("../../pages/secretariat/bookkeeping/journals/Ledgers")
);

const Members = lazy(() => import("../../pages/secretariat/members/Members"));
const AddOrUpdateMember = lazy(() =>
  import("../../pages/secretariat/members/AddOrUpdateMember")
);
const CreditMembers = lazy(() =>
  import("../../pages/secretariat/accounting/CreditMembers")
);
const PrintPayment = lazy(() =>
  import("../../pages/secretariat/batches/PrintPayment")
);

const Deposits = lazy(() =>
  import("../../pages/stakeholders/deposits/Deposits")
);
const ManageDeposits = lazy(() =>
  import("../../pages/stakeholders/deposits/ManageDeposits")
);
const AirTickets = lazy(() =>
  import("../../pages/stakeholders/airtickets/AirTickets")
);

const TicketRequests = lazy(() =>
  import("../../pages/secretariat/tickets/TicketRequests")
);

const ElectronicRequests = lazy(() =>
  import("../../pages/stakeholders/electronics/ElectronicRequests")
);

const ManageElectronicRequests = lazy(() =>
  import("../../pages/secretariat/electronics/ManageElectronicRequests")
);

const Airlines = lazy(() =>
  import("../../pages/secretariat/airlines/Airlines")
);

const Loans = lazy(() => import("../../pages/stakeholders/loans/Loans"));
const ApplyLoan = lazy(() => import("../../pages/secretariat/loans/ApplyLoan"));
const ViewLoan = lazy(() => import("../../pages/stakeholders/loans/ViewLoan"));
const Surety = lazy(() => import("../../pages/stakeholders/activities/Surety"));
const RegisteredLoans = lazy(() =>
  import("../../pages/secretariat/loans/RegisteredLoans")
);

const Vendors = lazy(() => import("../../pages/secretariat/vendors/Vendors"));
const Projects = lazy(() =>
  import("../../pages/secretariat/projects/Projects")
);
const Contracts = lazy(() =>
  import("../../pages/secretariat/contracts/Contracts")
);
const Accounts = lazy(() => import("../../pages/accounts/Accounts"));
const Profile = lazy(() => import("../../pages/stakeholders/Profile"));
const Notifications = lazy(() =>
  import("../../pages/stakeholders/Notifications")
);
const Liquidate = lazy(() =>
  import("../../pages/stakeholders/liquidations/Liquidate")
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
      name: "Accounts",
      element: <Accounts />,
      url: "/secretariat/accounts",
    },
    {
      name: "Apply Loan",
      element: <ApplyLoan />,
      url: "/secretariat/apply/loans",
    },
    {
      name: "Credit Members",
      element: <CreditMembers />,
      url: "/secretariat/credit/members",
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
      name: "Journals",
      element: <Journals />,
      url: "/secretariat/journals",
    },
    {
      name: "Ledgers",
      element: <Ledgers />,
      url: "/secretariat/ledgers",
    },
    {
      name: "Members",
      element: <Members />,
      url: "/secretariat/members",
    },
    {
      name: "Members Profiles",
      element: <AddOrUpdateMember />,
      url: "/secretariat/members/manage",
    },
    {
      name: "Vendors",
      element: <Vendors />,
      url: "/secretariat/vendors",
    },
    {
      name: "Projects",
      element: <Projects />,
      url: "/secretariat/projects",
    },
    {
      name: "Contacts",
      element: <Contracts />,
      url: "/secretariat/contract/awards",
    },
    {
      name: "Manage Deposits",
      element: <ManageDeposits />,
      url: "/secretariat/manage/deposits",
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
      name: "Liquidate Requests",
      element: <Liquidate />,
      url: "/stakeholders/liquidate",
    },
    {
      name: "Member Profile",
      element: <Profile />,
      url: "/stakeholders/member/profile",
    },
    {
      name: "Notifications",
      element: <Notifications />,
      url: "/stakeholders/member/messages",
    },
    {
      name: "Air Tickets",
      element: <AirTickets />,
      url: "/stakeholders/air-ticket/request",
    },
    {
      name: "Electronic Purchase Request",
      element: <ElectronicRequests />,
      url: "/stakeholders/electronic/purchase",
    },
    {
      name: "Manage Electronic Purchase Request",
      element: <ManageElectronicRequests />,
      url: "/secretariat/electronic/purchase/requests",
    },
    {
      name: "Airlines",
      element: <Airlines />,
      url: "/secretariat/airlines",
    },
    {
      name: "Ticket Requests",
      element: <TicketRequests />,
      url: "/secretariat/tickets",
    },
    {
      name: "Deposits",
      element: <Deposits />,
      url: "/stakeholders/deposits",
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
      name: "Roles",
      element: <Roles />,
      url: "/administration/roles",
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
