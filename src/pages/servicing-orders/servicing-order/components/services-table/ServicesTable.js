import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import columnDefinitions from './columnDefinitions';
import CustomActionsCellRenderer from '../../../../../ui/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {NexusGrid} from '../../../../../ui/elements';
import {defineColumn, defineButtonColumn} from '../../../../../ui/elements/nexus-grid/elements/columnDefinitions';
import constants from '../fulfillment-order/constants';
import './ServicesTable.scss';

const ServicesTable = ({data}) => {

    const [services, setServices] = useState();
    const [providerServices, setProviderServices] = useState('');

    useEffect(() => {
        if (data) {
            setServices(data);
            setProviderServices(`${data.fs.toLowerCase()}Services`);
        }
    }, [data]);

    const handleServiceRemoval = id => {
        const filteredServices = services[`${providerServices}`].filter(item => item.componentId != id);
        setServices({...services, [`${providerServices}`]: filteredServices});

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
        cellRendererParams: services && services[`${providerServices}`],
    });

    return services ? (
        <div className="nexus-c-services-table">
            <div className="nexus-c-services-table__header">
                <h5 className="nexus-c-services-table__title">{`${constants.SERVICES_TITLE} (${services[`${providerServices}`].length})`}</h5>
                <div className="nexus-c-services-table__subtitle">{constants.SERVICES_BARCODE}: {services.amsAssetId}</div>
            </div>
            <NexusGrid
                columnDefs={[
                    orderingColumn,
                    closeButtonColumn,
                    ...columnDefinitions
                ]}
                rowData={services[`${providerServices}`]}
                domLayout="autoHeight"
                onGridReady={params => params.api.sizeColumnsToFit()}
            />
        </div>
    ) : null;
};

ServicesTable.propTypes = {
    data: PropTypes.object,
};

ServicesTable.defaultProps = {
    data: null,
};

export default ServicesTable;
