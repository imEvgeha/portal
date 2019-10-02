import React from 'react';
import ReactDOM from 'react-dom'; // we should remove thiss, replace use of findDomNode with ref
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Editable from 'react-x-editable'; // there is inside atlaskit componetn for editable
import config from 'react-global-configuration';
import InlineEdit from '@atlaskit/inline-edit';
// TODO: move to AtlasKit
import { Button, Label } from 'reactstrap';
import './RightDetails.scss';
import {store} from '../../../index';
import {blockUI} from '../../../stores/actions/index';
import {rightsService} from '../service/RightsService';
import EditableBaseComponent from '../../../components/form/editable/EditableBaseComponent';
import {profileService} from '../service/ProfileService';
import {cannot} from '../../../ability';
import NexusBreadcrumb from '../../NexusBreadcrumb';
import {AVAILS_DASHBOARD} from '../../../constants/breadcrumb';
import {getDeepValue, momentToISO} from '../../../util/Common';
import BlockUi from 'react-block-ui';
import RightsURL from '../util/RightsURL';
import {confirmModal} from '../../../components/modal/ConfirmModal';
import RightTerritoryForm from '../../../components/form/RightTerritoryFormv2';
import NexusCustomItemizedField from '../../../ui-elements/nexus-custom-itemized-field/NexusCustomItemizedField';

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

    refresh = null;

    constructor(props) {
        super(props);

        this.emptyValueText = 'Enter';
        this.fields = {};

        this.state = {
            errorMessage: '',
            isRightTerritoryFormOpen: false,
            isRightTerritoryEditFormOpen: false,
            territoryIndex: null,
            isEdit: false,
        };
    }

    componentDidMount() {
        if (NexusBreadcrumb.empty()) NexusBreadcrumb.set(AVAILS_DASHBOARD);
        NexusBreadcrumb.push({ name: '', path: '/avails/' });
        profileService.initAvailsMapping();
        this.getRightData();
        if (this.refresh === null) {
            this.refresh = setInterval(this.getRightData, config.get('avails.edit.refresh.interval'));
        }
    }

    componentWillUnmount() {
        if (this.refresh !== null) {
            clearInterval(this.refresh);
            this.refresh = null;
        }
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
                        const territoryErrors = (Array.isArray(validationErrors) && validationErrors.filter(el => el.fieldName && el.fieldName.includes('territory') && !el.fieldName.includes('territoryExcluded') )
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
                                el.isValid = false;
                                el.errors = territoryErrors.filter(error => error.index === index);
                            } else {
                                el.isValid = true;
                                el.name = el.country;
                            }
                            el.id = index;
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
                                isValid:true,
                                name: el,
                                id: i,
                            };
                        })) || [];

                        const affiliates = [
                            ...affiliateList,
                            ...affiliateErrors.map((el, index) => {
                                let obj = {};
                                obj.name = `${el.message} ${el.sourceDetails && el.sourceDetails.originalValue}`;
                                obj.isValid = false;
                                obj.errors = affiliateErrors[index];
                                obj.id = el.index;
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
                                isValid:true,
                                name: el,
                                id: i,
                            };
                        })) || [];

                        const affiliatesExclude = [
                            ...affiliateiExcludeList,
                            ...affiliateExcludeErrors.map((error, index) => {
                                let obj = {};
                                obj.name = `${error.message} ${error.sourceDetails && error.sourceDetails.originalValue}`;
                                obj.isValid = false;
                                obj.errors = affiliateExcludeErrors[index];
                                obj.id = error.index;
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

    update(name, value, onError) {
        if (this.state.flatRight[name] === value) {
            onError();
            return;
        }
        console.log(value);
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

    render() {
        const renderFieldTemplate = (name, displayName, value, error, readOnly, required, highlighted, tooltip, ref, content) => {
            const hasValidationError = Array.isArray(error) ? error.length > 0 : error;
            // TODO: Use AtlasKit icons; Remove inline css
            return (
                <div key={name}
                    className={(readOnly ? ' disabled' : '') + (highlighted ? ' font-weight-bold' : '')}
                    style={{
                        backgroundColor: hasValidationError ? '#f2dede' : '#fff',
                        color: hasValidationError ? '#a94442' : null,
                        border: 'none',
                        position: 'relative', display: 'block', padding: '0.75rem 1.25rem', marginBottom: '-1px',
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
            let ref;
            if (this.fields[name]) {
                ref = this.fields[name];

            } else {
                this.fields[name] = ref = React.createRef();
            }

            const {selectValues = {}} = this.props;
            // deepClone(value) returns null for country
            let selectedVal = ref.current ? ref.current.state.value : value;

            let options = selectValues[name] || [];

            options = options.filter((rec) => (rec.value)).map(rec => ({
                    ...rec,
                    label: rec.label || rec.value,
                }
            ));

            const addTerritory = (items) => {
                // TODO: don't mutate, move to state
                selectedVal = items;
                this.update(name, items, this.cancel);
             };

            return renderFieldTemplate(name, displayName, value, errors, readOnly, required, highlighted, null, ref, (
                <InlineEdit
                    onConfirm={() => {}}
                    editView={() => (
                        <NexusCustomItemizedField
                            name={name}
                            items={selectedVal}
                            onSubmit={items => addTerritory(items)}
                            form={(props) => (
                                <RightTerritoryForm
                                    data={value}
                                    options={options}
                                    {...props}
                                />
                            )}
                        />
                    )}
                    readView={() => <div>Placeholder</div> /* TODO: Use AtlasKit Tags here*/}
                    keepEditViewOpenOnBlur
                    readViewFitContainerWidth
                />
            ));
        };

        const fieldMapping = (fieldType, jvName, displayName, required, value) => {
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
                    this.state.territory,
                    // Array.isArray(validationErrors) && validationErrors.filter(el => el.fieldName && el.fieldName.includes('territory')),
                    // readOnly,
                    required,
                    value,
                ),
            };
            return fieldMap[fieldType];
        };

        const {mappings = []} = this.props.availsMapping || {};

        const renderFields = mappings.map((mapping) => {
            if (mapping.enableEdit && !mapping.readOnly) {
                let required = mapping.required;
                const value = this.right ? this.right[mapping.javaVariableName] : '';
                const cannotCreate = cannot('create', 'Avail', mapping.javaVariableName);
                if (cannotCreate) {
                    return;
                }
                return fieldMapping(mapping.dataType, mapping.javaVariableName, mapping.displayName, required, value);
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
