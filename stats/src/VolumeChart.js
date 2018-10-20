import React from 'react';
// import {Line} from 'react-chartjs-2';
import {BarChart} from 'react-easy-chart';



class VolumeChart extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
    <div className="volumechart">
    <BarChart
    width={600}
    colorBars
    
    margin={{top: 10, right: 10, bottom: 50, left: 50}}
    axisLabels={{x: 'My x Axis', y: 'My y Axis'}}

    data={this.props.data}/>
    </div>
    )
  };

}

export default (VolumeChart);
