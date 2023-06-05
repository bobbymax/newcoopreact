import React, { useEffect, useState } from "react";
import PageHeader from "../../template/includes/PageHeader";
import { useStateContext } from "../../context/ContextProvider";
import Alert from "../../app/services/alert";
import AddBankAccount from "./AddBankAccount";
import { alter, fetch } from "../../app/http/controllers";

const Profile = () => {
  const { auth } = useStateContext();

  const [accs, setAccs] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openModal = () => {
    setShow(true);
    setIsLoading(true);
  };

  const manageAccount = (acc) => {
    setData(acc);
    setIsUpdating(true);
    setShow(true);
  };

  const makeAccountDefault = (acc) => {
    Alert.flash(
      "Are you sure?",
      "info",
      "You are about to make this bank your primary account!!"
    ).then((result) => {
      if (result.isConfirmed) {
        const requests = {
          user_id: auth?.id,
          current: "yes",
        };
        try {
          alter("set/default/accounts", acc.id, requests)
            .then((res) => {
              const response = res.data;
              setAccs(
                accs.map((ac) => {
                  if (ac.id === response?.data?.id) {
                    return response?.data;
                  }

                  return ac;
                })
              );
              Alert.success("Updated", response.message);
            })
            .catch((err) => console.log(err.message));
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const destroyAccount = (response) => {
    setAccs(accs.filter((acc) => acc.id !== response.data));
    Alert.success(response?.status, response?.message);
    setIsUpdating(false);
    setShow(false);
    setData(undefined);
  };

  const handleSubmit = (response) => {
    if (response?.action === "alter") {
      setAccs(
        accs.map((acc) => {
          if (acc.id === response?.data?.id) {
            return response?.data;
          }

          return acc;
        })
      );
    } else {
      setAccs([response?.data, ...accs]);
    }

    Alert.success(response?.status, response?.message);
    setIsUpdating(false);
    setShow(false);
    setData(undefined);
  };

  const handleClose = () => {
    setIsUpdating(false);
    setShow(false);
    setData(undefined);
    setIsLoading(false);
  };

  useEffect(() => {
    if (auth !== null) {
      try {
        fetch("members/accounts", auth?.id)
          .then((res) => {
            setAccs(res.data.data);
          })
          .catch((err) => console.log(err.message));
      } catch (error) {
        console.log(error);
      }
    }
  }, [auth]);

  return (
    <>
      <AddBankAccount
        title="Add Bank Account"
        show={show}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        isUpdating={isUpdating}
        handleDestroy={destroyAccount}
        data={data}
      />
      <PageHeader pageName="Profile" headerIcon="home" />

      <div className="col-md-6">
        <div className="form__card">
          <div className="profile__header">
            <h3>Bank Accounts</h3>
            <button
              type="button"
              className="account__bttn bg__dark"
              onClick={openModal}
              disabled={isLoading || accs?.length === 3}
            >
              <span className="material-icons-sharp">person_add</span>
              <p>Add Account</p>
            </button>
          </div>
          <div className="accounts__body mt-4">
            {accs?.length > 0 ? (
              accs.map((account) => (
                <div className="accounts mb-3" key={account.id}>
                  <div className="row">
                    <div className="col-md-7">
                      <div className="acc_details">
                        <h3>{account?.bank_name}</h3>
                        <h2>{account?.account_number}</h2>
                        <p>{account?.current ? "default" : "not default"}</p>
                      </div>
                    </div>
                    <div className="col-md-5">
                      <button
                        type="button"
                        className="make__primary bg__dark"
                        onClick={() => manageAccount(account)}
                      >
                        <p>manage</p>
                      </button>
                      <button
                        type="button"
                        className="make__primary bg__secondary"
                        onClick={() => makeAccountDefault(account)}
                        disabled={account?.current}
                      >
                        <p>set default</p>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <p className="text-danger">
                  There are no accounts on your profile
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
