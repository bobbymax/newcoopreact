import React, { useState } from "react";
import { Button, TextInput } from "../template/components/Inputs";
import { authenticate } from "../features/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../app/http/controllers/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      email,
      password,
    };

    // console.log(data);

    try {
      login(data)
        .then((res) => {
          setTimeout(() => {
            dispatch(authenticate(res.data));
            setEmail("");
            setPassword("");
            setLoading(false);
            navigate("/dashboard");
          }, 2000);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err.message);
        });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-md-12">
          <TextInput
            label="Email Address"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="lg"
            placeholder="Enter Email Address"
            borderRadius
          />
        </div>
        <div className="col-md-12">
          <TextInput
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size="lg"
            placeholder="Enter Password"
            borderRadius
          />
        </div>
        <div className="col-md-12 mt-3">
          <Button text="LOGIN" isLoading={loading} type="submit" icon="login" />
        </div>
      </div>
    </form>
  );
};

export default Login;
