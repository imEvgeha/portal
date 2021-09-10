import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Field, ErrorMessage} from '@atlaskit/form';
import {useDropzone} from 'react-dropzone';
import {
    DropzoneContainer,
    Container,
    DropzoneEmptyText,
    PlaceholderContainer,
    UploadIcon,
    ImagePreview,
    Image,
    ImageDetails,
} from './styled';

const WRONG_FORMAT = 'Wrong file format. Please upload';
const MAX_SIZE = 'File to big. Max size is 10MB';

const DRAG = 'Drop here';
const INSTRUCTIONS = 'Drag’n’drop image here or click to browse your device.';

const NexusUpload = ({name, onChange, label, icon, iconPosition, error, disabled, accept, value, setFieldValue}) => {
    const [file, setFile] = useState(undefined);
    const IconComponent = icon;

    useEffect(() => {
        setFile(value);
    }, [value]);

    const onDrop = (acceptedFiles, rejectedFiles) => {
        if (rejectedFiles.length > 0) {
            setFile(null);
            return setFieldValue(name, 'Wrong format');
        }

        if (acceptedFiles[0].size > 10000000) {
            setFile(null);
            return setFieldValue(name, 'Max size');
        }

        const fileWithPreview = Object.assign(acceptedFiles[0], {
            preview: URL.createObjectURL(acceptedFiles[0]),
        });

        setFile(fileWithPreview);
        setFieldValue(name, acceptedFiles[0]);
        onChange(acceptedFiles[0]);
    };

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        accept,
        onDrop,
        multiple: false,
        disabled,
    });

    const validate = value => {
        switch (value) {
            case 'Wrong format':
                return `${WRONG_FORMAT} ${accept}`;
            case 'Max size':
                return MAX_SIZE;
            default:
                return undefined;
        }
    };

    // NOTE: After v4.0.0, styled components exposes a ref using forwardRef,
    // therefore, no need for using innerRef as refKey
    return (
        <Container>
            <Field {...{name, label, error}} validate={validate}>
                {({fieldProps, error}) => (
                    <>
                        <DropzoneContainer {...getRootProps({refKey: 'innerRef'})} disabled={disabled} error={!!error}>
                            <input {...getInputProps()} />
                            <DropzoneEmptyText>
                                <PlaceholderContainer hasIcon={!!icon} iconPosition={iconPosition}>
                                    <>
                                        {icon && <UploadIcon>{IconComponent}</UploadIcon>}
                                        {isDragActive ? DRAG : file ? file.name : INSTRUCTIONS}
                                    </>
                                </PlaceholderContainer>
                            </DropzoneEmptyText>
                        </DropzoneContainer>
                        {error && <ErrorMessage>{error}</ErrorMessage>}
                    </>
                )}
            </Field>

            {file && (
                <ImagePreview>
                    <Image src={file.preview} />
                    <ImageDetails>{file.path}</ImageDetails>
                </ImagePreview>
            )}
        </Container>
    );
};

NexusUpload.propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    label: PropTypes.string,
    icon: PropTypes.element,
    iconPosition: PropTypes.string,
    error: PropTypes.any,
    disabled: PropTypes.bool,
    accept: PropTypes.string,
    value: PropTypes.any,
};

NexusUpload.defaultProps = {
    label: null,
    icon: null,
    iconPosition: 'right',
    error: null,
    disabled: false,
    accept: '.jpeg,.jpg,.png',
    value: null,
};

export default NexusUpload;
