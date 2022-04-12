import React, {useEffect, useState, useContext} from 'react';
import Button, {LoadingButton} from '@atlaskit/button';
import Select from '@atlaskit/select';
import {NexusModalContext} from '@vubiquity-nexus/portal-ui/lib/elements/nexus-modal/NexusModal';
import {downloadFile} from '@vubiquity-nexus/portal-utils/lib/Common';
import './ServicingOrdersView.scss';
import ServicingOrdersTable from './components/servicing-orders-table/ServicingOrdersTable';
import {exportServicingOrders} from './servicingOrdersService';
import {
    CUSTOMER_LBL,
    HIDE_COMPLETED_BTN,
    HIDE_READY_BTN,
    SERVICING_ORDERS_TTL,
    EXPORT_WARNING_MESSAGE,
    readinessStatus,
} from './constants';

const ServicingOrdersView = () => {
    const [selectedServicingOrders, setSelectedServicingOrders] = useState([]);
    const [isHideReady, setIsHideReady] = useState(false);
    const [isHideCompleted, setIsHideCompleted] = useState(false);
    const NO_CUSTOMER_FILTER = {label: 'Select...', value: ''};
    const [customerFilter, setCustomerFilter] = useState(NO_CUSTOMER_FILTER);
    const [fixedFilter, setFixedFilter] = useState({});
    const [externalFilter, setExternalFilter] = useState({});
    const [isExporting, setIsExporting] = useState(false);
    const [isRefreshData, setIsRefreshData] = useState(false);
    const ModalContent = (
        <>
            <p>{EXPORT_WARNING_MESSAGE}</p>
            <p>Do you wish to continue?</p>
        </>
    );
    const modalHeading = 'Warning';
    const {openModal, closeModal} = useContext(NexusModalContext);

    useEffect(() => {
        setFixedFilter({
            status: isHideCompleted ? ['NOT_STARTED', 'IN_PROGRESS', 'CANCELLED', 'FAILED'] : undefined,
            readiness: isHideReady ? [readinessStatus.NEW, readinessStatus.ON_HOLD] : undefined,
        });
    }, [isHideReady, isHideCompleted]);

    useEffect(() => {
        setExternalFilter({
            ...(customerFilter && customerFilter.value && {tenant: customerFilter.value}),
        });
    }, [customerFilter]);

    /**
     * Handle export button onClick
     */
    const handleExportRequest = () => {
        // Show warning modal if selected export contains a readiness of ON HOLD
        selectedServicingOrders.filter(so => so.readiness === readinessStatus.ON_HOLD).length
            ? openWarningModal()
            : exportSelectedServicingOrders();
    };

    /**
     * Download selected servicing orders as .csv file
     */
    const exportSelectedServicingOrders = async () => {
        setIsExporting(true);
        try {
            const response = await exportServicingOrders(selectedServicingOrders.map(so => so.so_number));
            downloadFile(response, 'SOM_FulfillmentOrders_', '.csv', false);
            setIsExporting(false);
        } catch (err) {
            setIsExporting(false);
        }
    };

    /**
     * Open global modal with config
     */
    const openWarningModal = () => {
        const actions = [
            {
                text: 'Continue',
                onClick: () => {
                    exportSelectedServicingOrders();
                    closeModal();
                },
            },
            {
                text: 'Cancel',
                onClick: closeModal,
            },
        ];
        openModal(ModalContent, {title: modalHeading, width: 'small', actions});
    };

    /**
     * After refreshing data, set to false
     */
    const handleDataRefreshComplete = () => {
        setIsRefreshData(false);
    };

    const options = [NO_CUSTOMER_FILTER, {label: 'MGM', value: 'MGM'}, {label: 'WB', value: 'WB'}];

    return (
        <div className="nexus-c-servicing-orders">
            <h1>{SERVICING_ORDERS_TTL}</h1>

            <div className="nexus-c-servicing-orders__external-filters">
                <div className="nexus-c-servicing-orders__customer-filter">
                    <label htmlFor="customer">{CUSTOMER_LBL}</label>
                    <Select
                        name="customer"
                        options={options}
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
                <LoadingButton
                    isDisabled={!selectedServicingOrders.length}
                    onClick={handleExportRequest}
                    isLoading={isExporting}
                >
                    Export
                </LoadingButton>
            </div>
            <ServicingOrdersTable
                fixedFilter={fixedFilter}
                externalFilter={externalFilter}
                setSelectedServicingOrders={setSelectedServicingOrders}
                isRefreshData={isRefreshData}
                dataRefreshComplete={handleDataRefreshComplete}
            />
        </div>
    );
};

export default ServicingOrdersView;
