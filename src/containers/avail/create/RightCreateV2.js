import React from 'react';
import PropTypes from 'prop-types';
import connect from 'react-redux/es/connect/connect';
import BlockUi from 'react-block-ui';
import {Button, Label} from 'reactstrap';

import {store} from '../../../index';
import {blockUI} from '../../../stores/actions/index';
import {profileService} from '../service/ProfileService';
import {oneOfValidation} from '../../../util/Validation';
import {rightsService} from '../service/RightsService';
import NexusBreadcrumb from '../../NexusBreadcrumb';
import {AVAILS_DASHBOARD, RIGHT_CREATE} from '../../../constants/breadcrumb';
import {safeTrim} from '../../../util/Common';
import RightsURL from '../util/RightsURL';
import {can, cannot} from '../../../ability';
import {URL} from '../../../util/Common';
import RightTerritoryFormSchema from '../../../components/form/RightTerritoryFormSchema';
import {
    NexusDateTimePicker,
    NexusDatePicker,
    NexusMultiInstanceField
} from '../../../ui-elements';

const mapStateToProps = state => {
    return {
        availsMapping: state.root.availsMapping,
        selectValues: state.root.selectValues,
        blocking: state.root.blocking
    };
};

// TODO: Way too many renders
class RightCreate extends React.Component {

    static propTypes = {
        selectValues: PropTypes.object,
        availsMapping: PropTypes.any,
        blocking: PropTypes.bool,
        match: PropTypes.object
    };

    static contextTypes = {
        router: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.mappingErrorMessage = {};
        this.right = {};
    }

    componentDidMount() {
        if(NexusBreadcrumb.empty()) NexusBreadcrumb.set(AVAILS_DASHBOARD);

        NexusBreadcrumb.push(RIGHT_CREATE);
        this.right = {};

        if(this.props.availsMapping){
            this.initMappingErrors(this.props.availsMapping.mappings);
        }else{
            profileService.initAvailsMapping();
        }
    }

    componentWillUnmount() {
        NexusBreadcrumb.pop();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.availsMapping !== this.props.availsMapping) {
            this.initMappingErrors(this.props.availsMapping.mappings);
        }
    }

    handleChange = ({target}, val) => {
        const value = val || (target.value ? safeTrim(target.value) : '');
        const name = target.name;
        this.checkRight(name, value, true);
    };

    handleArrayPush = (e, name) => {
        // TODO: redundant?
        this.checkRight(name, e, true);
    };

    checkRight(name, value, setNewValue) {
        if(!this.mappingErrorMessage[name] || !this.mappingErrorMessage[name].inner) {
            let validationError = this.validateField(name, value, this.right);

            let errorMessage = {inner: '', pair: '', range: '', date: '', text: validationError};
            this.mappingErrorMessage[name] = errorMessage;

            if (!validationError) {
                const pairFieldName = this.getPairFieldName(name);
                if (pairFieldName) {
                    const map = this.props.availsMapping.mappings.find(({javaVariableName}) => javaVariableName === name);
                    const mappingPair = this.props.availsMapping.mappings.find(({javaVariableName}) => javaVariableName === pairFieldName);
                    const oneOfValidationError = oneOfValidation(name, map.displayName, value, pairFieldName, mappingPair.displayName, this.right);
                    if (!this.mappingErrorMessage[name].range) {
                        this.mappingErrorMessage[name].pair = oneOfValidationError;
                    }
                    this.mappingErrorMessage[pairFieldName] = this.mappingErrorMessage[pairFieldName] || {
                        inner: '',
                        pair: '',
                        range: '',
                        date: '',
                        text: ''
                    };

                    if(!this.mappingErrorMessage[pairFieldName].range) {
                        this.mappingErrorMessage[pairFieldName].pair = oneOfValidationError;
                    }
                }
            }
        }

        if(setNewValue){
            let newRight = {...this.right, [name]: value};
            this.right = newRight;
            this.setState({});
        }
    }

    getPairFieldName(name) {
        switch (name) {
            case 'start': return 'availStart';
            case 'availStart': return 'start';
            default: return '';
        }
    }

    anyInvalidField() {
        return this.isAnyErrors() || this.areMandatoryFieldsEmpty();
    }

    isAnyErrors() {
        for (let [, value] of Object.entries(this.mappingErrorMessage)) {
            if(value.date || value.range || value.text || value.inner || value.pair) {
                return true;
            }
        }
        return false;
    }

    validateNotEmpty(data) {
        if (!data || !safeTrim(data)) {
            return 'Field can not be empty';
        }
        return '';
    }

    validateField(name, value) {
        const map = this.props.availsMapping.mappings.find(x => x.javaVariableName === name);
        const isOriginRightIdRequired = name === 'originalRightId' && this.right.temporaryPriceReduction === true && this.right.status && this.right.status.value === 'Ready';
        if(map && (map.required || isOriginRightIdRequired)) {
            if(Array.isArray(value)){
                return value.length === 0 ? 'Field can not be empty' : '';
            }
            return this.validateNotEmpty(value);
        }
        return '';
    }

    areMandatoryFieldsEmpty() {
        return !!this.props.availsMapping.mappings
            .filter(({javaVariableName}) => can('create', 'Avail', javaVariableName))
            .find(x => x.required && !this.right[x.javaVariableName]);
    }

    validateFields(){
        this.props.availsMapping.mappings.filter(({javaVariableName}) => can('create', 'Avail', javaVariableName)).map((mapping) => {
            this.checkRight(mapping.javaVariableName, this.right[mapping.javaVariableName], false);
        });
        this.setState({});
        return this.anyInvalidField();
    }

    confirm = () => {
        if(this.validateFields()) {
            this.setState({errorMessage: 'Not all mandatory fields are filled or not all filled fields are valid'});
            return;
        }
        store.dispatch(blockUI(true));
        if(this.props.match.params.availHistoryId){
            this.right.availHistoryIds=[this.props.match.params.availHistoryId];
        }
        rightsService.create(this.right).then((response) => {
            this.right={};
            this.setState({});
            if(response && response.data && response.data.id){
                if(this.props.match.params.availHistoryId){
                    this.context.router.history.push(URL.keepEmbedded('/avails/history/' + this.props.match.params.availHistoryId + '/manual-rights-entry'));
                }else{
                    this.context.router.history.push(RightsURL.getRightUrl(response.data.id));
                }

            }
            store.dispatch(blockUI(false));
        })
            .catch(() => {
                this.setState({errorMessage: 'Right creation Failed'});
                store.dispatch(blockUI(false));
            });
    };

    cancel = () => {
        if(this.props.match.params.availHistoryId){
            this.context.router.history.push(URL.keepEmbedded('/avails/history/' + this.props.match.params.availHistoryId + '/manual-rights-entry'));
        }else {
            this.context.router.history.push(URL.keepEmbedded('/avails'));
        }
    };

    initMappingErrors = (mappings) => {
        let mappingErrorMessage = {};
        mappings.map((mapping) => {
            mappingErrorMessage[mapping.javaVariableName] =  {
                inner: '',
                date: '',
                range: '',
                pair: '',
                text:''
            };
        });

        this.mappingErrorMessage =  mappingErrorMessage;
    };

    render() {
        const fieldMapping = (fieldType, jvName, displayName, required, value) => {
            const prepData = (name) => {
                const {selectValues = {}} = this.props;
                const options  = selectValues[name] || [];
                const alreadySelected = Array.isArray(value) ? value.map((option) => option.country) : [];

                return options
                    .filter((rec) => (rec.value && !alreadySelected.includes(rec.value)))
                    .map(rec => ({...rec, label: rec.label || rec.value}));
            };

            const fieldMap = {
                string: null,
                integer: null,
                year: null,
                double: null,
                select: null,
                multiselect: null,
                localdate: null,
                time: null,
                duration: null,
                date: (
                    <NexusDatePicker
                        id={jvName}
                        label={displayName}
                        onChange={date => {
                            /* For testing proposes */
                            console.warn('NexusDatePicker returned: ', date);
                        }}
                        required={required}
                    />
                ),
                datetime: (
                    <NexusDateTimePicker
                        id={jvName}
                        label={displayName}
                        onChange={date => {
                            /* For testing proposes */
                            console.warn('NexusDateTimePicker returned: ', date);
                        }}
                        required={required}
                    />
                ),
                boolean: null,
                territoryType: (
                    <NexusMultiInstanceField
                        existingItems={this.right['territory']}
                        onSubmit={items => this.handleArrayPush(items, 'territory')}
                        schema={RightTerritoryFormSchema(prepData('territory'))}
                        keyForTagLabel="country"
                    />
                ),
            };
            return fieldMap[fieldType];
        };

        const {mappings = []} = this.props.availsMapping || {};

        const renderFields = mappings.map((mapping, index)=> {
            const {enableEdit, readOnly, required, javaVariableName, dataType, displayName, tooltip} = mapping;
            if(enableEdit && !readOnly){
                const value = this.right ? this.right[javaVariableName] : '';
                const cannotCreate = cannot('create', 'Avail', javaVariableName);
                if(cannotCreate){
                    return;
                }
                const element = fieldMapping(dataType, javaVariableName, displayName, required, value);
                const wrappedElement = (
                    <div key={`${name}-${index}`}
                         className="list-group-item-action"
                         style={{border:'none', position:'relative', display:'block', padding:'0.75rem 1.25rem', marginBottom:'-1px', backgroundColor:'#fff'}}>
                        <div className="row">
                            <div className="col-4">{displayName}{required?<span className="text-danger">*</span>:''}:
                                {tooltip ? <span title={tooltip} style={{color: 'grey'}}>&nbsp;&nbsp;<i className="far fa-question-circle"></i></span> : ''}
                            </div>
                            <div className="col-8">
                                {element}
                            </div>
                        </div>
                    </div>
                );
                return  wrappedElement;
            }
        });

        return (
            <div style={{position: 'relative'}}>
                <BlockUi tag="div" blocking={this.props.blocking}>
                    <div className={'d-inline-flex justify-content-center w-100 position-absolute' + (this.state && this.state.errorMessage ? ' alert-danger' : '')}
                         style={{top:'-20px', zIndex:'1000', height:'25px'}}>
                        <Label id="right-create-error-message">
                            {this.state && this.state.errorMessage}
                        </Label>
                    </div>
                    <div className="nx-stylish row mt-3 mx-5">
                        <div className="nx-stylish list-group col" style={{overflowY:'scroll', height:'calc(100vh - 220px)'}}>
                            {renderFields}
                        </div>
                    </div>
                    {this.props.availsMapping &&
                    <div style={{display:'flex', justifyContent: 'flex-end'}} >
                        <div className="mt-4 mx-5">
                            <Button className="mr-2" id="right-create-submit-btn" color="primary" onClick={this.confirm}>Submit</Button>
                            <Button className="mr-4" id="right-create-cancel-btn" color="primary" onClick={this.cancel}>Cancel</Button>
                        </div>
                    </div>
                    }
                </BlockUi>
            </div>
        );
    }
}

export default connect(mapStateToProps, null)(RightCreate);
