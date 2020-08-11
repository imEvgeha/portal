import React from 'react';
import PropTypes from 'prop-types';
import {get} from 'lodash';
import {NexusTag} from '../../../../../ui/elements/';
import {uid} from 'react-uid';
import {CustomFieldAddText} from '../custom-form-components/CustomFormComponents';
import './PriceField.scss';

const PriceField = ({
    name,
    prices,
    onRemoveClick,
    onTagClick,
    onAddClick,
    renderChildren,
    mappingErrorMessage,
    isTableMode = false,
}) => {
    const getPrices = () => {
        return prices.map((price, i) => {
            const {priceValue: value = '', priceType: type = '', priceCurrency: currency = ''} = price || {};

            return (
                <NexusTag
                    key={uid(price)}
                    text={`${type} ${value || ''} ${currency || ''}`}
                    value={price}
                    removeButtonText="Remove"
                    onRemove={() => onRemoveClick(i)}
                    onClick={() => onTagClick(i)}
                />
            );
        });
    };

    const getAddButton = () => {
        return (
            <CustomFieldAddText onClick={onAddClick} id={'right-create-' + name + '-button'}>
                Add...
            </CustomFieldAddText>
        );
    };

    return (
        <div className="nexus-c-price-field">
            {isTableMode && getAddButton()}
            {prices && prices.length > 0 ? getPrices() : !isTableMode && getAddButton()}
            {renderChildren()}
            <br />
            {mappingErrorMessage[name] && mappingErrorMessage[name].text && (
                <small className="text-danger m-2">{get(mappingErrorMessage, [name, 'text'], '')}</small>
            )}
        </div>
    );
};

PriceField.propTypes = {
    prices: PropTypes.array,
    name: PropTypes.string.isRequired,
    onAddClick: PropTypes.func.isRequired,
    onRemoveClick: PropTypes.func.isRequired,
    onTagClick: PropTypes.func,
    mappingErrorMessage: PropTypes.object,
    renderChildren: PropTypes.func,
    isTableMode: PropTypes.bool,
};

PriceField.defaultProps = {
    prices: [],
    renderChildren: () => null,
    mappingErrorMessage: {},
    onTagClick: () => null,
    isTableMode: false,
};

export default PriceField;
