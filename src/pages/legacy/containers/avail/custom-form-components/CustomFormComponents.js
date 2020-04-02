import styled from 'styled-components';

const CustomFieldAddText = styled.div`
    color: #999;
    font-style: italic;
    cursor: pointer;
    user-select: none;
    font-weight: bold;
    float: left;
`;

const AddButton = styled.div`
    float: right;
    font-weight: bold;
    background: #DDD;
    cursor: pointer;
    padding: 5px;
    border-radius: 3px;
    width: 40px;
    text-align: center;
    &:hover {
        background: #EEE;
    }
`;

export {
    CustomFieldAddText,
    AddButton
};
