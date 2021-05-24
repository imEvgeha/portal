export default function getContextMenuItems(params, link) {
    const url = params.node && params.node.data ? `${link}/${params.node.data.id}` : null;
    return [
        'copy',
        'copyWithHeaders',
        link &&
            url && {
                name: 'Open link in new tab ',
                action: () => {
                    window.open(url, '_blank');
                },
            },
    ];
}
