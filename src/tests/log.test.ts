import log from '../log';
import { COLORS, METHODS } from '../log';
import { expect } from 'chai';
import * as chalk from 'chalk';



describe('logging to console (NB: Tests hidden because this mucks with the console)', function() {
  let items;
  let fnLog;
  beforeEach(() => {
    fnLog = console.log;
    items = [];
    console.log = (value) => items.push(value);
  });
  afterEach(() => {
    console.log = fnLog;
    log.silent = false;
  });



  it('logs a single value', () => {
    log.info('info');
    log.warn('warn');
    log.error('error');
    expect(items[0]).to.equal('info');
    expect(items[1]).to.equal('warn');
    expect(items[2]).to.contain('error');
  });


  it('logs multiple parameter values', () => {
    log.info('my', 'info');
    log.warn('my', 'warn');
    log.error('my', 'error');

    expect(items[0]).to.equal('my info');
    expect(items[1]).to.equal('my warn');
    expect(items[2]).to.contain('my error');
  });



  it('is not silent by default', () => {
    expect(log.silent).to.equal(false);
  });


  it('does not log when silent', () => {
    log.silent = true;
    log.info(1);
    log.warn(2);
    log.error(3);
    expect(items).to.eql([]);
  });


  it('has a colors methods for each log method', () => {
    METHODS.forEach(method => {
      COLORS.forEach(color => {
        expect(log[method][color]).to.be.an.instanceof(Function);
        log[method][color]('abc');
        log[method][color]('foo', 'bar');
        expect(items[0]).to.contain('abc');
        expect(items[1]).to.contain('foo');
        expect(items[1]).to.contain('bar');
      });
    });
  });


  it('exposes raw color methods for formatting', () => {
    COLORS.forEach(color => {
      expect(log[color]('foo')).to.equal(chalk[color]('foo'));
    });
  });


  it('logs an error stack from all methods', () => {
    const err = new Error('Foo');
    log.info(err);
    log.warn(err);
    log.error(err);
    expect(items[0]).to.contain(err.stack);
    expect(items[1]).to.contain(err.stack);
    expect(items[2]).to.contain(err.stack);
  });


  it('converts errors to red', () => {
    const red = chalk.red('red');
    log.error('red');
    expect(items[0]).to.equal(red);
  });


  it('converts object to YAML string (with circular reference)', () => {
    const obj: any = {
      foo: 123,
      bar: {
        one: 1,
        two: 2,
      },
      array: [1, 2, 3],
    };
    const ref = { obj };
    obj.circular = ref;
    log.info('foo', obj);
    expect(items[0]).to.contain('&ref_0\n');
    expect(items[0]).to.contain('foo \n');
    expect(items[0]).to.contain('foo: 123\n');
  });
});
