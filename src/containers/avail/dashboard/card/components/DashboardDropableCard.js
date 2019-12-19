import PropTypes from 'prop-types';
import React from 'react';
import './DashboardCard.scss';
import Dropzone from 'react-dropzone';
import {Progress} from 'reactstrap';
import {uploadService} from '../../../service/UploadService';
import config from 'react-global-configuration';


export default class DashboardDropableCard extends React.Component {
    static defaultProps = {
        status: null
    };

    static propTypes = {
        loading: PropTypes.bool,
        bsStyle: PropTypes.string,
        type: PropTypes.string,
        externalId: PropTypes.string,
        status: PropTypes.string
    };

    DELAY_AFTER_LOADED = 3000;

    constructor(props) {
        super(props);
        this.state = {
            uploading: false,
            error: '',
            files: [],
            file: null,
            total: 0,
            fileUploadedPercentage: 0

        };
        this.handleUpload = this.handleUpload.bind(this);
    }

    handleUpload(files) {
        if (files && files.length > 0) {
            this.setState({files: files, total: files.length, uploading: true});
            this.uploadFiles(files);
        }
    }

    uploadFiles(files) {
        if (files && files.length > 0) {
            const currentFile = files[0];
            files = files.slice(1);
            this.setState({files: files, file: currentFile});
            this.sentUploadedFile(currentFile, files);
        } else {
            this.setState({file: null});
            setTimeout(() => {
                this.uploadFinished();
            }, 3000);
            // console.log('Send next file, finished');
        }
    }

    updateFileUploadedPercentage = (percentage) => {
        this.setState({fileUploadedPercentage: percentage});
    }

    sentUploadedFile(currentFile, files) {
        uploadService.uploadAvail(currentFile, this.props.externalId, this.updateFileUploadedPercentage).then(() => {
            // console.log(res);
            setTimeout(() => this.uploadFiles(files), 1000);
        }).catch((e) => {
            console.error('Unexpected error');
            console.error(e);
            this.setState({
                error: 'Upload error',
                files: [],
                total: 0});
            this.uploadFinished();
        });
    }

    uploadFinished() {
        setTimeout(() => this.setState({uploading: false}), this.DELAY_AFTER_LOADED);
    }

    getUploadedPercentage = () => {
        return this.state.fileUploadedPercentage;
    }

    getProcessStatus = (status) => {
        if(status === 'PENDING') return 'Processing';      
    }

    render() {
        const renderUploadingInfo = (file) => (
            file ? 'Uploading: ' + file.name : this.props.status ? this.getProcessStatus(this.props.status) : 'Uploading finished'
        );

        const renderUploadingError = (error, file) => (
            <span className="text-danger">{error + ': ' +file.name}</span>
        );


        return (
            <Dropzone
                disabled={this.state.uploading}
                className="dashboard-card-container"
                accept={config.get('avails.upload.extensions')}
                disableClick={true}
                ref={(ref) => {this.dropZoneRef = ref;}}
                onDrop={this.handleUpload}>
                <div className="dashboard-card-icon">
                    <i className="fas fa-cloud-upload-alt"> </i>
                </div>
                <div className="dashboard-card-title">
                    { !this.state.uploading && 'Drag files to upload or'}
                </div>
                { this.state.uploading && (
                    <React.Fragment>
                        <div className="text-center">{this.getUploadedPercentage()}%</div>
                        <Progress value={this.getUploadedPercentage()} />
                    </React.Fragment>
                )}
                { !this.state.uploading && <button className="btn btn-primary dashboard-card-btn" id={'avails-dashboard-upload-btn'} onClick={() => this.dropZoneRef.open()}>Browse files</button>}                
                { this.state.uploading && ( this.state.error ? 
                    <span className="dashboard-card__label-error">{renderUploadingError(this.state.error, this.state.file)}</span> : 
                    <span className="dashboard-card__label-info">{renderUploadingInfo(this.state.file)}</span>)}
            </Dropzone>
        );
    }
}
