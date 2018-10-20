import React from 'react';
import StackGrid from 'react-stack-grid';


class Images extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <StackGrid columnWidth={150}>
      {this.props.images.map(image => {
        let img = `https://cocoonaks.blob.core.windows.net/thumbs/${image.image}`
        return (
          <img src={img} alt={image.image} width={150}/>
        );
      })}
      </StackGrid>

    )
  };

}

export default (Images);
