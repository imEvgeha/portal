import React from 'react';
import PropTypes from 'prop-types';

const ModalContent = ({subtitle, children}) => {
  return (
    <div className="nexus-c-modal-content">
        <div className="nexus-c-modal-content__subtitle-container">
            <span className="nexus-c-modal-content__subtitle">{subtitle}</span>
        </div>
        <div className="nexus-c-modal-content__fields">
            {children}
        </div>
    </div>
  );
}

ModalContent.propTypes = {
  subtitle: PropTypes.array,
};

ModalContent.defaultProps = {
  subtitle: '',
};

export default ModalContent;