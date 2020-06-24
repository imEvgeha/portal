import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import SectionMessage from '@atlaskit/section-message';
import Spinner from '@atlaskit/spinner';
import classNames from 'classnames';
import {getAffectedRights, getRestrictedTitles} from '../availsService';
import TitleMatchingRightsTable from '../title-matching-rights-table/TitleMatchingRightsTable';
import RightsMatchingTitlesTable from '../rights-matching-titles-table/RightsMatchingTitlesTable';
import {TITLE_MATCHING_MSG} from './constants';
import './BulkMatching.scss';

const BulkMatching = ({data, headerTitle}) => {
    const [selectedTableData, setSelectedTableData] = useState([]);
    const [affectedTableData, setAffectedTableData] = useState([]);
    const [contentType, setContentType] = useState(null);
    const [restrictedCoreTitleIds, setRestrictedCoreTitleIds] = useState([]);
    const [loadTitlesTable, setLoadTitlesTable] = useState(false);
    const [activeTab, setActiveTab] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

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
                        >Selected(0)
                        </Button>
                    </div>
                    <RightsMatchingTitlesTable
                        restrictedCoreTitleIds={restrictedCoreTitleIds}
                        setTotalCount={setTotalCount}
                        contentType={contentType}
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
};

BulkMatching.defaultProps = {
    headerTitle: '',
};

export default BulkMatching;
