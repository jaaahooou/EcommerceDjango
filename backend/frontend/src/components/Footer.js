import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const footer = () => {
  return (
    <div>
      <Container
        style={{
          bottom: "0",
          position: "fixed",
          width: "100vw",
        }}
      >
        <Row>
          <Col className="text-center py-3">Copyright &copy; IncredbleShop</Col>
        </Row>
      </Container>
    </div>
  );
};

export default footer;
