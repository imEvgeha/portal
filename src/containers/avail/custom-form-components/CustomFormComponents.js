import React from 'react';
import styled, { css } from 'styled-components';
import moment from 'moment';
import { convertBooleanToString } from '../../../containers/avail/util/format';

const CustomFieldAddText = styled.div`
    color: #999;
    font-style: italic;
    cursor: pointer;
    user-select: none;
    font-weight: bold;
    float: left;
`;

const TerritoryTag = styled.div`
    padding: 10px;
    user-select: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    background: #EEE;
    font-weight: bold;
    font-size: 13px;
    display: inline;
    cursor: pointer;
    justify-content: space-between;
    ${props => props.isEdit && css`
        float: left;
    `}
    ${props => props.isCreate && css`
        margin-right: 5px;
    `}
    ${props => props.isValid && css`
        color: #000;
    `}
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
   

const RemovableButton = styled.div`
    
    cursor: pointer !important;
    color: #111;
    font-weight: bold;
    padding-left: 5px;
    padding-right: 5px;    
    font-size: 14px;
    display: inline-block; 
    background: #EEE;
    &:hover {
        color: red;
    }
    ${props => props.isCreate && css`
        padding: 5px;
        
    `}
    ${props => props.isEdit && css`      
        float: left;
        padding: 9px;
        margin-right: 5px;
    `}
`;

const TooltipContainer = styled.div`
    padding: 5px;
    ${props => props.isValid && css`
        color: #000;
    `}
`;
const TooltipItem = styled.div`
    padding: 5px;
    font-size: 13px;
    border-bottom: 1px solid #DDD;
    word-wrap: break-word;
    text-align: center;
    &:last-child {
        border-bottom: none;
    }
`;

const SmallTag = styled.span`
    margin-top: 2px;
    margin-right: 2px;
    display: inline-block;
    background: #DDD;
    padding: 5px;
    border-radius: 3px;
    font-weight: bold;
    font-size: 10px;
`;

const TerritoryTooltip = (data) => (
    <TooltipContainer isValid={data && data.isValid} >
        <TooltipItem>Territory: <b>{data && data.country ? data.country : '-'}</b></TooltipItem>
        <TooltipItem>Selected: <b>{data && convertBooleanToString(data.selected)}</b></TooltipItem>        
        <TooltipItem>Date Selected: <b>{data && data.dateSelected ? moment(data.dateSelected).format('L') : '-'}</b></TooltipItem>
        <TooltipItem>Right Cont. Status: <b>{data && data.rightContractStatus ? data.rightContractStatus : '-'}</b></TooltipItem>
        <TooltipItem>Vu Contract ID: <br/> {data && data.vuContractId ? data.vuContractId.map((e, i) => <SmallTag key={i}>{e}</SmallTag>) : '-'}</TooltipItem>
    </TooltipContainer>
);

export {
    TerritoryTag,
    CustomFieldAddText,
    RemovableButton,
    TerritoryTooltip,
    AddButton
};
