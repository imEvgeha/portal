import React from 'react';
import PropTypes from 'prop-types';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import './ClearButton.scss';

function ClearButton({onClear}) {
  return (
      <div className='nexus-c-clear-button' onClick={onClear}>
          <EditorCloseIcon size='medium' />
      </div>
);
}

ClearButton.propTypes = {
    onClear: PropTypes.func,
};

ClearButton.defaultProps = {
    onClear: function() {
  return null;
}
};

export default ClearButton;