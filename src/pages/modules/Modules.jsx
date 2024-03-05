import React, { useState, useEffect } from "react";
import PageHeader from "../../template/includes/PageHeader";
import { collection } from "../../app/http/controllers";
import TableComponent from "../../template/components/TableComponent";
import CreateModule from "./CreateModule";
import { formatSelectOptions } from "../../app/helpers";
import Alert from "../../app/services/alert";
import ExportCsv from "../../components/ExportCsv";

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [single, setSingle] = useState(null);

  const columns = [
    {
      field: "name",
      header: "Name",
      isSortable: true,
    },
    {
      field: "icon",
      header: "Icon",
      isSortable: false,
    },
    {
      field: "code",
      header: "Code",
      isSortable: false,
    },
    {
      field: "url",
      header: "Path",
      isSortable: false,
    },
    {
      field: "type",
      header: "Type",
      isSortable: true,
    },
  ];

  const headers = [
    { label: "name", key: "name" },
    { label: "code", key: "code" },
    { label: "icon", key: "icon" },
    { label: "parent", key: "parent" },
    { label: "type", key: "type" },
    { label: "url", key: "url" },
  ];

  const manageModule = (mod) => {
    setSingle(mod);
    setIsUpdating(true);
    setIsLoading(true);
    setShow(true);
  };

  const createModule = (response) => {
    const { data, message, status, method } = response;

    if (method === "alter") {
      setModules(
        modules.map((mod) => {
          if (mod?.id === data?.id) {
            return data;
          }

          return mod;
        })
      );
    } else {
      setModules([data, ...modules]);
    }

    Alert.success(status, message);
    closeForm();
  };

  const closeForm = () => {
    setShow(false);
    setIsLoading(false);
    setIsUpdating(false);
    setSingle(null);
  };

  useEffect(() => {
    try {
      const urls = ["roles", "modules"];

      const requests = urls.map((url) => collection(url));

      Promise.all(requests)
        .then((res) => {
          const rles = res[0].data.data;
          const mds = res[1].data.data;
          setRoles(formatSelectOptions(rles, "id", "name", "label"));
          setModules(mds);

          // console.log(rles);
        })
        .catch((err) => console.error(err.message));
    } catch (error) {
      console.error(error);
    }
  }, []);

  // console.log(modules);

  const addModule = () => {
    // console.log("added");
    setIsLoading(true);
    setShow(true);
  };

  return (
    <>
      <PageHeader
        pageName="Modules"
        text="Create Module"
        handleClick={addModule}
        icon="post_add"
        isLoading={isLoading}
        resource
      />

      <div className="data__content">
        <div className="row">
          <div className="col-md-2">
            <ExportCsv
              headers={headers}
              data={modules}
              filename="modules-download"
            />
          </div>
          {show ? (
            <CreateModule
              options={modules}
              roles={roles}
              handleSubmit={createModule}
              isUpdating={isUpdating}
              data={single}
              handleClose={closeForm}
            />
          ) : (
            <TableComponent
              data={modules}
              columns={columns}
              manage
              manageData={manageModule}
              isSearchable
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Modules;
