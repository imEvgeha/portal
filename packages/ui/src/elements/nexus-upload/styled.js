import styled, {css} from 'styled-components';

export const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

export const DropzoneContainer = styled.div`
    color: #000000;
    width: 100%;
    height: 80px;
    padding: 0 8px;
    font-family: sans-serif;
    font-size: 16px;
    font-weight: 400;
    border-radius: 4px;
    border: 1px dashed #cccccc;
    background-color: #fafafa;
    cursor: pointer;
    display: flex;
    align-items: center;

    ${({disabled}) =>
        disabled &&
        css`
            cursor: default;
            border-color: #e6e6e6;
            color: #cccccc;
            background-color: #f2f2f2;
        `}
    ${({error}) =>
        error &&
        css`
            color: #dc3545;
            border-color: #dc3545;
        `};
`;

export const DropzoneEmptyText = styled.div`
    display: flex;
    width: 100%;
`;

export const UploadIcon = styled.div`
    position: absolute;
    top: 50%;
    left: 16px;
    transform: translateY(-50%);
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const PlaceholderContainer = styled.div`
    position: relative;
    display: flex;
    font-size: 14px;
    align-items: center;
    justify-content: center;
    text-align: center;
    word-break: break-all;
    flex: 1;
    ${({hasIcon}) =>
        hasIcon &&
        css`
            padding-left: 60px;
        `}
    ${({iconPosition}) =>
        iconPosition === 'right' &&
        css`
            padding: 0 60px 0 8px;
            ${UploadIcon} {
                left: auto;
                right: 16px;
            }
        `}
`;

export const ImagePreview = styled.div`
    display: flex;
`;
export const Image = styled.img`
    display: block;
    width: 254px;
    height: 144px;
    margin: 24px 0;
`;

export const ImageDetails = styled.p`
    margin: 24px 16px;
`;
