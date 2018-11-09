import t from 'prop-types';
import React from 'react';
import './DashboardCard.scss';
import Dropzone from 'react-dropzone';
import {Progress} from 'reactstrap';
import {uploadService} from '../UploadService';
import config from 'react-global-configuration';


export default class DashboardDropableCard extends React.Component {
    static propTypes = {
        loading: t.bool,
        bsStyle: t.string,
        type: t.string,
    };

    DELAY_AFTER_LOADED = 3000;

    constructor(props) {
        super(props);
        this.state = {
            uploading: false,
            error: '',
            files: [],
            file: null,
            total: 0

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
            this.uploadFinished();
            console.log('Send next file, finished');
        }
    }

    sentUploadedFile(currentFile, files) {
        uploadService.uploadAvail(currentFile).then((res) => {
            console.log(res);
            setTimeout(() => this.uploadFiles(files), 1000);
        }).catch((e) => {
            console.log('Unexpected error');
            console.log(e);
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

    render() {
        const renderUploadingInfo = (file) => (
            file ? 'Uploading: ' + file.name : 'Upload finished'
        );

        const renderUploadingError = (error, file) => (
            <span className="text-danger">{error + ': ' +file.name}</span>
        );


        return (
            <Dropzone
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
                    { this.state.uploading && ( this.state.error ? renderUploadingError(this.state.error, this.state.file) : renderUploadingInfo(this.state.file))}
                </div>
                { this.state.uploading && <Progress animated={!!this.state.file} value={100 - this.state.files.length * 100 / this.state.total} />}
                { !this.state.uploading && !this.state.error && <button className="btn btn-primary dashboard-card-btn" id={'avails-dashboard-upload-btn'} onClick={() => this.dropZoneRef.open()}>Browse files</button>}
            </Dropzone>
        );
    }
}
