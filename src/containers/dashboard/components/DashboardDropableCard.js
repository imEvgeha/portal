import t from 'prop-types'
import React from 'react'
import './DashboardCard.scss'
import Dropzone from 'react-dropzone'
import {dashboardService} from "../DashboardService";
import {Progress} from "reactstrap";
import {tmpUploadService} from "../TmpUploadService";

export default class DashboardDropableCard extends React.Component {
    static propTypes = {
        loading: t.bool,
        bsStyle: t.string,
        type: t.string,
    };

    static defaultProps = {
        bsStyle: 'primary',
        type: 'button',
    };

    constructor(props) {
        super(props);
        this.state = {
            uploading: false,
            files: [],
            file: null,
            total: 0

        };
        this.onDrop = this.onDrop.bind(this);
    }

    onDrop(files) {
        if (files && files.length > 0) {
            this.setState({files: files, total: files.length});
            this.sendNextFile();
        }
    }

    sendNextFile() {
        if (this.state.files && this.state.files.length > 0) {
            const file = this.state.files[0];
            this.setState({files: this.state.files.slice(1), file: file, uploading: true});
            this.uploadFile(file);
        } else {
            this.setState({file: null});
            setTimeout(() => this.setState({uploading: false}), 2000);
        }
    }

    uploadFile(file) {
        tmpUploadService.uploadAvail(file).then((res) => {
            setTimeout(() => this.sendNextFile(), 1000);
        })
    }

    render() {

        return (
                <Dropzone
                    className="dashboard-card-container"
                    accept=".xls, .xlsx"
                    disableClick={true}
                    ref={(ref) => {this.dropZoneRef = ref;}}
                    onDrop={this.onDrop}>
                    <div className="dashboard-card-icon">
                        <i className="fas fa-cloud-upload-alt"> </i>
                    </div>
                    <div className="dashboard-card-title">
                        { !this.state.uploading && 'Drag files to upload or'}
                        { this.state.uploading && (this.state.file ? 'Uploading: ' + this.state.file.name : 'Upload finished')}
                    </div>
                    { this.state.uploading && <Progress animated={!!this.state.file} value={100 - this.state.files.length * 100 / this.state.total} />}
                    { !this.state.uploading && <button className="btn btn-primary dashboard-card-btn" onClick={() => this.dropZoneRef.open()}>Browse files</button>}
                </Dropzone>
        )
    }
}
