'use strict';

var common = require('./common');
var assert = common.assert;
var sinon = common.sinon;

var InstanceResource = require('../lib/resource/InstanceResource');
var FactorInstantiator = require('../lib/resource/FactorInstantiator');
var FactorConstructor = FactorInstantiator.Constructor;
var SmsFactor = require('../lib/resource/SmsFactor');
var GoogleAuthenticatorFactor = require('../lib/resource/GoogleAuthenticatorFactor');

describe('FactorInstantiator#Constructor', function() {
  var sandbox;

  before(function() {
    sandbox = sinon.sandbox.create();
  });

  after(function() {
    sandbox.restore();
  });

  it('should inherit from InstanceResource', function() {
    assert.equal(FactorConstructor.super_, InstanceResource);
  });
});

describe('FactorInstantiator#getConstructor', function() {
  var sandbox;
  var getConstructor;

  before(function() {
    sandbox = sinon.sandbox.create();
    getConstructor = FactorInstantiator.getConstructor;
  });

  after(function() {
    sandbox.restore();
  });

  it('should throw an error if called without any parameters', function() {
    assert.throws(getConstructor, Error, 'Factor instances must have a defined type');
  });

  it('should throw an error if called without a type parameter', function() {
    assert.throws(getConstructor.bind(null, {}), Error, 'Factor instances must have a defined type');
  });

  it('should throw an error if called with an invalid type parameter', function() {
    assert.throws(
      getConstructor.bind(null, {type: 'fake'}),
      Error,
      'Unknown factor type `fake`'
    );
  });

  it('should not throw an error if called with a valid type (sms or google-authenticator)', function() {
    assert.doesNotThrow(getConstructor.bind(null, {type: 'SMS'}), Error);
    assert.doesNotThrow(getConstructor.bind(null, {type: 'google-authenticator'}), Error);
  });

  it('should construct an SmsFactor if the type is `SMS`, regardless of capitalization', function() {
    assert.equal(getConstructor({type: 'sms'}), SmsFactor);
    assert.equal(getConstructor({type: 'SMS'}), SmsFactor);
    assert.equal(getConstructor({type: 'sMs'}), SmsFactor);
  });

  it('should construct an GoogleAuthenticatorFactor if the type is `google-authenticator`, regardless of capitalization', function() {
    assert.equal(getConstructor({type: 'google-authenticator'}), GoogleAuthenticatorFactor);
    assert.equal(getConstructor({type: 'GOOGLE-AUTHENTICATOR'}), GoogleAuthenticatorFactor);
    assert.equal(getConstructor({type: 'Google-Authenticator'}), GoogleAuthenticatorFactor);
  });
});
