import log from '../log';

const err = new Error('Foo');
log.info(err);
log.warn(err);
log.error(err);

log.info();

log.info();
log.info('info');
log.warn('warn');
log.error('error');

const colors = `
colors:
  ${log.black('black')}
  ${log.blue('blue')}
  ${log.cyan('cyan')}
  ${log.gray('gray')}
  ${log.green('green')}
  ${log.magenta('magenta')}
  ${log.red('red')}
  ${log.white('white')}
  ${log.yellow('yellow')}

`;
log.info(colors);

log.info('object', { foo: 123 });
log.info();
