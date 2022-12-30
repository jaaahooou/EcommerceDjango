import React, { useState, useEffect } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  Form,
  Button,
  Row,
  Col,
  ListGroup,
  Image,
  Card,
  ListGroupItem,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { PayPalButton } from "react-paypal-button-v2";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../actions/orderActions";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../constants/OrderConstants";

function OrderScreen() {
  let orderId = useParams();
  let navigate = useNavigate();
  const [sdkReady, setSdkReady] = useState(false);

  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, error, loading } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  if (!loading && !error) {
    order.itemsPrice = order.orderItems
      .reduce((acc, item) => acc + item.price * item.qty, 0)
      .toFixed(2);
  }

  //AbXjdKct5yb4gBFU_kIXPsHFgDX7skGf5Ng7_RfGxWMMUAEGisfbaWvnYF0M4V_0Zqe7Yt5EtpebAZaV

  const addPayPalScript = () => {
    const script = document.createElement("script");
    script.type = "text/javascript";

    script.src =
      "https://www.paypal.com/sdk/js?client-id=AbXjdKct5yb4gBFU_kIXPsHFgDX7skGf5Ng7_RfGxWMMUAEGisfbaWvnYF0M4V_0Zqe7Yt5EtpebAZaV";
    script.async = true;
    script.onload = () => {
      setSdkReady(true);
    };
    document.body.appendChild(script);
  };

  // useEffect doesnt work if isPaid changed, maybe it`s because od problems with orderId
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
    if (!order || successPay || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, order, orderId, successPay, successDeliver]);

  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <div>
      <Row>
        <h1>Zamówienie: {order._id}</h1>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Wysyłka</h2>
              <p>
                {" "}
                <strong> Nazwa: </strong> {order.user.name}{" "}
              </p>
              <p>
                <strong> Email: </strong>{" "}
                <a href={`mailto:${order.user.email}`}> {order.user.email} </a>
              </p>

              <p>
                <strong>Wysyłka: </strong>
                {order.shippingAddress.address},{order.shippingAddress.city},
                {"  "}
                {order.shippingAddress.postalCode},{"  "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Dostarczone dnia: {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="warning">Nie dostarczone</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Metoda płatności</h2>
              <p>{order.paymentMethod}</p>

              {order.isPaid ? (
                <Message variant="success">
                  Zapłacone dnia: {order.paidAt}
                </Message>
              ) : (
                <Message variant="warning">Nie opłacone</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Zamówienie</h2>

              {order.orderItems.length === 0 ? (
                <Message variant="info">Zamówienie jest puste</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>

                        <Col>
                          <Link to={`/products/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>

                        <Col md={4}>
                          {item.qty} X {item.price}zł =
                          {(item.qty * item.price).toFixed(2)}zł
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
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Podsumowanie</h2>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Zamówienie:</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Koszt wysyłki:</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>VAT:</Col>
                  <Col>{order.taxPrice}zł</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Suma:</Col>
                  <Col>{order.totalPrice}zł</Col>
                </Row>
              </ListGroup.Item>

              {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
            {loadingDeliver && <Loader />}
            {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn btn-block"
                    onClick={deliverHandler}
                  >
                    Zaznacz jako dostarczone
                  </Button>
                </ListGroup.Item>
              )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default OrderScreen;
