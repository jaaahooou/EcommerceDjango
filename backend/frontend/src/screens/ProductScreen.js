import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Card,
  Form,
} from "react-bootstrap";
import Rating from "../components/Rating";

import { useDispatch, useSelector } from "react-redux";
import {
  listProductDetails,
  createProductReview,
} from "../actions/producActions";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";
import Message from "../components/Message";
import Loader from "../components/Loader";

const ProductScreen = () => {
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  let navigate = useNavigate();
  let { id } = useParams();
  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    loading: loadingProductReview,
    error: errorProductReview,
    cuccess: successProductReview,
  } = productReviewCreate;

  useEffect(() => {
    if (successProductReview) {
      setRating(0);
      setComment("");
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }
    dispatch(listProductDetails(id));
  }, [dispatch, id, successProductReview]);

  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProductReview(id, {
        rating,
        comment,
      })
    );
  };

  return (
    <div className="product-screen">
      <Link to="/" className="btn my-3">
        <Button
          variant="outline-dark"
          style={{
            marginLeft: "5px",
            borderRadius: "5px",
            color: "bisque",
          }}
        >
          Back
        </Button>
      </Link>
      <div>
        <Row>
          <Col md={6}>
            <Image src={product.image} alt={product.name} fluid></Image>
          </Col>
          <Col md={3}>
            <ListGroup variant="flush">
              <ListGroup.Item
                style={{
                  backgroundColor: "rgba(0,0,0,0.1)",
                  color: "bisque",
                }}
              >
                <h3>{product.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item
                style={{
                  backgroundColor: "rgba(0,0,0,0.1)",
                  color: "bisque",
                }}
              >
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} rewievs`}
                  color={"#f8e825"}
                />
              </ListGroup.Item>

              <ListGroup.Item
                style={{
                  backgroundColor: "rgba(0,0,0,0.1)",
                  color: "bisque",
                }}
              >
                Cena: {product.price}zł
              </ListGroup.Item>
              <ListGroup.Item
                style={{
                  backgroundColor: "rgba(0,0,0,0.1)",
                  color: "bisque",
                }}
              >
                Opis: {product.description}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card
              style={{
                backgroundColor: "rgba(0,0,0,0)",
                color: "bisque",
              }}
            >
              <ListGroup
                style={{
                  backgroundColor: "rgba(0,0,0,0.1)",
                  color: "bisque",
                }}
                variant="flush"
              >
                <ListGroup.Item
                  style={{
                    backgroundColor: "rgba(0,0,0,0.1)",
                    color: "bisque",
                  }}
                >
                  <Row>
                    <Col>Cena:</Col>
                    <Col>
                      {" "}
                      <strong>{product.price}zł</strong>{" "}
                    </Col>
                  </Row>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? "In Stock" : "Out of stock"}
                    </Col>
                  </Row>
                </ListGroup.Item>

                {product.countInStock > 0 && (
                  <ListGroup.Item
                    style={{
                      backgroundColor: "rgba(0,0,0,0.1)",
                      color: "bisque",
                    }}
                  >
                    <Row>
                      <Col>Ilość</Col>
                      <Col xs="auto" className="my-1">
                        {" "}
                        <Form.Control
                          style={{
                            backgroundColor: "rgba(0,0,0,0.1)",
                          }}
                          as="select"
                          calue={qty}
                          onChange={(e) => setQty(e.target.value)}
                        >
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}

                <ListGroup.Item
                  style={{
                    backgroundColor: "rgba(0,0,0,0.1)",
                    color: "bisque",
                  }}
                >
                  <Button
                    onClick={addToCartHandler}
                    className="btn-block"
                    variant="outline-dark"
                    disabled={product.countInStock === 0 ? true : false}
                    type="button"
                    style={{ backgroundColor: "rgba(0,0,0,0.5" }}
                  >
                    Dodaj do koszyka
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            {product.reviews.length === 0 && (
              <Message
                style={{
                  backgroundColor: "rgba(0,0,0,0.1)",
                  color: "bisque",
                }}
              >
                Brak opini
              </Message>
            )}

            <ListGroup variant="flush">
              {product.reviews.map((review) => (
                <ListGroup.Item key={review._id}>
                  <h3>{review.name}</h3>
                  <Rating value={review.rating} color="#f8e825" />
                  <p>{review.createdAt.substring(0, 10)}</p>
                  <p>{review.comment}</p>
                </ListGroup.Item>
              ))}{" "}
              <ListGroup.Item
                style={{
                  backgroundColor: "rgba(0,0,0,0.1)",
                  color: "bisque",
                }}
              >
                <h4>Napisz opinię</h4>

                {loadingProductReview && <Loader />}
                {successProductReview && (
                  <Message variant="success">Opinia dodana</Message>
                )}
                {errorProductReview && (
                  <Message variant="danger">{errorProductReview}</Message>
                )}
                {userInfo ? (
                  <Form onSubmit={submitHandler}>
                    <Form.Group controlId="rating">
                      <Form.Label>Rating</Form.Label>
                      <Form.Control
                        as="select"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                      >
                        <option value="">Wybierz...</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="comment">
                      <Form.Label>Opinia</Form.Label>
                      <Form.Control
                        as="textarea"
                        row="5"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></Form.Control>

                      <Button
                        disabled={loadingProductReview}
                        type="submit"
                        variant="primary"
                      >
                        Wyślij
                      </Button>
                    </Form.Group>
                  </Form>
                ) : (
                  <Message>
                    <Link style={{ color: "bisque" }} to="/login">
                      Zaloguj się
                    </Link>{" "}
                    aby dodać opinię{" "}
                  </Message>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ProductScreen;
