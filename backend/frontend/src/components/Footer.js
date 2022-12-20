import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const footer = () => {
  return (
    <div>
      <Container>
        <Row>
          <Col className="text-center py-3">Copyright &copy; IncredbleShop</Col>
        </Row>
      </Container>
    </div>
  );
};

export default footer;
