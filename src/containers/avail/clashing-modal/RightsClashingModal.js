import React, {useContext, useEffect} from 'react';
import {NexusModalContext} from '../../../ui-elements/nexus-modal/NexusModal';
import {NexusGrid, NexusTitle} from '../../../ui-elements';

const getColumnDef = (id, headerName) => { return {field: id, headerName: headerName, colId: id, width: 150}; };

const rightsClashingColumnsDef = [
    getColumnDef('licensor','Licensor'),
    getColumnDef('licensee','Licensee'),
    getColumnDef('title','Title'),
    getColumnDef('licenseType', 'License Type'),
    getColumnDef('format', 'Format'),
    getColumnDef('start','Start'),
    getColumnDef('end','End'),
    getColumnDef('territory','Territory'),
    getColumnDef('platformCategory','Platform Category'),
    getColumnDef('contentType','Content Type'),
    getColumnDef('availStart','Avail Start'),
    getColumnDef('availEnd','Avail End'),
];

function RightsClashingModal({clashingRights}) {

    const {setModalContent, setModalActions, setModalTitle, close} = useContext(NexusModalContext);

    useEffect(() => {
        if(clashingRights && clashingRights.length > 0) {
            setModalContent(buildContent());
        }
    }, [clashingRights]);

    setModalTitle('Clashing Rights');

    setModalActions([{
        text: 'Cancel',
        onClick: close
    }]);

    const buildContent = () => {
        return (
            <div>
                <NexusTitle>The rights could not be saved since it is clashing whit following existing rights:</NexusTitle>
                <NexusGrid
                    columnDefs={rightsClashingColumnsDef}
                    rowData={clashingRights}
                    singleClickEdit
                />
            </div>
        );
    };

    return (<></>);
}

export default RightsClashingModal;