import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { logout } from "../actions/userActions";
import { useNavigate } from "react-router-dom";

function Header() {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/");
    console.log("logout");
  };

  return (
    <div>
      <header>
        <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
          <Container>
            <LinkContainer to="/">
              <Navbar.Brand href="/">IncredibleShop</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <LinkContainer to="/cart">
                  <Nav.Link href="#home">
                    <i className="fas fa-shopping-cart"></i> Cart
                  </Nav.Link>
                </LinkContainer>
                {userInfo ? (
                  <NavDropdown title={userInfo.name} id="username">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>

                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <LinkContainer to="/login">
                    <Nav.Link href="#link">
                      {" "}
                      <i className="fas fa-user"></i>Login
                    </Nav.Link>
                  </LinkContainer>
                )}

                {userInfo && userInfo.isAdmin && (
                  <NavDropdown title="Admin" id="adminmenue">
                    <LinkContainer to="/admin/userlist">
                      <NavDropdown.Item>Users</NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to="/admin/productlist">
                      <NavDropdown.Item>Products</NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to="/admin/orderlist">
                      <NavDropdown.Item>Orders</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    </div>
  );
}

export default Header;
