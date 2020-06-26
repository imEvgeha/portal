import Button from '@atlaskit/button';
import Select from '@atlaskit/select';
import React, {useEffect, useState, useContext} from 'react';
import ServicingOrdersTable from './components/servicing-orders-table/ServicingOrdersTable';
import {CUSTOMER_LBL, HIDE_COMPLETED_BTN, HIDE_READY_BTN, SERVICING_ORDERS_TTL} from './constants';
import {downloadFile} from '../../util/Common';
import {readinessStatus} from './constants';
import './ServicingOrdersView.scss';
import {exportServicingOrders} from './servicingOrdersService';
import { NexusModalContext } from '../../ui/elements/nexus-modal/NexusModal';

const ServicingOrdersView = () => {
    const [selectedServicingOrders, setSelectedServicingOrders] = useState([]);
    const [isHideReady, setIsHideReady] = useState(false);
    const [isHideCompleted, setIsHideCompleted] = useState(false);
    const NO_CUSTOMER_FILTER = {label: 'Select...', value: ''};
    const [customerFilter, setCustomerFilter] = useState(NO_CUSTOMER_FILTER);
    const [fixedFilter, setFixedFilter] = useState({});
    const [externalFilter, setExternalFilter] = useState({});
    const [isExporting, setIsExporting] = useState(false);
    const ModalContent = (
        <>
            <p>
                One or more of the selected orders has a readiness status of ON HOLD and was previously exported.
            </p>
            <p>Do you wish to continue?</p>
        </>
    );
    const modalHeading = 'Warning';
    const modalStyle = {
        width: 'small'
    };
    const {setModalContentAndTitle, setModalActions, setModalStyle, close} = useContext(NexusModalContext);

    useEffect(
        () => {
            setFixedFilter({
                status: isHideCompleted ? ['NOT_STARTED', 'IN_PROGRESS', 'CANCELLED', 'FAILED'] : undefined,
                readiness: isHideReady ? [readinessStatus.NEW, readinessStatus.ON_HOLD] : undefined
            });
        },
        [isHideReady, isHideCompleted]
    );

    useEffect(
        () => {
            setExternalFilter({
                ...(customerFilter && customerFilter.value && {tenant: customerFilter.value})
            });
        },
        [customerFilter]
    );

    /**
     * Handle export button onClick
     */
    const handleExportRequest = () => {
        // Show warning modal if selected export contains a readiness of ON HOLD
        selectedServicingOrders.filter(so => (
            so.readiness === readinessStatus.ON_HOLD
        )).length ? openWarningModal() : exportSelectedServicingOrders();
    };

    /**
     * Download selected servicing orders as .csv file
     */
    const exportSelectedServicingOrders = () => {
        setIsExporting(true);
        exportServicingOrders(selectedServicingOrders.map(so => (so.so_number)))
            .then(response => {
                downloadFile(response, 'SOM_FulfillmentOrders_', '.csv', false);
                setIsExporting(false);
            }
        );
    };

    /**
     * Open global modal with config
     */
    const openWarningModal = () => {
        setModalContentAndTitle(ModalContent, modalHeading);
        setModalStyle(modalStyle);
        setModalActions([
            {
                text: 'Continue',
                onClick: () => {
                    close();
                    exportSelectedServicingOrders();
                }
            },
            {
                text: 'Cancel',
                onClick: () => {
                    close();
                }
            }
        ]);
    };

    return (
        <div className="nexus-c-servicing-orders">
            <span className="nexus-c-servicing-orders__title">{SERVICING_ORDERS_TTL}</span>

            <div className="nexus-c-servicing-orders__external-filters">
                <div className="nexus-c-servicing-orders__customer-filter">
                    <label htmlFor="customer">{CUSTOMER_LBL}</label>
                    <Select
                        name="customer"
                        options={[NO_CUSTOMER_FILTER, {label: 'MGM', value: 'MGM'}, {label: 'WB', value: 'WB'}]}
                        className="nexus-c-servicing-orders__customer-filter--select"
                        placeholder={NO_CUSTOMER_FILTER.label}
                        value={customerFilter}
                        onChange={setCustomerFilter}
                    />
                </div>
                <Button isSelected={isHideReady} onClick={() => setIsHideReady(!isHideReady)}>
                    {HIDE_READY_BTN}
                </Button>
                <Button isSelected={isHideCompleted} onClick={() => setIsHideCompleted(!isHideCompleted)}>
                    {HIDE_COMPLETED_BTN}
                </Button>
                <Button
                    isDisabled={!selectedServicingOrders.length}
                    onClick={() => handleExportRequest()}
                    isLoading={isExporting}
                >
                    Export
                </Button>
            </div>
            <ServicingOrdersTable
                fixedFilter={fixedFilter}
                externalFilter={externalFilter}
                setSelectedServicingOrders={setSelectedServicingOrders}
            />
        </div>
    );
};

export default ServicingOrdersView;
