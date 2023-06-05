import React, { useState } from "react";
import * as XLSX from "xlsx";
import PageHeader from "../template/includes/PageHeader";
import {
  CustomSelect,
  CustomSelectOptions,
  TextInput,
} from "../template/components/Inputs";
import { ImportTypes, convertToJson, getExtension } from "../app/helpers";
import TableComponent from "../template/components/TableComponent";
import { bulk } from "../app/http/controllers";
import Alert from "../app/services/alert";

const Import = () => {
  const [cols, setCols] = useState([]);
  const [data, setData] = useState([]);
  const [dataType, setDataType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fileUpload, setFileUpload] = useState("");

  const importData = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const body = {
      type: dataType,
      data,
    };

    // console.log(body);

    try {
      bulk("imports", body)
        .then((res) => {
          const result = res.data;
          console.log(result.data);
          setIsLoading(false);
          Alert.success("Imported", result.message);
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err.message);
          Alert.error("Oops!!", "Something must have gone wrong");
        });
    } catch (error) {
      console.log(error);
    }

    setCols([]);
    setDataType("");
    setData([]);
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
  return (
    <>
      <PageHeader pageName="Import Dependencies" icon="post_add" />

      <div className="data__content">
        <div className="col-md-5">
          <div className="form__card mb-5">
            <form onSubmit={importData}>
              <div className="row">
                <div className="col-md-12">
                  <TextInput
                    type="file"
                    label="Upload File"
                    value={fileUpload}
                    onChange={importExcel}
                  />
                </div>
                <div className="col-md-12">
                  <CustomSelect
                    label="Data Type"
                    value={dataType}
                    onChange={(e) => setDataType(e.target.value)}
                  >
                    <CustomSelectOptions
                      label="Select Data Type"
                      value=""
                      disabled
                    />
                    {ImportTypes.map((typ, i) => (
                      <CustomSelectOptions
                        key={i}
                        label={typ?.label}
                        value={typ?.value}
                      />
                    ))}
                  </CustomSelect>
                </div>
                <div className="col-md-12 mt-3">
                  <button
                    type="submit"
                    className="custom__logout__btn bg__primary"
                    disabled={
                      dataType === "" ||
                      cols?.length < 1 ||
                      data?.length < 1 ||
                      isLoading
                    }
                  >
                    <span className="material-icons-sharp">backup</span>
                    <p>Import</p>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {cols?.length > 0 && data?.length > 0 && (
          <TableComponent data={data} columns={cols} />
        )}
      </div>
    </>
  );
};

export default Import;
