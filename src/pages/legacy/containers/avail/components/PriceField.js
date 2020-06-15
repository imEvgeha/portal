import React from 'react';
import PropTypes from 'prop-types';
import {NexusTag} from '../../../../../ui/elements/';
import {uid} from 'react-uid';
import {CustomFieldAddText} from '../custom-form-components/CustomFormComponents';
import './PriceField.scss';
import {get} from 'lodash';

const PriceField = ({name, prices, onRemoveClick, onAddClick, renderChildren, mappingErrorMessage, isTableMode = false}) => {
    const getPrices = () => {
        return prices.map((price, i) => (
            <NexusTag
                key={uid(price)}
                text={`${price.priceType}`}
                value={price}
                removeButtonText='Remove'
                onRemove={() => onRemoveClick(price)}
            />
        ));
    };

    const getAddButton = () => {
        return (
            <CustomFieldAddText
                onClick={onAddClick}
                id={'right-create-' + name + '-button'}
            >
                Add...
            </CustomFieldAddText>
        );
    };

    return (
        <div className='nexus-c-price-field'>
            {isTableMode && getAddButton()}
            {prices && prices.length > 0 ? getPrices() : !isTableMode && getAddButton()}
            {renderChildren()}
            <br />
            {mappingErrorMessage[name] && mappingErrorMessage[name].text && (
                <small className="text-danger m-2">
                    {get(mappingErrorMessage, [name, 'text'], '')}
                </small>
            )}
        </div>
    );
};

PriceField.propTypes = {
    prices: PropTypes.array,
    name: PropTypes.string.isRequired,
    onAddClick: PropTypes.func.isRequired,
    onRemoveClick: PropTypes.func.isRequired,
    mappingErrorMessage: PropTypes.object,
    renderChildren: PropTypes.func,
    isTableMode: PropTypes.bool
};

PriceField.defaultProps = {
    prices: [],
    renderChildren: () => null,
    mappingErrorMessage: {},
    isTableMode: false
};

export default PriceField;
