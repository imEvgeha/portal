import React, {useState} from 'react';
import PropTypes from 'prop-types';
import NexusEditableTag from '../nexus-editable-tag/NexusEditableTag';

const NexusTagsContainer = ({data, saveData}) => {
    const [dataset, setDataSet]=  useState(data);

    const removeItem = value => {
        let newArray = dataset.filter(item => item !== value);
        setDataSet(newArray);
        saveData(newArray);
    };

    const saveItem = (index, value) => {
        let newArray = [...data];
        newArray[index] = value;
        setDataSet(newArray);
        saveData(newArray);
    };

    return (
        <div style={{ border: '1px solid lightgrey', padding: '10px', borderRadius: '5px' }}>
            {dataset.map((item, index) => (
                <NexusEditableTag
                    text={item}
                    key={item}
                    index={index}
                    inputWidth='350px'
                    remove={()=>removeItem(item)}
                    save={saveItem}
                />
            ))}
        </div>
    );
};

NexusTagsContainer.propTypes = {
    data: PropTypes.array.isRequired,
    saveData: PropTypes.func.isRequired,
};

export default NexusTagsContainer;