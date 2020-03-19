import React, {useContext, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {NexusModalContext} from '../../../ui-elements/nexus-modal/NexusModal';
import {NexusGrid, NexusTitle} from '../../../ui-elements';
import './RightsClashingModal.scss';
import {createLinkableCellRenderer} from '../../../avails/utils';
import {createRightMatchingColumnDefsSelector} from '../../../avails/right-matching/rightMatchingSelectors';
import {createRightMatchingColumnDefs} from '../../../avails/right-matching/rightMatchingActions';
import cloneDeep from 'lodash.clonedeep';

const columnsToUse = ['licensor', 'licensee', 'title', 'licenseType', 'format', 'start', 'end', 'territory', 'platformCategory', 'contentType', 'availStart', 'availEnd'];
const handleRightRedirect = params => createLinkableCellRenderer(params, '/avails/rights/');

function RightsClashingModal({clashingRights, columnDefs}) {

    const {setModalContent, setModalActions, setModalTitle, close} = useContext(NexusModalContext);

    const [rightsClashingColumnsDef, setRightsClashingColumnsDef] = useState([]);

    useEffect(() => {
        if (!columnDefs.length) {
            createRightMatchingColumnDefs();
        } else {
            const updatedColDef = cloneDeep(columnDefs)
                .filter(el => columnsToUse.includes(el.field)).map(columnDef => {
                if (columnDef.cellRenderer) {
                    columnDef.cellRenderer = handleRightRedirect;
                }
                return columnDef;
            });
            setRightsClashingColumnsDef(updatedColDef);
        }
    }, [columnDefs, createRightMatchingColumnDefs]);

    useEffect(() => {
        setModalTitle('Clashing Rights');

        setModalActions([{
            text: 'Cancel',
            onClick: close
        }]);
    }, []);

    useEffect(() => {
        if (clashingRights && clashingRights.length > 0) {
            setModalContent(buildContent());
        }
    }, [clashingRights]);

    const buildContent = () => {
        return (
            <div className="nexus-c-rights-clashing-modal">
                <NexusTitle isSubTitle>The rights could not be saved since it is clashing with following existing
                    rights:
                </NexusTitle>
                <NexusGrid
                    columnDefs={rightsClashingColumnsDef}
                    rowData={clashingRights}
                />
            </div>
        );
    };

    return (<></>);
}

const mapDispatchToProps = dispatch => ({
    createRightMatchingColumnDefs: payload => dispatch(createRightMatchingColumnDefs(payload))
});

const mapStateToProps = () => {
    const rightMatchingColumnDefsSelector = createRightMatchingColumnDefsSelector();

    return (state, props) => ({
        columnDefs: rightMatchingColumnDefsSelector(state, props),
    });
};

export default connect(mapStateToProps, mapDispatchToProps)(RightsClashingModal);