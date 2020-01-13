export default function booleanFilterCellRenderer(params) {
    return `<span>${params.value === 'true' ? 'Yes' : 'No'}</span>`;
}