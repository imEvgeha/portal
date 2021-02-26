import React, {useState, useEffect, useMemo} from 'react';
import PropTypes from 'prop-types';
import { HelperMessage } from '@atlaskit/form';
import SectionMessage from '@atlaskit/section-message';
import Textfield from "@atlaskit/textfield";
import {get, set, cloneDeep} from 'lodash';
import {languagePath} from './constants';
import './JuiceBoxSection.scss';

const JuiceBoxSection = ({selectedOrder, setSelectedOrder, isDisabled}) => {

    const [language, setLanguage] = useState(get(selectedOrder,languagePath));
    const orderClone = useMemo(()=>cloneDeep(selectedOrder),[selectedOrder]);

    useEffect(() => {
        setLanguage(get(selectedOrder,languagePath));
    },[get(selectedOrder,languagePath)])


    const onLangChange = event => {
        set(orderClone, languagePath, event.target.value);
        setSelectedOrder(orderClone);
    }

    return (
        <div>
            <h2>JuiceBox Fulfillment Order</h2>
            {language === undefined ?
                (<div className="nexus-jb-lang-label">
                    <SectionMessage
                        title="Data not available"
                    >
                        <p>Language not available with this order.</p>
                    </SectionMessage>
                </div>) :
                (<div>
                    <label htmlFor="jb-lang" className="nexus-jb-lang-label"><h4>Language: </h4></label>
                    <div className="nexus-jb-lang-input">
                        <Textfield
                            className="nexus-jb-lang-input_textfield"
                            name="juicebox-lang"
                            id="jb-lang"
                            value={language || ''}
                            onChange={onLangChange}
                            isDisabled={isDisabled}
                        />
                    </div>
                    {!isDisabled &&
                    <HelperMessage>
                        Type to change language
                    </HelperMessage>
                    }

                </div>)
            }
        </div>

    )
}

JuiceBoxSection.propTypes = {
    selectedOrder: PropTypes.object.isRequired,
    setSelectedOrder: PropTypes.func.isRequired,
    isDisabled: PropTypes.bool.isRequired,
};


export default JuiceBoxSection;
