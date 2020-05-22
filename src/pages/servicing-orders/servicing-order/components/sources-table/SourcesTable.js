import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Radio} from '@atlaskit/radio';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import './SourcesTable.scss';
import columnDefinitions from './columnDefinitions';
import {NexusGrid, NexusTitle} from '../../../../../ui/elements';
import CustomActionsCellRenderer from '../../../../../ui/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import mockData from '../../../servicingOrdersMockData.json';
import {defineColumn, defineButtonColumn} from '../../../../../ui/elements/nexus-grid/elements/columnDefinitions';
import {GRID_EVENTS} from '../../../../../ui/elements/nexus-grid/constants';

const SourcesTable = props => {
    const rowData = [];
    const [sources, setSources] = useState([]);
    const [selectedSource, setSelectedSource] = useState();

    const data = [
        {
            id: '1',
            barcode: 5,
            title: 'Lorem'
        },
        {
            id: '2',
            barcode: 6,
            title: 'Lorem 2'
        }
    ];

    useEffect(() => {
        setSources(data);
    }, []);

    const serviceButtonCell = ({data}) => { // eslint-disable-line
        const {id} = data || {};

        return (
            <CustomActionsCellRenderer id={id}>
                <Radio
                    name={id}
                    isChecked={selectedSource && selectedSource.id === id}
                    onChange={() => setSelectedSource(data)}
                />
            </CustomActionsCellRenderer>
        );
    };

    const closeButtonCell = ({data}) => {
        const {id} = data || {};
        const handleClick = () => {
            const updatedRowData = sources.filter(el => el.id !== id);
            setSources(updatedRowData);
        };

        return (
            <CustomActionsCellRenderer id={id}>
                <span onClick={handleClick}>
                    <EditorCloseIcon />
                </span>
            </CustomActionsCellRenderer>
        );
    };

    const radioButtonColumn = defineButtonColumn({
        colId: 'radio',
        field: 'radio',
        cellRendererParams: selectedSource,
        cellRendererFramework: serviceButtonCell,
    });

    const closeButtonColumn = defineButtonColumn({
        cellRendererFramework: closeButtonCell,
        cellRendererParams: sources
    });

    const servicesColumn = defineColumn({
        headerName: '#',
        width: 40,
        colId: 'services',
        field: 'services',
    });

    return (
        <div className="nexus-c-sources-table">
            <NexusTitle isSubTitle>{`Sources (${rowData.length})`}</NexusTitle>
            <NexusGrid 
                columnDefs={[
                    radioButtonColumn,
                    closeButtonColumn,
                    servicesColumn, 
                    ...columnDefinitions
                ]}
                rowData={sources}
            />
        </div>
    );
};

export default SourcesTable;
