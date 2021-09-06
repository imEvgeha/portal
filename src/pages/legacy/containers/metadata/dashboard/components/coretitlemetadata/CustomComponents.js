import styled, {css} from 'styled-components';
import {Row, Col} from 'reactstrap';
import FontAwesome from 'react-fontawesome';

const PersonListFlag = styled.div`
    box-sizing: border-box;
    display: inline-block;
    padding: 7px;
    vertical-align: middle;
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

export {PersonListFlag, DraggableContent};
