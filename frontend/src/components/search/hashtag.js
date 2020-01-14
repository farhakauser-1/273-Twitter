import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import Navbar from '../navbar/navbar';
import Tweet from '../tweet/tweetComponent';
import constants from '../../utils/constants';

class TweetsByHashtag extends Component {
  constructor() {
    super();
    this.state = {
      userFeed: [],
      tweetIndex: 0,
      buttonState: false,
    };
    this.count = 2;
  }

  componentDidMount() {
    axios.get(`${constants.BACKEND_SERVER.URL}/search/tweet/hashtag/${this.props.match.params.hashtag}?start=${this.state.tweetIndex}&count=${this.count}`)
      .then((response) => {
        // console.log(response)
        this.setState({
          userFeed: response.data,
          tweetIndex: this.state.tweetIndex + this.count,
        });
      })
      .catch(() => {
        // console.log(err);
      });
  }

  componentDidUpdate(nextProps) {
    // console.log(nextProps) // NextProps is old data
    // console.log(this.props) // this props is the new data that we are going to have

    if (nextProps.location.pathname !== this.props.location.pathname) {
      const startCount = 0;
      axios.get(`${constants.BACKEND_SERVER.URL}/search/tweet/hashtag/${this.props.match.params.hashtag}?start=${startCount}&count=${this.count}`)
        .then((response) => {
          // console.log(response)
          this.setState({
            userFeed: response.data,
            tweetIndex: this.state.tweetIndex + this.count,
          });
        })
        .catch(() => {
          // console.log(err);
        });
    }
  }

    fetchMoreTweets = (e) => {
      e.preventDefault();
      axios.get(`${constants.BACKEND_SERVER.URL}/search/tweet/hashtag/${this.props.match.params.hashtag}?start=${this.state.tweetIndex}&count=${this.count}`)
        .then((response) => {
          this.setState({
            userFeed: this.state.userFeed.concat(response.data),
            tweetIndex: this.state.tweetIndex + this.count,
            buttonState: response.data.length < this.count,
          });
        })
        .catch(() => {
          // console.log(err);
        });
    }

    render() {
      const allTweets = [];
      let data;
      for (data in this.state.userFeed) {
        allTweets.push(<Tweet tweetData={this.state.userFeed[data]} />);
      }
      const loadMoreButton = [];
      if (this.state.userFeed.length > 0) {
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
          <Navbar isActive="" userName={localStorage.getItem('userName')} imageURL={localStorage.getItem('imageURL')} />

          {/* Do not modify this div properties */}
          <div className="col-md-9 shadow pl-5 pr-5 pb-5 pt-3">
            {/* Insert UI here */}
            <div className="border-bottom">
              <h4 className="font-weight-bolder">
#
                {this.props.match.params.hashtag}
              </h4>
              <h6 className="font-weight-lighter text-secondary">
@
                {localStorage.getItem('userName')}
              </h6>
            </div>

            {allTweets}

            {loadMoreButton}

          </div>

        </div>
      );
    }
}
// export TweetsByHashtag Component
export default TweetsByHashtag;
