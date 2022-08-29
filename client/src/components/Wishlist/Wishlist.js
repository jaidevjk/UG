import React, { Component } from "react";
import { connect } from "react-redux";
import { trackPromise } from "react-promise-tracker";
import { Link } from "react-router-dom";
import { compose } from "redux";
import { withRouter } from "react-router";

import {
  fetchWishListItems,
  deleteWishListItems,
} from "../../actions/Products";

import {
  updateWishlisttNum,
  updateWishProductNum,
  updateWishProductNumSum,
} from "../../actions/OtherActions";

import {
  removeFromWishList,
  updateWishListCount,
} from "../../actions/WishlistActions";

import Header from "../Navbar/Header";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

class Wishlist extends Component {
  state = {
    productCount: 0,
    productName: "",
    productId: "",
  };

  componentDidMount() {
    const items = { ...localStorage };
    const ids = JSON.parse(localStorage.getItem("wishListItem"))
      ? JSON.parse(items.wishListItem)
      : [];
    ids.map((val) => {});
    this.setState({ totalProducts: ids.length });
  }

  renderWishlist() {
    const items = { ...localStorage };
    const id = JSON.parse(localStorage.getItem("wishListItem"))
      ? JSON.parse(items.wishListItem)
      : [];
    if (id.length >= 1) {
      return (
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-9">
              <div className="table-responsive">
                <table
                  className="table-striped text-center"
                  cellPadding="5px"
                  width="100%"
                >
                  <thead className="greenBg text-white">
                    <tr className="p-2 text-center">
                      <th>Item</th>
                      <th className="mx-2">Rate</th>
                      <th>Quantity</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">{this.renderProducts()}</tbody>
                </table>
              </div>
            </div>
            <div className="col-12 col-md-3 text-center ">
              <div className="bordered shadow rounded">
                <h3 className="p-2">Order Summary</h3>
                <hr />
                <p className="p-1">
                  <b>Total Products: </b>
                  {this.renderProductsCount()}
                </p>
                <hr />
                <p className="p-1">
                  <b>Total Estimated Cost: </b>
                  {this.renderOrderSummary()}
                </p>
                <hr />
                <p className="p-1">
                  {localStorage.getItem("profile") === null ? (
                    <span>
                      Please Login to checkout, <br />
                      <Link
                        to="/signin"
                        className="btn btn-warning btn-block py-2"
                      >
                        click here
                      </Link>
                    </span>
                  ) : (
                    <Link
                      to="/cartForm"
                      className="btn btn-success btn-block py-2"
                    >
                      Checkout
                    </Link>
                  )}
                </p>
                <hr />
                <p className="p-1">
                  <Link
                    to="/store"
                    className="btn btn-danger btn-block py-2"
                    onClick={() => {
                      localStorage.removeItem("wishListItem");
                      trackPromise(this.props.updateWishlisttNum(0));
                      toast.success("Your cart is successfully cleared");
                    }}
                  >
                    Clear Cart
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="text-center">
          <h2 className="text-center text-danger mt-5">
            No Products In Your Cart
          </h2>
          <Link
            to="/store"
            className="btn btn-outline-danger text-center p-3"
            style={{ fontSize: "1.5rem" }}
          >
            Shop Now
          </Link>
        </div>
      );
    }
  }

  renderProducts() {
    // console.log(JSON.parse(localStorage.getItem("cartItem")));
    const products = JSON.parse(localStorage.getItem("wishListItem"));
    return products.map((item, index) => {
      return (
        <tr key={item.id}>
          <td className="d-flex">
            <img src={item.image} alt="Cart Image" width="80px" />
            <h5 className="mx-2 my-auto text-capitalize">{item.name}</h5>
          </td>
          <td>
            <span>{item.cost}</span>
          </td>
          <td className="d-flex" style={{ transform: "translateY(-40%)" }}>
            <a
              className="cart_btn1"
              onClick={() => {
                trackPromise(
                  this.props.updateWishProductNum(
                    item.id,
                    item.price,
                    this.props.history
                  )
                );
              }}
              style={{ cursor: "pointer" }}
            >
              <i className="fa fa-minus"></i>
            </a>
            <input
              type="text"
              min={0}
              name="productCount"
              className="text-center customInput"
              value={parseInt(item.count)}
              onChange={(e) => {
                this.setState({ productCount: e.target.value });
              }}
              disabled
            />
            <a
              onClick={() => {
                trackPromise(
                  this.props.updateWishProductNumSum(
                    item.id,
                    item.price,
                    this.props.history
                  )
                );
              }}
              className="cart_btn1 mr-2"
              style={{ cursor: "pointer" }}
            >
              <i className="fa fa-plus"></i>
            </a>
          </td>
          <td>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => {
                trackPromise(this.props.deleteWishListItems(item.id));
                trackPromise(this.props.removeFromWishList(item.id));
                trackPromise(this.props.updateWishListCount());
              }}
            >
              <span>
                <i className="fas fa-trash fa-2x"></i>
              </span>
            </span>
          </td>
        </tr>
      );
    });
  }

  renderProductsCount() {
    const items = { ...localStorage };
    const ids = JSON.parse(localStorage.getItem("wishListItem"))
      ? JSON.parse(items.wishListItem)
      : [];
    return ids.length;
  }

  renderOrderSummary() {
    const items = { ...localStorage };
    const price = [];
    const qnt = [];
    const ids = JSON.parse(localStorage.getItem("wishListItem"))
      ? JSON.parse(items.wishListItem)
      : [];

    for (let i in ids) {
      // console.log(ids[i]);
      price.push(ids[i].cost);
      qnt.push(ids[i].count);
    }
    // console.log(price, qnt);
    const total = qnt.reduce(function (r, a, i) {
      return r + a * price[i];
    }, 0);
    return total;
  }

  render() {
    // console.log(this.props.count);
    return (
      <div>
        <Header />
        <div className="py-2 p-md-0"></div>
        {this.renderWishlist()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    wishlist: state.wishListItem,
    count: state.productCount,
  };
};

export default compose(
  connect(mapStateToProps, {
    fetchWishListItems,
    deleteWishListItems,
    updateWishlisttNum,
    updateWishProductNum,
    updateWishProductNumSum,
    removeFromWishList,
    updateWishListCount,
  })(withRouter(Wishlist))
);
