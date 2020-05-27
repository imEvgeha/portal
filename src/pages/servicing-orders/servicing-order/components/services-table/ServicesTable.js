import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import columnDefinitions from './columnDefinitions';
import CustomActionsCellRenderer from '../../../../../ui/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {NexusGrid} from '../../../../../ui/elements';
import {defineColumn, defineButtonColumn} from '../../../../../ui/elements/nexus-grid/elements/columnDefinitions';
import constants from '../fulfillment-order/constants';
import './ServicesTable.scss';

const mockData = [
    {
        type: 'Subtitles',
        version: 'French',
        standard: 'Forced',
        operationalStatus: 'In Progress',
        componentId: 'LOL-123',
        spec: 'M-DBS-2398 SCC',
        addRecipient: 'MGM',
        sourceStandard: '_1080_23_976',
    },
    {
        type: 'Audio',
        version: 'French',
        standard: '5.1',
        operationalStatus: 'On Hold',
        componentId: 'FML-897',
        spec: 'M-DBS-2398 SCC',
        addRecipient: 'Vubiquity',
        sourceStandard: '_1080_23_976',
    },
];

const ServicesTable = ({data}) => {

    const [services, setServices] = useState({});
    const [mockedData, setMockedData] = useState([]);

    useEffect(() => {
        if (data) {
            setServices(data);
            setMockedData(mockData);
        }
    }, [data]);

    const handleServiceRemoval = id => {
        const filteredServices = mockedData.filter(item => item.componentId != id);
        // refactor when api response is clear or valid mock data supplied
        setMockedData(filteredServices);
    };

    const closeButtonCell = ({data}) => {
        return (
            <CustomActionsCellRenderer id={data.componentId}>
                <span onClick={() => handleServiceRemoval(data.componentId)}>
                    <EditorCloseIcon />
                </span>
            </CustomActionsCellRenderer>
        );
    };

    const orderingColumn = defineColumn({
        headerName: '#',
        width: 40,
        colId: 'serviceId',
        field: 'serviceId',
        cellRendererFramework: data => {
            return data ? data.rowIndex : 0;
        }
    });

    const closeButtonColumn = defineButtonColumn({
        cellRendererFramework: closeButtonCell,
        cellRendererParams: mockedData,
    });

    return (
        <div className="nexus-c-services-table">
            <div className="nexus-c-services-table__header">
                <h5 className="nexus-c-services-table__title">{`${constants.SERVICES_TITLE} (${mockedData.length})`}</h5>
                <div className="nexus-c-services-table__subtitle">{constants.SERVICES_BARCODE}: {services.amsAssetId}</div>
            </div>
            <NexusGrid
                columnDefs={[
                    orderingColumn,
                    closeButtonColumn,
                    ...columnDefinitions
                ]}
                rowData={mockedData}
                domLayout="autoHeight"
                onGridReady={params => params.api.sizeColumnsToFit()}
            />
        </div>
    );
};

ServicesTable.propTypes = {
    data: PropTypes.object,
};

ServicesTable.defaultProps = {
    data: null,
};

export default ServicesTable;
