import Badge from '@atlaskit/badge';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import {Radio} from '@atlaskit/radio';
import {isEqual} from 'lodash';
import PropTypes from 'prop-types';
import React, {useEffect, useState} from 'react';
import {compose} from 'redux';
import mappings from '../../../../../../profile/sourceTableMapping';
import {NexusGrid} from '../../../../../ui/elements';
import {GRID_EVENTS} from '../../../../../ui/elements/nexus-grid/constants';
import CustomActionsCellRenderer from '../../../../../ui/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {defineColumn} from '../../../../../ui/elements/nexus-grid/elements/columnDefinitions';
import withColumnsResizing from '../../../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import usePrevious from '../../../../../util/hooks/usePrevious';
import constants from '../fulfillment-order/constants';
import columnDefinitions from './columnDefinitions';
import {NON_EDITABLE_COLS, SELECT_VALUES} from './Constants';
import './SourcesTable.scss';

const {SOURCE_TITLE, SOURCE_SUBTITLE} = constants;

const SourceTableGrid = compose(withColumnsResizing())(NexusGrid);

const SourcesTable = ({data, onSelectedSourceChange}) => {
    const [sources, setSources] = useState([]);
    const [selectedSource, setSelectedSource] = useState(null);
    const previousData = usePrevious(data);

    useEffect(
        () => {
            if (!isEqual(data, previousData)) {
                setSelectedSource(null);
                setSources(data);
            }
            setSources(data);
        },
        [data]
    );

    useEffect(
        () => {
            if (selectedSource === null && data.length > 0) {
                setSelectedSource(data[0]);
            }
        },
        [selectedSource, data]
    );

    useEffect(
        () => {
            onSelectedSourceChange(selectedSource);
        },
        [selectedSource]
    );

    const serviceButtonCell = ({data, selectedItem = {}}) => {
        // eslint-disable-line
        const {barcode} = data || {};

        return (
            <CustomActionsCellRenderer id={barcode}>
                <Radio
                    name={barcode}
                    isChecked={selectedItem && selectedItem.barcode === barcode}
                    onChange={() => setSelectedSource(data)}
                />
            </CustomActionsCellRenderer>
        );
    };

    const closeButtonCell = ({data, list = []}) => {
        const {barcode} = data || {};
        const handleClick = () => {
            const updatedRowData = list.filter(el => el.barcode !== barcode);
            if (selectedSource && selectedSource.barcode === barcode) {
                setSelectedSource();
            }
            setSources(updatedRowData);
        };

        return (
            <CustomActionsCellRenderer id={barcode} classname="nexus-c-sources__close-icon">
                <span onClick={handleClick}>
                    <EditorCloseIcon />
                </span>
            </CustomActionsCellRenderer>
        );
    };

    const radioButtonColumn = defineColumn({
        width: 40,
        colId: 'radio',
        field: 'radio',
        cellRendererParams: {selectedItem: selectedSource},
        cellRendererFramework: serviceButtonCell
    });

    const servicesColumn = defineColumn({
        headerName: '#',
        width: 40,
        colId: 'services',
        field: 'services',
        cellRendererFramework: ({data}) => {
            // TODO: fix this
            const name = data && `${data['fs'].toLowerCase()}Services`;
            const serviceLength = name && data[name] ? data[name].length : 0;

            return <Badge>{serviceLength}</Badge>;
        }
    });

    const onSourceTableChange = ({type, rowIndex, data}) => {
        if (type === GRID_EVENTS.CELL_VALUE_CHANGED) {
            let newSources = sources.slice();
            newSources[rowIndex] = data;
            setSources(newSources);
        }
    };

    return (
        <div className="nexus-c-sources-table">
            <div className="nexus-c-sources-table__header">
                <h2>{`${SOURCE_TITLE} (${sources.length})`}</h2>
                <div>{SOURCE_SUBTITLE}</div>
            </div>
            <SourceTableGrid
                columnDefs={[radioButtonColumn, servicesColumn, ...columnDefinitions]}
                rowData={sources}
                domLayout="autoHeight"
                mapping={mappings}
                notEditableColumns={NON_EDITABLE_COLS}
                selectValues={SELECT_VALUES}
                onGridEvent={onSourceTableChange}
            />
        </div>
    );
};

SourcesTable.propTypes = {
    data: PropTypes.array,
    onSelectedSourceChange: PropTypes.func.isRequired
};

SourcesTable.defaultProps = {
    data: []
};

export default SourcesTable;
