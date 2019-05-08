import React from 'react';
import {Button} from 'reactstrap';
import t from 'prop-types';
import RightsResultTable from '../dashboard/components/RightsResultTable';
import {profileService} from '../service/ProfileService';
import {rightSearchHelper} from '../dashboard/RightSearchHelper';
// import connect from 'react-redux/es/connect/connect';

// const mapStateToProps = state => {
//     return {
//         availsMapping: state.root.availsMapping,
//     };
// };

export default class RightsCreateFromAttachment extends React.Component {
    static contextTypes = {
        router: t.object
    }

    constructor(props) {
        super(props);
        this.createRight = this.createRight.bind(this);
        this.state={
            availHistoryIds: 'aigh_TL5Kc',
            studio: 'Sony',
            subject: 'Latest Blah Avails',
            PDFAttachments: ['some-email-attachment-1', 'some-email-attachment-2']
        };
    }

    componentDidMount() {
        profileService.initAvailsMapping();
        rightSearchHelper.advancedSearch({availHistoryIds: this.state.availHistoryIds});
    }

    createRight() {
        this.context.router.history.push('/avails/rights/create');
    }

    render(){
        return(
            <div className={'mx-2'}>
                <div><h3>Create Rights from PDF </h3></div>
                <div> Studio: {this.state.studio} </div>
                <div> Subject: {this.state.subject} </div>
                <div> PDF Attachments: {this.state.PDFAttachments} </div>
                <Button id="right-create" onClick={this.createRight}>Create Right</Button>
                <div> Upload a spreadsheet </div>
                <hr style={{color:'black', backgroundColor:'black'}}/>
                <div> Rights Created </div>
                <RightsResultTable
                    fromServer = {true}
                    columns = {['title', 'productionStudio', 'territory', 'genres', 'start', 'end']}
                />
            </div>
        );
    }
}

// export default connect(mapStateToProps, null)(RightsCreateFromAttachment);