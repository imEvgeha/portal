import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import {compose} from 'redux';
import {cloneDeep} from 'lodash';
import columnDefinitions from './columnDefinitions';
import CustomActionsCellRenderer from '../../../../../ui/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {NexusGrid} from '../../../../../ui/elements';
import {defineColumn, defineButtonColumn} from '../../../../../ui/elements/nexus-grid/elements/columnDefinitions';
import withEditableColumns from '../../../../../ui/elements/nexus-grid/hoc/withEditableColumns';
import mappings from '../../../../../../profile/servicesTableMappings';
import {SELECT_VALUES, ADD_EMPTY_SERVICE_ROW} from './Constants';
import {GRID_EVENTS} from '../../../../../ui/elements/nexus-grid/constants';
import Add from '../../../../../assets/action-add.svg';
import constants from '../fulfillment-order/constants';
import './ServicesTable.scss';

const ServicesTableGrid = compose(
    withEditableColumns()
)(NexusGrid);

const ServicesTable = ({data}) => {
    const [services, setServices] = useState({});
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
            <CustomActionsCellRenderer id={data.componentId} classname="nexus-c-services__close-icon">
                <span onClick={() => handleServiceRemoval(data.componentId)}>
                    <EditorCloseIcon />
                </span>
            </CustomActionsCellRenderer>
        );
    };

    const handleRowDataChange = ({rowIndex, type, data}) => {
        if (type === GRID_EVENTS.CELL_VALUE_CHANGED && data) {
            const updatedServices = cloneDeep(services[`${providerServices}`]);
            updatedServices[rowIndex] = {...data};
            setServices({...services, [`${providerServices}`]: updatedServices});
        }
    };

    const addEmptyServicesRow = () => {
        const updatedServices = cloneDeep(services[`${providerServices}`]);
        updatedServices.push(ADD_EMPTY_SERVICE_ROW);
        setServices({...services, [`${providerServices}`]: updatedServices});
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

    const servicesCount = services[`${providerServices}`] ? services[`${providerServices}`].length : 0;
    const amsAssetID = services.amsAssetId || null;
    return (
        <div className="nexus-c-services-table">
            <div className="nexus-c-services-table__header">
                <h5 className="nexus-c-services-table__title">{`${constants.SERVICES_TITLE} (${servicesCount})`}</h5>
                <div className="nexus-c-services-table__subtitle">{constants.SERVICES_BARCODE}: {amsAssetID}</div>
                <div className="nexus-c-services-table__add-icon">
                    <Add onClick={addEmptyServicesRow} />
                </div>
            </div>
            <ServicesTableGrid
                columnDefs={[
                    orderingColumn,
                    closeButtonColumn,
                    ...columnDefinitions
                ]}
                rowData={cloneDeep(services[`${providerServices}`])}
                domLayout="autoHeight"
                onGridReady={params => params.api.sizeColumnsToFit()}
                mapping={mappings}
                selectValues={SELECT_VALUES}
                onGridEvent={handleRowDataChange}
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
