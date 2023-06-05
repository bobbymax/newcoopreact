import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageHeader from "../../../template/includes/PageHeader";
import AddMember from "./AddMember";
import Alert from "../../../app/services/alert";
import { alter } from "../../../app/http/controllers";
import AddRoleToMember from "./AddRoleToMember";

const AddOrUpdateMember = () => {
  const { state } = useLocation();

  const [isUpdating, setIsUpdating] = useState(false);
  const [member, setMember] = useState(null);
  const [loans, setLoans] = useState([]);
  const [roles, setRoles] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [show, setShow] = useState(false);
  const [showRole, setShowRole] = useState(false);

  const handleSubmit = (response) => {
    setMember(response.data);
    Alert.success(response?.status, response?.message);
    handleClose();
  };

  const openModal = () => {
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setShowRole(false);
  };

  // Disable or Reactivate an Account
  const disableOrReactivate = (status) => {
    Alert.flash(
      `${member?.disabled ? "Renew" : "Block"}`,
      `${member?.disabled ? "info" : "warning"}`,
      `${member?.disabled ? "Reactivate" : "Disable"} this account`
    ).then((result) => {
      if (result.isConfirmed) {
        try {
          const requests = {
            status,
          };
          alter("verify/members", member?.id, requests)
            .then((res) => {
              const response = res.data;
              setMember(response.data);
              Alert.success("Verified", response.message);
            })
            .catch((err) => console.log(err.message));
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  // Verify member Accounts
  const verifyMember = () => {
    Alert.flash(
      "Verify User!!",
      "info",
      "You are about to verify this account"
    ).then((result) => {
      if (result.isConfirmed) {
        try {
          const requests = {
            status: "active",
          };
          alter("verify/members", member?.id, requests)
            .then((res) => {
              const response = res.data;
              setMember(response.data);
              Alert.success("Verified", response.message);
            })
            .catch((err) => console.log(err.message));
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  useEffect(() => {
    if (member !== null && member.hasOwnProperty("attributes")) {
      const { loans, roles, wallet } = member?.attributes;

      setLoans(loans);
      setRoles(roles);
      setWallet(wallet);
    }
  }, [member]);

  useEffect(() => {
    if (state.hasOwnProperty("isUpdating") && state.hasOwnProperty("member")) {
      const { isUpdating, member } = state;

      setIsUpdating(isUpdating);
      setMember(member);
    }
  }, [state]);

  // console.log(member);

  return (
    <>
      <AddMember
        title="Update Member"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        data={member}
        isUpdating={isUpdating}
      />

      <AddRoleToMember
        title="Add Role to Member"
        show={showRole}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        data={member}
      />

      <PageHeader pageName="Manage Account" />

      <div className="manage__account">
        <div className="row">
          <div className="col-md-8">
            <div className="member__action__section">
              <h3>{member?.name}</h3>
            </div>
          </div>
          {/* Action Button */}
          <div className="col-md-4">
            <div className="member__action__section">
              <div className="action__bttn__grp">
                <button
                  type="button"
                  className="member__bttn__actions bg__primary"
                  onClick={() => openModal()}
                >
                  <span className="material-icons-sharp">edit</span>
                  <p>Modify Account</p>
                </button>
                <button
                  type="button"
                  className="member__bttn__actions bg__secondary"
                  onClick={() => verifyMember()}
                  disabled={member?.verified === "Verified"}
                >
                  <span className="material-icons-sharp">verified</span>
                  <p>{`${
                    member?.verified === "Verified"
                      ? "Verified"
                      : "Verify Member"
                  }`}</p>
                </button>
                <button
                  type="button"
                  className="member__bttn__actions bg__danger"
                  onClick={() =>
                    disableOrReactivate(
                      `${member?.disabled ? "active" : "blocked"}`
                    )
                  }
                >
                  <span className="material-icons-sharp">visibility_off</span>
                  <p>
                    {`${member?.disabled ? "Reactivate" : "Disable"}`} Account
                  </p>
                </button>
                <button
                  type="button"
                  className="member__bttn__actions bg__dark"
                  onClick={() => setShowRole(true)}
                >
                  <span className="material-icons-sharp">add_box</span>
                  <p>Add Role to Member</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddOrUpdateMember;
