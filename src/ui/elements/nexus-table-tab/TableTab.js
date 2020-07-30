import styled, {css} from 'styled-components';

export const TabContainer = styled.div`
    display: flex;
    align-items: center;
`;

const BasicTab = styled.div`
    display: inline-block;
    border-right: 1px solid #000;
    font-size: 14px;
    width: 130px;
    padding: 0 10px 0 10px;
    text-align: center;
    color: #999;
    ${props =>
        props.isActive &&
        css`
            font-weight: bold;
            font-size: 15px;
            color: #000;
        `}
    ${props =>
        props.isDisabled &&
        css`
            pointer-events: none;
        `}
`;

export const SelectRightsTab = styled(BasicTab)`
    &:last-child {
        border-right: none;
        width: 200px;
    }
    &:hover {
        color: #666;
        cursor: pointer;
    }
`;

export const ManualRightEntryTab = styled(BasicTab)`
    font-size: 16px;
    min-width: 130px;
    padding: 0 5px 5px 5px;
    margin-top: 5px;
    &:last-child {
        border-right: none;
        width: 140px;
    }
    ${props =>
        !props.isNotClickable &&
        css`
            &:hover {
                color: #666;
                cursor: pointer;
            }
        `}
`;
