// import React from 'react';
// import {updatePromotedRights, updatePromotedRightsFullData} from '../../../../stores/actions/DOP';
// import PropTypes from 'prop-types';
// import {connect} from 'react-redux';
// import {rightsService} from '../../../../containers/avail/service/RightsService';
//
// import {union} from 'lodash';
// import {BulkActionButton} from './BulkActionButton';
// import Tabs from './Tabs';
// import UserTerritories from './territories/UserTerritories';
//
// class TableHeader extends React.Component {
//     constructor(props) {
//         super(props);
//     }
//
//     isPromoted = node => {
//         return this.props.promotedRights.findIndex(e => e.rightId === node.data.id) > -1;
//     };
//
//     getPromotableStatus = node => {
//         return node && node.data.territory.some(({country, selected}) => country && !selected);
//     };
//
//     onBulkPromote = () => {
//         const {
//             promotedRights,
//             updatePromotedRights,
//             promotedRightsFullData,
//             updatePromotedRightsFullData,
//             table,
//         } = this.props;
//         const toPromote = [];
//         const toPromoteFullData = [];
//         table.api.getSelectedNodes().forEach(node => {
//             const isPromotable = this.getPromotableStatus(node);
//             if (isPromotable && !this.isPromoted(node)) {
//                 const territoryList = (node && node.data && node.data.territory) || [];
//                 const territories = this.getTerritoriesWithUserSelected(territoryList);
//
//                 toPromote.push({rightId: node.id, territories});
//                 toPromoteFullData.push(node.data);
//             }
//         });
//
//         updatePromotedRights([...promotedRights, ...toPromote]);
//         updatePromotedRightsFullData([...promotedRightsFullData, ...toPromoteFullData]);
//     };
//
//     getTerritoriesWithUserSelected = territories => {
//         const selectableTerritories = territories.filter(({country, selected}) => !selected && country) || [];
//         let newTerritories = selectableTerritories.map(el => el.country);
//         if (this.props.useSelectedTerritories) {
//             const userSelectedTerritoryList = this.props.selectedTerritories.map(el => el.countryCode);
//             newTerritories = union(newTerritories, userSelectedTerritoryList);
//         }
//         return newTerritories;
//     };
//
//     onBulkUnPromote = () => {
//         const {
//             promotedRights,
//             updatePromotedRights,
//             promotedRightsFullData,
//             updatePromotedRightsFullData,
//             table,
//         } = this.props;
//         let unPromotedRights = promotedRights.slice(0);
//         let unPromotedRightsFullData = promotedRightsFullData.slice(0);
//         table.api.getSelectedNodes().forEach(node => {
//             if (this.isPromoted(node)) {
//                 unPromotedRights = unPromotedRights.filter(e => e.rightId !== node.data.id);
//                 unPromotedRightsFullData = unPromotedRightsFullData.filter(e => e.id !== node.data.id);
//             }
//         });
//
//         updatePromotedRights(unPromotedRights);
//         updatePromotedRightsFullData(unPromotedRightsFullData);
//     };
//
//     onBulkIgnore = () => {
//         this.props.table.api.getSelectedNodes().forEach(node => {
//             if (node.data.status === 'ReadyNew') {
//                 rightsService.update({status: 'Ready'}, node.data.id).then(res => {
//                     node.setData(res);
//                     this.props.table.api.redrawRows({rowNodes: [node]});
//                 });
//             }
//         });
//     };
//
//     onBulkUnIgnore = () => {
//         this.props.table.api.getSelectedNodes().forEach(node => {
//             if (node.data.status === 'Ready') {
//                 rightsService.update({status: 'ReadyNew'}, node.data.id).then(res => {
//                     node.setData(res);
//                     this.props.table.api.redrawRows({rowNodes: [node]});
//                 });
//             }
//         });
//     };
//
//     onClearSelection = () => {
//         this.props.table.api.getSelectedNodes().forEach(n => {
//             n.setSelected(false);
//         });
//     };
//
//     render() {
//         return (
//             <div
//                 style={{
//                     marginLeft: '20px',
//                     marginBottom: '10px',
//                     display: 'flex',
//                     paddingLeft: '10px',
//                     paddingRight: '10px',
//                     justifyContent: 'space-between',
//                 }}
//             >
//                 <div style={{display: 'flex'}}>
//                     <BulkActionButton
//                         onBulkIgnore={this.onBulkIgnore}
//                         onBulkUnIgnore={this.onBulkUnIgnore}
//                         onBulkPromote={this.onBulkPromote}
//                         onBulkUnPromote={this.onBulkUnPromote}
//                         onClearSelection={this.onClearSelection}
//                     />
//
//                     <Tabs />
//                 </div>
//
//                 <UserTerritories />
//             </div>
//         );
//     }
// }
//
// const mapStateToProps = state => {
//     return {
//         promotedRights: state.dopReducer.session.promotedRights,
//         promotedRightsFullData: state.dopReducer.session.promotedRightsFullData,
//         selectedTerritories: state.dopReducer.session.selectedTerritories,
//         useSelectedTerritories: state.dopReducer.session.useSelectedTerritories,
//     };
// };
//
// const mapDispatchToProps = {
//     updatePromotedRights,
//     updatePromotedRightsFullData,
// };
//
// TableHeader.propTypes = {
//     table: PropTypes.object,
//     promotedRights: PropTypes.array,
//     promotedRightsFullData: PropTypes.array,
//     updatePromotedRights: PropTypes.func,
//     updatePromotedRightsFullData: PropTypes.func,
//     selectedTerritories: PropTypes.array,
//     useSelectedTerritories: PropTypes.bool,
// };
//
// export default connect(mapStateToProps, mapDispatchToProps)(TableHeader);
