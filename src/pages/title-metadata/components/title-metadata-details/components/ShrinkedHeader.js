import React from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import classnames from 'classnames';
import './ShrinkedHeader.scss';

const ShrinkedHeader = ({isShrinked, title}) => {
    return (
        <div
            className={classnames('nexus-c-shrinked-header', {
                'nexus-c-shrinked-header--visible': isShrinked,
            })}
        >
            <div>{title}</div>
            <div className="nexus-c-shrinked-header__sync-publish">
                <Button appearance="default">Publish to VZ</Button>
                <Button appearance="default">Publish to Movida</Button>
            </div>
        </div>
    );
};

ShrinkedHeader.propTypes = {
    isShrinked: PropTypes.bool,
    title: PropTypes.string,
};

ShrinkedHeader.defaultProps = {
    isShrinked: false,
    title: null,
};

export default ShrinkedHeader;
