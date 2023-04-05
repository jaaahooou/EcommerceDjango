import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

export const SearchBox = () => {
  const [keyword, setKeyword] = useState("");

  let navigate = useNavigate();
  let location = useLocation();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      navigate(`/?keyword=${keyword}&page=1`);
    } else {
      navigate(navigate(location.pathname));
    }
  };
  return (
    <Form onSubmit={submitHandler} inline="true" className="header-search-form">
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        className="mr-sm-2 ml-sm-5"
        style={{ borderRadius: "5px" }}
      ></Form.Control>

      <Button
        variant="outline-dark"
        className="p-2"
        style={{
          marginLeft: "5px",
          borderRadius: "5px",
          color: "bisque",
        }}
      >
        search
      </Button>
    </Form>
  );
};
