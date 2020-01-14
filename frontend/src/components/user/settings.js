import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import { Redirect } from 'react-router';
import Navbar from '../navbar/navbar';
import constants from '../../utils/constants';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      userName: '',
      city: '',
      state: '',
      zipcode: '',
      imageURL: '',
      description: '',
      phone: '',
      email: '',
      newPassword: '',
      confirmPassword: '',
    };
    this.onChange = this.onChange.bind(this);
    this.deactivateUser = this.deactivateUser.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  componentDidMount() {
    axios.get(`${constants.BACKEND_SERVER.URL}/users/profile/${localStorage.getItem('userId')}`)
      .then((response) => {
        // console.log(response.data);
        this.setState({
          name: response.data.name,
          userName: response.data.userName,
          city: response.data.city,
          state: response.data.state,
          zipcode: response.data.zipcode,
          description: response.data.description,
          phone: response.data.phone,
          email: response.data.email,
        });
      });
  }

    onChange = (e) => {
      this.setState({
        [e.target.name]: e.target.files[0],
      });
    }

    IsValueEmpty = (Value) => {
      if (Value === null || Value === undefined || Value === '') {
        return true;
      }
      if (''.localeCompare(Value.toString().replace(/\s/g, '')) === 0) return true;
      return false;
    }

    IsValidPassword = (Password) => {
      if (Password === undefined || Password === null || Password === '') {
        return true;
      }
      if (Password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
        return true;
      }
      return false;
    }

    IsValidZipcode = (Zipcode) => {
      if (Zipcode === undefined || Zipcode === null || Zipcode === '') {
        return true;
      }
      if (Zipcode.toString().match(/^(?!0{5})(\d{5})(?!-?0{4})(|-\d{4})?$/)) {
        return true;
      }
      return false;
    }

    nameChangeHandler = (e) => {
      this.setState({
        name: e.target.value,
      });
    }

    descriptionChangeHandler = (e) => {
      if (e.target.value.length <= 160) {
        this.setState({
          description: e.target.value,
        });
      }
    }

    emailChangeHandler = (e) => {
      this.setState({
        email: e.target.value,
      });
    }

    userNameChangeHandler = (e) => {
      if (e.target.value.length <= 15) {
        this.setState({
          userName: e.target.value,
        });
      }
    }

    phoneChangeHandler = (e) => {
      if (e.target.value.length <= 10) {
        this.setState({
          phone: e.target.value,
        });
      }
    }

    cityChangeHandler = (e) => {
      this.setState({
        city: e.target.value,
      });
    }

    stateChangeHandler = (e) => {
      this.setState({
        state: e.target.value,
      });
    }

    zipcodeChangeHandler = (e) => {
      this.setState({
        zipcode: e.target.value,
      });
    }

    newPasswordChangeHandler = (e) => {
      this.setState({
        newPassword: e.target.value,
      });
    }

    confirmPasswordChangeHandler = (e) => {
      this.setState({
        confirmPassword: e.target.value,
      });
    }

    doPasswordsMatch = () => {
      if (this.state.newPassword.localeCompare(this.state.confirmPassword) === 0) {
        return true;
      }
      return false;
    }

    processData = (data) => {
      if (data == null || data.length === 0) {
        return '';
      }
      return data;
    }

    updateProfile = (e) => {
      e.preventDefault();
      const data = {
        userId: localStorage.getItem('userId'),
        name: this.state.name,
        userName: this.state.userName,
        city: this.processData(this.state.city),
        state: this.processData(this.state.state),
        zipcode: this.processData(this.state.zipcode),
        imageURL: this.processData(this.state.imageURL),
        description: this.processData(this.state.description),
        email: this.processData(this.state.email),
        image: this.state.profileImage,
      };
      // console.log(data);
      if (this.processData(this.state.phone).length > 0) {
        data.phone = Number(this.processData(this.state.phone));
      }
      if (!this.doPasswordsMatch()) {
        this.setState({
          errMsg: 'Passwords do not match',
          successMsg: '',
        });
      } else if (!this.IsValidPassword(this.state.newPassword)) {
        this.setState({
          errMsg: 'Invalid password format',
          successMsg: '',
        });
      } else if (!this.IsValidZipcode(data.zipcode)) {
        this.setState({
          errMsg: 'Invalid zipcode',
          successMsg: '',
        });
      } else if (this.IsValueEmpty(data.name) || this.IsValueEmpty(data.userName)) {
        this.setState({
          errMsg: 'Name and username cannot be empty',
          successMsg: '',
        });
      // } else if (!(this.IsValueEmpty(data.email) || this.IsValueEmpty(data.phone))
      //           || (this.IsValueEmpty(data.email) && this.IsValueEmpty(data.phone))) {
      //   this.setState({
      //     errMsg: 'Please provide email or phone number',
      //     successMsg: '',
      //   });
      } else {
        const profileData = new FormData();
        profileData.append('userId', data.userId);
        profileData.append('name', data.name);
        profileData.append('city', data.city);
        profileData.append('userName', data.userName);
        profileData.append('description', data.description);
        profileData.append('email', data.email);
        profileData.append('state', data.state);
        profileData.append('zipcode', data.zipcode);
        profileData.append('imageURL', data.imageURL);
        profileData.append('image', this.state.profileImage);
        if (this.processData(this.state.phone).length > 0) {
          profileData.append('phone', this.state.phone);
        }
        if (this.state.newPassword.length > 0) {
          profileData.append('password', data.password);
        }

        axios.put(`${constants.BACKEND_SERVER.URL}/users/profile/`, profileData)
          .then((response) => {
            if (response.status === 200) {
              // console.log(response.data.imageURL);
              let newImageURL;
              if (response.data.imageURL === undefined) {
                newImageURL = 'https://cdn2.iconfinder.com/data/icons/user-icon-2-1/100/user_5-15-512.png';
              } else {
                newImageURL = response.data.imageURL;
              }
              localStorage.setItem('userName', this.state.userName);
              localStorage.setItem('imageURL', newImageURL);
              this.setState({
                errMsg: '',
                successMsg: 'Updated successully',
              });
            }
          })
          .catch(() => {
            this.setState({
              errMsg: 'Error in updating',
              successMsg: '',
            });
          });
      }
    }

    deactivateUser = (e) => {
      e.preventDefault();

      const data = {
        userId: localStorage.getItem('userId'),
      };

      axios.delete(`${constants.BACKEND_SERVER.URL}/users/deactivateAccount/${data.userId}`)
        .then((response) => {
          if (response.status === 200) {
            // console.log(response.data);
            // console.log('User deactivated successfully');
            this.setState({
              deactivate: true,
              successMsg: 'User Deactivated',
              errMsg: '',
            });
          } else if (response.status === 204) {
            // console.log('No User Found');
            this.setState({
              deactivate: false,
              errMsg: 'No User Found',
              successMsg: '',
            });
          }
        })
        .catch(() => {
          this.setState({
            deactivate: false,
            errMsg: 'Error in deactivating',
            successMsg: '',
          });
        });
    }

    deleteUser = (e) => {
      e.preventDefault();

      const data = {
        userId: localStorage.getItem('userId'),
      };

      axios.post(`${constants.BACKEND_SERVER.URL}/users/deleteUser`, data)
        .then((response) => {
          if (response.status === 200) {
            // console.log(response.data);
            // console.log('User deleted successfully');
            this.setState({
              delete: true,
              successMsg: 'User Deleted',
              errMsg: '',
            });
          } else if (response.status === 404) {
            // console.log('No User Found');
            this.setState({
              delete: false,
              errMsg: 'No User Found',
              successMsg: '',
            });
          }
        })
        .catch(() => {
          this.setState({
            delete: false,
            errMsg: 'Error in deleting',
            successMsg: '',
          });
        });
    }

    render() {
      const stateCodes = [];
      let code;
      let stateValue;
      for (code in constants.STATE_CODES) {
        stateValue = `${code} - ${constants.STATE_CODES[code]}`;
        stateCodes.push(<option className="form-control" value={stateValue}>{stateValue}</option>);
      }
      let RedirectVar = null;
      if (this.state.deactivate || this.state.delete) {
        RedirectVar = <Redirect to="/welcome" />;
        localStorage.removeItem('imageURL');
        localStorage.removeItem('twitterToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
        localStorage.removeItem('name');
      }

      return (

      // Do not modify this div properties
        <div className="row" style={{ minHeight: `${100}vh`, maxWidth: `${100}vw` }}>
          {/*
                    Do not remove navbar. isActive will indicate which is the active page.
                    It can be one of the following values.
                    1. Home
                    2. Messages
                    3. Bookmarks
                    4. Lists
                    5. Profile
                    6. Settings
                    7. Analytics
                */}
          <Navbar isActive="Settings" userName={localStorage.getItem('userName')} imageURL={localStorage.getItem('imageURL')} />
          {RedirectVar}
          {/* Do not modify this div properties */}
          <div className="col-md-9 shadow pl-5 pr-5 pt-3">
            {/* Insert UI here */}
            <div className="border-bottom mb-4">
              <h4 className="font-weight-bolder">Update profile</h4>
              <h6 className="font-weight-lighter text-secondary">
@
                {localStorage.getItem('userName')}
              </h6>
            </div>
            <form onSubmit={this.updateProfile}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" className="form-control" required onChange={this.nameChangeHandler} value={this.state.name} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="3" style={{ resize: 'none' }} className="form-control" onChange={this.descriptionChangeHandler} value={this.state.description} />
              </div>

              <div className="row">
                <div className="form-group col-md-4">
                  <label>Email address</label>
                  <input type="email" className="form-control" onChange={this.emailChangeHandler} value={this.state.email} />
                </div>

                <div className="form-group col-md-4">
                  <label>Username</label>
                  <input type="text" className="form-control" required onChange={this.userNameChangeHandler} value={this.state.userName} />
                </div>
                <div className="form-group col-md-4">
                  <label>Phone Number</label>
                  <input type="text" className="form-control" onChange={this.phoneChangeHandler} value={this.state.phone} />
                </div>
              </div>

              <div className="row">
                <div className="form-group col-md-4">
                  <label>City</label>
                  <input type="text" className="form-control" onChange={this.cityChangeHandler} value={this.state.city} />
                </div>
                <div className="form-group col-md-4">
                  <label>State</label>
                  <select className="custom-select" onChange={this.stateChangeHandler} value={this.state.state}>
                    {stateCodes}
                  </select>
                </div>
                <div className="form-group col-md-4">
                  <label>Zipcode</label>
                  <input type="text" className="form-control" onChange={this.zipcodeChangeHandler} value={this.state.zipcode} />
                </div>
              </div>

              <div className="row">
                <div className="form-group col-md-6">
                  <label>New password</label>
                  <input type="password" className="form-control" onChange={this.newPasswordChangeHandler} value={this.state.newPassword} />
                </div>
                <div className="form-group col-md-6">
                  <label>Confirm new password</label>
                  <input type="password" className="form-control" onChange={this.confirmPasswordChangeHandler} value={this.state.confirmPassword} />
                </div>
              </div>
              <div className="form-group row">
                <div className="col-md-6">
                  <div className="file-field">
                    <label className="font-weight-bolder">Profile image</label>
                    <div className="btn btn-sm">
                      <input type="file" accept="image/*" name="profileImage" onChange={this.onChange} />
                    </div>
                  </div>
                </div>
                <div className="form-group col-md-3">
                  <button type="button" className="btn btn-outline-danger font-weight-bolder form-control" onClick={this.deactivateUser}>Deactivate Profile</button>
                </div>
                <div className="form-group col-md-3">
                  <button type="button" className="btn btn-danger font-weight-bolder form-control" onClick={this.deleteUser}>Delete Profile</button>
                </div>
              </div>

              <div className="text-center">
                <p className="text-danger">{this.state.errMsg}</p>
                <p className="text-success">{this.state.successMsg}</p>
              </div>

              <div className="form-group">
                <input type="submit" className="form-control bg-primary text-white" value="Update" />
              </div>

            </form>
          </div>

        </div>
      );
    }
}
// export Settings Component
export default Settings;
