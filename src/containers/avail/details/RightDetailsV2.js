import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
// TODO: move to AtlasKit
import { Button, Label } from 'reactstrap';
import moment from 'moment';
import './RightDetails.scss';
import {store} from '../../../index';
import isEqual from 'lodash.isequal';
import {blockUI} from '../../../stores/actions/index';
import {rightsService} from '../service/RightsService';
import {profileService} from '../service/ProfileService';
import {cannot} from '../../../ability';
import NexusBreadcrumb from '../../NexusBreadcrumb';
import {AVAILS_DASHBOARD} from '../../../constants/breadcrumb';
import {getDeepValue} from '../../../util/Common';
import BlockUi from 'react-block-ui';
import RightsURL from '../util/RightsURL';
import NexusMultiInstanceField from '../../../ui-elements/nexus-multi-instance-field/NexusMultiInstanceField';
import RightTerritoryFormSchema from '../../../components/form/RightTerritoryFormSchema';
import rightConstants from './RightConstants';

const {
    TERRITORY_TYPE,
} = rightConstants;

const mapStateToProps = state => {
    return {
        availsMapping: state.root.availsMapping,
        selectValues: state.root.selectValues,
        blocking: state.root.blocking,
    };
};

// TODO: Way too many renders
class RightDetails extends React.Component {
    static propTypes = {
        selectValues: PropTypes.object,
        availsMapping: PropTypes.any,
        match: PropTypes.any,
        location: PropTypes.any,
        blocking: PropTypes.bool,
    };

    static defaultProps = {
        selectValues: null,
        availsMapping: null,
        match: {},
        location: {},
        blocking: null,
    };

    static contextTypes = {
        router: PropTypes.object,
    };

    constructor(props) {
        super(props);

        this.emptyValueText = 'Enter';

        this.state = {
            errorMessage: '',
            isRightTerritoryFormOpen: false,
            isRightTerritoryEditFormOpen: false,
            editedRight: {},
            flatRight: {},
            territoryIndex: null,
            isEdit: false,
        };
    }

    componentDidMount() {
        if (NexusBreadcrumb.empty()) NexusBreadcrumb.set(AVAILS_DASHBOARD);
        NexusBreadcrumb.push({ name: '', path: '/avails/' });
        profileService.initAvailsMapping();
        this.getRightData();
    }

    componentWillUnmount() {
        NexusBreadcrumb.pop();
    }

    getRightData = () => {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            rightsService.get(this.props.match.params.id)
                .then(res => {
                    if (res && res.data) {
                        const regForEror = /\[(.*?)\]/i;
                        const regForSubField = /.([A-Za-z]+)$/;
                        const {validationErrors = [], territory = [], affiliate = [], affiliateExclude = [], castCrew = []} = res.data || {};
                        // temporally solution for territory - all should be refactor
                        const territoryErrors = (Array.isArray(validationErrors) && validationErrors.filter(el => el.fieldName && el.fieldName.includes(TERRITORY_TYPE) && !el.fieldName.includes('territoryExcluded') )
                            .map(error => {
                                const matchObj = error.fieldName.match(regForEror);
                                if (matchObj) {
                                    const matchSubField = error.fieldName.match(regForSubField);
                                    error.index = Number(matchObj[1]);
                                    error.subField = matchSubField[1];
                                }
                                return error;
                            })) || [];

                        const territories = (Array.isArray(territory) && territory.map((el, index) => {
                            const error = territoryErrors.find(error => error.index === index);
                            if (error) {
                                el.name = `${error.message} ${error.sourceDetails && error.sourceDetails.originalValue}`;
                                el.errors = territoryErrors.filter(error => error.index === index);
                            } else {
                                el.name = el.country;
                            }
                            // el.id = index;
                            return el;
                        })) || [];
                        // temporally solution for affiliate and affilateExclude
                        const affiliateErrors = (Array.isArray(validationErrors) && validationErrors.filter(el => el.fieldName && el.fieldName.includes('affiliate') && !el.fieldName.includes('affiliateExclude'))
                        .map(error => {
                            const matchObj = error.fieldName.match(regForEror);
                            if (matchObj) {
                                error.index = Number(matchObj[1]);
                            }
                            return error;
                        })) || [];

                        const affiliateList = (Array.isArray(affiliate) && affiliate.map((el, i) => {
                            return {
                                name: el,
                                id: i,
                            };
                        })) || [];

                        const affiliates = [
                            ...affiliateList,
                            ...affiliateErrors.map((el, index) => {
                                let obj = {};
                                obj.name = `${el.message} ${el.sourceDetails && el.sourceDetails.originalValue}`;
                                obj.errors = affiliateErrors[index];
                                // obj.id = el.index;
                                return obj;
                            })
                        ];

                        const affiliateExcludeErrors = (Array.isArray(validationErrors) && validationErrors.filter(el => el.fieldName && el.fieldName.includes('affiliateExclude'))
                        .map(error => {
                            const matchObj = error.fieldName.match(regForEror);
                            if (matchObj) {
                                error.index = Number(matchObj[1]);
                            }
                            return error;
                        })) || [];

                        const affiliateiExcludeList = (Array.isArray(affiliateExclude) && affiliateExclude.map((el, i) => {
                            return {
                                name: el,
                                id: i,
                            };
                        })) || [];

                        const affiliatesExclude = [
                            ...affiliateiExcludeList,
                            ...affiliateExcludeErrors.map((error, index) => {
                                let obj = {};
                                obj.name = `${error.message} ${error.sourceDetails && error.sourceDetails.originalValue}`;
                                obj.errors = affiliateExcludeErrors[index];
                                // obj.id = error.index;
                                return obj;
                        })];

                        const castCrews = castCrew;

                        this.setState({
                            right: res.data,
                            flatRight: this.flattenRight(res.data),
                            territory: territories,
                            affiliates,
                            affiliatesExclude,
                            castCrews,
                        });
                        NexusBreadcrumb.pop();
                        NexusBreadcrumb.push({ name: res.data.title, path: '/avails/' + res.data.id });
                    }
                })
                .catch(() => {
                    this.setState({
                        errorMessage: 'Sorry, we could not find a right with id ' + this.props.match.params.id + ' !'
                    });
                });
        }
    };

    flattenRight(right) {
        let rightCopy = {};

        this.props.availsMapping.mappings.forEach(map => {
            const val = getDeepValue(right, map.javaVariableName);
            if (val || val === false || val === null) {
                if (Array.isArray(val) && map.dataType === 'string') {
                    rightCopy[map.javaVariableName] = val.join(',');
                } else {
                    rightCopy[map.javaVariableName] = val;
                }
            }

        });
        return rightCopy;
    }

    update(name, onError) {
        const {editedRight = {}, flatRight = {}} = this.state;
        const existingField = flatRight[name] || {};
        const value = editedRight[name];

        console.error('pre', existingField, value);
        if (isEqual(existingField, value)) {
            console.error(existingField, value);
            onError();
            return;
        }

        // Remove utility props from territory items
        if (name === TERRITORY_TYPE) {
            value.forEach((item, index) => {
                // If date was given, convert it to ISO string for back-end compatibility
                if (item.dateSelected) {
                    item.dateSelected = moment(item.dateSelected).toISOString();
                }
                item.name  && delete value[index].name;
                item.id && delete value[index].id;
                item.state && delete value[index].state;
            });
        }

        let updatedRight = { [name]: value };
        if (name.indexOf('.') > 0 && name.split('.')[0] === 'languageAudioTypes') {
            if (name.split('.')[1] === 'language') {
                updatedRight['languageAudioTypes.audioType'] = this.state.flatRight['languageAudioTypes.audioType'];
            } else {
                updatedRight['languageAudioTypes.language'] = this.state.flatRight['languageAudioTypes.language'];
            }
        }
        store.dispatch(blockUI(true));
        rightsService.update(updatedRight, this.state.right.id)
            .then(res => {
                let editedRight = res.data;
                this.setState({
                    right: res.data,
                    flatRight: this.flattenRight(res.data),
                    errorMessage: ''
                });
                NexusBreadcrumb.pop();
                NexusBreadcrumb.push({ name: editedRight.title, path: '/avails/' + editedRight.id });
                store.dispatch(blockUI(false));
            })
            .catch(() => {
                this.setState({
                    errorMessage: 'Editing right failed'
                });
                store.dispatch(blockUI(false));
                onError();
            });
    }

    validateNotEmpty(data) {
        return data.trim() ? '' : <small>Field can not be empty</small>;
    }

    cancel = () => {
        this.context.router.history.push(RightsURL.getSearchURLFromRightUrl(window.location.pathname, window.location.search));
    };

    handleChange = (fieldName, value) => {
        console.log('Setting state: ', fieldName, value);
        this.setState((prevState) => ({
            editedRight: {
                ...prevState.editedRight,
                [fieldName]: value,
            }
        }));
    };

    render() {
        const renderFieldTemplate = (name, displayName, value, error, readOnly, required, highlighted, tooltip, ref, content) => {
            // const hasValidationError = Array.isArray(error) ? error.length > 0 : error;
            // TODO: Use AtlasKit icons; Remove inline css
            return (
                <div key={name}
                    className={(readOnly ? ' disabled' : '') + (highlighted ? ' font-weight-bold' : '')}
                    style={{
                    }}>
                    <div className="row">
                        <div className="col-4">{displayName}
                            {required ? <span className="text-danger">*</span> : ''}
                            :
                            {highlighted ? <span title={'* fields in bold are original values provided by the studios'} style={{ color: 'grey' }}>&nbsp;&nbsp;<i className="far fa-question-circle"></i></span> : ''}
                            {tooltip ? <span title={tooltip} style={{ color: 'grey' }}>&nbsp;&nbsp;<i className="far fa-question-circle"></i></span> : ''}
                        </div>
                        <div className="col-8">
                            {content}
                        </div>
                    </div>
                </div>
            );
        };

        const renderTerritoryField = (name, displayName, value, errors, readOnly, required, highlighted) => {
            const {flatRight = {}} = this.state;
            let selectedVal = flatRight[name] || value;

            // TODO: Extract when prepping data for the whole component; To be fixed on RightDetails refactor
            const prepData = (name) => {
                const {selectValues = {}} = this.props;
                const options  = selectValues[name] || [];
                const alreadySelected = Array.isArray(value) ? value.map((option) => option.country) : [];

                return options
                    .filter((rec) => (rec.value && !alreadySelected.includes(rec.value)))
                    .map(rec => ({...rec, label: rec.label || rec.value}));
            };

            return renderFieldTemplate(name, displayName, value, errors, readOnly, required, highlighted, null, null, (
                <NexusMultiInstanceField
                    name={name}
                    schema={RightTerritoryFormSchema(prepData(TERRITORY_TYPE))}
                    existingItems={selectedVal}
                    keyForTagLabel="country"
                    onSubmit={items => this.handleChange(name, items)}
                    onConfirm={() => this.update(name, this.cancel)}
                    isWithInlineEdit={true}
                    isReadOnly={readOnly}
                />
            ));
        };

        const fieldMapping = (fieldType, jvName, displayName, readOnly, required, value) => {
            const fieldMap = {
                string: null,
                integer: null,
                year: null,
                double: null,
                select: null,
                multiselect: null,
                duration: null,
                time: null,
                localdate: null,
                date: null,
                boolean: null,
                territoryType: renderTerritoryField(
                    jvName,
                    displayName,
                    value,
                    null,
                    readOnly,
                    // Array.isArray(validationErrors) && validationErrors.filter(el => el.fieldName && el.fieldName.includes('territory')),
                    // readOnly,
                    required,
                    null,
                ),
            };
            return fieldMap[fieldType];
        };

        const {mappings = []} = this.props.availsMapping || {};

        const renderFields = mappings.map((mapping) => {
            const {enableEdit, readOnly, required, dataType, javaVariableName, displayName} = mapping || {};
            const {flatRight = {}} = this.state;
            const value = flatRight[javaVariableName] || '';

            if (enableEdit && !readOnly) {
                const cannotCreate = cannot('create', 'Avail', javaVariableName);
                if (cannotCreate) {
                    return;
                }
                return fieldMapping(dataType, javaVariableName, displayName, readOnly, required, value);
            }
        });

        return (
            <div style={{ position: 'relative' }}>
                <BlockUi tag="div" blocking={this.props.blocking}>
                    {
                        this.state.errorMessage &&
                        <div id='right-edit-error' className='d-inline-flex justify-content-center w-100 position-absolute alert-danger' style={{ top: '-20px', zIndex: '1000', height: '25px' }}>
                            <Label id='right-edit-error-message'>
                                {this.state.errorMessage}
                            </Label>
                        </div>
                    }
                    <div className="nx-stylish row mt-3 mx-5">
                        <div className={'nx-stylish list-group col-12'} style={{ overflowY: 'scroll', height: 'calc(100vh - 220px)' }}>
                            {renderFields}
                        </div>
                    </div>
                    {this.props.availsMapping &&
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }} >
                            <div className="mt-4 mx-5 px-5">
                                <Button className="mr-5" id="right-edit-cancel-btn" color="primary" onClick={this.cancel}>Cancel</Button>
                            </div>
                        </div>
                    }
                </BlockUi>
            </div>
        );
    }
}

export default connect(mapStateToProps)(RightDetails);
