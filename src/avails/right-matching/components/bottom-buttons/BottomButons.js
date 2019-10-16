import React from 'react';
import PropType from 'prop-types';
import Button, {ButtonGroup} from '@atlaskit/button';
import './BottomButons.scss';

function BottomButtons({buttons}) {
    
    return (
        <div className="nexus-c-right-to-match-view__buttons">
            <ButtonGroup>
                {buttons.map((button, index) => <Button
                        key={index}
                        className="nexus-c-button"
                        onClick={button.onClick}
                        isDisabled={button.isDisabled}
                        appearance={button.appearance}
                    >
                        {button.name}
                    </Button>
                )}
            </ButtonGroup>
        </div>
    );
}

BottomButtons.propTypes = {
    buttons: PropType.array.isRequired
};

export default BottomButtons;