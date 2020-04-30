'use strict';

exports.init = function () {
    Object.defineProperty(Object.prototype, 'check', {
        get: function () {
            const objectNamespace = getObjectNamespace(this);

            return Object.assign(
                objectNamespace,
                negationProperties(objectNamespace)
            );
        }
    });

    Object.defineProperty(Function.prototype, 'check', {
        get: function () {
            const functionNamespace = getFunctionNamespace(this);

            return Object.assign(
                functionNamespace,
                negationProperties(functionNamespace)
            );
        }
    });

    Object.defineProperty(String.prototype, 'check', {
        get: function () {
            const stringNamespace = getStringNamespace(this);

            return Object.assign(
                stringNamespace,
                negationProperties(stringNamespace)
            );
        }
    });

    Object.defineProperty(Array.prototype, 'check', {
        get: function () {
            // Методы массива включают в себя все методы объекта + одно своё
            const arrayNamespace = Object.assign(
                getObjectNamespace(this),
                getArrayNamespace(this)
            );

            return Object.assign(
                arrayNamespace,
                negationProperties(arrayNamespace)
            );
        }
    });
};

function negationProperties(obj) {
    return { not: Object.keys(obj).reduce((result, current)=> ({
        ...result,
        [current]: (...args) => !obj[current](...args)
    }), [])
    };
}

function getObjectNamespace(context) {
    return {
        hasKeys: (keys) => hasPropertyValues(context, 'keys', keys, containsKeys),
        containsKeys: (keys) => containsKeys(context, keys),
        hasValues: (values) => hasPropertyValues(context, 'values', values, containsValues),
        containsValues: (values) => containsValues(context, values),
        hasValueType: (key, type) => hasValueType(context, key, type)
    };
}

function getFunctionNamespace(context) {
    return {
        hasParamsCount: (count) => hasParamsCount(context, count)
    };
}

function getStringNamespace(context) {
    return {
        hasWordsCount: (count) => hasWordsCount(context, count),
        hasLength: (length) => hasLength(context, length)
    };
}

function getArrayNamespace(context) {
    return {
        hasLength: (length) => hasLength(context, length)
    };
}

/**
 * Обёртка для работы с null
 * @param{Object} obj
 * @returns {Object}
 */
exports.wrap = function (obj) {
    const isNull = () => obj === null;
    const objType = typeof obj;
    const objIsArrayOrObject = (objType === 'object' && !isNull()) || Array.isArray(obj);
    const objIsArrayOrString = objType === 'string' || Array.isArray(obj);
    const objIsFunction = objType === 'function';
    const objIsString = objType === 'string';
    const returnObj = {
        isNull,
        containsKeys: (keys) => objIsArrayOrObject ? containsKeys(obj, keys) : false,
        hasKeys: (keys) => objIsArrayOrObject
            ? hasPropertyValues(obj, 'keys', keys, containsKeys) : false,
        containsValues: (values) => objIsArrayOrObject ? containsValues(obj, values) : false,
        hasValues: (values) => objIsArrayOrObject
            ? hasPropertyValues(obj, 'values', values, containsValues) : false,
        hasValueType: (key, type) => objIsArrayOrObject ? hasValueType(obj, key, type) : false,
        hasLength: (length) => objIsArrayOrString ? hasLength(obj, length) : false,
        hasParamsCount: (count) => objIsFunction ? hasParamsCount(obj, count) : false,
        hasWordsCount: (count) => objIsString ? hasWordsCount(obj, count) : false
    };

    return Object.assign(returnObj, negationProperties(returnObj));
};

/**
 * Определён для объектов и массивов.
 * Проверяет, что цель содержит только указанные ключи или значения.
 * @param{Object} context - объект, из которого вызвали функцию,
 * @param{String} property - название свойства, 'keys' или 'values'
 * @param{Array} propertyValues - ключи,
 * @param{Function}returnFunction - функция, результат которой необходимо вернуть
 * @returns {boolean}
 */
function hasPropertyValues(context, property, propertyValues, returnFunction) {
    const allPropertyValues = property === 'keys' ? Object.keys(context) : Object.values(context);
    if (allPropertyValues.length !== propertyValues.length) {
        return false;
    }

    return returnFunction(context, propertyValues);
}

/**
 * Определён для объектов и массивов.
 * Проверяет, что цель содержит указанные ключи.
 * @param{Object} context - объект, из которого вызвали функцию
 * @param{Array} keys - ключи
 * @returns {boolean}
 */
function containsKeys(context, keys) {
    const allKeys = Object.keys(context);
    for (const key of keys) {
        if (!allKeys.includes(key)) {
            return false;
        }
    }

    return true;
}

/**
 * Определён для объектов и массивов.
 * Проверяет, что цель содержит указанные значения.
 * @param{Object} context - объект, из которого вызвали функцию
 * @param{Array} values - значения
 * @returns {boolean}
 */
function containsValues(context, values) {
    const allValues = Object.values(context);
    for (const value of values) {
        if (!allValues.includes(value)) {
            return false;
        }
    }

    return true;
}

/**
 *  Определён для функций.
 *  Проверяет, что количество аргументов функции соответствует указанному.
 * @param{Object} context - объект, из которого вызывается функция
 * @param{Number} count - указанное количество аргументов
 * @returns {boolean}
 */
function hasParamsCount(context, count) {
    return context.length === count;
}

/**
 * Определён для строк. Проверяет, что количество слов в строке соответствует указанному.
 * Словом считается последовательность символов, отличных от пробела,
 * ограниченная с обеих сторон пробелами или началом/концом строки.
 * @param{Object} context - объект, из котоого вызываем функцию
 * @param{Number} count - указанное количество
 * @returns {boolean}
 */
function hasWordsCount(context, count) {
    const countOfWords = context.split(' ').filter(Boolean).length;

    return countOfWords === count;
}

/**
 * Определён для массивов и строк.
 * Проверяет, что длина цели соответствует указанной.
 * @param{Object} context - объект, из которого вызываем функцию
 * @param{Number} length -указанная длина
 * @returns {boolean}
 */
function hasLength(context, length) {
    return context.length === length;
}

/**
 * Определён для объектов и массивов.
 * Проверяет, что значение по указанному ключу относится к указанному типу.
 * Поддерживаемые типы: String, Number, Function, Array.
 * @param{Object} context - объект, из которого вызываем функцию
 * @param{String} key - ключ
 * @param{Object} type - тип
 * @returns {boolean}
 */
function hasValueType(context, key, type) {
    switch (type) {
        case String:
            return typeof context[key] === 'string';
        case Number:
            return typeof context[key] === 'number';
        case Function:
            return typeof context[key] === 'function';
        case Array:
            return Array.isArray(context[key]);
        default:
            throw new TypeError('Unsupported Type');
    }
}
