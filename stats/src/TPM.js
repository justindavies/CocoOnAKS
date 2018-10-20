import React from 'react';

class TPM extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="tpm">
      {this.props.tpm}
      <div className="little">
        per minute
      </div>
    </div>

    )
  };

}

export default (TPM);
