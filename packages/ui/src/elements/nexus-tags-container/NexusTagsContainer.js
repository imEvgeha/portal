import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import NexusEditableTag from '../nexus-editable-tag/NexusEditableTag';

const NexusTagsContainer = ({data, saveData, removeItems, isEdit}) => {
    const [dataset, setDataSet] = useState(data || []);

    const removeItem = value => {
        const newArray = dataset.filter(item => item !== value);
        setDataSet(newArray);
        typeof saveData === 'function' && saveData(newArray);
        typeof removeItems === 'function' && removeItems(value);
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
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
            {dataset.map((item, index) => (
                <NexusEditableTag
                    text={item}
                    key={item}
                    index={index}
                    inputWidth="350px"
                    remove={() => removeItem(item)}
                    save={saveItem}
                    isEdit={isEdit}
                />
            ))}
        </div>
    );
};

NexusTagsContainer.propTypes = {
    data: PropTypes.array.isRequired,
    saveData: PropTypes.func,
    removeItems: PropTypes.func,
    isEdit: PropTypes.bool,
};

NexusTagsContainer.defaultProps = {
    saveData: () => null,
    removeItems: () => null,
    isEdit: false,
};

export default NexusTagsContainer;
