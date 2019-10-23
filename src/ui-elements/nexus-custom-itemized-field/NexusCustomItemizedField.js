// eslint-disable-next-line no-unused-vars
import React, {useState, useContext, useEffect, Fragment} from 'react';
import PropTypes from 'prop-types';
import Button from '@atlaskit/button';
import AddIcon from '@atlaskit/icon/glyph/add';
import {renderer} from 'react-forms-processor-atlaskit';
import {cache} from '../../containers/config/EndpointContainer';
import './NexusCustomItemizedField.scss';
import {NexusModalContext} from '../nexus-modal/NexusModal';
import {
    RemovableButton,
    TerritoryTag,
} from '../../containers/avail/custom-form-components/CustomFormComponents';
import {Form} from 'react-forms-processor';
// import {renderer} from '../../containers/config/CreateEditConfigForm';
import {getConfigApiValues} from '../../common/CommonConfigService';

const PLACEHOLDER = 'Add...';

const NexusCustomItemizedField = ({
    schema,
    existingItems,
    onSubmit,
}) => {
    const [items, setItems] = useState(existingItems);
    const {setModalContent, setModalActions, close}= useContext(NexusModalContext);
    const [test, setTest] = useState({tbr: 'br'});

    useEffect(() => setItems(existingItems), [existingItems]);

    const addItem = (test) => {
        const content = (
            <>
                <Form
                    renderer={renderer}
                    // optionsHandler={optionsHandler}
                    defaultFields={schema}
                    onRemoveItem={() => {}}
                    displayName={'Test'}
                    value={test}
                    onSubmit={submitChanges}
                    onChange={(item) => {console.log(item); setTest(item);}}
                />
            </>
    );
        setModalActions([{text: 'Cancel', onClick: close}, {text: 'Submit', onClick: submitChanges}]);
        setModalContent(content);
    };

    // Filters out the item at given index
    const getFilteredItems = (arr = [], index) => arr.filter((element, i) => i !== index);

    const submitChanges = (item) => {
        const combinedItems = [...items, test];
        console.warn(combinedItems);
        onSubmit(combinedItems);

        setItems(combinedItems);
        close();
    };

    return (
        <div className="nexus-c-nexus-custom-itemized-field">
            <div className="nexus-c-nexus-custom-itemized-field__content">
                <div className="nexus-c-nexus-custom-itemized-field__clickable-text" onClick={() => addItem(test)}>
                    {!items.length &&
                        PLACEHOLDER
                    }
                </div>
                {items.map((item, index) => (
                    // TODO: Refactor using AtlasKit
                    <TerritoryTag isCreate key={index}>
                        {item.country}
                        <RemovableButton onClick={() => setItems(getFilteredItems(items, index))}>
                            x
                        </RemovableButton>
                    </TerritoryTag>
                ))}
            </div>
            <div className="nexus-c-nexus-custom-itemized-field__controls">
                <Button onClick={addItem} className="button-fix">
                    <AddIcon />
                </Button>
            </div>
        </div>
    );
};

NexusCustomItemizedField.propTypes = {
    existingItems: PropTypes.arrayOf(PropTypes.object),
    onSubmit: PropTypes.func.isRequired,
    schema: PropTypes.arrayOf(PropTypes.object).isRequired,
};

NexusCustomItemizedField.defaultProps = {
    existingItems: [],
};

export default NexusCustomItemizedField;
