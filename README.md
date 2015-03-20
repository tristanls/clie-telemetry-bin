# clie-telemetry-bin
Executable wrapper for [clie](https://github.com/tristanls/clie) incorporating telemetry events and logs.

## Example `bin/cli.js` for your [clie](https://github.com/tristanls/clie) app

```javascript
#!/usr/bin/env node
"use strict";

var bin = require('clie-telemetry-bin');
var path = require('path');
var pkg = require('../package.json');

var commandsDirectory = path.normalize(path.join(__dirname, '..', 'commands'));

bin(pkg, commandsDirectory);
```
