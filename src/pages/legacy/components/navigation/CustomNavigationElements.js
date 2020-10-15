import styled from 'styled-components';

export const SideMenu = styled.div`
    width: 15%;
    background-color: ${props => (props.primary ? '#F1F6F7' : 'white')};
    float: left;
    height: calc(100vh - 90px);
    padding: 15px;
    overflow-y: ${props => (props.isScrollable ? 'scroll' : 'none')};
`;

export const TextHeader = styled.span`
    border-bottom: 1px solid #ddd;
    display: block;
    width: 95%;
    font-size: 22px;
    font-weight: bold;
    margin: auto;
    color: #273568;
    margin-top: 10px;
    padding-bottom: 10px;
    padding-left: 15px;
`;

export const GroupHeader = styled.div`
    font-size: 12px;
    font-weight: bold;
    color: #666;
    text-transform: uppercase;
    margin-top: 40px;
    padding-left: 10px;
`;

export const ListParent = styled.ul`
    padding: 0;
    margin: 0;
    padding-left: 10px;
`;

export const ListElement = styled.li`
    padding: 10px;
    border-radius: 3px;
    margin-top: 2px;
    color: #697890;
    &:first-child {
        margin-top: 10px;
    }
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    &:hover {
        background-color: #e8edee;
    }
`;
