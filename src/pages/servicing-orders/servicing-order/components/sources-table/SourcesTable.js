import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Badge from '@atlaskit/badge';
import EditorRemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import {Radio} from '@atlaskit/radio';
import {isEqual, cloneDeep} from 'lodash';
import {compose} from 'redux';
import mappings from '../../../../../../profile/sourceTableMapping.json';
import Add from '../../../../../assets/action-add.svg';
import loadingGif from '../../../../../assets/img/loading.gif';
import {NexusGrid} from '../../../../../ui/elements';
import {GRID_EVENTS} from '../../../../../ui/elements/nexus-grid/constants';
import CustomActionsCellRenderer from '../../../../../ui/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {defineButtonColumn, defineColumn} from '../../../../../ui/elements/nexus-grid/elements/columnDefinitions';
import withColumnsResizing from '../../../../../ui/elements/nexus-grid/hoc/withColumnsResizing';
import {URL} from '../../../../../util/Common';
import usePrevious from '../../../../../util/hooks/usePrevious';
import {showToastForErrors} from '../../../../../util/http-client/handleError';
import constants from '../fulfillment-order/constants';
import {NON_EDITABLE_COLS, SELECT_VALUES, INIT_SOURCE_ROW, TEMP_SOURCE_ROW, TABLE_HEIGHT} from './Constants';
import columnDefinitions from './columnDefinitions';
import './SourcesTable.scss';
import {fetchAssetFields} from './util';

const {SOURCE_TITLE, SOURCE_SUBTITLE} = constants;

const SourceTableGrid = compose(withColumnsResizing())(NexusGrid);

const SourcesTable = ({data: dataArray, onSelectedSourceChange, setUpdatedServices, isDisabled}) => {
    const [sources, setSources] = useState([]);
    const [selectedSource, setSelectedSource] = useState(null);
    const previousData = usePrevious(dataArray);
    const [gridApi, setGridApi] = useState(null);

    const barcodes = dataArray.map(item => item.barcode.trim());

    const onGridReady = ({type, api}) => {
        setGridApi(api);
        type === 'READY' && api.sizeColumnsToFit();
    };

    useEffect(
        () => {
            if (!isEqual(dataArray, previousData)) {
                setSelectedSource(null);
                populateRowData();
            }
            populateRowData();
        },
        // disabling eslint here as it couldn;t be tested since no scenario was found as of now
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dataArray]
    );

    useEffect(() => {
        if (selectedSource === null && dataArray.length > 0) {
            setSelectedSource(dataArray[0]);
        }
    }, [selectedSource, dataArray]);

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
            <div id={barcode}>
                <Radio
                    name={barcode}
                    isChecked={selectedItem && selectedItem.barcode === barcode}
                    onChange={() => barcode && setSelectedSource(data)}
                />
            </div>
        );
    };

    const radioButtonColumn = defineColumn({
        width: 35,
        colId: 'radio',
        field: 'radio',
        cellRendererParams: {selectedItem: selectedSource},
        cellRendererFramework: serviceButtonCell,
    });

    const servicesColumn = defineColumn({
        headerName: '#',
        width: 35,
        colId: 'services',
        field: 'services',
        cellRendererFramework: ({data}) => {
            // TODO: fix this
            const name = data && `${data['fs'].toLowerCase()}Services`;
            const serviceLength = name && data[name] ? data[name].length : 0;

            return <Badge>{serviceLength}</Badge>;
        },
    });

    // eslint-disable-next-line react/prop-types
    const closeButtonCell = ({rowIndex, data}) => {
        return (
            <CustomActionsCellRenderer id={rowIndex.toString()} classname="nexus-c-services__close-icon">
                {!isDisabled && (
                    <span onClick={() => removeSourceRow(data.barcode)}>
                        <EditorRemoveIcon size="medium" primaryColor="grey" />
                    </span>
                )}
            </CustomActionsCellRenderer>
        );
    };

    const closeButtonColumn = defineButtonColumn({
        width: 35,
        cellRendererFramework: closeButtonCell,
        cellRendererParams: '',
    });

    const loadingCell = params => {
        if (params.value === ' ') {
            return `<img src=${loadingGif} alt="loading..."/>`;
        }
        return params.value;
    };

    const barcodeColumn = !isDisabled
        ? {...columnDefinitions[0], editable: true}
        : {...columnDefinitions[0], editable: false};
    let newColDef = [barcodeColumn, ...columnDefinitions.filter((item, index) => index !== 0)];
    newColDef = newColDef.map(item => {
        return {...item, cellRenderer: loadingCell};
    });

    // Todo : remove this when dete stg apis are working
    if (!URL.isLocalOrDevOrQA()) newColDef = [columnDefinitions[0]];

    const onSourceTableChange = async ({type, rowIndex, data, api}) => {
        const prevSources = sources.slice();
        prevSources[rowIndex] = {
            ...prevSources[rowIndex],
            barcode: barcodes[rowIndex],
        };
        if (type === GRID_EVENTS.CELL_VALUE_CHANGED) {
            const barcodeIndex = barcodes.findIndex(item => item === data.barcode.trim());
            if (barcodeIndex !== -1) {
                showToastForErrors(null, {
                    errorToast: {
                        title: 'Duplicate Entry',
                        description: `Entry ${data.barcode.trim()} already exists in this list`,
                    },
                });
                api.setRowData(prevSources);
            } else if (barcodes[rowIndex] !== data.barcode.trim()) {
                // call DETE fetch api and update barcode.
                const loadingSources = sources.slice();
                let loading = data;
                loading = {
                    ...loading,
                    ...cloneDeep(TEMP_SOURCE_ROW),
                };
                loadingSources[rowIndex] = loading;
                setSources(loadingSources);
                try {
                    const {assetFormat, title = [], spec, status, componentAssociations = []} = await fetchAssetFields(
                        data.barcode
                    );
                    const newSources = cloneDeep(sources[0]);
                    newSources.deteServices[0].deteSources[rowIndex] = {
                        ...newSources.deteServices[0].deteSources[rowIndex],
                        amsAssetId: data.barcode,
                        barcode: data.barcode,
                        assetFormat,
                        title: title[0].name,
                        version: spec,
                        status,
                        standard: componentAssociations[0].component.standard,
                    };
                    setUpdatedServices(newSources);
                } catch (e) {
                    setSources(prevSources);
                }
            }
        }
    };

    const addEmptySourceRow = () => {
        if (sources[sources.length - 1].barcode === '')
            showToastForErrors(null, {
                errorToast: {
                    title: 'Invalid Action',
                    description: 'Please add one row at a time',
                },
            });
        else {
            setSources([...sources, cloneDeep(INIT_SOURCE_ROW)]);
        }
    };

    const removeSourceRow = barcode => {
        const newSources = cloneDeep(sources[0]);
        newSources.deteServices[0].deteSources = newSources.deteServices[0].deteSources.filter(
            item => item.barcode !== barcode
        );
        setUpdatedServices(newSources);
    };

    const populateRowData = () => {
        const dataClone = cloneDeep(dataArray);
        const sourcesArray = [];
        const newDataArray = [];

        // eslint-disable-next-line no-return-assign
        dataClone.length &&
            dataClone.forEach((item, index) => (newDataArray[index] = item.deteServices[0].deteSources[index]));
        newDataArray.forEach((item, index) => (sourcesArray[index] = {...item, ...dataClone[index]}));
        setSources(sourcesArray);
    };

    useEffect(() => {
        // show last empty row in case new row is added
        const len = sources.length;
        if (len >= TABLE_HEIGHT) {
            const lastRow = sources[len - 1];
            if (lastRow && lastRow.barcode === '') {
                gridApi.ensureIndexVisible(len - 1);
            }
        }
    }, [sources.length]);

    return (
        <div className={URL.isLocalOrDevOrQA() ? 'nexus-c-sources' : 'nexus-c-sources_stg'}>
            <div className="nexus-c-sources__header">
                <h2>{`${SOURCE_TITLE} (${sources.length})`}</h2>
                <div>{SOURCE_SUBTITLE}</div>
                {sources.length > 0 && (
                    <div className="nexus-c-source-table__add-icon">
                        {!isDisabled && <Add onClick={addEmptySourceRow} />}
                    </div>
                )}
            </div>
            <SourceTableGrid
                columnDefs={[radioButtonColumn, closeButtonColumn, servicesColumn, ...newColDef]}
                defaultColDef={{
                    flex: 1,
                    sortable: true,
                }}
                rowData={sources}
                domLayout="normal"
                notEditableColumns={NON_EDITABLE_COLS}
                selectValues={SELECT_VALUES}
                onGridEvent={onSourceTableChange}
                onGridReady={onGridReady}
            />
        </div>
    );
};

SourcesTable.propTypes = {
    data: PropTypes.array,
    onSelectedSourceChange: PropTypes.func.isRequired,
    setUpdatedServices: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool.isRequired,
};

SourcesTable.defaultProps = {
    data: [],
};

export default SourcesTable;
