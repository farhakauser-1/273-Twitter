import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import constants from '../../utils/constants';
import CanvasJSReact from '../../canvasjs/canvasjs.react';

const { CanvasJSChart } = CanvasJSReact;

class TopViewed extends Component {
  constructor() {
    super();
    this.state = {
      topViewedTweets: [],
    };
  }

  componentDidMount() {
    // graph for users tweet views count
    axios.get(`${constants.BACKEND_SERVER.URL}/tweets/topTweetsByViews/${localStorage.getItem('userId')}`)
      .then((response) => {
        // console.log(response.data)
        const viewsgraph = [];
        let d;
        let label;
        let y;
        const result = response.data;
        for (d in result) {
          label = result[d]._id.tweetId;
          y = result[d].total;
          if (y > 0) {
            const data = {
              label,
              y,
            };
            viewsgraph.push(data);
          }
        }

        this.setState({
          topViewedTweets: viewsgraph,
        });
        // console.log(this.state.topViewedTweets)
      })
      .catch(() => {
        // console.log(err);
      });
  }

  render() {
    const { topViewedTweets } = this.state;
    const options = {
      animationEnabled: true,
      exportEnabled: false,
      theme: 'light2',
      title: {
        text: 'Top 10 Viewed  Tweets',
      },
      axisY: {
        title: 'View count',
      },
      axisX: {
        title: 'Tweet IDs',
      },
      data: [
        {
          type: 'column',
          dataPoints: topViewedTweets,
        },
      ],
    };
    return (
      <div className="pt-5 pb-5">
        <CanvasJSChart options={options} /* onRef={ref => (this.chart = ref)} */ />
      </div>
    );
  }
}
// export TopViewed Component
export default TopViewed;
