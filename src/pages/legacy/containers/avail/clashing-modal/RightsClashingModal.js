import React, {useContext, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {cloneDeep} from 'lodash';
import './RightsClashingModal.scss';
import NexusSpinner from '../../../../../ui/elements/nexus-spinner/NexusSpinner';
import {NexusModalContext} from '../../../../../ui/elements/nexus-modal/NexusModal';
import {NexusGrid, NexusTitle} from '../../../../../ui/elements';
import {createRightMatchingColumnDefsSelector} from '../../../../avails/right-matching/rightMatchingSelectors';
import {createRightMatchingColumnDefs} from '../../../../avails/right-matching/rightMatchingActions';

const columnsToUse = [
    'licensor',
    'licensee',
    'title',
    'licenseType',
    'format',
    'start',
    'end',
    'territory',
    'platformCategory',
    'contentType',
    'availStart',
    'availEnd',
];

const RightsClashingModal = ({clashingRights, columnDefs}) => {
    const {openModal, closeModal} = useContext(NexusModalContext);

    const [rightsClashingColumnsDef, setRightsClashingColumnsDef] = useState([]);

    const actions = [
        {
            text: 'Cancel',
            onClick: closeModal,
        },
    ];

    useEffect(() => {
        if (!columnDefs.length) {
            createRightMatchingColumnDefs();
        } else {
            const updatedColDef = cloneDeep(columnDefs).filter(el => columnsToUse.includes(el.field));
            setRightsClashingColumnsDef(updatedColDef);
        }
    }, [columnDefs, createRightMatchingColumnDefs]);

    useEffect(() => {
        if (clashingRights && clashingRights.length > 0) {
            openModal(buildContent(), {title: 'Clashing Rights', width: 'medium', actions});
        }
    }, [clashingRights]);

    const buildContent = () => {
        return (
            <div className="nexus-c-rights-clashing-modal">
                <NexusTitle isSubTitle>
                    The rights could not be saved since it is clashing with following existing rights:
                </NexusTitle>
                <NexusGrid columnDefs={rightsClashingColumnsDef} rowData={clashingRights} />
            </div>
        );
    };

    return <></>;
};

const mapDispatchToProps = dispatch => ({
    createRightMatchingColumnDefs: payload => dispatch(createRightMatchingColumnDefs(payload)),
});

const mapStateToProps = () => {
    const rightMatchingColumnDefsSelector = createRightMatchingColumnDefsSelector();

    return (state, props) => ({
        columnDefs: rightMatchingColumnDefsSelector(state, props),
    });
};

export default connect(mapStateToProps, mapDispatchToProps)(RightsClashingModal);
