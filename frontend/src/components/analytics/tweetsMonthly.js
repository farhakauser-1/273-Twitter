import React, { Component } from 'react';
import '../../App.css';
import CanvasJSReact from '../../canvasjs/canvasjs.react';

const { CanvasJSChart } = CanvasJSReact;

class MonthlyTweets extends Component {
  constructor(props) {
    super(props);
    this.monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  }

  render() {
    const viewsgraph = [];
    let d;
    let label;
    let y;
    for (d in this.props.value) {
      label = this.props.value[d]._id;
      y = this.props.value[d].count;
      label = this.monthNames[label];
      const data = {
        label,
        y,
      };
      viewsgraph.push(data);
    }
    const topViewedTweets = viewsgraph;
    const options = {
      animationEnabled: true,
      exportEnabled: false,
      theme: 'light2',
      title: {
        text: 'Tweets posted by month',
        fontSize: 25,
        fontWeight: 'bolder',
        // fontColor: "#007bff",
      },
      axisY: {
        title: 'Tweet count',
      },
      axisX: {
        title: 'Line',
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
// export MonthlyTweets Component
export default MonthlyTweets;
