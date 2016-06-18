# js-util-log
A simple and colorful logger abstraction.




## Install
    npm install -S js-util-log


## Usage

```js
import log from 'js-util-log';

log.info('one', 2, 'three');
log.info();
log.warn(`${ value }` and ${ number });
log.error('Fail!');

```

#### Colors
Colors are created using [chalk](https://www.npmjs.com/package/chalk) and exposed from the log API for convenience.

- black
- red
- green
- yellow
- blue
- magenta
- cyan
- white
- gray



Turn an entire line into a color:
```js
log.info.cyan('----------------------------------------');
log.info.cyan('   Whole line is cyan');
log.info.cyan('----------------------------------------');
```


or apply a color to a single word only:

```js
log.info(`This is the ${ log.green('number') } of the winner.`);
```




## Tests

    npm test


---
### License: MIT
