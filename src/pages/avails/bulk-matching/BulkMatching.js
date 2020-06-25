import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import SectionMessage from '@atlaskit/section-message';
import Spinner from '@atlaskit/spinner';
import classNames from 'classnames';
import {getAffectedRights, getRestrictedTitles, bulkUpdateAllRights} from '../availsService';
import withToasts from '../../../ui/toast/hoc/withToasts';
import useMatchAndDuplicateList from '../../metadata/legacy-title-reconciliation/hooks/useMatchAndDuplicateList';
import TitleMatchingRightsTable from '../title-matching-rights-table/TitleMatchingRightsTable';
import RightsMatchingTitlesTable from '../rights-matching-titles-table/RightsMatchingTitlesTable';
import BulkMatchingActionsBar from './components/BulkMatchingActionsBar';
import {TITLE_MATCHING_MSG} from './constants';
import {getDomainName, URL} from '../../../util/Common';
import TitleSystems from '../../legacy/constants/metadata/systems';
import {rightsService} from '../../legacy/containers/avail/service/RightsService';
import DOP from '../../../util/DOP';
import {
    WARNING_TITLE,
    SUCCESS_TITLE,
    WARNING_ICON,
    SUCCESS_ICON,
} from '../../../ui/elements/nexus-toast-notification/constants';
import {
    TITLE_MATCH_AND_CREATE_WARNING_MESSAGE,
    TITLE_MATCH_SUCCESS_MESSAGE,
} from '../../../ui/toast/constants';
import './BulkMatching.scss';

const BulkMatching = ({data, headerTitle, closeDrawer, addToast, removeToast}) => {
    const [selectedTableData, setSelectedTableData] = useState([]);
    const [affectedTableData, setAffectedTableData] = useState([]);
    const [affectedRightIds, setAffectedRightIds] = useState([]);
    const [contentType, setContentType] = useState(null);
    const [restrictedCoreTitleIds, setRestrictedCoreTitleIds] = useState([]);
    const [loadTitlesTable, setLoadTitlesTable] = useState(false);
    const [activeTab, setActiveTab] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    const {matchList, handleMatchClick, duplicateList, handleDuplicateClick} = useMatchAndDuplicateList();
    const {NEXUS, MOVIDA, VZ} = TitleSystems;

    const changeActiveTab = () => {
        setActiveTab(!activeTab);
    };

    useEffect(() => {
        if (data.length) {
            setSelectedTableData(data);
            const {contentType} = data[0] || {};
            setContentType(contentType);
        }
    }, [data]);

    useEffect(() => {
        if (selectedTableData.length) {
            const rightIds = selectedTableData.map(right => right.id);
            setAffectedRightIds(rightIds);
            getAffectedRights(rightIds).then(res => {
                if (Array.isArray(res) && res.length) {
                    setAffectedTableData(res);
                }
            });
        }
    }, [selectedTableData]);

    useEffect(() => {
        if (affectedTableData.length) {
            const affectedRightIds = affectedTableData.map(right => right.id);

            getRestrictedTitles(affectedRightIds).then(res => {
                if (Array.isArray(res) && res.length) {
                    setRestrictedCoreTitleIds(res);
                }
                setLoadTitlesTable(true);
            });
        }
    }, [affectedTableData]);

    const onMatch = () => {
        const url = `${getDomainName()}/metadata/detail/${matchList[NEXUS].id}`;
        const onViewTitleClick = () => window.open(url, '_blank');

        const updatedRight = {'coreTitleId': matchList[NEXUS].id};
        bulkUpdateAllRights(updatedRight, mergeRightIds(affectedRightIds, duplicateList))
            .then(res => console.log(res));

        addToast({
            title: SUCCESS_TITLE,
            description: TITLE_MATCH_SUCCESS_MESSAGE,
            icon: SUCCESS_ICON,
            actions: [
                {content: 'View Title', onClick: onViewTitleClick}
            ],
            isWithOverlay: true,
        });
    };

    const mergeRightIds = (affectedRightIds, duplicateList) => {
        const extractDuplicates = Object.keys(duplicateList).map(key => key);
        return [...affectedRightIds, ...extractDuplicates];
    };

    const mergeSingle = () => {
        removeToast();
        mergeTitles();
    };

    const onMatchAndCreate = () => {
        if (Object.keys(matchList).length === 1) {
            addToast({
                title: WARNING_TITLE,
                description: TITLE_MATCH_AND_CREATE_WARNING_MESSAGE,
                icon: WARNING_ICON,
                actions: [
                    {content: 'Cancel', onClick: removeToast},
                    {content: 'Ok', onClick: mergeSingle}
                ],
                isWithOverlay: true,
            });
        }
        else {
            mergeTitles();
        }
    };

    const onCancel = () => {
        closeDrawer();
    };

    return (
        <div className="nexus-c-bulk-matching">
            <h2>{headerTitle}</h2>
            <div className="nexus-c-bulk-matching__header">
                <div
                    className={classNames(
                        'nexus-c-bulk-matching__selected',
                        !activeTab && 'nexus-c-bulk-matching__selected--active'
                    )}
                    onClick={activeTab ? changeActiveTab : null}
                >Selected Rights ({selectedTableData.length})
                </div>
                <div
                    className={classNames(
                        'nexus-c-bulk-matching__affected',
                        activeTab && 'nexus-c-bulk-matching__affected--active'
                    )}
                    onClick={!activeTab ? changeActiveTab : null}
                >Affected Rights ({affectedTableData.length})
                </div>
                <Button className="nexus-c-bulk-matching__btn" onClick={() => null}>New Title</Button>
            </div>
            <TitleMatchingRightsTable
                data={activeTab ? affectedTableData : selectedTableData}
            />
            <SectionMessage>
                {TITLE_MATCHING_MSG}
                <Button spacing="none" appearance="link">New Title</Button>
            </SectionMessage>
            {loadTitlesTable ? (
                <>
                    <div className="nexus-c-bulk-matching__titles-table-header">
                        <div className="nexus-c-bulk-matching__titles-table-header-title">Titles ({totalCount})</div>
                        <Button
                            className="nexus-c-bulk-matching__titles-table-selected-btn"
                            onClick={() => null}
                        >
                            Selected(0)
                        </Button>
                    </div>
                    <RightsMatchingTitlesTable
                        restrictedCoreTitleIds={restrictedCoreTitleIds}
                        setTotalCount={setTotalCount}
                        contentType={contentType}
                        matchList={matchList}
                        handleMatchClick={handleMatchClick}
                        handleDuplicateClick={handleDuplicateClick}
                        duplicateList={duplicateList}
                    />
                    <BulkMatchingActionsBar
                        matchList={matchList}
                        //mergeTitles={() => mergeTitles(matchList, duplicateList, rightId)}
                        onMatch={onMatch}
                        onMatchAndCreate={onMatchAndCreate}
                        onCancel={onCancel}
                    />
                </>
            ) : (
                <div className="nexus-c-bulk-matching__spinner">
                    <Spinner size="large" />
                </div>
            )}
        </div>
    );
};

BulkMatching.propTypes = {
    data: PropTypes.array.isRequired,
    headerTitle: PropTypes.string,
    addToast: PropTypes.func,
    removeToast: PropTypes.func,
    closeDrawer: PropTypes.func,
};

BulkMatching.defaultProps = {
    headerTitle: '',
    addToast: () => null,
    removeToast: () => null,
    closeDrawer: () => null,
};

export default withToasts(BulkMatching);
