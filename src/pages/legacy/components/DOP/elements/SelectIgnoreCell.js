import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {updatePromotedRights, updatePromotedRightsFullData} from '../../../stores/actions/DOP';
import {rightsService} from '../../../containers/avail/service/RightsService';
import {union} from 'lodash';

const defaultColor = '#606060';
const selectedColor = '#D7D7D7';
const ignoredColor = '#FFFFFF';

class SelectIgnoreCell extends Component {
    constructor(props) {
        super(props);
        const isIgnored = props.node.data && props.node.data.status === 'Ready';
        this.state = {
            isIgnored,
        };
    }

    isPromoted = () => {
        return this.props.promotedRights.find(e => e.rightId === this.props.node.id);
    };

    checkPromotableStatus = (territories = []) =>
        territories && territories.some(territory => !territory.selected && territory.country);

    onPromoteClick = () => {
        const {
            updatePromotedRights,
            updatePromotedRightsFullData,
            promotedRights,
            promotedRightsFullData,
            node = {},
        } = this.props;
        const {id, data = {}} = node;
        const rightId = id;
        const promotableTerritoriesObject =
            (data && data.territory && data.territory.filter(el => el.country && !el.selected)) || [];
        const promotableTerritories = promotableTerritoriesObject.map(el => el.country);
        const territories = this.getTerritoriesWithUserSelected(promotableTerritories);
        const filteredPromotedRights = promotedRights.filter(e => e.rightId !== rightId);
        const updatedPromotedRights = this.isPromoted()
            ? filteredPromotedRights
            : [...filteredPromotedRights, {rightId, territories}];
        updatePromotedRights(updatedPromotedRights);

        const filteredPromotedRightsFullData = promotedRightsFullData.filter(e => e.id !== rightId);
        const updatedPromotedRightsFullData = this.isPromoted()
            ? filteredPromotedRightsFullData
            : [...filteredPromotedRightsFullData, data];
        updatePromotedRightsFullData(updatedPromotedRightsFullData);
    };

    getTerritoriesWithUserSelected = territories => {
        if (this.props.useSelectedTerritories) {
            territories = union(
                territories,
                this.props.selectedTerritories.map(el => el.countryCode)
            );
        }
        return territories;
    };

    onIgnoreClick = () => {
        this.setState({
            isLoaded: true,
        });
        const {node} = this.props;
        if (node && node.data && node.data.status === 'Ready') {
            return rightsService.update({status: 'ReadyNew'}, node.data.id).then(res => {
                node.setData(res.data);
                this.setState({isIgnored: false, isLoaded: false});
            });
        }
        rightsService.update({status: 'Ready'}, node.data.id).then(res => {
            node.setData(res.data);
            this.setState({isIgnored: true, isLoaded: false});
        });
    };

    isIgnorable = () => {
        return (
            this.props.node.data &&
            (this.props.node.data.status === 'Ready' || this.props.node.data.status === 'ReadyNew')
        );
    };

    render() {
        const {node} = this.props;
        const {data} = node || {};
        const {territory} = data || {};
        const isPromotable = this.checkPromotableStatus(territory);
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
                            margin: '5px',
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

const mapStateToProps = ({dopReducer}) => ({
    promotedRights: dopReducer.session.promotedRights,
    promotedRightsFullData: dopReducer.session.promotedRightsFullData,
    selectedTerritories: dopReducer.session.selectedTerritories,
    useSelectedTerritories: dopReducer.session.useSelectedTerritories,
});

const mapDispatchToProps = dispatch => ({
    updatePromotedRights: payload => dispatch(updatePromotedRights(payload)),
    updatePromotedRightsFullData: payload => dispatch(updatePromotedRightsFullData(payload)),
});

SelectIgnoreCell.propTypes = {
    node: PropTypes.object,
    promotedRights: PropTypes.array,
    promotedRightsFullData: PropTypes.array,
    updatePromotedRights: PropTypes.func,
    updatePromotedRightsFullData: PropTypes.func,
    useSelectedTerritories: PropTypes.bool,
    selectedTerritories: PropTypes.array,
};

SelectIgnoreCell.defaultProps = {
    node: null,
    promotedRights: [],
    promotedRightsFullData: [],
    updatePromotedRights: null,
    updatePromotedRightsFullData: null,
    useSelectedTerritories: false,
    selectedTerritories: [],
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectIgnoreCell);
