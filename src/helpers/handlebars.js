import _ from 'lodash';

export function printValue(arg1) {
    return _.isUndefined(arg1) ? '----' : arg1;
}

export function eq(arg1, arg2) {
    return arg1 === arg2;
}

export function and(...args) {
    return args.slice(0, -1).reduce((sum, el) => sum && el, true);
}
