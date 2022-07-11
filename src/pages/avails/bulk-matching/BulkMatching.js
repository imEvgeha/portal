import React, {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import SectionMessage from '@atlaskit/section-message';
import withMatchAndDuplicateList from '@vubiquity-nexus/portal-ui/lib/elements/nexus-grid/hoc/withMatchAndDuplicateList';
import {toggleRefreshGridData} from '@vubiquity-nexus/portal-ui/lib/grid/gridActions';
import ToastBody from '@vubiquity-nexus/portal-ui/lib/toast/components/toast-body/ToastBody';
import {TITLE_MATCH_AND_CREATE_WARNING_MESSAGE, WARNING_TITLE} from '@vubiquity-nexus/portal-ui/lib/toast/constants';
import withToasts from '@vubiquity-nexus/portal-ui/lib/toast/hoc/withToasts';
import {get, toLower} from 'lodash';
import {Button} from 'primereact/button';
import {connect, useSelector} from 'react-redux';
import {compose} from 'redux';
import {titleService} from '../../legacy/containers/metadata/service/TitleService';
import TitleSystems from '../../metadata/constants/systems';
import TitleCreate from '../../title-metadata/components/titleCreateModal/TitleCreateModal';
import {setExternalIdValues} from '../../title-metadata/titleMetadataActions';
import {createExternalDropdownIDsSelector} from '../../title-metadata/titleMetadataSelectors';
import {getEnums} from '../../title-metadata/titleMetadataServices';
import {HEADER_TITLE_BONUS_RIGHT, HEADER_TITLE_TITLE_MATCHING} from '../selected-rights-actions/constants';
import TitleMatchingRightsTable from '../title-matching-rights-table/TitleMatchingRightsTable';
import {
    getAffectedRights,
    getRestrictedTitles,
    setCoreTitleId,
    getExistingBonusRights,
    createBonusRights,
} from './bulkMatchingService';
import BonusRightsReview from './components/bonus-rights-review/BonusRightsReview';
import BulkMatchingReview from './components/bulk-match-review/BulkMatchingReview';
import HeaderSection from './components/header-section/HeaderSection';
import TitlesSection from './components/titles-section/TitlesSection';
import {
    TITLE_MATCHING_MSG,
    TITLE_MATCHING_REVIEW_HEADER,
    RIGHT_TABS,
    EXISTING_CORE_TITLE_ID_WARNING,
    BONUS_RIGHTS_REVIEW_HEADER,
    TITLE_BULK_MATCH_SUCCESS_MESSAGE,
    TITLE_BONUS_RIGHTS_SUCCESS_MESSAGE,
} from './constants';
import './BulkMatching.scss';

export const BulkMatching = ({
    data,
    closeDrawer,
    addToast,
    removeToast,
    toggleRefreshGridData,
    isBonusRight,
    setHeaderText,
    headerText,
    matchButton,
    duplicateButton,
    onCellValueChanged,
    matchList,
    duplicateList,
    selectedItems,
    getRestrictedIds,
    onReloadData,
    setExternalIdValues,
    externalIdOptions,
}) => {
    const selectedTenant = useSelector(state => get(state, 'auth.selectedTenant'));

    const isMounted = useRef(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedTableData, setSelectedTableData] = useState([]);
    const [affectedTableData, setAffectedTableData] = useState([]);
    const [existingBonusRights, setExistingBonusRights] = useState([]);
    const [restrictedCoreTitleIds, setRestrictedCoreTitleIds] = useState([]);
    const [loadTitlesTable, setLoadTitlesTable] = useState(false);
    const [activeTab, setActiveTab] = useState(RIGHT_TABS.SELECTED);
    const [isMatchLoading, setMatchIsLoading] = useState(false);
    const [isMatchAndCreateLoading, setMatchAndCreateIsLoading] = useState(false);
    const [combinedTitle, setCombinedTitle] = useState([]);
    const [bonusRights, setBonusRights] = useState([]);

    const {NEXUS} = TitleSystems;

    const changeActiveTab = tab => tab !== activeTab && setActiveTab(tab);

    const updateExternalIdDropdown = async () => {
        return getEnums('external-id-type');
    };

    const getExternalIdDropdownValues = () => {
        let currentTenant;
        if (externalIdOptions.length) {
            currentTenant = externalIdOptions.find(e => e.tenantCode === selectedTenant.id);
        }
        if (currentTenant?.tenantCode !== selectedTenant.id) {
            updateExternalIdDropdown().then(responseOptions => setExternalIdValues({responseOptions}));
        }
    };

    useEffect(() => {
        getExternalIdDropdownValues();
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => getRestrictedIds(restrictedCoreTitleIds), [restrictedCoreTitleIds]);

    useEffect(() => {
        if (isMounted.current && data.length) {
            setSelectedTableData(data);
        }
    }, [data]);

    useEffect(() => {
        if (selectedTableData.length) {
            const rightIds = selectedTableData.map(right => right.id);
            if (isBonusRight) {
                getExistingBonusRights(rightIds).then(({data}) => {
                    if (isMounted.current) {
                        setExistingBonusRights(data);
                        setRestrictedCoreTitleIds([selectedTableData[0].coreTitleId]);
                        setLoadTitlesTable(true);
                    }
                });
            } else {
                getAffectedRights(rightIds).then(res => {
                    if (isMounted.current && Array.isArray(res) && res.length) {
                        setAffectedTableData(res);
                    }
                });
            }
        }
    }, [selectedTableData.length, isBonusRight]);

    useEffect(() => {
        if (affectedTableData.length) {
            const affectedRightIds = affectedTableData.map(right => right.id);
            getRestrictedTitles(affectedRightIds).then(res => {
                if (isMounted.current && Array.isArray(res) && res.length) {
                    setRestrictedCoreTitleIds(res);
                }
                isMounted.current && setLoadTitlesTable(true);
            });
        }
    }, [affectedTableData]);

    const onMatch = () => {
        setMatchIsLoading(true);
        bulkTitleMatch(matchList[NEXUS].id);
    };

    const bulkTitleMatch = (coreTitleId, isNewTitle = false) => {
        const action = isBonusRight ? createBonusRights : setCoreTitleId;
        const rights = isBonusRight ? selectedTableData : affectedTableData;
        getExistingBonusRights(
            selectedTableData.map(right => right.id),
            coreTitleId
        )
            .then(res => {
                setExistingBonusRights(res.data);
                action({
                    rightIds: rights.map(right => right.id),
                    coreTitleId,
                })
                    .then(response => {
                        setLoadTitlesTable(false);
                        disableLoadingState();
                        dispatchSuccessToast(response.length);
                        setBonusRights(response);
                        onReloadData();
                        if (isNewTitle || matchList[NEXUS]) {
                            setHeaderText(BONUS_RIGHTS_REVIEW_HEADER);
                            toggleRefreshGridData(true);
                            return !isBonusRight && closeDrawer();
                        }
                        setHeaderText(TITLE_MATCHING_REVIEW_HEADER);
                    })
                    .catch(() => {
                        // nexusFetch handles error toast
                        disableLoadingState();
                    });
            })
            .catch(() => {
                disableLoadingState();
            });
    };

    const mergeTitles = matchList => {
        const extractTitleIds = Object.values(matchList).reduce((acc, curr) => {
            return [...acc, curr.id];
        }, []);
        titleService
            .bulkMergeTitles({
                idsToMerge: extractTitleIds,
                idsToHide: Object.values(duplicateList).map(title => title.id),
            })
            .then(res => {
                setCombinedTitle([...combinedTitle, res]);
                const {id} = res || {};
                bulkTitleMatch(id);
            })
            .catch(() => {
                // nexusFetch handles error toast
                setMatchAndCreateIsLoading(false);
            });
    };

    const onMatchAndCreate = () => {
        setMatchAndCreateIsLoading(true);
        if (Object.keys(matchList).length === 1) {
            dispatchWarningToast();
        } else {
            mergeTitles(matchList);
        }
    };

    const disableLoadingState = () => {
        setMatchIsLoading(false);
        setMatchAndCreateIsLoading(false);
    };

    const dispatchSuccessToast = count => {
        addToast({
            detail: isBonusRight
                ? TITLE_BONUS_RIGHTS_SUCCESS_MESSAGE(count, selectedTableData.length - count)
                : TITLE_BULK_MATCH_SUCCESS_MESSAGE(affectedTableData.length),
            severity: 'success',
        });
    };

    const closeModalAndRefreshTable = () => {
        setShowModal(false);
        toggleRefreshGridData(true);
    };

    const dispatchWarningToast = () => {
        const onOkayButtonClick = e => {
            e.preventDefault();
            removeToast();
            mergeTitles(matchList);
        };

        const onCancelButtonClick = e => {
            e.preventDefault();
            removeToast();
            disableLoadingState();
        };
        addToast({
            severity: 'warn',
            closable: false,
            content: (
                <ToastBody summary={WARNING_TITLE} detail={TITLE_MATCH_AND_CREATE_WARNING_MESSAGE} severity="warn">
                    <div className="d-flex align-items-center">
                        <Button
                            label="Cancel"
                            className="p-button-link p-toast-left-button"
                            onClick={onCancelButtonClick}
                        />
                        <Button
                            label="Continue"
                            className="p-button-link p-toast-right-button"
                            onClick={onOkayButtonClick}
                        />
                    </div>
                </ToastBody>
            ),
            sticky: true,
        });
    };

    const onMatchAndCreateDone = () => {
        toggleRefreshGridData(true);
        closeDrawer();
    };

    const handleShowModal = () => {
        setShowModal(true);
    };

    const getRightsTableData = () => {
        switch (activeTab) {
            case RIGHT_TABS.AFFECTED:
                return affectedTableData;
            case RIGHT_TABS.BONUS_RIGHTS:
                return existingBonusRights;
            default:
                return selectedTableData;
        }
    };

    const hasExistingCoreTitleIds = affectedTableData.some(({coreTitleId}) => coreTitleId);
    const isDisabled = isMatchAndCreateLoading || isMatchLoading;
    return (
        <div className="nexus-c-bulk-matching">
            {(headerText === HEADER_TITLE_TITLE_MATCHING || headerText === HEADER_TITLE_BONUS_RIGHT) && (
                <div>
                    <HeaderSection
                        activeTab={activeTab}
                        affectedRights={affectedTableData.length}
                        changeActiveTab={changeActiveTab}
                        existingBonusRights={existingBonusRights.length}
                        isBonusRight={isBonusRight}
                        isNewTitleDisabled={isDisabled}
                        selectedRights={selectedTableData.length}
                        showModal={handleShowModal}
                    />
                    <TitleMatchingRightsTable data={getRightsTableData()} />
                    <SectionMessage>
                        <div className="nexus-c-bulk-matching__message">
                            {TITLE_MATCHING_MSG}
                            <Button
                                label="New Title"
                                spacing="none"
                                appearance="link"
                                onClick={handleShowModal}
                                disabled={isMatchAndCreateLoading || isMatchLoading}
                                className="p-button-link nexus-c-bulk-matching__new-title-button"
                            />
                            {hasExistingCoreTitleIds && (
                                <div className="nexus-c-bulk-matching__warning">{EXISTING_CORE_TITLE_ID_WARNING}</div>
                            )}
                        </div>
                    </SectionMessage>
                    <TitlesSection
                        onMatchAndCreate={onMatchAndCreate}
                        isMatchAndCreateLoading={isMatchAndCreateLoading}
                        isMatchLoading={isMatchLoading}
                        contentType={get(selectedTableData, '[0].contentType', '')}
                        restrictedCoreTitleIds={restrictedCoreTitleIds}
                        isTitlesTableLoading={!loadTitlesTable}
                        closeDrawer={closeDrawer}
                        onMatch={onMatch}
                        selectionList={{matchList, onCellValueChanged, selectedItems, matchButton, duplicateButton}}
                    />
                </div>
            )}
            {headerText === TITLE_MATCHING_REVIEW_HEADER && (
                <>
                    <BulkMatchingReview
                        combinedTitle={combinedTitle}
                        matchedTitles={Object.values(matchList)}
                        onDone={onMatchAndCreateDone}
                        bonusRights={isBonusRight ? bonusRights : null}
                        existingBonusRights={existingBonusRights}
                    />
                </>
            )}
            {headerText === BONUS_RIGHTS_REVIEW_HEADER && (
                <BonusRightsReview
                    closeDrawer={closeDrawer}
                    bonusRights={bonusRights}
                    existingBonusRights={existingBonusRights}
                />
            )}
            <TitleCreate
                display={showModal}
                onSave={closeModalAndRefreshTable}
                onCloseModal={() => setShowModal(false)}
                isItMatching={true}
                defaultValues={{
                    contentType: get(selectedTableData, '[0].contentType', ''),
                }}
                bulkTitleMatch={bulkTitleMatch}
                externalDropdownOptions={externalIdOptions.find(
                    e => toLower(e.tenantCode) === toLower(selectedTenant.id)
                )}
            />
        </div>
    );
};

BulkMatching.propTypes = {
    data: PropTypes.array.isRequired,
    addToast: PropTypes.func,
    removeToast: PropTypes.func,
    closeDrawer: PropTypes.func,
    toggleRefreshGridData: PropTypes.func,
    setHeaderText: PropTypes.func,
    isBonusRight: PropTypes.bool,
    headerText: PropTypes.string,
    onCellValueChanged: PropTypes.func,
    matchButton: PropTypes.object,
    duplicateButton: PropTypes.object,
    selectedItems: PropTypes.array,
    getRestrictedIds: PropTypes.func,
    matchList: PropTypes.object,
    duplicateList: PropTypes.object,
    onReloadData: PropTypes.func,
    setExternalIdValues: PropTypes.func.isRequired,
    externalIdOptions: PropTypes.array,
};

BulkMatching.defaultProps = {
    addToast: () => null,
    removeToast: () => null,
    closeDrawer: () => null,
    toggleRefreshGridData: () => null,
    setHeaderText: () => null,
    isBonusRight: false,
    headerText: '',
    onCellValueChanged: () => null,
    matchButton: {},
    duplicateButton: {},
    selectedItems: [],
    getRestrictedIds: () => null,
    matchList: {},
    duplicateList: {},
    onReloadData: () => null,
    externalIdOptions: [],
};

const mapStateToProps = () => {
    const externalIdSelector = createExternalDropdownIDsSelector();
    return state => ({
        externalIdOptions: externalIdSelector(state),
    });
};

const mapDispatchToProps = dispatch => ({
    toggleRefreshGridData: payload => dispatch(toggleRefreshGridData(payload)),
    setExternalIdValues: payload => dispatch(setExternalIdValues(payload)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withToasts(compose(withMatchAndDuplicateList())(BulkMatching)));
