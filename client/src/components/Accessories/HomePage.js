import React, { Component } from "react";
import Footer from "../Footer/Footer";
import Header from "../Navbar/Header";
import Carousel from "./ProductCarousel";
import { Link } from "react-router-dom";
import CartLink from "../Cart/CartLink";
import AllProducts from "../Store/AllProducts";

export default class PottingSoil extends Component {
  componentDidMount() {
    document.title = "MultiplexUrbanGarden - Urban Gardening Accessories";
  }

  render() {
    return (
      <div>
        <div
          className="background_img1"
          style={{
            backgroundImage: " url(./images/Urban_Images/ACCESSORIES1.png)",
          }}
        >
          <Header />
          <Carousel />
        </div>
        <CartLink />
        <AllProducts id={5} />
        <Footer />
      </div>
    );
  }
}
