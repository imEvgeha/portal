export class Action {
    icon;
    action;
    position;
    disabled;
    buttonId;

    constructor(props) {
        const {icon, action, position, disabled, buttonId} = props;
        this.icon = icon;
        this.action = action;
        this.position = position;
        this.disabled = disabled;
        this.buttonId = buttonId;
    }
}
