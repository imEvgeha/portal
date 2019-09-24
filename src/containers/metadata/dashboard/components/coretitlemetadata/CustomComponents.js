import styled, { css } from 'styled-components';
import { Row, Col } from 'reactstrap';

const PersonListFlag = styled.div`
    box-sizing: border-box;
    display: inline-block;
    padding: 7px;
    vertical-align: middle;
`;

const ListText = styled.div`
    display: flex;
    align-items: center;
    margin-left: ${props => props.showPersonType ? '10px' : 0};
`;

const CustomRow = styled(Row)`
    border: 1px solid #DDD;
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
    ${props => props.isInline && css`
        display: inline-block;
    `};
`;

const CustomInput = styled.input`
    padding: 7px;
    border: 1px solid #DDD;
    border-radius: 3px;
    outline: none;
    width: 100%;    
    margin-bottom: 10px;
`;

const CustomLabel = styled.div`
    font-weight: bold;
    font-size: 16px;
    color: #666;
`;

const DraggableContent = styled.div`
    border:${props => props.isDragging ? '2px dotted #111' : '1px solid #DDD'};
    padding: 5px;
    background-color: #FAFBFC;
    width: 97%;
    margin: auto;
    opacity: ${props => props.isDragging ? '1' : '0.8'};
    &:hover {
        background-color: #EEE;
    }
`; 

const DroppableContent = styled.div`
    background-color: ${props => props.isDragging ? '#bdc3c7' : ''};
    width: 97%;
    border:${props => props.isDragging ? '2px dotted #111' : ''};
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
    width: 40%;
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
    ListItemText
}