import React, { Component } from 'react';
import '../../App.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Redirect } from 'react-router';
import constants from '../../utils/constants';

class CreateAccount extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      phone: '',
      password: '',
      errMsg: '',
      successMsg: '',
      month: 'January',
      date: 1,
      year: 2019,
      showEmail: true,
    };
    this.Months = {
      January: 31,
      February: 28,
      March: 31,
      April: 30,
      May: 31,
      June: 31,
      July: 30,
      August: 31,
      September: 30,
      October: 31,
      November: 30,
      December: 31,
    };
  }

    IsValueEmpty = (Value) => {
      if (Value == null) {
        return false;
      }
      if (''.localeCompare(Value.replace(/\s/g, '')) === 0) return true;
      return false;
    }

    IsValidEmailID = (EmailID) => {
      if (EmailID == null) {
        return true;
      }
      if (EmailID.match(/^[a-z][a-z0-9._]*[@][a-z]+[.][a-z]+$/)) {
        return true;
      }
      return false;
    }

    IsValidName = (Name) => {
      if (Name.match(/^[a-zA-Z ]+$/)) {
        return true;
      }
      return false;
    }

    IsValidPassword = (Password) => {
      if (Password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
        return true;
      }
      return false;
    }

    isLeapYear = (year) => ((year % 100 === 0) ? (year % 400 === 0) : (year % 4 === 0))

    nameChangeHandler = (e) => {
      if (e.target.value.length <= 50) {
        this.setState({
          name: e.target.value,
        });
      }
    }

    emailChangeHandler = (e) => {
      this.setState({
        email: e.target.value,
      });
    }

    phoneChangeHandler = (e) => {
      this.setState({
        phone: e.target.value,
      });
    }

    toggleEmailPhone = () => {
      this.setState({
        showEmail: !this.state.showEmail,
      });
    }

    monthChangeHandler = (e) => {
      this.setState({
        month: e.target.value,
      });
    }

    dateChangeHandler = (e) => {
      this.setState({
        date: e.target.value,
      });
    }

    yearChangeHandler = (e) => {
      this.setState({
        year: e.target.value,
      });
      if (this.isLeapYear(e.target.value)) {
        this.Months.February = 29;
      } else {
        this.Months.February = 28;
      }
    }

    passwordChangeHandler = (e) => {
      this.setState({
        password: e.target.value,
      });
    }

    submitCreateAccount = (e) => {
      e.preventDefault();
      const usrData = {
        name: this.state.name,
        password: this.state.password,
        dateOfBirth: `${this.state.month} ${this.state.date} ${this.state.year}`,
      };
      if (this.state.showEmail) {
        usrData.email = this.state.email;
      } else {
        usrData.phone = this.state.phone;
      }
      // Check for valid phone number
      if (this.IsValueEmpty(usrData.name) || this.IsValueEmpty(usrData.email)
      || this.IsValueEmpty(usrData.password) || this.IsValueEmpty(usrData.phone)) {
        this.setState({
          errMsg: 'All the fields are required',
          successMsg: '',
        });
      } else if (!this.IsValidEmailID(usrData.email)) {
        this.setState({
          errMsg: 'Invalid email ID',
          successMsg: '',
        });
      } else if (!this.IsValidName(usrData.name)) {
        this.setState({
          errMsg: 'Name can contain only alphabets and spaces',
          successMsg: '',
        });
      } else if (!this.IsValidPassword(usrData.password)) {
        this.setState({
          errMsg: 'Invalid password format',
          successMsg: '',
        });
      } else {
        axios.post(`${constants.BACKEND_SERVER.URL}/users/signup`, usrData)
          .then((response) => {
            this.setState({
              name: '',
              email: '',
              phone: '',
              month: 'January',
              date: 1,
              year: 2019,
              password: '',
            });
            if (response.status === 201) {
              this.setState({
                successMsg: 'User created successfully',
                errMsg: '',
              });
            }
          })
          .catch(() => {
            this.setState({
              errMsg: 'Failed to create account',
              successMsg: '',
            });
          });
      }
    }

    render() {
      const MonthsOption = [];
      const DateOption = [];
      const YearsOption = [];
      let toggleMsg = '';
      const EmailOrPhone = [];
      if (this.state.showEmail) {
        EmailOrPhone.push(
          <div className="form-group">
            <label htmlFor="userEmailID">Email</label>
            <input type="email" id="userEmailID" onChange={this.emailChangeHandler} className="form-control" value={this.state.email} required />
          </div>,
        );
        toggleMsg = 'Use phone instead';
      } else {
        EmailOrPhone.push(
          <div className="form-group">
            <label htmlFor="userPhone">Phone</label>
            <input type="text" id="userPhone" onChange={this.phoneChangeHandler} className="form-control" value={this.state.phone} required />
          </div>,
        );
        toggleMsg = 'Use email instead';
      }
      for (const month in this.Months) {
        MonthsOption.push(<option value={month}>{month}</option>);
      }
      for (let date = 1; date <= this.Months[this.state.month]; date += 1) {
        DateOption.push(<option value={date}>{date}</option>);
      }
      for (let year = 2006; year >= 1899; year -= 1) {
        YearsOption.push(<option value={year}>{year}</option>);
      }

      let redirectVar = null;
      if (localStorage.getItem('twitterToken')) {
        redirectVar = <Redirect to="/user/home" />;
      }

      return (
        <div>
          {redirectVar}
          <div className="container-fluid">
            <form>
              <div className="row">
                <div className="col-md-4 offset-md-4 mt-5 pl-5 pr-5 pt-4 pb-4 shadow">
                  <h4 className="font-weight-bolder">Create your account</h4>
                  <div className="form-group">
                    <label htmlFor="userFirstName">Name</label>
                    <input type="text" id="userName" onChange={this.nameChangeHandler} className="form-control" value={this.state.name} required />
                  </div>
                  <div className="text-right">
                    {this.state.name.length}
/50
                  </div>
                  {EmailOrPhone}
                  <div role="button" className="text-primary form-group" onClick={this.toggleEmailPhone} onKeyPress={this.toggleEmailPhone} style={{ cursor: 'pointer' }}>{toggleMsg}</div>
                  <div>Date of birth</div>
                  <div className="row form-group">
                    <div className="col-md-5">
                      <select className="form-control" onChange={this.monthChangeHandler} value={this.state.month}>
                        {MonthsOption}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <select className="form-control" onChange={this.dateChangeHandler} value={this.state.date}>
                        {DateOption}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <select className="form-control" onChange={this.yearChangeHandler} value={this.state.year}>
                        {YearsOption}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="userPassword">Password</label>
                    <input type="password" id="userPassword" onChange={this.passwordChangeHandler} className="form-control" value={this.state.password} required />
                  </div>
                  <div className="text-center">
                    <p className="text-danger">{this.state.errMsg}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-success">{this.state.successMsg}</p>
                  </div>
                  <div className="form-group">
                    <input type="submit" id="userCreateAccount" onClick={this.submitCreateAccount} className="form-control bg-primary text-white" value="Create Account" />
                  </div>
                  <div className="panel text-center">
                    <p>or</p>
                    <p>
Already have an account?
                      <Link to="/login">Sign in</Link>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      );
    }
}
// export CreateAccount Component
export default CreateAccount;
