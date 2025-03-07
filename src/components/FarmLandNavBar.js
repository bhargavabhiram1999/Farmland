import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";

function FarmLandNavBar({ setActiveSection }) {
  const navigate = useNavigate();
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" fixed="top">
        <Container>
          <Navbar.Brand href="#home">Farm Tracker</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link onClick={() => setActiveSection("materialData")}>
              Update Material Data
            </Nav.Link>
            <Nav.Link onClick={() => setActiveSection("stockData")}>
              Stock Data
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link>
              <Button
                variant="light"
                onClick={() => {
                  localStorage.removeItem("user");
                  navigate("/");
                }}
              >
                Log out
              </Button>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <br />
    </>
  );
}

export default FarmLandNavBar;