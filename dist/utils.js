export const success = (v) => {
    return {
        status: 'SUCCESS',
        value: v,
    };
};
export const failure = (v) => {
    return {
        status: 'FAILURE',
        value: v,
    };
};
export const isSuccess = (either) => either.status === 'SUCCESS';
export const isFailure = (either) => either.status === 'FAILURE';
export const valueOf = (either) => either.value;
export const fold = (either, { onSuccess, onFailure, }) => (isSuccess(either) ? onSuccess(either.value) : onFailure(either.value));
export const isLiteralSchema = (schema) => schema.schema === 'string-literal' || schema.schema === 'number-literal';
export const isRecordSchema = (schema) => schema.schema === 'record';
//# sourceMappingURL=utils.js.map