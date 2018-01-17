import React from 'react';
import PropTypes from 'prop-types';

class Loading extends React.Component {
  render() {
    const { loading, text } = this.props;

    return (
      <div
        style={{
          display: loading ? 'block' : 'none',
          lineHeight: '44px',
          textAlign: 'center',
        }}
      >
        {text}
      </div>
    );
  }
}

Loading.propTypes = {
  loading: PropTypes.bool.isRequired,
  text: PropTypes.node,
};

Loading.defaultProps = {
  text: 'loading...',
};

export default Loading;
