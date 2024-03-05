import React, { useEffect, useState } from "react";
import Alert from "../../../../app/services/alert";
import { collection } from "../../../../app/http/controllers";
import PageHeader from "../../../../template/includes/PageHeader";
import TableComponent from "../../../../template/components/TableComponent";
import AddChartOfAccount from "./AddChartOfAccount";

const ChartOfAccounts = () => {
  const [charts, setCharts] = useState([]);
  const [codes, setCodes] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    {
      field: "code",
      header: "Code",
      isSortable: true,
    },
    {
      field: "name",
      header: "Name",
      isSortable: true,
    },
  ];

  const manageChartOfAccount = (chart) => {
    setData(chart);
    setIsUpdating(true);
    setShow(true);
  };

  const openModal = () => {
    setShow(true);
    setIsLoading(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setCharts(
        charts.map((chart) => {
          if (chart.id === response?.data?.id) {
            return response?.data;
          }

          return chart;
        })
      );
    } else {
      setCharts([response?.data, ...charts]);
    }

    Alert.success(response?.status, response?.message);
    handleClose();
  };

  const handleClose = () => {
    setIsUpdating(false);
    setShow(false);
    setData(undefined);
    setIsLoading(false);
  };

  useEffect(() => {
    try {
      const urls = ["accountCodes", "chartOfAccounts"];

      const requests = urls.map((url) => collection(url));

      Promise.all(requests)
        .then((res) => {
          setCodes(res[0].data.data);
          setCharts(res[1].data.data);
        })
        .catch((err) => console.error(err.message));
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <>
      <AddChartOfAccount
        title="Add Chart of Account"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        data={data}
        dependencies={{ codes }}
      />

      <PageHeader
        pageName="Chart of Accounts"
        text="Create Chart of Account"
        handleClick={openModal}
        icon="post_add"
        isLoading={isLoading}
        resource
      />

      <div className="data__content">
        <div className="row">
          <TableComponent
            columns={columns}
            data={charts}
            manage
            manageData={manageChartOfAccount}
            isSearchable
          />
        </div>
      </div>
    </>
  );
};

export default ChartOfAccounts;
