import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import SectionMessage from '@atlaskit/section-message';
import {getAffectedRights} from './bulkMatchingService';
import TitleMatchingTable from '../title-matching-table/TitleMatchingTable';
import './BulkMatching.scss';
import {TITLE_MATCHING_MSG} from './constants';

const BulkMatching = ({data}) => {
    const [selectedTableData, setSelectedTableData] = useState([]);
    const [affectedTableData, setAffectedTableData] = useState([]);
    const [affectedTableActive, setAffectedTableActive] = useState(false);

    const changeActiveTable = () => {
        setAffectedTableActive(!affectedTableActive);
    };

    useEffect(() => {
        if (data.length) {
            setSelectedTableData(data);
        }
    }, []);

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

    return (
        <div className="nexus-c-bulk-matching">
            <h3>Title Matching</h3>
            <div className="nexus-c-bulk-matching__header">
                <div
                    className={`nexus-c-bulk-matching__selected ${!affectedTableActive
                        ? 'nexus-c-bulk-matching__selected--active'
                        : ''}`}
                    onClick={affectedTableActive ? changeActiveTable : null}
                >Selected Rights ({selectedTableData.length})
                </div>
                <div
                    className={`nexus-c-bulk-matching__affected ${affectedTableActive
                        ? 'nexus-c-bulk-matching__affected--active'
                        : ''}`}
                    onClick={!affectedTableActive ? changeActiveTable : null}
                >Affected Rights ({affectedTableData.length})
                </div>
                <Button className="nexus-c-bulk-matching__btn" onClick={() => {}}>New Title</Button>
            </div>
            <TitleMatchingTable
                data={affectedTableActive ? affectedTableData : selectedTableData}
            />
            <SectionMessage>
                <div className="nexus-c-bulk-matching__info-msg">
                    {TITLE_MATCHING_MSG}<span>New Title</span>
                </div>
            </SectionMessage>
        </div>
    );
};

BulkMatching.propTypes = {
    data: PropTypes.array.isRequired,
};

export default BulkMatching;
