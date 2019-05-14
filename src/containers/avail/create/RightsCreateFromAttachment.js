import React from 'react';
import {Button} from 'reactstrap';
import t from 'prop-types';
import RightsResultTable from '../dashboard/components/RightsResultTable';
import {profileService} from '../service/ProfileService';
import {historyService} from '../service/HistoryService';
import {rightSearchHelper} from '../dashboard/RightSearchHelper';
import {URL} from '../../../util/Common';
// import connect from 'react-redux/es/connect/connect';

// const mapStateToProps = state => {
//     return {
//         availsMapping: state.root.availsMapping,
//     };
// };

export default class RightsCreateFromAttachment extends React.Component {

    static propTypes = {
        match: t.object
    };

    static contextTypes = {
        router: t.object
    }

    constructor(props) {
        super(props);
        this.createRight = this.createRight.bind(this);
        this.state={
            availHistoryId: this.props.match.params.availHistoryIds,
            historyData:{},
        };
    }

    componentDidMount() {
        profileService.initAvailsMapping();
        rightSearchHelper.advancedSearch({availHistoryIds: this.state.availHistoryId}, false);
        this.getHistoryData();
    }

    getHistoryData() {
        if(this.state.availHistoryId){
            historyService.getHistory(this.state.availHistoryId)
                .then(res => {
                    if(res && res.data) {
                        this.setState({
                            historyData: res.data,
                        });
                    }
                })
                .catch(() => {
                });
        }
    }

    createRight() {
        this.context.router.history.push(URL.keepEmbedded('/avails/history/' + this.state.availHistoryId + '/rights/create'));
    }

    render(){
        return(
            <div className={'mx-2'}>
                <div><h3>Create Rights from PDF </h3></div>
                <div> Studio: {this.state.historyData.provider} </div>
                {/*<div> PDF Attachments: {this.state.historyData.attachments.map(att => att.id)} </div>*/}
                <Button id="right-create" onClick={this.createRight}>Create Right</Button>
                <div> Upload a spreadsheet </div>
                <hr style={{color:'black', backgroundColor:'black'}}/>
                <div> Rights Created </div>
                <RightsResultTable
                    fromServer = {true}
                    columns = {['title', 'productionStudio', 'territory', 'genres', 'start', 'end']}
                    nav = {{back : 'create_from_attachments', params: {availHistoryId: this.state.availHistoryId}}}
                    autoload = {false}
                />
            </div>
        );
    }
}

// export default connect(mapStateToProps, null)(RightsCreateFromAttachment);