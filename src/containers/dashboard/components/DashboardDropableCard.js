import t from 'prop-types'
import React from 'react'
import './DashboardCard.scss'
import Dropzone from 'react-dropzone'

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
            showAdvancedSearch: false
        };
        this.onDrop = this.onDrop.bind(this);
    }

    onDrop(files) {
        console.log(files);
    }

    render() {

        return (
                <Dropzone
                    className="dashboard-card-container"
                    accept=".txt"
                    disableClick={true}
                    ref={(ref) => {this.dropZoneRef = ref;}}
                    onDrop={this.onDrop}>
                    <div className="dashboard-card-icon">
                        <i className="fas fa-cloud-upload-alt"> </i>
                    </div>
                    <div className="dashboard-card-title">
                        Drag files to upload or
                    </div>
                    <button className="btn btn-primary" onClick={() => this.dropZoneRef.open()}>Browse files</button>
                </Dropzone>
        )
    }
}
