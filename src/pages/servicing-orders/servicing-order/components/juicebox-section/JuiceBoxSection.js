import React, {useState, useEffect, useMemo} from 'react';
import PropTypes from 'prop-types';
import { HelperMessage } from '@atlaskit/form';
import SectionMessage from '@atlaskit/section-message';
import Textfield from "@atlaskit/textfield";
import {get, set, cloneDeep} from 'lodash';
import {languagePath} from './constants';
import './JuiceBoxSection.scss';

const JuiceBoxSection = ({selectedOrder, setSelectedOrder}) => {

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
                        title="Invalid JuiceBox data"
                        appearance="error"
                    >
                        <p>The data for this order does not match specifications.</p>
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
                        />
                    </div>

                    <HelperMessage>
                        Type to change language
                    </HelperMessage>
                </div>)
            }
        </div>

    )
}

JuiceBoxSection.propTypes = {
    selectedOrder: PropTypes.object.isRequired,
    setSelectedOrder: PropTypes.func.isRequired,
};


export default JuiceBoxSection;
