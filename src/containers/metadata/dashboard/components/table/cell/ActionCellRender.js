import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import './ActionCellRender.scss';
import CustomActionsCellRenderer
    from '../../../../../../ui-elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import NexusTooltip from '../../../../../../ui-elements/nexus-tooltip/NexusTooltip';
import {storeTitle} from '../../../../../../metadata/metadataActions';

function ActionCellRender({data, storeTitle}) {

    const [isMovidaOrVz, setIsMovidaOrVz] = useState();

    useEffect(() => {
        const {legacyIds: movida, vz} = data || {};
        // const {movida, vz} = legacyIds || {};
        const {movidaTitleId} = movida || {};
        const {vzTitleId} = vz || {};
        setIsMovidaOrVz(movidaTitleId || vzTitleId);
    }, [data]);

    return (
        <CustomActionsCellRenderer id={'action-' + data.id}>
            {!isMovidaOrVz &&
                <div>
                    <a className='nexus-c-metadata-table-action' href={`/metadata/detail/${data.id}/legacy-title-reconciliation`} onClick={() => storeTitle(data)} target='_blank'><b>Inspect</b></a>
                </div>
            }
        </CustomActionsCellRenderer>
    );
}

const mapDispatchToProps = dispatch => ({
    storeTitle: payload => dispatch(storeTitle(payload))
});

export default connect(null, mapDispatchToProps)(ActionCellRender);