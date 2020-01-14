import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import Navbar from '../navbar/navbar';
import Tweet from '../tweet/tweetComponent';
import constants from '../../utils/constants';

class UserLikedTweets extends Component {
  constructor() {
    super();
    this.state = {
      likedTweets: [],
      tweetIndex: 0,
      buttonState: false,
    };
    this.count = 2;
  }

  componentDidMount() {
    const userId = localStorage.getItem('userId');

    axios.get(`${constants.BACKEND_SERVER.URL}/tweets/fetchTweetByUserID/${userId}/LIKEDTWEETS?start=${this.state.tweetIndex}&count=${this.count}`)
      .then((response) => {
        // console.log(response);
        this.setState({
          likedTweets: response.data,
          tweetIndex: this.state.tweetIndex + this.count,
        });
      })
      .catch(() => {
        // console.log(err);
      });
  }

    fetchMoreTweets = (e) => {
      e.preventDefault();
      const userId = localStorage.getItem('userId');
      axios.get(`${constants.BACKEND_SERVER.URL}/tweets/fetchTweetByUserID/${userId}/LIKEDTWEETS?start=${this.state.tweetIndex}&count=${this.count}`)
        .then((response) => {
          this.setState({
            likedTweets: this.state.likedTweets.concat(response.data),
            tweetIndex: this.state.tweetIndex + this.count,
            buttonState: response.data.length < this.count,
          });
        })
        .catch(() => {
          // console.log(err);
        });
    }

    render() {
      const likedTweets = []; let
        data;
      for (data in this.state.likedTweets) {
        likedTweets.push(<Tweet tweetData={this.state.likedTweets[data]} />);
      }
      const loadMoreButton = [];
      if (this.state.likedTweets.length > 0) {
        loadMoreButton.push(
          <div className="row pt-4">
            <div className="col-md-3 offset-md-9">
              <button type="button" className="btn btn-outline-primary w-100" onClick={this.fetchMoreTweets} disabled={this.state.buttonState}>Load more tweets</button>
            </div>
          </div>,
        );
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
          <Navbar isActive="Analytics" userName={localStorage.getItem('userName')} imageURL={localStorage.getItem('imageURL')} />

          {/* Do not modify this div properties */}
          <div className="col-md-9 shadow pl-5 pr-5 pb-5 pt-3">
            {/* Insert UI here */}
            <div className="border-bottom">
              <h4 className="font-weight-bolder">Analytics</h4>
              <h6 className="font-weight-lighter text-secondary">
@
                {localStorage.getItem('userName')}
              </h6>
            </div>
            <div className="row border-bottom">
              <div className="col-md-3 p-3 text-center font-weight-bolder"><a href="/user/analytics" className="text-dark">Graphs</a></div>
              <div className="col-md-3 p-3 text-center font-weight-bolder"><a href="/view/analytics/tweets" className="text-dark">Tweets posted</a></div>
              <div className="col-md-3 p-3 text-center font-weight-bolder border-bottom border-primary text-primary">My liked tweets</div>
              <div className="col-md-3 p-3 text-center font-weight-bolder"><a href="/view/myretweets" className="text-dark">My retweets</a></div>
            </div>

            {likedTweets}

            {loadMoreButton}

          </div>

        </div>
      );
    }
}
// export UserLikedTweets Component
export default UserLikedTweets;
