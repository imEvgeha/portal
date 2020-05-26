import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import columnDefinitions from './columnDefinitions';
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
];

const ServicesTable = ({data}) => {

    const [services, setServices] = useState([]);

    useEffect(() => {
        setServices(mockData);
    }, [data]);

    const orderingColumn = defineColumn({
        headerName: '#',
        width: 40,
        colId: 'serviceId',
        field: 'serviceId',
        cellRendererFramework: (data) => {
            return data.definition ? data.definition.length : 0;
        }
    });

    console.log(data);
    return data.fulfillmentOrderId ? (
        <div className="nexus-c-services-table">
            <div className="nexus-c-services-table__header">
                <div className="nexus-c-services-table__title">{`${constants.SERVICES_TITLE} (${services.length})`}</div>
                <div className="nexus-c-services-table__subtitle">{constants.SERVICES_BARCODE}: {data.fulfillmentOrderId}</div>
            </div>
            <NexusGrid
                columnDefs={[
                    orderingColumn,
                    ...columnDefinitions
                ]}
                rowData={services}
                domLayout="autoHeight"
            />
        </div>
    ) : null;
};

ServicesTable.propTypes = {
    data: PropTypes.array,
};

ServicesTable.defaultProps = {
    data: [],
};

export default ServicesTable;
