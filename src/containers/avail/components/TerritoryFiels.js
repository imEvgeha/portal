import React from 'react';
import PropTypes from 'prop-types';
import NexusTag from '../../../ui-elements/nexus-tag/NexusTag';
import {uid} from 'react-uid';
import {AddButton, CustomFieldAddText} from '../custom-form-components/CustomFormComponents';
import './TerritoryField.scss';

function TerritoryField({name, territory, onRemoveClick, onAddClick, onPlusClick, onTagClick, renderChildren, mappingErrorMessage}) {

    const remove = (terr) => {
        console.log('remove', terr);
        onRemoveClick(terr);
    }

    return (
        <div className='nexus-territory-field'>
            {territory && territory.length > 0
                ? (
                    territory.map((terr, i) => (
                        <NexusTag
                            key={uid(terr)}
                            text={terr.country}
                            value={terr}
                            removeButtonText='Remove'
                            onRemove={() => remove(terr)}
                            onClick={() => onTagClick(i)}
                        />
                    ))
                )
                : (
                    <CustomFieldAddText
                        onClick={onAddClick}
                        id={'right-create-' + name + '-button'}
                    >
                        Add...
                    </CustomFieldAddText>
                )
            }
            <div style={{position: 'absolute', right: '10px'}}>
                <AddButton onClick={onPlusClick}>+</AddButton>
            </div>
            {renderChildren()}
            <br/>
            {mappingErrorMessage[name] && mappingErrorMessage[name].text &&
            <small className="text-danger m-2">
                {mappingErrorMessage[name] ? mappingErrorMessage[name].text ? mappingErrorMessage[name].text : '' : ''}
            </small>
            }
        </div>
    );
}

const defaultFunction = () => {};

TerritoryField.defaultProps = {
    territory: [],
    renderChildren: defaultFunction,
    onTagClick: defaultFunction,
    mappingErrorMessage: {}
};

TerritoryField.propTypes = {
    territory: PropTypes.array,
    name: PropTypes.string.isRequired,
    onAddClick: PropTypes.func.isRequired,
    onRemoveClick: PropTypes.func.isRequired,
    onPlusClick: PropTypes.func.isRequired,
    onTagClick: PropTypes.func,
    mappingErrorMessage: PropTypes.object,
    renderChildren: PropTypes.func,
};

export default TerritoryField;