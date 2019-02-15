import React, { Component } from 'react';
import { Row, Col, Container, TabContent, TabPane } from 'reactstrap';
import './MetadataTerritoryTab.scss';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import TerritoryMetadataTab from './TerritoryMetadataTab';
import TerritoryMetadataCreateTab from './TerritoryMetadataCreateTab';
import connect from 'react-redux/es/connect/connect';

class TerritoryMetadata extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: '0'
        };
    }
    toggle(tab) {
        if (this.state.activeTab !== tab) {
          this.setState({
            activeTab: tab
          });
        }
      }
    render() {
        return (
            <Container fluid id="titleContainer" style={{ marginTop: '30px' }}>

                <Row style={{ marginTop: '5px' }}>
                    <Col>
                        <h2>Territory Metadata</h2>
                    </Col>
                </Row>
                <div className='tab'>                
                    {
                        this.props.isEditMode ?
                            <button className={'tablinks add-local'}  onClick={() => { this.toggle('3'); }}>
                                <FontAwesome name='plus-circle' size="lg" style={{ marginRight: '5px' }} />
                            </button>
                            : null
                    } 
                    {
                        this.props.territoryMetadata.territories.map((item, i) => {                       
                            return <button className={'tablinks'} key={i} onClick={() => { this.toggle(i); }}><b>{item.local}</b></button>;
                        })
                    }                   
                </div>
                <TabContent activeTab={this.state.activeTab}>
                    {
                        this.props.territoryMetadata.territories.map((item, i) => {
                                 return (
                                 <TabPane key={i} tabId={i}>
                                    <Row>
                                        <TerritoryMetadataTab data={item} />
                                        </Row>
                                </TabPane>);
                        })
                    }
                    <TabPane tabId="3">
                        <Row>
                            <TerritoryMetadataCreateTab />
                        </Row>
                    </TabPane>
                </TabContent>
            </Container>
        );
    }
}

TerritoryMetadata.propTypes = {
    isEditMode: PropTypes.bool.isRequired,
    territoryMetadata: PropTypes.object
};
const mapStateToProps = state => {
    return {
        territoryMetadata: state.titleReducer.territoryMetadata,
    };
};
export default connect(mapStateToProps, null)(TerritoryMetadata);