import React, { useEffect, useState } from "react";
import PageHeader from "../../../template/includes/PageHeader";
import TableComponent from "../../../template/components/TableComponent";
import { collection } from "../../../app/http/controllers";
import { useNavigate } from "react-router-dom";
import AddMember from "./AddMember";
import Alert from "../../../app/services/alert";

const Members = () => {
  const columns = [
    {
      field: "membership_no",
      header: "Membership No",
      isSortable: true,
    },
    {
      field: "name",
      header: "Name",
      isSortable: true,
    },
    {
      field: "email",
      header: "Email",
      isSortable: false,
      currency: false,
    },
    {
      field: "contribution_fee",
      header: "Contribution",
      isSortable: true,
      currency: true,
    },
    {
      field: "type",
      header: "Type",
      isSortable: true,
    },
  ];
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const manageMember = (member) => {
    navigate("/secretariat/members/manage", {
      state: {
        isUpdating: true,
        member,
      },
    });
  };

  const openModal = () => {
    setShow(true);
    setIsLoading(true);
  };

  const handleSubmit = (response) => {
    setUsers([response?.data, ...users]);

    Alert.success(response?.status, response?.message);
    handleClose();
  };

  const handleClose = () => {
    setShow(false);
    setData(undefined);
    setIsLoading(false);
  };

  useEffect(() => {
    try {
      collection("members")
        .then((res) => {
          const response = res.data.data;
          setUsers(response.filter((member) => member?.type !== "admin"));
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <AddMember
        title="Add Member"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        data={data}
      />
      <PageHeader
        pageName="Members"
        text="Add New Member"
        handleClick={openModal}
        isLoading={isLoading}
        icon="post_add"
        resource
      />

      <div className="data__content">
        <div className="row">
          <TableComponent
            columns={columns}
            data={users}
            manage
            manageData={manageMember}
            isSearchable
          />
        </div>
      </div>
    </>
  );
};

export default Members;
