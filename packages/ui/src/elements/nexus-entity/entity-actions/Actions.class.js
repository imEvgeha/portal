export class Action {
    icon;
    action;
    position;
    disabled;
    buttonId;

    constructor(icon, action, position, disabled, buttonId) {
        this.icon = icon;
        this.action = action;
        this.position = position;
        this.disabled = disabled;
        this.buttonId = buttonId;
    }
}
