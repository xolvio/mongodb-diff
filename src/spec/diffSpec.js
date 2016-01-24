import {diff} from '../lib/index';

describe('diff', function () {
  describe('property updates', function () {
    describe('a change of a property', function () {
      it('adds the update to $set', function () {
        const a = {foo: 'a'};
        const b = {foo: 'b'};
        expect(diff(a, b)).toEqual({$set: {foo: 'b'}});
      });
    });

    describe('a change in a nested property', function () {
      it('adds the update to $set', function () {
        const a = {foo: {bar: 'a'}};
        const b = {foo: {bar: 'b'}};
        expect(diff(a, b)).toEqual({$set: {'foo.bar': 'b'}});
      });
    });

    describe('an added property', function () {
      it('adds the property update to $set', function () {
        const a = {};
        const b = {foo: 'a'};
        expect(diff(a, b)).toEqual({$set: {foo: 'a'}});
      });
    });

    describe('an added nested property', function () {
      it('adds the property update to $set', function () {
        const a = {foo: {}};
        const b = {foo: {bar: 'a'}};
        expect(diff(a, b)).toEqual({$set: {'foo.bar': 'a'}});
      });
    });

    describe('a removed property', function () {
      it('adds the property update to $unset', function () {
        const a = {foo: 'a'};
        const b = {};
        expect(diff(a, b)).toEqual({$unset: {foo: true}});
      });
    });

    describe('a removed nested property', function () {
      it('adds the property update to $unset', function () {
        const a = {foo: {bar: 'a'}};
        const b = {foo: {}};
        expect(diff(a, b)).toEqual({$unset: {'foo.bar': true}});
      });
    });
  });

  describe('array updates', function () {
    describe('a pushed value in an array', function () {
      it('adds the value via $push', function () {
        const a = {foo: ['a']};
        const b = {foo: ['a', 'b']};
        expect(diff(a, b)).toEqual({$push: {'foo': 'b'}});
      });
    });

    describe('two pushed values in an array', function () {
      it('adds the value via $push', function () {
        const a = {foo: ['a']};
        const b = {foo: ['a', 'b', 'c']};
        expect(diff(a, b)).toEqual({$push: {'foo': {$each: ['b', 'c']}}});
      });
    });

    describe('a shifted value in an array', function () {
      it('updates the array via $set', function () {
        const a = {foo: ['b']};
        const b = {foo: ['a', 'b']};
        expect(diff(a, b)).toEqual({$set: {'foo': ['a', 'b']}});
      });
    });

    describe('an inserted value in the middle of an array', function () {
      it('updates the array via $set', function () {
        const a = {foo: ['a', 'c']};
        const b = {foo: ['a', 'b', 'c']};
        expect(diff(a, b)).toEqual({$set: {'foo': ['a', 'b', 'c']}});
      });
    });

    describe('a removed value in an array', function () {
      it('updates the array via $pull', function () {
        const a = {foo: ['a']};
        const b = {foo: []};
        expect(diff(a, b)).toEqual({$pull: {'foo': 'a'}});
      });
    });

    describe('a removed value in an array that is contained multiple times', function () {
      it('updates the array via $set', function () {
        const a = {foo: ['a', 'a']};
        const b = {foo: ['a']};
        expect(diff(a, b)).toEqual({$set: {'foo': ['a']}});
      });
    });

    describe('two removed values in an array', function () {
      it('updates the array via $pull', function () {
        const a = {foo: ['a', 'b']};
        const b = {foo: []};
        expect(diff(a, b)).toEqual({$pull: {'foo': {$each: ['a', 'b']}}});
      });
    });

    describe('a removed and added value in an array', function () {
      it('updates the array via $set', function () {
        const a = {foo: ['a', 'b']};
        const b = {foo: ['a', 'c']};
        expect(diff(a, b)).toEqual({$set: {'foo': ['a', 'c']}});
      });
    });
  });
});
