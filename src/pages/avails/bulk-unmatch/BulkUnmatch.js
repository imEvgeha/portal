import React from 'react';
import PropTypes from 'prop-types';
import SectionMessage from '@atlaskit/section-message';
import NexusGrid from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/NexusGrid';
import {connect} from 'react-redux';
import {createRightMatchingColumnDefsSelector} from '../right-matching/rightMatchingSelectors';
import {BULK_UNMATCH_WARNING} from './constants';
import './BulkUnmatch.scss';

const BulkUnmatch = ({columnDefs = [], affectedRights = {}}) => {
    return (
        <div className="nexus-c-bulk-unmatch">
            <p className="nexus-c-bulk-unmatch__confirmation-message">
                {`Core title ID's will be removed from ${affectedRights.length} right(s). Do you want to continue?`}
            </p>
            {!!affectedRights.length && (
                <>
                    <SectionMessage appearance="warning">
                        <p>{BULK_UNMATCH_WARNING}</p>
                    </SectionMessage>
                    <NexusGrid rowData={affectedRights} columnDefs={columnDefs} />
                </>
            )}
        </div>
    );
};

BulkUnmatch.propTypes = {
    columnDefs: PropTypes.array,
    affectedRights: PropTypes.array,
};

BulkUnmatch.defaultProps = {
    columnDefs: [],
    affectedRights: [],
};

const createMapStateToProps = () => {
    const rightMatchingColumnDefsSelector = createRightMatchingColumnDefsSelector();

    return (state, props) => ({
        columnDefs: rightMatchingColumnDefsSelector(state, props),
    });
};

export default connect(createMapStateToProps)(BulkUnmatch);
