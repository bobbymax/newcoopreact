/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { alter, collection } from "../../../app/http/controllers";
import Modal from "../../../template/modals/Modal";
import {
  Button,
  CustomSelect,
  CustomSelectOptions,
} from "../../../template/components/Inputs";

const AddRoleToMember = ({
  title = "",
  show = false,
  lg = false,
  handleClose = undefined,
  handleSubmit = undefined,
  data = undefined,
}) => {
  const initialState = {
    user_id: 0,
    role_id: 0,
  };

  const [state, setState] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [rles, setRles] = useState([]);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      ...state,
    };

    try {
      setLoading(true);
      alter("add/role/members", state.user_id, requests)
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
        .catch((err) => console.log(err.message));
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
    try {
      collection("roles")
        .then((res) => {
          setRles(res.data.data);
        })
        .catch((err) => console.log(err.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (data !== undefined) {
      setState({
        ...state,
        user_id: data?.id,
      });
    }
  }, [data]);

  return (
    <>
      <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
        <form onSubmit={handleFormSubmit}>
          <div className="row">
            <div className="col-md-12">
              <CustomSelect
                label="Roles"
                value={state.role_id}
                onChange={(e) =>
                  setState({ ...state, role_id: parseInt(e.target.value) })
                }
              >
                <CustomSelectOptions label="Select Role" value={0} disabled />

                {rles.map((rle) => (
                  <CustomSelectOptions
                    key={rle.id}
                    value={rle.id}
                    label={rle.name}
                  />
                ))}
              </CustomSelect>
            </div>
            <div className="col-md-12">
              <Button
                type="submit"
                text="Add Role to Member"
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

export default AddRoleToMember;
