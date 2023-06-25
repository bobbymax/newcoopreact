import React, { useEffect, useState } from "react";
import PageHeader from "../../template/includes/PageHeader";
import { useStateContext } from "../../context/ContextProvider";
import Alert from "../../app/services/alert";
import AddBankAccount from "./AddBankAccount";
import { alter, collection, fetch, store } from "../../app/http/controllers";
import {
  Button,
  CustomSelect,
  CustomSelectOptions,
  TextInput,
} from "../../template/components/Inputs";
import { getMonths } from "../../app/helpers/loans/calculator";
import { currency } from "../../app/helpers";
import moment from "moment";

const Profile = () => {
  const { auth } = useStateContext();

  const [accs, setAccs] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState(undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentFee, setCurrentFee] = useState(0);
  const [newFee, setNewFee] = useState(0);
  const [months, setMonths] = useState([]);
  const [month, setMonth] = useState("");
  const [reviews, setReviews] = useState([]);
  const [count, setCount] = useState(0);

  const openModal = () => {
    setShow(true);
    setIsLoading(true);
  };

  const reset = () => {
    setPassword("");
    setConfirmPassword("");
    setIsLoading(false);
    setNewFee(0);
    setMonth("");
    setIsUpdating(false);
    setShow(false);
    setData(undefined);
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

  const handleReviewContribution = (e) => {
    e.preventDefault();

    const requests = {
      user_id: auth?.id,
      old_fee: currentFee,
      new_fee: newFee,
      month,
    };

    try {
      store("reviewContributions", requests)
        .then((res) => {
          const response = res.data;

          setReviews([response.data, ...reviews]);

          Alert.success("Success!!", response.message);
          reset();
        })
        .catch((err) => {
          console.log(err.response.data.message);
          Alert.error("Oops!!", err.response.data.message);
        });
    } catch (error) {
      console.log(error);
    }
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
    setIsLoading(false);
  };

  const resetPassword = (e) => {
    e.preventDefault();

    const requests = {
      password,
    };

    setIsLoading(true);

    try {
      alter("password/reset/members", auth?.id, requests)
        .then((res) => {
          const response = res.data;
          Alert.success("Successful!!", response.message);
          reset();
        })
        .catch((err) => {
          console.log(err.response.data.message);
          reset();
          Alert.error("Oops!!", err.response.data.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    reset();
  };

  useEffect(() => {
    if (reviews.length > 0) {
      const cc = reviews.filter((review) => review.status === "pending");
      setCount(cc.length);
    }
  }, [reviews]);

  useEffect(() => {
    if (auth !== null) {
      setCurrentFee(parseFloat(auth?.contribution_fee));
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

  useEffect(() => {
    try {
      collection("reviewContributions")
        .then((res) => {
          setReviews(res.data.data);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const date = new Date();
    const num = date.getDate() < 10 ? date.getMonth() : date.getMonth() + 1;
    const array = getMonths().slice(num);
    setMonths(array);
  }, []);

  console.log(count);

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

      <div className="row">
        <div className="col-md-7">
          <div className="row">
            <div className="col-md-12 mb-4">
              <div className="form__card">
                <div className="profile__header">
                  <h3>BANK ACCOUNTS</h3>
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
                              <p>
                                {account?.current ? "default" : "not default"}
                              </p>
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

            <div className="col-md-12 mb-4">
              <div className="form__card">
                <h3 className="mb-4">REVIEW CONTRIBUTION FEE</h3>

                <form onSubmit={handleReviewContribution}>
                  <div className="row">
                    <div className="col-md-12">
                      <TextInput
                        label="Current Contribution"
                        value={currentFee}
                        onChange={(e) =>
                          setCurrentFee(parseFloat(e.target.value))
                        }
                        placeholder="Enter Current Fee"
                        disabled
                      />
                    </div>
                    <div className="col-md-12">
                      <TextInput
                        label="New Fee Request"
                        value={newFee}
                        onChange={(e) => setNewFee(parseFloat(e.target.value))}
                        placeholder="Enter Current Fee"
                        disabled={count > 0}
                      />
                    </div>
                    <div className="col-md-12">
                      <CustomSelect
                        label="Month of Activation"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        disabled={count > 0}
                      >
                        <CustomSelectOptions
                          label="Choose Month"
                          value=""
                          disabled
                        />
                        {months.map((month, i) => (
                          <CustomSelectOptions
                            key={i}
                            value={month}
                            label={month}
                          />
                        ))}
                      </CustomSelect>
                    </div>
                    <div className="col-md-12">
                      <Button
                        type="submit"
                        text="Make Request"
                        isLoading={isLoading}
                        icon="refresh"
                        disabled={newFee < 1 || month === "" || count > 0}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="col-md-12">
              <div className="form__card">
                <h3 className="mb-4">PASSWORD RESET</h3>

                <form onSubmit={resetPassword}>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="badge__area">
                        <ul>
                          <li
                            className={`${
                              password?.length >= 8
                                ? "text-success"
                                : "text-danger"
                            }`}
                          >
                            Password must be 8 characters long
                          </li>
                          <li
                            className={`${
                              password !== "" && password === confirmPassword
                                ? "text-success"
                                : "text-danger"
                            }`}
                          >
                            Passwords must match
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <TextInput
                        label="New Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password"
                      />
                    </div>
                    <div className="col-md-12">
                      <TextInput
                        label="Verify Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                      />
                    </div>

                    <div className="col-md-12">
                      <Button
                        type="submit"
                        text="Reset Password"
                        isLoading={isLoading}
                        icon="refresh"
                        disabled={
                          password === "" ||
                          confirmPassword === "" ||
                          password?.length < 8 ||
                          password !== confirmPassword
                        }
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-5">
          <div className="requests">
            {reviews?.length > 0 ? (
              reviews.map((review) => (
                <div className="request_item" key={review.id}>
                  <small>{review.status?.toUpperCase()}</small>
                  <p>
                    Review Contribution{" "}
                    {parseFloat(review.old_fee) < parseFloat(review.new_fee)
                      ? "Upwards"
                      : "Downwards"}{" "}
                    From:
                  </p>
                  <h3>{`${currency(parseFloat(review.old_fee))} - ${currency(
                    parseFloat(review.new_fee)
                  )}`}</h3>
                  <small className="date__format">
                    {moment(review.created_at).format("LL")}
                  </small>
                </div>
              ))
            ) : (
              <div className="request_item">
                <small className="text-center">
                  You have no pending review request
                </small>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
