import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Badge from '@atlaskit/badge';
import {Radio} from '@atlaskit/radio';
import {isEqual} from 'lodash';
import {compose} from 'redux';
import mappings from '../../../../../../profile/sourceTableMapping.json';
import {NexusGrid} from '../../../../../ui/elements';
import {GRID_EVENTS} from '../../../../../ui/elements/nexus-grid/constants';
import CustomActionsCellRenderer from '../../../../../ui/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {defineColumn} from '../../../../../ui/elements/nexus-grid/elements/columnDefinitions';
import withColumnsResizing from '../../../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import usePrevious from '../../../../../util/hooks/usePrevious';
import {getMgmTitleByBarcode, getMgmAssetByBarcode} from '../../../servicingOrdersService';
import constants from '../fulfillment-order/constants';
import {NON_EDITABLE_COLS, SELECT_VALUES} from './Constants';
import columnDefinitions from './columnDefinitions';
import './SourcesTable.scss';

const {SOURCE_TITLE, SOURCE_SUBTITLE} = constants;
const Loading = 'Loading...';
const NotFound = 'Not found';
const SourceTableGrid = compose(withColumnsResizing())(NexusGrid);

const SourcesTable = ({data, onSelectedSourceChange}) => {
    const [sources, setSources] = useState([]);
    const [selectedSource, setSelectedSource] = useState(null);
    const previousData = usePrevious(data);

    /*
    useEffect(
        () => {
            console.log('data:',data);
            if(data.length > 0) {
                let rows = data.length > 0 ? data.map(item => {
                    return {
                        barcode: item.barcode,
                        title: Loading,
                        fs: item.fs,
                        titleId: Loading,
                        amsAssetId: Loading,
                        assetFormat: Loading,
                        standard: Loading
                    }
                }) : [];
                //console.log('rows: ', rows);


                if (!isEqual(data, previousData)) {
                    setSelectedSource(null);
                    //console.log('rows 2: ', rows);
                    //setSources([]);
                    //console.log('setting sources 2', rows);
                }
                rows.length && setSources(rows);
                //console.log('setting sources 3', sources);
                //setTimeout(()=>setSources([{barcode: 'item.barcode', title: 'test', fs: 'item.fs', titleId: 'ID'}]), 6000);
                //console.log('rows 3: ', rows);
                if (rows.length) {
                    let titlePromises = [];
                    let assetPromises = [];
                    rows.forEach(row => {
                        titlePromises.push(getMgmTitleByBarcode('DT10011'));
                        assetPromises.push(getMgmAssetByBarcode('DT10011'));
                    });
                    Promise.all([...titlePromises, ...assetPromises]).then(values => console.log(values)).catch(() => {
                        let errorRows = rows.map(item => {
                            return {
                                barcode: item.barcode,
                                title: NotFound,
                                fs: item.fs,
                                titleId: NotFound,
                                amsAssetId: NotFound,
                                assetFormat: NotFound,
                                standard: NotFound
                            }
                        });
                        setSources(errorRows);
                        console.log('setting sources 4', sources);
                    });
                }
            }
            //else setSources([]);
        },
        // disabling eslint here as it couldn;t be tested since no scenario was found as of now
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [data]
    );
*/

    useEffect(
        () => {
            if (!isEqual(data, previousData)) {
                setSelectedSource(null);
                setSources(data);
            }
            setSources(data);
        },
        // disabling eslint here as it couldn;t be tested since no scenario was found as of now
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [data]
    );

    useEffect(() => {
        if (selectedSource === null && data.length > 0) {
            setSelectedSource(data[0]);
        }
    }, [selectedSource, data]);

    useEffect(
        () => {
            onSelectedSourceChange(selectedSource);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedSource]
    );

    // eslint-disable-next-line
    const serviceButtonCell = ({data, selectedItem = {}}) => {
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

    const radioButtonColumn = defineColumn({
        width: 40,
        colId: 'radio',
        field: 'radio',
        cellRendererParams: {selectedItem: selectedSource},
        cellRendererFramework: serviceButtonCell,
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
        },
    });

    const onSourceTableChange = ({type, rowIndex, data}) => {
        if (type === GRID_EVENTS.CELL_VALUE_CHANGED) {
            const newSources = sources.slice();
            newSources[rowIndex] = data;
            setSources(newSources);
        }
    };

    return (
        <div className="nexus-c-sources">
            <div className="nexus-c-sources__header">
                <h2>{`${SOURCE_TITLE} (${sources.length})`}</h2>
                <div>{SOURCE_SUBTITLE}</div>
            </div>
            <SourceTableGrid
                columnDefs={[radioButtonColumn, servicesColumn, ...columnDefinitions]}
                rowData={sources}
                domLayout="normal"
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
    onSelectedSourceChange: PropTypes.func.isRequired,
};

SourcesTable.defaultProps = {
    data: [],
};

export default SourcesTable;
