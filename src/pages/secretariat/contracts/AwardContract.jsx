/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useStateContext } from "../../../context/ContextProvider";
import { alter, collection, store } from "../../../app/http/controllers";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {
  formatSelectOptions,
  generateUniqueString,
} from "../../../app/helpers";
import Modal from "../../../template/modals/Modal";
import { Button, TextInput } from "../../../template/components/Inputs";
import moment from "moment";

const AwardContract = ({
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
    user_id: 0,
    organization_id: 0,
    project_id: 0,
    approved_amount: 0,
    balance: 0,
    code: "",
    date_commenced: "",
    date_awarded: "",
    due_date: "",
  };

  const { auth } = useStateContext();
  const animated = makeAnimated();
  const [state, setState] = useState(initialState);
  const [vendors, setVendors] = useState([]);
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [duration, setDuration] = useState(0);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const requests = {
      ...state,
      user_id: auth?.id,
    };

    try {
      setLoading(true);
      if (isUpdating) {
        alter("awards", state.id, requests)
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
        store("awards", requests)
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
    setVendor(null);
    setProject(null);
    setLoading(false);
    setDuration(0);
    handleClose();
  };

  useEffect(() => {
    if (data !== undefined) {
      const commenced =
        data?.date_commenced !== null
          ? moment(data?.date_commenced).format("yyyy-MM-DD")
          : "";

      const awarded =
        data?.date_awarded !== null
          ? moment(data?.date_awarded).format("yyyy-MM-DD")
          : "";
      setState({
        ...state,
        id: data?.id,
        user_id: data?.user_id,
        organization_id: data?.organization_id,
        project_id: data?.project_id,
        code: data?.code,
        approved_amount: parseFloat(data?.approved_amount),
        balance: parseFloat(data?.balance),
        date_awarded: awarded,
        date_commenced: commenced,
        due_date: data?.due_date ?? "",
      });

      setVendor(
        vendors.filter((ven) => ven?.value === data?.organization_id)[0]
      );
      setProject(
        projects.filter((proj) => proj?.value === data?.project_id)[0]
      );
    }
  }, [data]);

  useEffect(() => {
    try {
      const urls = ["projects", "organizations"];

      const requests = urls.map((url) => collection(url));

      Promise.all(requests)
        .then((res) => {
          const projs = res[0].data.data;
          const vens = res[1].data.data;

          const removeSelf = vens.filter((ven) => ven?.type !== "self");

          setVendors(formatSelectOptions(removeSelf, "id", "name"));
          setProjects(formatSelectOptions(projs, "id", "title"));
          setState({
            ...state,
            code: !isUpdating ? generateUniqueString("CTR", 6) : state.code,
          });
        })
        .catch((err) => console.error(err.message));
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (project !== null && project?.properties) {
      const { properties } = project;

      setDuration(parseInt(properties?.duration));
      setState({
        ...state,
        project_id: properties?.id,
      });
    }
  }, [project]);

  useEffect(() => {
    if (vendor !== null && vendor?.properties) {
      const { properties } = vendor;

      setState({
        ...state,
        organization_id: properties?.id,
      });
    }
  }, [vendor]);

  useEffect(() => {
    if (state.approved_amount > 0) {
      setState({
        ...state,
        balance: state.approved_amount,
      });
    }
  }, [state.approved_amount]);

  useEffect(() => {
    const dd = moment(state.date_commenced).add(duration, "days");

    setState({
      ...state,
      due_date: dd.format("yyyy-MM-DD"),
    });
  }, [state.date_commenced]);

  return (
    <Modal title={title} show={show} handleClose={handleModalClose} lg={lg}>
      <form onSubmit={handleFormSubmit}>
        <div className="row">
          <div className="col-md-12 mb-4">
            <p className="label-font">Project</p>
            <Select
              components={animated}
              options={projects}
              placeholder="Select Project"
              value={project}
              onChange={setProject}
              isSearchable
            />
          </div>
          <div className="col-md-12 mb-4">
            <p className="label-font">Vendor</p>
            <Select
              components={animated}
              options={vendors}
              placeholder="Select Vendor"
              value={vendor}
              onChange={setVendor}
              isSearchable
            />
          </div>
          <div className="col-md-6">
            <TextInput
              label="Amount"
              value={state.approved_amount}
              onChange={(e) =>
                setState({
                  ...state,
                  approved_amount: parseFloat(e.target.value),
                })
              }
              placeholder="Enter Amount"
            />
          </div>
          <div className="col-md-6">
            <TextInput
              label="Balance"
              value={state.balance}
              onChange={(e) =>
                setState({
                  ...state,
                  balance: parseFloat(e.target.value),
                })
              }
              placeholder="Enter Balance"
              disabled
            />
          </div>
          <div className="col-md-12">
            <TextInput
              label="Code"
              value={state.code}
              onChange={(e) =>
                setState({
                  ...state,
                  code: e.target.value,
                })
              }
              disabled
            />
          </div>
          <div className="col-md-12">
            <TextInput
              label="Date Awarded"
              type="date"
              value={state.date_awarded}
              onChange={(e) =>
                setState({
                  ...state,
                  date_awarded: e.target.value,
                })
              }
            />
          </div>
          <div className="col-md-6">
            <TextInput
              label="Commence Date"
              type="date"
              value={state.date_commenced}
              onChange={(e) =>
                setState({
                  ...state,
                  date_commenced: e.target.value,
                })
              }
              disabled={project === null}
            />
          </div>
          <div className="col-md-6">
            <TextInput
              label="Due Date"
              type="date"
              value={state.due_date}
              onChange={(e) =>
                setState({
                  ...state,
                  due_date: e.target.value,
                })
              }
              disabled
            />
          </div>
          <div className="col-md-12 mt-4">
            <Button
              type="submit"
              text={`${isUpdating ? "Update" : "Award"} Contract`}
              isLoading={loading}
              icon="add_circle"
              disabled={
                project === null ||
                vendor === null ||
                state.amount < 1 ||
                state.date_awarded === "" ||
                state.date_commenced === ""
              }
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AwardContract;
