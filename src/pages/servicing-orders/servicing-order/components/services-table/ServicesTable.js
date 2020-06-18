import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import {compose} from 'redux';
import {get, cloneDeep} from 'lodash';
import columnDefinitions from './columnDefinitions';
import CustomActionsCellRenderer from '../../../../../ui/elements/nexus-grid/elements/cell-renderer/CustomActionsCellRenderer';
import {NexusGrid} from '../../../../../ui/elements';
import {defineColumn, defineButtonColumn, defineCheckboxSelectionColumn} from '../../../../../ui/elements/nexus-grid/elements/columnDefinitions';
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

const ServicesTable = ({data, isDisabled}) => {
    const [services, setServices] = useState({});
    const [tableData, setTableData ] = useState([]);
    const [providerServices, setProviderServices] = useState('');

    useEffect(() => {
        if (data) {
            // I'm not able to edit/save a nested object using the Nexus Grid. It keeps adding the updated value to the highest level.
            // I went ahead and flattened the object here with only necessary table data.
            const flattenedObject = data[`${data.fs.toLowerCase()}Services`].map(service => ({
                componentId: service.externalServices.externalId,
                spec: service.externalServices.formatType,
                doNotStartBefore: service.overrideDueDate,
                priority: service.externalServices.parameters.find(param => param.name === 'Priority').value,
                deliverToVu: service.deteTasks.deteDeliveries.externalDelivery.deliverToId === 'VUBIQUITY',
                operationalStatus: service.status
            }));
            setServices(data);
            setTableData(flattenedObject);
            setProviderServices(`${data.fs.toLowerCase()}Services`);
        }
    }, [data]);

    const handleServiceRemoval = index => {
        const removedRowTable = cloneDeep(tableData);
        removedRowTable.splice(index, 1);
        setTableData(removedRowTable);

        // TODO: Can there be 0 services in a source?

       // TODO: This change needs to be propogated up to the Fulfillment Order form to submit
    };

    const closeButtonCell = ({rowIndex}) => {
        return (
            <CustomActionsCellRenderer id={1} classname="nexus-c-services__close-icon">
                {
                !isDisabled && (
                    <span onClick={() => handleServiceRemoval(rowIndex)}>
                        <EditorCloseIcon />
                    </span>
                )
                }
            </CustomActionsCellRenderer>
        );
    };

    const handleRowDataChange = ({rowIndex, type, data}) => {
        if (type === GRID_EVENTS.CELL_VALUE_CHANGED && data) {
            const updatedServices = cloneDeep(services[`${providerServices}`]);
            const currentService = updatedServices[rowIndex];

            // TODO: Super inefficient, need to find a better way
            // Re-mapping the data
            currentService.externalServices.externalId = data.componentId;
            currentService.externalServices.formatType = data.spec;
            currentService.overrideDueDate = data.doNotStartBefore;
            currentService.externalServices.parameters.find(param => param.name === 'Priority').value = data.priority;
            currentService.deteTasks.deteDeliveries.externalDelivery.deliverToId = data.deliverToVu ? 'VUBIQUITY' : currentService.deteTasks.deteDeliveries.externalDelivery.deliverToId;
            currentService.status = data.operationalStatus;

            setServices({...services, [`${providerServices}`]: updatedServices});

            // TODO: This change needs to be propogated up to the Fulfillment Order form to submit
        }
    };

    const addEmptyServicesRow = () => {
        const updatedTableData = cloneDeep(tableData);
        updatedTableData.push(ADD_EMPTY_SERVICE_ROW);
        setTableData(updatedTableData);

        // TODO: What does a new service look like schema-wise when added? There are 24
        // properties in a service and we're only editing 6. What are the defaults for the other values?

        // TODO: This change needs to be propogated up to the Fulfillment Order form to submit
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
    const barcode = services.barcode || null;

    const valueGetter = (params) => {
        return get(params.data, params.colDef.dataSource || params.colDef.field, '');
    };

    return (
        <div className="nexus-c-services-table">
            <div className="nexus-c-services-table__header">
                <h3 className="nexus-c-services-table__title">{`${constants.SERVICES_TITLE} (${servicesCount})`}</h3>
                <div className="nexus-c-services-table__subtitle">{constants.SERVICES_BARCODE}: {barcode}</div>
                <div className="nexus-c-services-table__add-icon">
                    { !isDisabled && <Add onClick={addEmptyServicesRow} /> }
                </div>
            </div>
            <ServicesTableGrid
                defaultColDef={
                    {valueGetter}
                }
                columnDefs={[
                    orderingColumn,
                    closeButtonColumn,
                    // TODO: Add custom checkbox column
                    // TODO: Add custom datepicker column?
                    ...columnDefinitions
                ]}
                rowData={tableData}
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
