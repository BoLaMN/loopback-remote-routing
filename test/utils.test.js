var utils     = require('../utils.js');
var prefixes  = require('../lib/prefixes.js');
var expect    = require('chai').expect;
var app       = require('loopback')();

describe('Utils', function() {

  var db, Color, Palatee, defaultMethods;

  before(function() {
    defaultMethods = [
      '@create',
      '@upsert',
      '@exists',
      '@exists',
      '@findById',
      '@find',
      '@findOne',
      '@updateAll',
      '@deleteById',
      '@count',
      'updateAttributes',
      '@createChangeStream',
      '@createChangeStream'
    ];

    db = app.dataSource('db', {adapter: 'memory'});
    Color = app.model('color', { dataSource: 'db' });
    Palatee = app.model('palatee', {dataSource: 'db'});

    Color.hasMany(Palatee);
  });

  describe('.isStatic', function() {
    it('determine whether a remote method is static or not', function() {
      var staticMethod = 'find';
      var instanceMethod = 'prototype.__get__tags';

      expect(utils.isStatic(staticMethod)).to.be.true;
      expect(utils.isStatic(instanceMethod)).to.be.false;
    });
  });

  describe('.remoteMethods', function() {

    it('returns all available remote methods of a model', function(){
      var colorRemoteMethods = prefixes.hasMany.map(function(method) {
        return [method, 'palatees'].join('');
      }).concat(defaultMethods).sort();

      expect(utils.remoteMethods(Color).sort()).to.eql(colorRemoteMethods);
    });
  });

  describe('.handleOnlyOption', function() {
    it('only returns remote methods except the specifed ones', function() {
      var all = prefixes.embedsOne;
      var wanted = ['__create__', '__update__'];
      expect(utils.handleOnlyOption(all, wanted)).to.eql([
        '__get__',
        '__destroy__'
      ]);
    });
  });

  describe('.handleExceptOption', function() {
    it('returns remoth methods matches the specifed ones', function() {
      var all = prefixes.embedsOne;
      var unwanted = ['__create__', '__update__'];
      expect(utils.handleExceptOption(all, unwanted)).to.eql([
        '__create__',
        '__update__'
      ]);
    });

    it('disable remote methods available on the model', function() {
      var all = prefixes.embedsOne;
      var unwanted = ['__create__', '__not_exist__'];
      expect(utils.handleExceptOption(all, unwanted)).to.eql([
        '__create__',
      ]);
    });
  });
});
