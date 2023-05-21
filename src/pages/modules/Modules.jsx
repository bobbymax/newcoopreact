import React, { useState, useEffect } from "react";
import PageHeader from "../../template/includes/PageHeader";
import { batchRequests, collection } from "../../app/http/controllers";
import TableComponent from "../../template/components/TableComponent";
import CreateModule from "./CreateModule";
import axios from "axios";
import { formatSelectOptions } from "../../app/helpers";
import Alert from "../../app/services/alert";

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
      const rolesData = collection("roles");
      const modulesData = collection("modules");

      batchRequests([rolesData, modulesData])
        .then(
          axios.spread((...res) => {
            const rles = res[0].data.data;
            const mds = res[1].data.data;
            setRoles(formatSelectOptions(rles, "id", "name", "label"));
            setModules(mds);
          })
        )
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
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
