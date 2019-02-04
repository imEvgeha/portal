import React from 'react';
import connect from 'react-redux/es/connect/connect';
import t from 'prop-types';
import Editable from 'react-x-editable';

import {updateBreadcrumb} from '../../../stores/actions/index';
import {availService} from '../service/AvailService';

import {cannot} from '../../../ability';

//const mapStateToProps = state => {
//    return {};
//};

const mapDispatchToProps = {
    updateBreadcrumb
};

class AvailDetails extends React.Component {

    static propTypes = {
        updateBreadcrumb: t.func,
        match: t.obj,
        location: t.obj
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
       if(this.props.match && this.props.match.params && this.props.match.params.id){
            if(this.props.location && this.props.location.state && this.props.location.state.data &&
            this.props.match.params.id === this.props.location.state.data.id){
                this.setState({
                    avail: this.props.location.state.data
                });
            }else{
                availService.getAvail(this.props.match.params.id)
                    .then(res => {
                        if(res && res.data){
                            this.setState({
                                avail: res.data
                            });
                        }
                    })
                    .catch(() => {
                        this.setState({
                            errorMessage: 'Cannot retrieve avail'
                        });
                    });
            }
        }

    }

    render() {
        const renderFieldTemplate = (name, displayName, value, error, readOnly, content) => {
            const hasValidationError = error;
            return (
                <div key={name}
                    className={'list-group-item list-group-item-action' + (readOnly ? ' disabled' : '')}
                    style={{backgroundColor: hasValidationError ? '#f2dede' : null,
                            color: hasValidationError ? '#a94442' : null,
                            breakInside: 'avoid'
                        }}>
                    <div className="row">
                        <div className="col-4">{displayName}:</div>
                        <div
                            className={'col-8' + (value ? '' : ' empty')}
                            id={'dashboard-avails-detail-modal-' + name + '-field'}>
                            {content}
                        </div>
                    </div>
                </div>
            );
        };
        const renderTextField = (name, displayName, value, error, readOnly) => {
            const ref = React.createRef();
            const displayFunc = (val) => {
                if(error){
                    return (<div title = {error}
                        style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace:'nowrap',
                                color: error ? '#a94442' : null
                            }}
                        > {error} </div>);
                }else{
                    return val;
                }
            };

            return renderFieldTemplate(name, displayName, value, error, readOnly, (
                <Editable
                    ref={ref}
                    title={name}
                    value={value}
                    disabled={readOnly}
                    dataType="text"
                    mode="inline"
                    placeholder={this.emptyValueText + ' ' + displayName}
                    handleSubmit={this.handleSubmit}
                    emptyValueText={displayFunc(this.emptyValueText + ' ' + displayName)}
                    validate={() => this.validateTextField(ref.current, name)}
                    display={displayFunc}
                />
            ));
        };
        const renderBooleanField = (name, displayName, value, error, readOnly) => {
            return renderFieldTemplate(name, displayName, value, error, readOnly, (
                <Editable
                    title={name}
                    name={name}
                    dataType="select"
                    disabled={readOnly}
                    handleSubmit={this.handleSubmit}
                    value={value}
                    options={[
                        { key:'t', value: 'true', text: 'Yes' },
                        { key:'f', value: 'false', text: 'No' }]}
                />

            ));

        };
        const renderDatepickerField = (name, displayName, value, error, readOnly) => {
            let priorityError = null;
            if(error){
                priorityError = <div title = {error}
                                    style={{textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace:'nowrap', color: '#a94442'}}>
                                    {error}
                                </div>;
            }
            return renderFieldTemplate(name, displayName, value, error, readOnly, (
                <EditableDatePicker
                    value={value}
                    priorityDisplay={priorityError}
                    name={name}
                    disabled={readOnly}
                    displayName={displayName}
                    validate={(date) => rangeValidation(name, displayName, date, this.state.avail)}
                    onChange={(date, cancel) => this.handleDatepickerSubmit(name, date, cancel)}
                />
            ));
        };

        const renderFields = [];

        for(let i=1;i<=25;i++)
            renderFields.push(renderTextField('aaa'+i, 'AAA'+i, 'value'+i, false, ''));

        return(
            <div className={'list-group'} >
                <div>
                    <div className="nx-stylish" style={{columns:'3 400px'}}>
                        {renderFields}
                    </div>
                </div>
            </div>
        )



        //return (this.state.data ? this.state.data.title : this.props.match.params.id);
    }
}

export default connect(null, mapDispatchToProps)(AvailDetails);