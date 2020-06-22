import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import SectionMessage from '@atlaskit/section-message';
import {getAffectedRights} from '../availsService';
import {
    createRightMatchingColumnDefsSelector,
} from '../right-matching/rightMatchingSelectors';
import NexusGrid from '../../../ui/elements/nexus-grid/NexusGrid';
import {BULK_UNMATCH_WARNING} from './constants';
import './BulkUnmatch.scss';

const BulkUnmatch = ({selectedRights = [], columnDefs = []}) => {
    const [affectedRights, setAffectedRights] = useState([]);

    useEffect(
        () => {
            const selectedRightsIds = selectedRights.map(({id}) => id);
            getAffectedRights(selectedRightsIds).then(affectedRights => setAffectedRights(affectedRights));
        },
        [selectedRights]
    );

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
                    <NexusGrid
                        rowData={affectedRights}
                        columnDefs={columnDefs}
                    />
                </>
            )}
        </div>
    );
};

BulkUnmatch.propTypes = {
    selectedRights: PropTypes.array.isRequired,
    columnDefs: PropTypes.array.isRequired,
};

const createMapStateToProps = () => {
    const rightMatchingColumnDefsSelector = createRightMatchingColumnDefsSelector();

    return (state, props) => ({
        columnDefs: rightMatchingColumnDefsSelector(state, props),
    });
};

export default connect(createMapStateToProps)(BulkUnmatch);
