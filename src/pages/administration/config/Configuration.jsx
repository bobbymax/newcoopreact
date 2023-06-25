import React, { useEffect, useState } from "react";
import { collection, store } from "../../../app/http/controllers";
import Alert from "../../../app/services/alert";
import {
  Button,
  CustomSelect,
  CustomSelectOptions,
  TextInput,
} from "../../../template/components/Inputs";
import { splitDetails } from "../../../app/helpers";

const Configuration = () => {
  const [state, setState] = useState({});
  const [settings, setSettings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;

    setState({
      ...state,
      [e.target.name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const requests = {
      state,
    };

    try {
      store("configure", requests)
        .then((res) => {
          const data = res.data;
          setIsLoading(false);
          Alert.success("Updated", data.message);
          setCanEdit(false);
        })
        .catch((err) => {
          setIsLoading(false);
          Alert.error("Oops!!", err.response.data.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const vals = {};
    settings.forEach((el) => {
      const value = el?.input_type === "number" && el?.value === null ? 0 : "";

      vals[el.key] = el.value ?? value;
    });
    setState(vals);
  }, [settings]);

  useEffect(() => {
    try {
      collection("settings")
        .then((res) => {
          setSettings(res.data.data);
        })
        .catch((err) => console.log(err.response.data.message));
    } catch (error) {
      console.log(error);
    }
  }, []);

  console.log(state);

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <button
            type="button"
            className="btn btn-success mb-4 btn-rounded"
            onClick={() => setCanEdit(true)}
            disabled={canEdit}
          >
            Edit Configuration
          </button>

          <div className="form__card">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {settings?.length > 0 &&
                  settings?.map((conf, i) => (
                    <div className="col-md-12" key={i}>
                      {conf?.input_type === "text" && (
                        <TextInput
                          label={conf?.display_name}
                          name={conf?.key}
                          value={state[conf?.key]}
                          onChange={handleChange}
                          placeholder={`Enter ${conf?.display_name}`}
                          disabled={state[conf?.key] !== "" && !canEdit}
                        />
                      )}

                      {conf?.input_type === "textarea" && (
                        <TextInput
                          label={conf?.display_name}
                          name={conf?.key}
                          value={state[conf?.key]}
                          onChange={handleChange}
                          placeholder={`Enter ${conf?.display_name}`}
                          multiline={3}
                          disabled={state[conf?.key] !== "" && !canEdit}
                        />
                      )}

                      {conf?.input_type === "number" && (
                        <TextInput
                          label={conf?.display_name}
                          type={conf?.input_type}
                          name={conf?.key}
                          value={state[conf?.key]}
                          onChange={handleChange}
                          placeholder={`Enter ${conf?.display_name}`}
                          disabled={state[conf?.key] !== 0 && !canEdit}
                        />
                      )}

                      {conf?.input_type === "file" && (
                        <TextInput
                          label={conf?.display_name}
                          type={conf?.input_type}
                          name={conf?.key}
                          value={state[conf?.key]}
                          onChange={handleChange}
                          disabled={state[conf?.key] !== "" && !canEdit}
                        />
                      )}

                      {conf?.input_type === "select" && (
                        <CustomSelect
                          label={conf?.display_name}
                          value={state[conf?.key]}
                          onChange={handleChange}
                          name={conf?.key}
                          disabled={state[conf?.key] !== "" && !canEdit}
                        >
                          <CustomSelectOptions
                            value={`${conf?.input_type === "number" ? 0 : ""}`}
                            label={`Select ${conf?.display_name}`}
                            disabled
                          />

                          {splitDetails(conf?.details).map((det, i) => (
                            <CustomSelectOptions
                              key={i}
                              value={det.key}
                              label={det.label}
                            />
                          ))}
                        </CustomSelect>
                      )}
                    </div>
                  ))}

                <div className="col-md-12">
                  <Button
                    type="submit"
                    text="UPDATE CONFIGURATION"
                    isLoading={isLoading}
                    icon="add_circle"
                    disabled={!canEdit}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Configuration;
