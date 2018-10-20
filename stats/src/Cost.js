import React from 'react';

class Cost extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="cost">
      £{this.props.cost}
    </div>

    )
  };

}

export default (Cost);
