import React, { useState, useEffect } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../actions/cartActions";
import CheckoutSteps from "../components/CheckoutSteps";
import { register } from "../actions/userActions";
import Message from "../components/Message";
import { createOrder } from "../actions/orderActions";
import { ORDER_CREATE_RESET } from "../constants/OrderConstants";
import { login } from "../actions/userActions";

function PlaceOrderScreen() {
  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, error, success } = orderCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userError, loading, userInfo } = userLogin;

  console.log(userLogin);

  let navigate = useNavigate();

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  cart.itemsPrice = cart.cartItems
    .reduce((acc, item) => acc + item.price * item.qty, 0)
    .toFixed(2);
  cart.shippingPrice = (cart.itemsPrice > 100 ? 0 : 10).toFixed(2);
  cart.taxPrice = Number((0.23 * cart.itemsPrice).toFixed(2));
  cart.totalPrice =
    Number(cart.itemsPrice) +
    Number(cart.taxPrice) +
    Number(cart.shippingPrice);

  if (!cart.paymentMethod) {
    navigate("/payment");
  }

  useEffect(() => {
    if (success) {
      navigate(`/order/${order._id}`);
      dispatch({ type: ORDER_CREATE_RESET });
    }
  }, [success, navigate]);

  const placeOrder = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        taxPrice: cart.taxPrice,
        shippingPrice: cart.shippingPrice,
        totalPrice: cart.totalPrice,
      })
    );
  };

  return (
    <div style={{}}>
      <CheckoutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item
              style={{
                backgroundColor: "rgba(0,0,0,0.3)",
                color: "bisque",
              }}
            >
              <h2>shipping</h2>
              <p>
                <strong>Shipping:</strong>
                {cart.shippingAddress.address},{cart.shippingAddress.city},
                {"  "}
                {cart.shippingAddress.postalCode},{"  "}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item
              style={{
                backgroundColor: "rgba(0,0,0,0.3)",
                color: "bisque",
              }}
            >
              <h2>Payment method</h2>
              <p>{cart.paymentMethod}</p>
            </ListGroup.Item>
            <ListGroup.Item
              style={{
                backgroundColor: "rgba(0,0,0,0.3)",
                color: "bisque",
              }}
            >
              <h2>Order</h2>

              {cart.cartItems.length === 0 ? (
                <Message variant="info">Your cart is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item
                      style={{
                        backgroundColor: "rgba(0,0,0,0.3)",
                        color: "bisque",
                      }}
                      key={index}
                    >
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>

                        <Col
                          style={{
                            marginTop: "10px",
                          }}
                        >
                          {item.name}
                        </Col>

                        <Col
                          md={4}
                          style={{
                            marginTop: "10px",
                          }}
                        >
                          {item.qty} X ${item.price} = $
                          {(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card
            style={{
              backgroundColor: "rgba(0,0,0,0)",
            }}
          >
            <ListGroup variant="flush">
              <ListGroup.Item
                style={{
                  backgroundColor: "rgba(0,0,0,0.3)",
                  color: "bisque",
                }}
              >
                <h2>Summary</h2>
              </ListGroup.Item>

              <ListGroup.Item
                style={{
                  backgroundColor: "rgba(0,0,0,0.3)",
                  color: "bisque",
                }}
              >
                <Row>
                  <Col>Cart:</Col>
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item
                style={{
                  backgroundColor: "rgba(0,0,0,0.3)",
                  color: "bisque",
                }}
              >
                <Row>
                  <Col>Shipping:</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item
                style={{
                  backgroundColor: "rgba(0,0,0,0.3)",
                  color: "bisque",
                }}
              >
                <Row>
                  <Col>TAX:</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item
                style={{
                  backgroundColor: "rgba(0,0,0,0.3)",
                  color: "bisque",
                }}
              >
                <Row>
                  <Col>Summary:</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item
                style={{
                  backgroundColor: "rgba(0,0,0,0.3)",
                  color: "bisque",
                }}
              >
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>

              <ListGroup.Item
                style={{
                  backgroundColor: "rgba(0,0,0,0.3)",
                }}
              >
                {userInfo == null ? (
                  <Message variant="danger">You must be logged in</Message>
                ) : (
                  <Button
                    type="button"
                    className="btn-block"
                    disabled={cart.cartItems === 0}
                    onClick={placeOrder}
                  >
                    Submit order
                  </Button>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default PlaceOrderScreen;
