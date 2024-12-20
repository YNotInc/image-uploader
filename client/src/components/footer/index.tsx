import React from 'react';
import './styles.css';
import { MDBContainer, MDBFooter } from "mdbreact";

let Footer = () => {
    return (
        <MDBFooter color="blue" className="font-small pt-4 fixed-bottom">
      <div className="footer-copyright text-center py-3">
        <MDBContainer fluid>
          &copy; {new Date().getFullYear()} Copyright: <a href="https://www.MDBootstrap.com"> MDBootstrap.com </a>
        </MDBContainer>
      </div>
    </MDBFooter>
    );
};

export default Footer;