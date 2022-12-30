import React, { useState, useEffect } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../actions/cartActions";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { register } from "../actions/userActions";

function ShippingScreen() {
  let navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const dispatch = useDispatch();
  const [address, setAddress] = useState(shippingAddress.address);
  const [city, setCity] = useState(shippingAddress.city);
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode);
  const [country, setCountry] = useState(shippingAddress.country);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate("/payment");
  };
  return (
    <FormContainer>
      <h1>Wysyłka</h1>
      <CheckoutSteps step1 step2 />
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="address">
          <Form.Label>Adres</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter address"
            value={address ? address : ""}
            onChange={(e) => setAddress(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="city">
          <Form.Label>Miasto</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter city"
            value={city ? city : ""}
            onChange={(e) => setCity(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="postalCode">
          <Form.Label>Kod pocztowy</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter postal code"
            value={postalCode ? postalCode : ""}
            onChange={(e) => setPostalCode(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="country">
          <Form.Label>Kraj</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter country"
            value={country ? country : ""}
            onChange={(e) => setCountry(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary">
          Dalej
        </Button>
      </Form>
    </FormContainer>
  );
}

export default ShippingScreen;
