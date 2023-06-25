import React, { useEffect, useState } from "react";
import { collection } from "../../../app/http/controllers";
import Alert from "../../../app/services/alert";
import AddSetting from "./AddSetting";
import PageHeader from "../../../template/includes/PageHeader";
import TableComponent from "../../../template/components/TableComponent";

const Settings = () => {
  const [settings, setSettings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [data, setData] = useState(undefined);

  const columns = [
    {
      field: "key",
      header: "Key",
      isSortable: true,
    },
    {
      field: "display_name",
      header: "Name",
      isSortable: false,
    },
    {
      field: "input_type",
      header: "Input",
      isSortable: false,
    },
    {
      field: "group",
      header: "Group",
      isSortable: false,
    },
  ];

  const manageSetting = (setting) => {
    setData(setting);
    setIsUpdating(true);
    setIsLoading(true);
    setShow(true);
  };

  const openModal = () => {
    setShow(true);
    setIsLoading(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setSettings(
        settings.map((setting) => {
          if (setting.id === response?.data?.id) {
            return response?.data;
          }

          return setting;
        })
      );
    } else {
      setSettings([response?.data, ...settings]);
    }

    Alert.success(response?.status, response?.message);
    setIsUpdating(false);
    setShow(false);
    setData(undefined);
    setIsLoading(false);
  };

  const handleClose = () => {
    setIsUpdating(false);
    setShow(false);
    setData(undefined);
    setIsLoading(false);
  };

  useEffect(() => {
    try {
      collection("settings")
        .then((res) => {
          const response = res.data.data;
          setSettings(response);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <AddSetting
        title="Add Setting"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        data={data}
      />

      <PageHeader
        pageName="Settings"
        text="Add Setting Config"
        handleClick={openModal}
        icon="post_add"
        isLoading={isLoading}
        resource
      />

      <div className="data__content">
        <div className="row">
          <TableComponent
            columns={columns}
            data={settings}
            manage
            manageData={manageSetting}
            isSearchable
          />
        </div>
      </div>
    </>
  );
};

export default Settings;
