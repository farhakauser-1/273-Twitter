import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import constants from '../../utils/constants';
import CanvasJSReact from '../../canvasjs/canvasjs.react';

const { CanvasJSChart } = CanvasJSReact;

class profileViews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileViewCount: [],
    };
  }

  componentDidMount() {
    // graph for users tweet views count
    axios.get(`${constants.BACKEND_SERVER.URL}/users/viewCount/${localStorage.getItem('userId')}`)
      .then((response) => {
        // console.log('response.data', response.data);
        const viewsgraph = [];
        let index;
        for (index in response.data) {
          viewsgraph.push({ label: index, y: response.data[index] });
        }
        this.setState({
          profileViewCount: viewsgraph,
        });
      })
      .catch(() => {
        // console.log(err);
      });
  }

  render() {
    const options = {
      animationEnabled: true,
      exportEnabled: false,
      theme: 'light2',
      title: {
        text: 'Profile views in the last 30 days',
      },
      axisY: {
        title: 'View count',
      },
      axisX: {
        title: 'Date',
      },
      data: [
        {
          // Change type to "doughnut", "line", "splineArea", etc.
          type: 'line',
          dataPoints: this.state.profileViewCount,
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
// export profileViews Component
export default profileViews;
