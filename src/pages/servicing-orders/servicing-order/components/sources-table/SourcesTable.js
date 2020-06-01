import React, {useState, useEffect} from 'react';
import {compose} from 'redux';
import { clone } from 'lodash';
import PropTypes from 'prop-types';
import {Radio} from '@atlaskit/radio';
import Badge from '@atlaskit/badge';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import './SourcesTable.scss';
import columnDefinitions from './columnDefinitions';
import {NexusGrid} from '../../../../../ui/elements';
import CustomActionsCellRenderer from '../../../../../ui/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {
    defineColumn,
    defineButtonColumn,
} from '../../../../../ui/elements/nexus-grid/elements/columnDefinitions';
import constants from '../fulfillment-order/constants';
import Add from '../../../../../assets/action-add.svg';
import withEditableColumns from '../../../../../ui/elements/nexus-grid/hoc/withEditableColumns';
import mappings  from '../../../../../../profile/sourceTableMapping';
import withColumnsResizing from '../../../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import { SELECTED_VALUES, INIT_SOURCE_ROW, NON_EDITABLE_COLS } from './Constants';
import {GRID_EVENTS} from '../../../../../ui/elements/nexus-grid/constants';

const {SOURCE_TITLE, SOURCE_SUBTITLE} = constants;

const SourceTableGrid = compose(
    withColumnsResizing(),
    withEditableColumns(),
)(NexusGrid);

const SourcesTable = ({data, onSelectedSourceChange}) => {
    const [sources, setSources] = useState([]);
    const [selectedSource, setSelectedSource] = useState();

    useEffect(() => {
        setSources(data);
    }, [data]);

    useEffect(() => {
        onSelectedSourceChange(selectedSource);
    }, [selectedSource]);

    const serviceButtonCell = ({data, selectedItem = {}}) => { // eslint-disable-line
        const {barcode} = data || {};

        return (
            <CustomActionsCellRenderer id={barcode}>
                <Radio
                    name={barcode}
                    isChecked={selectedItem.barcode === barcode}
                    onChange={() => setSelectedSource(data)}
                />
            </CustomActionsCellRenderer>
        );
    };

    const closeButtonCell = ({data, list = []}) => {
        const {barcode} = data || {};
        const handleClick = () => {
            const updatedRowData = list.filter(el => el.barcode !== barcode);
            setSources(updatedRowData);
        };

        return (
            <CustomActionsCellRenderer id={barcode}>
                <span onClick={handleClick}>
                    <EditorCloseIcon />
                </span>
            </CustomActionsCellRenderer>
        );
    };

    const addNewRow = () => {
      setSources([...sources, clone(INIT_SOURCE_ROW)]);
    };

    const radioButtonColumn = defineColumn({
        width: 40,
        colId: 'radio',
        field: 'radio',
        cellRendererParams: {selectedItem: selectedSource},
        cellRendererFramework: serviceButtonCell,
    });

    const closeButtonColumn = defineButtonColumn({
        cellRendererFramework: closeButtonCell,
        cellRendererParams: {list: sources},
    });

    const servicesColumn = defineColumn({
        headerName: '#',
        width: 40,
        colId: 'services',
        field: 'services',
        cellRendererFramework: ({data}) => {
            // TODO: fix this
            const name = Object.keys(data).length && `${data['fs'].toLowerCase()}Services`;
            const serviceLength = (name && data[name]) ? data[name].length : 0;

            return (
                <Badge>
                    {serviceLength}
                </Badge>
            );
        }
    });

    const onSourceTableChange = ({type, rowIndex, data}) => {
        if( type === GRID_EVENTS.CELL_VALUE_CHANGED) {
            let newSources = sources.slice();
            newSources[rowIndex] = data;
            setSources(newSources);
        }
    };

    return (
        <div className="nexus-c-sources-table">
            <div className="nexus-c-sources-table__header">
                <div className="nexus-c-sources-table__title">{`${SOURCE_TITLE} (${sources.length})`}</div>
                <div className="nexus-c-sources-table__subtitle">
                    {SOURCE_SUBTITLE}
                    <Add onClick={addNewRow} />
                </div>
            </div>
            <SourceTableGrid
                columnDefs={[
                    radioButtonColumn,
                    closeButtonColumn,
                    servicesColumn,
                    ...columnDefinitions
                ]}
                rowData={sources}
                domLayout="autoHeight"
                mapping={mappings}
                notEditableColumns={NON_EDITABLE_COLS}
                selectValues={SELECTED_VALUES}
                onGridEvent={onSourceTableChange}
            />
        </div>
    );
};

SourcesTable.propTypes = {
    data: PropTypes.array,
    onSelectedSourceChange: PropTypes.func.isRequired,
};

SourcesTable.defaultProps = {
    data: [],
};

export default SourcesTable;
