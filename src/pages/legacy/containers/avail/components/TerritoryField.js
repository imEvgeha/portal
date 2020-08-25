import React from 'react';
import PropTypes from 'prop-types';
import {NexusTag} from '../../../../../ui/elements/';
import {uid} from 'react-uid';
import {CustomFieldAddText} from '../custom-form-components/CustomFormComponents';
import {TERRITORY_REMOVE_CONFIRMATION_MESSAGE, TERRITORY_REMOVE_CONFIRMATION_SUB_MESSAGE} from './constants';
import './TerritoryField.scss';

const REMOVE_TERRITORY_CONFIRMATION_CONTENT = (
    <>
        <div>{TERRITORY_REMOVE_CONFIRMATION_MESSAGE}</div>
        <div>{TERRITORY_REMOVE_CONFIRMATION_SUB_MESSAGE}</div>
    </>
);

const TerritoryField = ({
    name,
    territory,
    onRemoveClick,
    onAddClick,
    onTagClick,
    renderChildren,
    mappingErrorMessage,
    isTableMode = false,
}) => {
    const getTerritories = () => {
        return territory.map((terr, i) => (
            <NexusTag
                key={uid(terr)}
                text={terr.country}
                value={terr}
                removeButtonText="Remove"
                onRemove={() => onRemoveClick(terr)}
                onClick={() => onTagClick(i)}
                confirmationContent={REMOVE_TERRITORY_CONFIRMATION_CONTENT}
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
        <div className='nexus-c-territory-field'>
            {isTableMode && getAddButton()}
            {territory && territory.length > 0 ? getTerritories() : !isTableMode && getAddButton()}
            {renderChildren()}
            <br />
            {mappingErrorMessage[name] && mappingErrorMessage[name].text && (
            <small className="text-danger m-2">
                {mappingErrorMessage[name] && mappingErrorMessage[name].text || ''}
            </small>
          )}
        </div>
    );
};

TerritoryField.propTypes = {
    territory: PropTypes.array,
    name: PropTypes.string.isRequired,
    onAddClick: PropTypes.func.isRequired,
    onRemoveClick: PropTypes.func.isRequired,
    onTagClick: PropTypes.func,
    mappingErrorMessage: PropTypes.object,
    renderChildren: PropTypes.func,
    isTableMode: PropTypes.bool
};

TerritoryField.defaultProps = {
    territory: [],
    renderChildren: () => null,
    onTagClick: () => null,
    mappingErrorMessage: {},
    isTableMode: false
};

export default TerritoryField;
