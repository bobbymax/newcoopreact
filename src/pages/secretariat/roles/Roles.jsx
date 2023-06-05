import React, { useEffect, useState } from "react";
import Alert from "../../../app/services/alert";
import { collection } from "../../../app/http/controllers";
import PageHeader from "../../../template/includes/PageHeader";
import TableComponent from "../../../template/components/TableComponent";
import AddRole from "./AddRole";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const columns = [
    {
      field: "name",
      header: "Name",
      isSortable: true,
    },
    {
      field: "slot",
      header: "Allocation",
      isSortable: false,
    },
  ];

  const manageRole = (cat) => {
    setData(cat);
    setIsUpdating(true);
    setShow(true);
  };

  const openModal = () => {
    setShow(true);
    setIsLoading(true);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setRoles(
        roles.map((dept) => {
          if (dept.id === response?.data?.id) {
            return response?.data;
          }

          return dept;
        })
      );
    } else {
      setRoles([response?.data, ...roles]);
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
      collection("roles")
        .then((res) => {
          const response = res.data.data;
          setRoles(response);
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
      <AddRole
        title="Add Role"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        data={data}
      />
      <PageHeader
        pageName="Roles"
        text="Add Role"
        handleClick={openModal}
        icon="post_add"
        isLoading={isLoading}
        resource
      />

      <div className="data__content">
        <div className="row">
          <TableComponent
            columns={columns}
            data={roles}
            manage
            manageData={manageRole}
            isSearchable
          />
        </div>
      </div>
    </>
  );
};

export default Roles;
