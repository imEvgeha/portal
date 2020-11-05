import React, {useState, useEffect, memo} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import {Checkbox} from '@atlaskit/checkbox';
import Tag from '@atlaskit/tag';
import {isEmpty} from 'lodash';
import {connect} from 'react-redux';
import RightsURL from '../../legacy/containers/avail/util/RightsURL';
import {getLinkedRights, clearLinkedRights} from '../rights-repository/rightsActions';
import * as selectors from '../rights-repository/rightsSelectors';
import BulkDeleteActions from './components/bulk-delete-actions/BulkDeleteActions';
import {HEADER, BULK_DELETE_REMAINING_MSG, BULK_DELETE_LINKED_RIGHT_MSG} from './constants';
import './NexusBulkDelete.scss';

export const NexusBulkDelete = ({rights, onClose, rightsWithDeps, getLinkedRights, clearLinkedRights}) => {
    const [tableData, setTableData] = useState({});

    useEffect(() => {
        if (rights.length) {
            getLinkedRights({rights});
        }
        return () => {
            clearLinkedRights();
        };
    }, [rights, getLinkedRights]);

    useEffect(() => {
        if (!isEmpty(rightsWithDeps)) {
            console.log(rightsWithDeps);
        }
    }, [rightsWithDeps]);

    const renderLinkableRightId = id => (
        <Button key={id} appearance="link" onClick={() => window.open(RightsURL.getRightUrl(id), '_blank')}>
            {id}
        </Button>
    );

    const renderCustomTypeTag = text => (
        <div className="nexus-c-bulk-delete__tag">
            <Tag text={text} color="greyLight" />
        </div>
    );

    // const deselectRightForDeletion = key => {
    //     const selectedRight = tableData[key];
    //     selectedRight.isSelected = !selectedRight.isSelected;
    //     setTableData({...tableData});
    // };

    return (
        <div className="nexus-c-bulk-delete">
            <div className="nexus-c-bulk-delete__container">
                <div className="nexus-c-bulk-delete__message">{BULK_DELETE_REMAINING_MSG}</div>
                <div className="nexus-c-bulk-delete__results">
                    <div className="nexus-c-bulk-delete__heading">
                        <div className="nexus-c-bulk-delete__selected">Selected Rights</div>
                        <div className="nexus-c-bulk-delete__affected">Affected Rights</div>
                    </div>
                    <div className="nexus-c-bulk-delete__rights">
                        {!isEmpty(rightsWithDeps) &&
                            Object.entries(rightsWithDeps).map(([key, value]) => {
                                return (
                                    <>
                                        <div className="nexus-c-bulk-delete__selected-right" key={key}>
                                            <div className="nexus-c-bulk-delete__selected-right-id-row">
                                                <Checkbox isChecked={false} onChange={() => null} />
                                                <div className="nexus-c-bulk-delete__selected-right-id-label">
                                                    Right ID
                                                </div>
                                                <div className="nexus-c-bulk-delete__selected-right-id">{key}</div>
                                            </div>
                                            <div className="nexus-c-bulk-delete__selected-right-title-row">
                                                <div className="nexus-c-bulk-delete__selected-empty" />
                                                <div className="nexus-c-bulk-delete__selected-right-title-label">
                                                    Title
                                                </div>
                                                <div className="nexus-c-bulk-delete__selected-title">
                                                    {value.original.title}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="nexus-c-bulk-delete__affected-rights">
                                            {value.dependencies.map(depRight => {
                                                return (
                                                    <div
                                                        className="nexus-c-bulk-delete-affected-entry"
                                                        key={depRight.id}
                                                    >
                                                        <div className="nexus-c-bulk-delete__affected-linked-id-row">
                                                            <div className="nexus-c-bulk-delete__affected-linked-id-label">
                                                                Linked Right ID
                                                            </div>
                                                            <div className="nexus-c-bulk-delete__affected-linked-id">
                                                                {depRight.id}
                                                            </div>
                                                            <div className="nexus-c-bulk-delete__affected-linked-tag">
                                                                {renderCustomTypeTag('TPR')}
                                                            </div>
                                                        </div>
                                                        <div className="nexus-c-bulk-delete__affected-title-row">
                                                            <div className="nexus-c-bulk-delete__affected-title-label">
                                                                Title
                                                            </div>
                                                            <div className="nexus-c-bulk-delete__affected-title">
                                                                {depRight.title}
                                                            </div>
                                                        </div>
                                                        <div className="nexus-c-bulk-delete__affected-tpr-row">
                                                            <div className="nexus-c-bulk-delete__affected-tpr-label">
                                                                TPR Original Rights
                                                            </div>
                                                            <div className="nexus-c-bulk-delete__affected-tpr-ids">
                                                                {depRight.originalRightIds.map(id => (
                                                                    <div
                                                                        className="nexus-c-bulk-delete__affected-tpr-id"
                                                                        key={id}
                                                                    >
                                                                        {id}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="nexus-c-bulk-delete__affected-bonus-row">
                                                            <div className="nexus-c-bulk-delete__affected-bonus-label">
                                                                Bonus Source Right
                                                            </div>
                                                            <div className="nexus-c-bulk-delete__affected-bonus-id">
                                                                {depRight.sourceRightId}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </>
                                );
                            })}
                    </div>
                </div>
            </div>
            <BulkDeleteActions onClose={onClose} onSubmit={() => null} rightsDeletionCount={rights.length} />
        </div>
    );
};

NexusBulkDelete.propTypes = {
    rights: PropTypes.array.isRequired,
    rightsWithDeps: PropTypes.object,
    onClose: PropTypes.func,
    getLinkedRights: PropTypes.func,
    clearLinkedRights: PropTypes.func,
};

NexusBulkDelete.defaultProps = {
    rightsWithDeps: {},
    onClose: () => null,
    getLinkedRights: () => null,
    clearLinkedRights: () => null,
};

const mapStateToProps = () => {
    const rightsWithDependenciesSelector = selectors.createRightsWithDependenciesSelector();

    return (state, props) => ({
        rightsWithDeps: rightsWithDependenciesSelector(state, props),
    });
};

const mapDispatchToProps = dispatch => ({
    getLinkedRights: payload => dispatch(getLinkedRights(payload)),
    clearLinkedRights: () => dispatch(clearLinkedRights()),
});

export default connect(mapStateToProps, mapDispatchToProps)(memo(NexusBulkDelete));
