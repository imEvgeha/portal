import styled, {css} from 'styled-components';
import {Row, Col} from 'reactstrap';
import FontAwesome from 'react-fontawesome';

const PersonListFlag = styled.div`
    box-sizing: border-box;
    display: inline-block;
    padding: 7px;
    vertical-align: middle;
`;

const ListText = styled.div`
    display: flex;
    align-items: center;
    margin-left: ${props => (props.showPersonType ? '10px' : 0)};
`;

const CustomRow = styled(Row)`
    border: 1px solid #ddd;
    padding: 10px;
`;

const CustomColumn = styled(Col)`
    display: flex;
    align-items: center;
`;

const CustomEllipsis = styled.div`
    white-space: nowrap;
    overflow: hidden;
    display: flex;
    align-items: center;
    text-overflow: ellipsis;
    ${props =>
        props.isInline &&
        css`
            display: inline-block;
        `};
`;

const CustomInput = styled.input`
    padding: 5px;
    border: ${props => (props.isError ? '2px solid #e74c3c' : '2px solid #DFE1E6;')};
    color: ${props => (props.isError ? '#e74c3c' : '#111;')};
    ${props =>
        props.readOnly &&
        css`
            margin-bottom: 10px;
        `};
    border-radius: 3px;
    outline: none;
    width: 100%;
    font-size: 14px;
    &:hover {
        background: #ebecf0;
    }
`;

const CustomLabel = styled.div`
    font-weight: bold;
    font-size: 14px;
    margin-bottom: 5px;
    color: ${props => (props.isError ? '#DE350B' : '#666')};
`;

const DraggableContent = styled.div`
    border: ${props => (props.isDragging ? '2px dotted #111' : '1px solid #DDD')};
    padding: 5px;
    background-color: #fafbfc;
    width: 97%;
    margin: auto;
    opacity: ${props => (props.isDragging ? '1' : '0.8')};
    &:hover {
        background-color: #eee;
    }
`;

const DroppableContent = styled.div`
    background-color: ${props => (props.isDragging ? '#bdc3c7' : '')};
    width: 97%;
    border: ${props => (props.isDragging ? '2px dotted #111' : '')};
`;

const ListContainer = styled.div`
    display: flex;
    align-items: center;
    border: 1px solid green;
    justify-content: space-between;
`;

const CustomAddButton = styled.span`
    font-weight: bold;
    font-size: 15px;
    color: #999;
    width: 40px;
    font-style: italic;
    cursor: pointer;
`;

const ListItemText = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    ${props =>
        props.isEditMode &&
        css`
            cursor: pointer;
            &:hover {
                color: #2ecc71;
            }
        `};
`;

const CustomDeleteButton = styled(FontAwesome)`
    margin-right: 5px;
    cursor: pointer;
    position: absolute;
    right: 45px;
    &:hover {
        color: #e74c3c;
    }
`;

const CustomDragButton = styled(FontAwesome)`
    margin-left: 5px;
    cursor: move;
    position: absolute;
    right: 25px;
    &:hover {
        color: #3498db;
    }
`;

export {
    PersonListFlag,
    ListText,
    CustomRow,
    CustomColumn,
    CustomEllipsis,
    CustomInput,
    CustomLabel,
    DraggableContent,
    DroppableContent,
    ListContainer,
    CustomAddButton,
    ListItemText,
    CustomDeleteButton,
    CustomDragButton,
};
