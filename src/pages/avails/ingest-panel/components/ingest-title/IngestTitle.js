import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './IngestTitle.scss';

const IngestTitle = ({link, isHeader}) => {
    const fileName = link.split('/').pop();
    return (
        <div className={classnames('nexus-c-ingest-title', isHeader && 'nexus-c-ingest-title--is-header')}>
            <div className="nexus-c-ingest-title__details">
                <i className="po po-add nexus-c-ingest-title__type" />
                <span title={fileName} className="nexus-c-ingest-title__filename">
                    {fileName}
                </span>
            </div>
        </div>
    );
};

IngestTitle.propTypes = {
    link: PropTypes.string,
    isHeader: PropTypes.bool,
};

IngestTitle.defaultProps = {
    link: '',
    isHeader: false,
};

export default IngestTitle;
