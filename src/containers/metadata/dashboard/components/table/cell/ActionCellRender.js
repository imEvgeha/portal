import React, {useEffect, useState} from 'react';
import './ActionCellRender.scss';
import CustomActionsCellRenderer
    from '../../../../../../ui-elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import NexusTooltip from '../../../../../../ui-elements/nexus-tooltip/NexusTooltip';

function ActionCellRender({data}) {

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
            <NexusTooltip content='Legacy title reconciliation'>
                <div>
                    <a className='nexus-c-metadata-table-action' href={`/metadata/detail/${data.id}/title-merging`} target='_blank'><b>Inspect</b></a>
                </div>
            </NexusTooltip>
            }
        </CustomActionsCellRenderer>
    );
}

export default ActionCellRender;