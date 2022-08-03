import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {cloneDeep, get} from 'lodash';
import {compose} from 'redux';
import withColumnsResizing from '../../../../packages/ui/lib/elements/nexus-grid/hoc/withColumnsResizing';
import {NexusGrid} from '../../../ui/elements';
import {mapColumnDefinitions} from '../rights-repository/util/utils';
import mappings from './TitleMatchingRightsTable.json';
import columnDefinitions from './columnDefinitions';
import './TitleMatchingRightsTable.scss';

const TitleTable = compose(withColumnsResizing())(NexusGrid);

const TitleMatchingRightsTable = ({data}) => {
    const [tableData, setTableData] = useState([]);
    const [tableColumnDefinitions, setTableColumnDefinitions] = useState([]);

    useEffect(() => {
        if (!tableColumnDefinitions.length) {
            const colDefs = mapColumnDefinitions(columnDefinitions);

            setTableColumnDefinitions(colDefs);
        }
    }, [columnDefinitions, mappings]);

    const flattenData = data => {
        return cloneDeep(data).filter(item => {
            if (Array.isArray(item.territory)) {
                item.territory = get(item.territory[0], 'country', '');
            }
            if (item.episodic) {
                item.seriesTitle = item.episodic.seriesTitle;
                item.episodeNumber = item.episodic.episodeNumber;
                item.seasonNumber = item.episodic.seasonNumber;
            }
            return item;
        });
    };

    useEffect(() => {
        if (data.length) {
            setTableData(flattenData(data));
        }
    }, [data]);

    return (
        <div className="nexus-c-title-matching-rights-table">
            <TitleTable
                className="titleTableForMatching"
                columnDefs={tableColumnDefinitions}
                mapping={mappings}
                rowData={tableData}
                rowSelection="single"
            />
        </div>
    );
};

TitleMatchingRightsTable.propTypes = {
    data: PropTypes.array,
};

TitleMatchingRightsTable.defaultProps = {
    data: null,
};

export default TitleMatchingRightsTable;
