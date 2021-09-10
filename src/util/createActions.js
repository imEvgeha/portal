export default type => (payload, meta) => ({
    type,
    payload,
    error: payload instanceof Error,
    meta,
});
