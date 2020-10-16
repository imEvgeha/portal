import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Button, {ButtonGroup} from '@atlaskit/button';
import CheckIcon from '@atlaskit/icon/glyph/check';
import EditorRemoveIcon from '@atlaskit/icon/glyph/editor/remove';
import Page, {Grid, GridColumn} from '@atlaskit/page';
import Select from '@atlaskit/select/dist/cjs/Select';
import Tag from '@atlaskit/tag';
import Textfield from '@atlaskit/textfield';
import {cloneDeep, get, isEmpty, set, isEqual} from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import './ComponentsPicker.scss';

// eslint-disable-next-line react/prop-types
const Header = ({heading, title, barcode}) => {
    return (
        <div className="picker__header">
            <h1>{heading}</h1>
            <h2>{title}</h2>
            <p>{barcode}</p>
        </div>
    );
};

// eslint-disable-next-line react/prop-types
const Footer = ({warning, onCancel, onSave}) => {
    return (
        <div className="picker__footer">
            <p>{warning}</p>
            <Button onClick={onCancel}>cancel</Button>
            <Button appearance="primary" onClick={onSave}>
                save
            </Button>
        </div>
    );
};

// eslint-disable-next-line react/prop-types
const ListItem = ({item}) => {
    return (
        <div>
            <CheckIcon />
            <Tag text={item} />
            <EditorRemoveIcon />
        </div>
    );
};

// eslint-disable-next-line react/prop-types
const SummaryPanel = ({list = []}) => {
    return (
        <div className="picker__summary-panel">
            {list.map(item => (
                <ListItem item={item} />
            ))}
        </div>
    );
};

export const ComponentsPicker = () => {
    return (
        <Page>
            <div style={{width: '85%'}}>
                <GridColumn>
                    <div className="fulfillment-order">
                        <div className="fulfillment-order__row fulfillment-order__header">
                            <div className="fulfillment-order__title">
                                <div className="fulfillment-order__title--text">Fulfillment Order</div>
                                <div>Order ID: {get(fulfillmentOrder, fieldKeys.ID, '')}</div>
                            </div>
                            <div className="fulfillment-order__save-buttons">
                                <ButtonGroup>
                                    <Button
                                        onClick={onCancel}
                                        isDisabled={isSaveDisabled || isSaving || isFormDisabled}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={onSaveHandler}
                                        appearance="primary"
                                        isDisabled={isSaveDisabled || isFormDisabled}
                                        isLoading={isSaving}
                                    >
                                        Save
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </div>
                        <Grid>
                            <GridColumn medium={6}>
                                <label htmlFor="notes">Notes:</label>
                                <NexusTextArea
                                    name="notes"
                                    onTextChange={e => onFieldChange(fieldKeys.NOTES, e.target.value)}
                                    notesValue={get(fulfillmentOrder, fieldKeys.NOTES, '') || ''}
                                    isDisabled={isFormDisabled}
                                />
                            </GridColumn>
                            <GridColumn medium={2}>
                                <label htmlFor="servicer">Servicer</label>
                                <Textfield
                                    name="servicer"
                                    value={get(fulfillmentOrder, fieldKeys.SERVICER, '')}
                                    isDisabled={true}
                                />
                            </GridColumn>

                            <GridColumn medium={2}>
                                <div className="fulfillment-order__input">
                                    <label htmlFor="fulfillment-status">Fulfillment Status</label>
                                    <Textfield
                                        name="fulfillment-status"
                                        value={Constants.STATUS[get(fulfillmentOrder, fieldKeys.STATUS, '')] || ''}
                                        isDisabled={true}
                                    />
                                </div>
                                <div className="fulfillment-order__input">
                                    <NexusDatePicker
                                        id="dueDate"
                                        label="Start Date"
                                        value={getValidDate(get(fulfillmentOrder, fieldKeys.START_DATE, ''))}
                                        onChange={val => onFieldChange(fieldKeys.START_DATE, val)}
                                        isReturningTime={false}
                                        isDisabled={true}
                                    />
                                </div>
                            </GridColumn>

                            <GridColumn medium={2}>
                                <div className="fulfillment-order__input">
                                    <label htmlFor="readiness-status">Readiness Status</label>
                                    <Select
                                        id="readiness-status"
                                        name="readiness-status"
                                        className="fulfillment-order__readiness-status"
                                        options={Constants.READINESS_STATUS}
                                        value={{
                                            value: get(fulfillmentOrder, fieldKeys.READINESS, ''),
                                            label: readinessOption && readinessOption.label,
                                        }}
                                        onChange={val => onFieldChange(fieldKeys.READINESS, val.value)}
                                        isDisabled={isFormDisabled}
                                    />
                                </div>
                                <div className="fulfillment-order__input">
                                    <NexusDatePicker
                                        id="dueDate"
                                        label="Due Date"
                                        value={getValidDate(get(fulfillmentOrder, fieldKeys.DUE_DATE, ''))}
                                        onChange={val => onFieldChange(fieldKeys.DUE_DATE, val)}
                                        isReturningTime={false}
                                        isDisabled={true}
                                    />
                                </div>
                            </GridColumn>
                        </Grid>
                        <hr />
                        {children}
                    </div>
                </GridColumn>
            </div>
        </Page>
    );
};

FulfillmentOrder.propTypes = {
    selectedFulfillmentOrder: PropTypes.object,
    setSelectedOrder: PropTypes.func,
    setSelectedFulfillmentOrderID: PropTypes.func,
    fetchFulfillmentOrders: PropTypes.func,
    serviceOrder: PropTypes.object,
    updatedServices: PropTypes.object,
    children: PropTypes.any,
    cancelEditing: PropTypes.func,
    lastOrder: PropTypes.object.isRequired,
};

FulfillmentOrder.defaultProps = {
    selectedFulfillmentOrder: {},
    setSelectedOrder: () => null,
    setSelectedFulfillmentOrderID: () => null,
    fetchFulfillmentOrders: () => null,
    serviceOrder: null,
    updatedServices: () => null,
    children: null,
    cancelEditing: () => null,
};

export default FulfillmentOrder;
