import React, { Component } from "react";
import Cart from "../../Cart/Cart";
import AdminHeader from "../AdminHeader";

import { trackPromise } from "react-promise-tracker";
import { connect } from "react-redux";
import { fetchUsers } from "../../../actions/auth";

class CartItem extends Component {
  componentDidMount() {
    trackPromise(this.props.fetchUsers());
  }
  renderProducts() {
    const products = JSON.parse(localStorage.getItem("cartItem"));
    return products.map((item, index) => {
      return (
        <tr key={item?.id}>
          <td className="d-flex">
            <img src={item?.image} alt="Cart Image" width="80px" />
            <h5 className="mx-2 my-auto text-capitalize">{item?.name}</h5>
          </td>
        </tr>
      );
    });
  }

  renderTable() {
    return this.props.users.map((product, index) => {
      //   console.log(product.approve);
      return (
        <tr key={product._id}>
          <td>{index + 1}</td>
          <td>{product.name}</td>
          <td>{product.email}</td>
          <td>{product.mobile}</td>
          <td>{this.renderProducts()}</td>
        </tr>
      );
    });
  }

  renderCart() {
    const items = { ...localStorage };
    const id = JSON.parse(localStorage.getItem("cartItem"))
      ? JSON.parse(items.cartItem)
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
          </div>
        </div>
      );
    }
  }
  render() {
    return (
      <div>
        <AdminHeader />
        <div className="col-md-9 offset-md-2 ">
          <h4 className="text-center">Cart Item</h4>
          <br />
          <table className="table table-striped  styled-table text-center">
            <thead>
              <tr>
                <th>Sl. No</th>
                <th>Customer Name</th>
                <th>Customer email</th>
                <th>Customer mobile</th>
                <th>Cart Items</th>
              </tr>
            </thead>
            <tbody>{this.renderTable()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    users: state.users,
  };
};

export default connect(mapStateToProps, { fetchUsers })(CartItem);
