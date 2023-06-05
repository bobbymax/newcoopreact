import React, { useEffect, useState } from "react";
import { CChart } from "@coreui/react-chartjs";

const Pie = () => {
  const [chartData, setChartData] = useState({});
  // const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const data = {
      labels: ["VueJs", "EmberJs", "ReactJs"],
      datasets: [
        {
          backgroundColor: ["#41B883", "#E46651", "#00D8FF"],
          data: [40, 20, 80],
        },
      ],
    };
    // const options = {
    //   plugins: {
    //     legend: {
    //       labels: {
    //         usePointStyle: true,
    //       },
    //     },
    //   },
    // };

    setChartData(data);
    // setChartOptions(options);
  }, []);
  return <CChart type="pie" data={chartData} />;
};

export default Pie;
