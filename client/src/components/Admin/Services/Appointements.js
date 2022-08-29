import React, { Component } from "react";
import { connect } from "react-redux";
import { trackPromise } from "react-promise-tracker";
import Moment from "react-moment";
import "moment-timezone";

import {
  fetchServicesForm,
  deleteServiceForm,
} from "../../../actions/OtherActions";
import AdminHeader from "../AdminHeader";
import { ExportToExcel } from "../Orders/ExportToExcel";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class ServiceAppointments extends Component {
  state = {
    search: "",
    fileName:
      "MUG Appointment Report " +
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
    startDate: new Date(),
    endDate: new Date(),
    filteredArray: [],
  };
  componentDidMount() {
    trackPromise(this.props.fetchServicesForm());
  }

  renderTable() {
    const arr =
      this.state.filteredArray.length === 0
        ? this.props.products
        : this.state.filteredArray;
    return arr
      .filter((val) => {
        if (this.state.search === "") {
          return val;
        } else if (
          val.email.toLowerCase().includes(this.state.search.toLowerCase())
        ) {
          return val;
        }
      })
      .map((product, index) => {
        return (
          <tr key={product._id}>
            <th>{index + 1}</th>
            <th>{product.name}</th>
            <th>
              <Moment format=" DD-MMM-YYYY, hh:mm:ss A">{product.date}</Moment>
            </th>
            <th>{product.email}</th>
            <th>{product.phone}</th>
            <th>{product.looking}</th>
            <th>{product.area}</th>
            <th>{product.message}</th>
            <th>
              <a href={`mailto:${product.email}`}>
                <i className="fa fa-envelope"></i>
              </a>
            </th>
            <td>
              <i
                className="fa fa-trash"
                onClick={() => {
                  trackPromise(this.props.deleteServiceForm(product._id));
                  this.setState({ id: product._id });
                }}
                style={{ cursor: "pointer" }}
              ></i>
            </td>
          </tr>
        );
      });
  }

  renderExcelData() {
    // Excel Info
    const appointments = [];
    const arr =
      this.state.filteredArray.length === 0
        ? this.props.products
        : this.state.filteredArray;
    arr.map((product) => {
      // console.log(product);
      appointments.push({
        Name: product.name,
        "Mobile Number": product.phone,
        Email: product.email,
        Area: product.area,
        "Looking For": product.looking,
        Message: product.message,
        Date: product.date,
        // Status: product.status ? "Answered" : "Pending",
      });
    });
    return appointments;
  }

  searchByDate() {
    var toStart = new Date(this.state.startDate).toISOString();
    var sd = new Date(toStart).getTime();
    var toEnd = new Date(this.state.endDate).toISOString();
    var ed = new Date(toEnd).getTime();

    var result = this.props.products.filter((product) => {
      var time = new Date(product.date).getTime();
      return sd < time && time < ed;
    });
    console.log("Results", result);
    this.setState({ filteredArray: result });
  }

  render() {
    // console.table(this.props.products);
    return (
      <div>
        <AdminHeader />
        <div className="col-md-10 offset-md-2 ">
          <h2 className="text-center">Appointments</h2>
          <div className="container" style={{ margin: "3rem auto 1rem auto" }}>
            <div className="form-group">
              <label htmlFor="search">Search By Email Id:</label>
              <input
                className="form-control"
                value={this.state.search}
                onChange={(e) => {
                  this.setState({ search: e.target.value });
                }}
                placeholder="Search By Email Id."
                id="search"
              />
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex w-50">
                <DatePicker
                  selected={this.state.startDate}
                  selectsStart
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  onChange={(date) => {
                    this.setState({ startDate: date });

                    // console.log(date);
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

              <ExportToExcel
                apiData={this.renderExcelData()}
                fileName={this.state.fileName}
              />
            </div>

            <div className="table-responsive">
              <table className="table table-striped  styled-table text-center">
                <thead>
                  <tr>
                    <th>Sl. No</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th scope="col">Email</th>
                    <th scope="col">Mobile No.</th>
                    <th scope="col">Looking For</th>
                    <th scope="col">Area</th>
                    <th scope="col">Message</th>
                    <th>Reply</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>{this.renderTable()}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    products: state.products,
  };
};

export default connect(mapStateToProps, {
  fetchServicesForm,
  deleteServiceForm,
})(ServiceAppointments);
