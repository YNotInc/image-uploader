  
import React from "react";

// IMPORTANT: Contains MDBBootstrap Styles
import './styles.css';

// import { MDBCarousel, MDBCarouselCaption, MDBCarouselInner, MDBCarouselItem, MDBView, MDBMask, MDBContainer } from "mdbreact";

let Home = function() {
    return (
        <header>
          <div 
          className="view jarallax" data-jarallax='{"speed": 0.2}'>
            <div className="container h-100 d-flex justify-content-center align-items-center">
              <div className="row pt-5 mt-3">
                <div className="col-md-12 mb-3">
                  <div className="intro-info-content text-center">
                    <h1 className="display-3 mb-5 wow fadeInDown" data-wow-delay="0.3s">NEW
                      <a className="indigo-text font-weight-bold" href="#!">COLLECTION</a>
                    </h1>
                    <h5 className="text-uppercase mb-5 mt-1 font-weight-bold wow fadeInDown" data-wow-delay="0.3s">Free
                      delivery & special prices</h5>
                    <a className="btn btn-outline-indigo btn-lg wow fadeInDown" data-wow-delay="0.3s" href="#!">Shop</a>
                    <a className="btn btn-indigo btn-lg wow fadeInDown" data-wow-delay="0.3s" href="#!">Lookbook</a>
                  </div>
                </div>
              </div>
            </div>
        </div></header>);
};

export default Home;