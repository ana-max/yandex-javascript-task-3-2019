/* eslint-env mocha */
'use strict';


const assert = require('assert');

const check = require('./check');

describe('CheckForNull', function () {
    const wrappedNull = check.wrap(null);
    const wrappedString = check.wrap('hello');
    const wrappedObject = check.wrap({ name: 'John', age: 20 });
    const wrappedArray = check.wrap([1, 2, 3]);
    const wrappedFunc = check.wrap(function (a, b) {
        return a + b;
    });
    const wrappedNumber = check.wrap(1);
    it('should wrapped null', function () {
        assert.ok(wrappedNull.isNull());
        assert.ok(wrappedNull.not.containsKeys([]));
        assert.ok(wrappedNull.not.hasKeys([]));
        assert.ok(!wrappedNull.containsValues([]));
        assert.ok(!wrappedNull.hasValues([]));
        assert.ok(!wrappedNull.hasLength(0));
        assert.ok(!wrappedNull.hasParamsCount(0));
        assert.ok(!wrappedNull.hasWordsCount(0));
        assert.ok(!wrappedNull.hasValueType([]));
    });
    it('should wrapped string', function () {
        assert.ok(!wrappedString.isNull());
        assert.ok(!wrappedString.containsKeys([]));
        assert.ok(!wrappedString.hasKeys([]));
        assert.ok(!wrappedString.containsValues([]));
        assert.ok(!wrappedString.hasValues([]));
        assert.ok(wrappedString.hasLength(5));
        assert.ok(!wrappedString.not.hasLength(5));
        assert.ok(!wrappedString.hasParamsCount(0));
        assert.ok(wrappedString.hasWordsCount(1));
        assert.ok(!wrappedString.hasValueType([]));
    });
    it('should wrapped array', function () {
        assert.ok(!wrappedArray.isNull());
        assert.ok(wrappedArray.containsKeys([]));
        assert.ok(wrappedArray.hasKeys(['0', '1', '2']));
        assert.ok(wrappedArray.containsValues([]));
        assert.ok(wrappedArray.hasValues([1, 2, 3]));
        assert.ok(wrappedArray.hasLength(3));
        assert.ok(!wrappedArray.hasParamsCount(0));
        assert.ok(!wrappedArray.hasWordsCount(1));
        assert.ok(wrappedArray.hasValueType('0', Number));
    });
    it('should wrapped object', function () {
        assert.ok(!wrappedObject.isNull());
        assert.ok(wrappedObject.containsKeys([]));
        assert.ok(wrappedObject.hasKeys(['name', 'age']));
        assert.ok(wrappedObject.containsValues(['John', 20]));
        assert.ok(wrappedObject.hasValues(['John', 20]));
        assert.ok(!wrappedObject.hasLength(3));
        assert.ok(!wrappedObject.hasParamsCount(0));
        assert.ok(!wrappedObject.hasWordsCount(1));
        assert.ok(wrappedObject.hasValueType('age', Number));
    });
    it('should wrapped func', function () {
        assert.ok(!wrappedFunc.isNull());
        assert.ok(!wrappedFunc.containsKeys([]));
        assert.ok(!wrappedFunc.hasKeys([]));
        assert.ok(!wrappedFunc.containsValues([]));
        assert.ok(!wrappedFunc.hasValues([]));
        assert.ok(!wrappedFunc.hasLength(3));
        assert.ok(wrappedFunc.hasParamsCount(2));
        assert.ok(!wrappedFunc.hasWordsCount(1));
        assert.ok(!wrappedFunc.hasValueType('0', Number));
    });
    it('should wrapped number', function () {
        assert.ok(!wrappedNumber.isNull());
        assert.ok(!wrappedNumber.containsKeys([]));
        assert.ok(!wrappedNumber.hasKeys([]));
        assert.ok(!wrappedNumber.containsValues([]));
        assert.ok(!wrappedNumber.hasValues([]));
        assert.ok(!wrappedNumber.hasLength(3));
        assert.ok(!wrappedNumber.hasParamsCount(2));
        assert.ok(!wrappedNumber.hasWordsCount(1));
        assert.ok(!wrappedNumber.hasValueType('0', Number));
    });
});
const wrappedNull = check.wrap(null);

wrappedNull.isNull(); // true
wrappedNull.hasLength(5); // false

const wrappedString = check.wrap('hello');

wrappedString.isNull(); // false
wrappedString.hasLength(5); // true

check.init();

describe('MyCheck', function () {
    const person = { name: 'John', age: 20 };
    const numbers = [1, 2, 3];
    const func = function (a, b) {
        return a + b;
    };
    const str = 'some string';
    it ('should check all methods for object', function () {
        assert.ok(person.check.containsKeys(['name']));
        assert.ok(person.check.containsKeys(['name', 'age']));
        assert.ok(person.check.containsKeys(['age']));
        assert.ok(!person.check.hasKeys(['name']));
        assert.ok(!person.check.hasKeys(['age']));
        assert.ok(person.check.hasKeys(['name', 'age']));
        assert.ok(person.check.containsValues(['John', 20]));
        assert.ok(person.check.containsValues([20, 'John']));
        assert.ok(person.check.hasValues([20, 'John']));
        assert.ok(!person.check.hasValues([20]));
        assert.ok(!person.check.hasValues(['John']));
        assert.ok(!person.check.hasValueType('age', String));
        assert.ok(person.check.hasValueType('age', Number));
        assert.ok(!person.check.hasValueType('name', Number));
        assert.ok(person.check.hasValueType('name', String));
    });
    it ('should negation all methods for object', function () {
        assert.ok(!person.check.not.containsKeys(['name']));
        assert.ok(!person.check.not.containsKeys(['name', 'age']));
        assert.ok(!person.check.not.containsKeys(['age']));
        assert.ok(person.check.not.hasKeys(['name']));
        assert.ok(person.check.not.hasKeys(['age']));
        assert.ok(!person.check.not.hasKeys(['name', 'age']));
        assert.ok(!person.check.not.containsValues(['John', 20]));
        assert.ok(!person.check.not.containsValues([20, 'John']));
        assert.ok(!person.check.not.hasValues([20, 'John']));
        assert.ok(person.check.not.hasValues([20]));
        assert.ok(person.check.not.hasValues(['John']));
        assert.ok(person.check.not.hasValueType('age', String));
        assert.ok(!person.check.not.hasValueType('age', Number));
        assert.ok(person.check.not.hasValueType('name', Number));
        assert.ok(!person.check.not.hasValueType('name', String));
    });
    it ('should negation all methods for array', function () {
        assert.ok(!numbers.check.not.containsKeys(['0', '2', '1']));
        assert.ok(numbers.check.not.hasKeys(['0', '2']));
        assert.ok(!numbers.check.not.hasKeys(['0', '2', '1']));
        assert.ok(!numbers.check.not.containsValues([1, 2, 3]));
        assert.ok(!numbers.check.not.containsValues([3, 2]));
        assert.ok(!numbers.check.not.hasValues([3, 2, 1]));
        assert.ok(numbers.check.not.hasValues([1, 2]));
        assert.ok(numbers.check.not.hasValueType('0', String));
        assert.ok(!numbers.check.not.hasValueType('0', Number));
        assert.ok(!numbers.check.not.hasLength(3));
        assert.ok(numbers.check.not.hasLength(1));
        assert.ok(numbers.check.not.hasLength(4));
    });
    it ('should check all methods for array', function () {
        assert.ok(numbers.check.containsKeys(['0', '2', '1']));
        assert.ok(!numbers.check.hasKeys(['0', '2']));
        assert.ok(numbers.check.hasKeys(['0', '2', '1']));
        assert.ok(numbers.check.containsValues([1, 2, 3]));
        assert.ok(numbers.check.containsValues([3, 2]));
        assert.ok(numbers.check.hasValues([3, 2, 1]));
        assert.ok(!numbers.check.hasValues([1, 2]));
        assert.ok(!numbers.check.hasValueType('0', String));
        assert.ok(numbers.check.hasValueType('0', Number));
        assert.ok(numbers.check.hasLength(3));
        assert.ok(!numbers.check.hasLength(1));
        assert.ok(!numbers.check.hasLength(4));
    });
    it('should check all methods for string', function () {
        assert.ok(str.check.hasLength(11));
        assert.ok(str.check.hasWordsCount(2));
        assert.ok(!str.check.not.hasLength(11));
        assert.ok(!str.check.not.hasWordsCount(2));
    });
    it('should check all methods for function', function () {
        assert.ok(func.check.hasParamsCount(2));
        assert.ok(!func.check.not.hasParamsCount(2));
    });
});
describe('Check', function () {
    const person = { name: 'John', age: 20 };
    const numbers = [1, 2, 3];
    const func = function (a, b) {
        return a + b;
    };
    const str = 'some string';
    it('should check that target hasKeys', function () {
        assert.ok(person.check.hasKeys(['name', 'age']));
    });

    it('should check that target hasValueType', function () {
        assert.ok(person.check.hasValueType('name', String));
    });

    it('should check that target hasKeys', function () {
        assert.ok(numbers.check.hasKeys(['0', '1', '2']));
    });

    it('should check that target hasLength', function () {
        assert.ok(numbers.check.hasLength(3));
    });

    it('should check that target containsValues', function () {
        assert.ok(numbers.check.containsValues([2, 1]));
    });

    it('should check that target hasParamsCount', function () {
        assert.ok(func.check.hasParamsCount(2));
    });

    it('should check that target hasWordsCount', function () {
        assert.ok(str.check.hasWordsCount(2));
    });
});
