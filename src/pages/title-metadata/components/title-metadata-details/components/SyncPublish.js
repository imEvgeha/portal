import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import './SyncPublish.scss';

const SyncPublish = ({children, message}) => {
    return (
        <div className="nexus-c-sync-publish">
            <Button appearance="default">{children}</Button>
            <div className="nexus-c-sync-publish__msg">{message}</div>
        </div>
    );
};

SyncPublish.propTypes = {
    message: PropTypes.string,
};

SyncPublish.defaultProps = {
    message: null,
};

export default SyncPublish;
