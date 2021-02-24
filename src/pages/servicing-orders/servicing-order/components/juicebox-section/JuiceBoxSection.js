import React, {useState} from 'react';
import PropTypes from "prop-types";
import { HelperMessage } from '@atlaskit/form';
import Textfield from "@atlaskit/textfield";
import './JuiceBoxSection.scss';

const JuiceBoxSection = ({language}) => {
    const [lang, setLang] = useState(language);


    return (
        <div>
            <h2>JuiceBox Fulfillment Order</h2>
            <label htmlFor="jb-lang" className="nexus-jb-lang-label"><h4>Language: </h4></label>
            <div className="nexus-jb-lang-input">
                <Textfield
                    name="juicebox-lang"
                    id="jb-lang"
                    value={lang}
                    onChange={e => setLang(e.target.value)}
                />
            </div>

            <HelperMessage>
                Type to change language
            </HelperMessage>
        </div>

    )
}

JuiceBoxSection.propTypes = {
    language: PropTypes.string,
};

JuiceBoxSection.defaultProps = {
    language: '',
};

export default JuiceBoxSection;
