import React, { Component } from "react";
import { Navbar } from "react-bootstrap";

class Header extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Navbar>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="#home">Stockfolio</a>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Navbar.Text>
                Signed in as: <Navbar.Link href="#">Mark Otto</Navbar.Link>
              </Navbar.Text>
              <Navbar.Text pullRight style={{ marginRight: "15px" }}>
                Login
              </Navbar.Text>
            </Navbar.Collapse>
          </Navbar>
        </header>
      </div>
    );
  }
}

export default Header;
