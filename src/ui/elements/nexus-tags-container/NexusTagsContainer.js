import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import NexusEditableTag from '../nexus-editable-tag/NexusEditableTag';

const NexusTagsContainer = ({data, saveData}) => {
    const [dataset, setDataSet] = useState(data || []);

    const removeItem = value => {
        const newArray = dataset.filter(item => item !== value);
        setDataSet(newArray);
        saveData(newArray);
    };

    const saveItem = (index, value) => {
        const newArray = [...dataset];
        newArray[index] = value;
        setDataSet(newArray);
        saveData(newArray);
    };

    useEffect(() => {
        setDataSet(data);
    }, [data]);

    return (
        <div style={{border: '1px solid lightgrey', padding: '8px', borderRadius: '5px', minHeight: '38px'}}>
            {dataset.map((item, index) => (
                <NexusEditableTag
                    text={item}
                    key={item}
                    index={index}
                    inputWidth="350px"
                    remove={() => removeItem(item)}
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
