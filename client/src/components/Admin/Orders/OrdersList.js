import React, { Component } from "react";
import { trackPromise } from "react-promise-tracker";
import { connect } from "react-redux";
import Moment from "react-moment";
import "moment-timezone";
import { Link } from "react-router-dom";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { Calendar } from "react-date-range";
import { DateRangePicker } from "react-date-range";
import $ from "jquery";
// import DatePicker from "react-date-picker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { fetchOrders, createOrder } from "../../../actions/paymentActions";
import AdminHeader from "../AdminHeader";
import { ExportToExcel } from "./ExportToExcel";

class OrdersList extends Component {
  state = {
    update: true,
    search: "",
    fileName:
      "MUG Sales Report " +
      new Date().getDate() +
      "-" +
      parseInt(new Date().getMonth() + 1) +
      "-" +
      new Date().getFullYear() +
      " " +
      new Date().getHours() +
      ":" +
      new Date().getMinutes() +
      ":" +
      new Date().getSeconds(),

    data: {},
    startDate: new Date(),
    endDate: new Date(),
    filteredArray: [],
    address: "",
    city: "",
    phoneNo: "",
    pincode: "",
    country: "",
    state: "",
    company: "",
    username: "",
    userEmail: "",
    // userId: "61b239f77b1a7e100bf71047",
    userId: "",
    orderItems: [],
    payment: [],
    itemsPrice: "",
    totalPrice: "",
    id: "",
    change: false,
    paymentMode: "",
    bgColor: "",
    discountPrice: "",
    shippingPrice: "",
  };

  componentDidMount() {
    trackPromise(this.props.fetchOrders());
    this.setState({ update: false });
    // console.log(JSON.parse(localStorage.getItem("cartItem")) ? true : false);

    // const profile = localStorage.getItem("twk_token_621770fd1ffac05b1d7b8539");
    // console.log(profile);
    const items = { ...localStorage };
    const price = [];
    const qnt = [];
    const ids = JSON.parse(localStorage.getItem("cartItem"))
      ? JSON.parse(items.cartItem)
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

    // this.setState({
    //   userEmail: profile.email,
    //   phoneNo: profile.mobile,
    //   username: profile.name,
    //   userId: profile._id,
    //   totalPrice: total,
    //   orderItems: JSON.parse(localStorage.getItem("cartItem")),
    // });

    if (total >= 10000) {
      const discount = total - 10000;
      const discountPer = 10000 - 10000 * 0.15;
      const finalCost = discount + discountPer;
      this.setState({ discountPrice: Math.ceil(finalCost) });
    } else {
      this.setState({ discountPrice: Math.ceil(total - total * 0.15) });
    }

    if (total >= 10000) {
      const discount = total - 10000;
      const discountPer = 10000 - 10000 * 0.15;
      const finalCost = discount + discountPer;

      if (total >= 1000) {
        this.setState({ itemsPrice: Math.ceil(finalCost), shippingPrice: 0 });
      } else {
        this.setState({
          itemsPrice: Math.ceil(finalCost) + 99,
          shippingPrice: 99,
        });
      }
    } else {
      if (total >= 1000) {
        this.setState({
          itemsPrice: Math.ceil(total - total * 0.15),
          shippingPrice: 0,
        });
      } else {
        this.setState({
          itemsPrice: Math.ceil(total - total * 0.15) + 99,
          shippingPrice: 99,
        });
      }
    }
  }

  // handleSelect(date) {
  //   console.log(date); // native Date object
  // }

  searchByDate() {
    var toStart = new Date(this.state.startDate).toISOString();
    var sd = new Date(toStart).getTime();
    var toEnd = new Date(this.state.endDate).toISOString();
    var ed = new Date(toEnd).getTime();

    var result = this.props.orders.filter((order) => {
      var time = new Date(order.orderInfo.createdAt).getTime();
      return sd < time && time < ed;
    });
    console.log("Results", result);
    this.setState({ filteredArray: result });
  }

  renderTable() {
    const arr =
      this.state.filteredArray.length === 0
        ? this.props.orders
        : this.state.filteredArray;
    return arr
      .filter((val) => {
        if (this.state.search === "") {
          return val;
        } else if (
          val.user.username
            .toLowerCase()
            .includes(this.state.search.toLowerCase()) ||
          val.orderStatus
            .toLowerCase()
            .includes(this.state.search.toLowerCase()) ||
          val.user.userEmail
            .toLowerCase()
            .includes(this.state.search.toLowerCase())
        ) {
          // console.log(val._id);
          return val;
        }
      })
      .reverse()
      .map((order, index) => {
        // console.log(
        //   new Date(order.orderInfo.createdAt).toLocaleDateString("en-US")
        // );
        return (
          <tr key={order._id}>
            <td>{index + 1}</td>
            <td>
              <Moment format=" DD-MMM-YYYY, hh:mm:ss A">
                {order.orderInfo.createdAt}
              </Moment>
            </td>
            <td>MUG00{order._id + 1}</td>
            <td>INV00{order._id + 1}</td>
            <td>{order.user === undefined ? "" : order.user.username}</td>
            <td>{order.orderItems.length}</td>
            <td>{order.orderInfo.itemsPrice}</td>
            <td>
              {order.orderInfo.paymentMode === "Cash on Delivery" &&
              order.payment === undefined ? (
                <span className="text-warning">
                  <b>COD</b>
                </span>
              ) : (
                <span className="text-success">
                  <b>Online payment</b>
                </span>
              )}
            </td>
            <td>
              {order.orderStatus === "Pending" ||
              order.orderStatus === "Canceled" ? (
                <span className="text-danger">{order.orderStatus}</span>
              ) : (
                <span className="text-success">{order.orderStatus}</span>
              )}
            </td>
            <td>
              <ul
                className="d-flex justify-content-around w-75 my-auto"
                style={{ listStyle: "none" }}
              >
                <li>
                  <a
                    href={`/singleOrder?id=${order._id}`}
                    className="btn btn-sm btn-primary "
                  >
                    <i className="fa fa-eye"></i>
                  </a>
                </li>
                {/* <li>
                <a
                  style={{ cursor: "pointer" }}
                  className="btn btn-sm btn-danger text-white"
                >
                  <i className="fa fa-trash"></i>
                </a>
              </li> */}
              </ul>
            </td>
          </tr>
        );
      });
  }

  clearValues() {
    this.setState({
      startDate: new Date(),
      endDate: new Date(),
      filteredArray: [],
      address: "",
      city: "",
      phoneNo: "",
      pincode: "",
      country: "",
      state: "",
      company: "",
      username: "",
      userEmail: "",
      //  userId: "61b239f77b1a7e100bf71047",
      userId: "",
      orderItems: [],
      payment: {},
      itemsPrice: "",
      totalPrice: "",
      id: "",
      change: false,
      paymentMode: "",
      bgColor: "",
      discountPrice: "",
      shippingPrice: "",
    });
  }

  renderProducts() {
    // console.log(JSON.parse(localStorage.getItem("cartItem")));
    const products = JSON.parse(localStorage.getItem("cartItem"));
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
          <td
            className="d-flex align-items-center justify-content-center"
            style={{ transform: "translateY(-40%)" }}
          >
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
          </td>
        </tr>
      );
    });
  }

  // renderExcelData() {
  //   // Excel Info
  //   const orders = [];
  //   const arr =
  //     this.state.filteredArray.length === 0
  //       ? this.props.orders
  //       : this.state.filteredArray;
  //   arr.map((order) => {
  //     orders.push({
  //       "Order Id": "MUG00" + order._id + 1,
  //       "Invoice Number": "INV00" + order._id + 1,
  //       "No. of items ordered": order.orderItems.length,
  //       "Original Price": order.orderInfo.totalPrice,
  //       "Discount Price (15%)": order.orderInfo.discountPrice,
  //       "Shipping Price": order.orderInfo.shippingPrice,
  //       "Total Price": order.orderInfo.itemsPrice,
  //       "Order Status": order.orderStatus,
  //       "Payment Mode":
  //         order.orderInfo.paymentMode === "Cash on Delivery" &&
  //         order.payment === undefined
  //           ? "COD"
  //           : "Online payment",
  //       "Ordered At":
  //         new Date(order.orderInfo.createdAt).getDate() +
  //         "-" +
  //         parseInt(new Date(order.orderInfo.createdAt).getMonth() + 1) +
  //         "-" +
  //         new Date(order.orderInfo.createdAt).getFullYear() +
  //         " " +
  //         new Date(order.orderInfo.createdAt).getHours() +
  //         ":" +
  //         new Date(order.orderInfo.createdAt).getMinutes() +
  //         ":" +
  //         new Date(order.orderInfo.createdAt).getSeconds(),
  //       "Cancel Reason": order.cancelReason,
  //       Comments: order.comments,
  //       Transportation: order.contactInfo,
  //       "Mode of Transport": order.modeOfTransport,
  //       "Customer Name": order.user.username,
  //       "Customer Number": order.user.phoneNo,
  //       "Customer Email Id": order.user.userEmail,
  //       "Customer Address":
  //         order.user.address +
  //         order.user.company +
  //         order.user.city +
  //         order.user.state +
  //         order.user.country +
  //         "-" +
  //         order.user.pincode,
  //     });
  //   });
  //   return orders;
  // }



  renderExcelData() {
    // Excel Info
    const orders = [];
    const arr =
      this.state.filteredArray.length === 0
        ? this.props.orders
        : this.state.filteredArray;
    arr.filter((val) => {
      if (this.state.search === "") {
        return val;
      } else if (
        val.user.username
          .toLowerCase()
          .includes(this.state.search.toLowerCase()) ||
        val.orderStatus
          .toLowerCase()
          .includes(this.state.search.toLowerCase()) ||
        val.user.userEmail
          .toLowerCase()
          .includes(this.state.search.toLowerCase())
      ) {
        // console.log(val._id);
        return val;
      }
    })
    .reverse()
    .map((order) => {
      orders.push({
        "Order Id": "MUG00" + order._id + 1,
        "Invoice Number": "INV00" + order._id + 1,
        "No. of items ordered": order.orderItems.length,
        "Original Price": order.orderInfo.totalPrice,
        "Discount Price (15%)": order.orderInfo.discountPrice,
        "Shipping Price": order.orderInfo.shippingPrice,
        "Total Price": order.orderInfo.itemsPrice,
        "Order Status": order.orderStatus,
        "Payment Mode":
          order.orderInfo.paymentMode === "Cash on Delivery" &&
          order.payment === undefined
            ? "COD"
            : "Online payment",
        "Ordered At":
          new Date(order.orderInfo.createdAt).getDate() +
          "-" +
          parseInt(new Date(order.orderInfo.createdAt).getMonth() + 1) +
          "-" +
          new Date(order.orderInfo.createdAt).getFullYear() +
          " " +
          new Date(order.orderInfo.createdAt).getHours() +
          ":" +
          new Date(order.orderInfo.createdAt).getMinutes() +
          ":" +
          new Date(order.orderInfo.createdAt).getSeconds(),
        "Cancel Reason": order.cancelReason,
        Comments: order.comments,
        Transportation: order.contactInfo,
        "Mode of Transport": order.modeOfTransport,
        "Customer Name": order.user.username,
        "Customer Number": order.user.phoneNo,
        "Customer Email Id": order.user.userEmail,
        "Customer Address":
          order.user.address +
          order.user.company +
          order.user.city +
          order.user.state +
          order.user.country +
          "-" +
          order.user.pincode,
      });
    });
    return orders;
  }



  onSubmit(e) {
    e.preventDefault();

    const userInfo = {
      address: this.state.address,
      city: this.state.city,
      phoneNo: this.state.phoneNo,
      pincode: this.state.pincode,
      country: this.state.country,
      state: this.state.state,
      company: this.state.company,
      username: this.state.username,
      userEmail: this.state.userEmail,
    };

    const items = JSON.parse(localStorage.getItem("cartItem"));

    const paymentInfo = {
      itemsPrice: this.state.itemsPrice,
      totalPrice: this.state.totalPrice,
      shippingPrice: this.state.shippingPrice,
      discountPrice: this.state.discountPrice,
    };

    console.log(paymentInfo);

    if (items === null) {
      alert("Please add items in Store page");
    } else {
      trackPromise(
        this.props.createOrder({
          user: userInfo,
          orderItems: JSON.parse(localStorage.getItem("cartItem")),
          userId: this.state.userId,
          orderInfo: paymentInfo,
        })
      );
    }
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
            <div className="col-12 col-md-12">
              <h5>Products to be ordered:</h5>
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
                    </tr>
                  </thead>
                  <tbody className="text-center">{this.renderProducts()}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="text-center">
          <h5 className="text-center text-danger mt-5">
            Add products in store page to cart you can see here.
          </h5>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <AdminHeader />
        <div className="col-md-10 offset-md-2 ">
          <h2 className="text-center">Order List</h2>
          <div className="">
            <div className="">
              <div className="form-group">
                <label htmlFor="search">Search By User Name or Email ID:</label>
                <input
                  className="form-control"
                  value={this.state.search}
                  onChange={(e) => {
                    this.setState({ search: e.target.value });
                  }}
                  placeholder="Search By User Name or Email ID."
                  id="search"
                />
              </div>

              <div className="d-flex w-50">
                <DatePicker
                  selected={this.state.startDate}
                  selectsStart
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  onChange={(date) => {
                    this.setState({ startDate: date });
                    console.log(date);
                  }}
                  dateFormat="dd/MM/yyyy"
                />
                <DatePicker
                  selected={this.state.endDate}
                  selectsEnd
                  startDate={this.state.startDate}
                  // endDate={this.state.endDate}
                  minDate={this.state.startDate}
                  onChange={(date) => {
                    this.setState({ endDate: date });
                  }}
                  dateFormat="dd/MM/yyyy"
                />
                <button
                  className="btn btn-primary btn-block py-0"
                  onClick={() => this.searchByDate()}
                >
                  Search by Date
                </button>
              </div>

              <div className="row">
                <div className="col-12 col-md-8">
                  <div className="input-group mb-3 w-50 my-2">
                    <div className="input-group-prepend">
                      <label
                        className="input-group-text"
                        HTMLfor="inputGroupSelect01"
                      >
                        Search By Order Status
                      </label>
                    </div>
                    <select
                      className="custom-select"
                      id="inputGroupSelect01"
                      value={this.state.search}
                      onChange={(e) => {
                        this.setState({ search: e.target.value });
                      }}
                    >
                      <option value="">All</option>
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Canceled">Canceled</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
                {/* <DateRangePicker
                  ranges={[selectionRange]}
                  onChange={this.handleSelect}
                /> */}

                <div className="col-12 col-md-4 text-center">
                  <ExportToExcel
                    apiData={this.renderExcelData()}
                    fileName={this.state.fileName}
                  />
                   {/* <ExportToExcel
                    apiData={this.renderTable()}
                    fileName={this.state.fileName}
                  /> */}

                  <button
                    className="btn btn-secondary mt-2"
                    data-toggle="modal"
                    data-target="#exampleModal"
                  >
                    Add order
                  </button>
                </div>
              </div>

              <table className="table table-striped  styled-table text-center">
                <thead>
                  <tr>
                    <th>Sl. No</th>
                    <th>Date</th>
                    <th>Order Id</th>
                    <th>Invoice No.</th>
                    <th>Name</th>
                    <th>No. of Items</th>
                    <th>Amount</th>
                    <th>Payment Mode</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>{this.renderTable()}</tbody>
              </table>
            </div>
          </div>
        </div>

        {/* modal comes here */}
        <form method="post" onSubmit={this.onSubmit.bind(this)}>
          <div
            className="modal fade"
            id="exampleModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
            data-backdrop="static"
          >
            <div
              className="modal-dialog modal-lg  modal-dialog-centered"
              role="document"
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title" id="exampleModalLabel">
                    Add Order
                  </h3>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={() => this.clearValues()}
                    style={{ transform: "translate(-100%,80%)" }}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body modal_body">
                  {this.renderCart()}
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <div className="form-group">
                        <label>
                          Customer Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="username"
                          className="form-control products_input"
                          value={this.state.username}
                          onChange={(e) => {
                            this.setState({ username: e.target.value });
                          }}
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="form-group">
                        <label>
                          Customer Address{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="username"
                          className="form-control products_input"
                          value={this.state.address}
                          onChange={(e) => {
                            this.setState({ address: e.target.value });
                          }}
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <div className="form-group">
                        <label>
                          Customer City <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          className="form-control products_input"
                          value={this.state.city}
                          onChange={(e) => {
                            this.setState({ city: e.target.value });
                          }}
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="form-group">
                        <label>
                          Customer phoneNo{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          name="phoneNo"
                          className="form-control products_input"
                          value={this.state.phoneNo}
                          onChange={(e) => {
                            this.setState({ phoneNo: e.target.value });
                          }}
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <div className="form-group">
                        <label>
                          Customer pincode{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          className="form-control products_input"
                          value={this.state.pincode}
                          onChange={(e) => {
                            this.setState({ pincode: e.target.value });
                          }}
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="form-group">
                        <label>
                          Customer country{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="country"
                          className="form-control products_input"
                          value={this.state.country}
                          onChange={(e) => {
                            this.setState({ country: e.target.value });
                          }}
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <div className="form-group">
                        <label>
                          Customer company{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="company"
                          className="form-control products_input"
                          value={this.state.company}
                          onChange={(e) => {
                            this.setState({ company: e.target.value });
                          }}
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="form-group">
                        <label>
                          Customer Email <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="userEmail"
                          className="form-control products_input"
                          value={this.state.userEmail}
                          onChange={(e) => {
                            this.setState({ userEmail: e.target.value });
                          }}
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-md-6">
                      <div className="form-group">
                        <label>
                          Customer state <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          name="state"
                          className="form-control products_input"
                          value={this.state.state}
                          onChange={(e) => {
                            this.setState({ state: e.target.value });
                          }}
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn  btn-danger"
                    data-dismiss="modal"
                    onClick={() => this.clearValues()}
                  >
                    Close
                  </button>
                  <input
                    type="submit"
                    value="Add Order"
                    className="btn btn-success"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
        {/* modal ends */}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    orders: state.orders,
  };
};

export default connect(mapStateToProps, { fetchOrders, createOrder })(
  OrdersList
);
