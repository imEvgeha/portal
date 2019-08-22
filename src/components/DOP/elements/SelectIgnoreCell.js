import React, {Component} from 'react';
import t from 'prop-types';
import {connect} from 'react-redux';
import {updatePromotedRights} from '../../../stores/actions/DOP';
import {rightsService} from '../../../containers/avail/service/RightsService';

const defaultColor = '#606060';
const selectedColor = '#D7D7D7';
const ignoredColor = '#FFFFFF';

class SelectIgnoreCell extends Component {
    static propTypes = {
        node: t.object,
        promotedRights: t.array,
        updatePromotedRights: t.func
    };

    static defaultProps = {
        node: null,
        promotedRights: [],
        updatePromotedRights: null,
    }

    constructor(props) {
        super(props);
        const isIgnored = props.node.data && props.node.data.status === 'Ready';
        this.state = {
            isIgnored,
            isLoading: false
        };
    }

    isPromoted = () => {
        return this.props.promotedRights.find(e => e.rightId === this.props.node.id);
    };

    checkPromotableStatus = (territories = []) => territories && territories.some(territory => !territory.selected && territory.country);

    onPromoteClick = () => {
        const {updatePromotedRights, promotedRights, node} = this.props;
        const territories = (node && node.data && node.data.territory && node.data.territory.map(el => el.country)) || [];
        const promotableTerritories = territories.filter(el => el && !el.selected);
        if (this.isPromoted()) {
            return updatePromotedRights(promotedRights.filter(e => e.rightId !== node.id));
        } 
        updatePromotedRights([...promotedRights.filter(el => el.rightId !== node.id), {rightId: node.id, territories: promotableTerritories}]);
    };

    onIgnoreClick = () => {
        this.setState({
            isLoaded: true
        });
        const {node} = this.props;
        if (node && node.data && node.data.status === 'Ready') {
            return rightsService
                .update({status: 'ReadyNew'}, node.data.id)
                .then(res => {
                    node.setData(res.data);
                    this.setState({isIgnored: false, isLoaded: false});
                });
        } 
        rightsService
            .update({status: 'Ready'}, node.data.id)
            .then(res => {
                node.setData(res.data);
                this.setState({isIgnored: true, isLoaded: false});
            });
    };

    isIgnorable = () => {
        return this.props.node.data && (this.props.node.data.status === 'Ready' || this.props.node.data.status === 'ReadyNew');
    };

    render() {
        const {node} = this.props;
        const isPromotable = this.checkPromotableStatus(node && node.data.territory); 
        return (
            <div style={{height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                {isPromotable && (
                    <button 
                        className="btn"
                        style={{background: this.isPromoted() ? selectedColor : defaultColor, margin: '5px'}}
                        onClick={this.onPromoteClick}
                    >
                        {this.isPromoted() ? 'Unselect' : 'Select'}
                    </button>
                )}
                {this.isIgnorable() && (
                    <button 
                        className="btn"
                        style={{
                            background: this.state.isIgnored ? ignoredColor : selectedColor,
                            margin: '5px'
                        }}
                        onClick={this.onIgnoreClick}
                        disabled={this.state.isLoaded}
                    >
                        {this.state.isIgnored ? 'Unignore' : 'Ignore'}
                    </button>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    promotedRights: state.dopReducer.session.promotedRights
});

const mapDispatchToProps = (dispatch) => ({
    updatePromotedRights: payload => dispatch(updatePromotedRights(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectIgnoreCell);
