import React from 'react';

class Agents extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="agents">
      {this.props.agents}
      <div className="little">
        pods active
      </div>
    </div>

    )
  };

}

export default (Agents);
