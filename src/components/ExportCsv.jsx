import React from "react";
import { CSVLink } from "react-csv";

const ExportCsv = ({ headers = [], data = [], filename = "" }) => {
  const options = {
    data,
    headers,
    filename,
  };

  return (
    <CSVLink {...options} className="export__bttn">
      Export To CSV
    </CSVLink>
  );
};

export default ExportCsv;
