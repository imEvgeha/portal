import React, {useState} from "react";
import NexusEditableTag from "../../../../../../../ui/elements/nexus-editable-tag/NexusEditableTag";

const getData = array => {
    let myData = [];
    array.forEach((item, index) => {
        myData.push({ id: index, value: item });
    });
    return myData;
};
const putData = array => {
    let newData = [];
    array.forEach(item => {
        newData.push(item.value);
    });
    return newData;
}
const MSVEditComponent = ({data, saveData}) => {
    const [dataset, setDataSet]=  useState(getData(data));

    const removeItem = value => {
        let newArray = dataset.filter(item => item.value !== value);
        setDataSet(newArray);
        saveData(putData(newArray));
    };

    const saveItem = (id, value) => {
        let newArray = [...dataset];
        let index = newArray.findIndex(item => item.id === id );
        newArray[index] ? newArray[index] = { id, value} : null;
        setDataSet(newArray);
        saveData(putData(newArray));
        //console.log('new Array to be saved: ', putData(newArray));
    }

    return (
        <div style={{ border: "1px solid lightgrey", padding: "10px", borderRadius: '5px' }}>
            {dataset.map(item => (
                <NexusEditableTag
                    text={item.value}
                    key={item.value}
                    id={item.id}
                    inputWidth='350px'
                    remove={() => removeItem(item.value)}
                    save={saveItem}
                />
            ))}
        </div>
    );
};

export default MSVEditComponent;