import { useEffect, useState } from "react";
import { alter } from "../../../app/http/controllers";
import { Boxes, Button, TextInput } from "../../../template/components/Inputs";
import Modal from "../../../template/modals/Modal";

const ResetPassword = ({
  title = "",
  show = false,
  lg = false,
  handleClose = undefined,
  handleSubmit = undefined,
  data = undefined,
}) => {
  const initialState = {
    user_id: 0,
    password: "",
    changePassword: false,
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
      alter("reset/password", state.user_id, requests)
        .then((res) => {
          const response = res.data;

          handleSubmit({
            status: "Reset Successful",
            data: response.data,
            message: response.message,
            action: "alter",
          });
          setState(initialState);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err.message);
          setLoading(false);
        });
    } catch (error) {
      console.error(error);
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
        user_id: data?.id,
      });
    }
  }, [data]);

  //   console.log(data);

  return (
    <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
      <form onSubmit={handleFormSubmit}>
        <div className="row">
          <div className="col-md-12">
            <TextInput
              label="Password"
              value={state.password}
              onChange={(e) => setState({ ...state, password: e.target.value })}
              placeholder="Enter Password"
            />
          </div>
          <div className="col-md-12">
            <Boxes
              label="Change After Login"
              value={state.changePassword}
              checked={state.changePassword}
              onChange={(e) =>
                setState({ ...state, changePassword: e.target.checked })
              }
            />
          </div>
          <div className="col-md-12">
            <Button
              type="submit"
              text="Reset Password"
              isLoading={loading}
              icon="add_circle"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ResetPassword;
