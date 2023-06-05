/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { alter, store } from "../../../app/http/controllers";
import Modal from "../../../template/modals/Modal";
import {
  Button,
  CustomSelect,
  CustomSelectOptions,
  TextInput,
} from "../../../template/components/Inputs";

const AddMember = ({
  title = "",
  show = false,
  lg = false,
  isUpdating = false,
  handleClose = undefined,
  handleSubmit = undefined,
  data = undefined,
}) => {
  const initialState = {
    id: 0,
    membership_no: "",
    staff_no: "",
    firstname: "",
    middlename: "",
    surname: "",
    mobile: "",
    contribution_fee: 0,
    type: "",
    email: "",
  };

  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      ...state,
    };

    try {
      setLoading(true);
      if (isUpdating) {
        alter("members", state.id, requests)
          .then((res) => {
            const response = res.data;

            handleSubmit({
              status: "Updated!!",
              data: response.data,
              message: response.message,
              action: "alter",
            });
            setState(initialState);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err.message);
            setLoading(false);
          });
      } else {
        store("members", requests)
          .then((res) => {
            const response = res.data;

            handleSubmit({
              status: "Created!!",
              data: response.data,
              message: response.message,
              action: "store",
            });
            setState(initialState);
            setLoading(false);
          })
          .catch((err) => {
            console.log(err.message);
            setLoading(false);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleModalClose = () => {
    setState(initialState);
    setLoading(false);
    handleClose();
  };

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        id: data?.id,
        membership_no: data?.membership_no,
        staff_no: data?.staff_no ?? "",
        firstname: data?.firstname,
        middlename: data?.middlename,
        surname: data?.surname,
        mobile: data?.mobile,
        contribution_fee: parseFloat(data?.contribution_fee),
        type: data?.type,
        email: data?.email,
      });
    }
  }, [data]);

  return (
    <>
      <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
        <form onSubmit={handleFormSubmit}>
          <div className="row">
            <div className="col-md-12">
              <TextInput
                label="Surname"
                value={state.surname}
                onChange={(e) =>
                  setState({ ...state, surname: e.target.value })
                }
                placeholder="Enter Surname"
              />
            </div>
            <div className="col-md-7">
              <TextInput
                label="Firstname"
                value={state.firstname}
                onChange={(e) =>
                  setState({ ...state, firstname: e.target.value })
                }
                placeholder="Enter Firstname"
              />
            </div>
            <div className="col-md-5">
              <TextInput
                label="Middlename"
                value={state.middlename}
                onChange={(e) =>
                  setState({ ...state, middlename: e.target.value })
                }
                placeholder="Enter Middlename"
              />
            </div>
            <div className="col-md-12">
              <TextInput
                label="Email Address"
                type="email"
                value={state.email}
                onChange={(e) => setState({ ...state, email: e.target.value })}
                placeholder="Enter Email Address"
              />
            </div>
            <div className="col-md-6">
              <TextInput
                label="Membership No."
                value={state.membership_no}
                onChange={(e) =>
                  setState({ ...state, membership_no: e.target.value })
                }
                placeholder="Enter Membership No."
              />
            </div>
            <div className="col-md-6">
              <TextInput
                label="Staff No."
                value={state.staff_no}
                onChange={(e) =>
                  setState({ ...state, staff_no: e.target.value })
                }
                placeholder="Enter Staff No."
              />
            </div>
            <div className="col-md-7">
              <TextInput
                label="Mobile Number"
                value={state.mobile}
                onChange={(e) => setState({ ...state, mobile: e.target.value })}
                placeholder="Enter Mobile Number"
              />
            </div>
            <div className="col-md-5">
              <TextInput
                label="Contribution Fee"
                value={state.contribution_fee}
                onChange={(e) =>
                  setState({
                    ...state,
                    contribution_fee: parseFloat(e.target.value),
                  })
                }
                placeholder="Enter Contribution Fee"
              />
            </div>
            <div className="col-md-12">
              <CustomSelect
                label="Type"
                value={state.type}
                onChange={(e) => setState({ ...state, type: e.target.value })}
              >
                <CustomSelectOptions
                  label="Select Member Type"
                  value=""
                  disabled
                />
                {["staff", "member"].map((st, i) => (
                  <CustomSelectOptions
                    key={i}
                    value={st}
                    label={st?.toUpperCase()}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-12">
              <Button
                type="submit"
                text={`${isUpdating ? "Update" : "Add"} Member`}
                isLoading={loading}
                icon="add_circle"
              />
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddMember;
