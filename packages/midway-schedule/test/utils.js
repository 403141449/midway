'use strict';

const fs = require('fs');
const path = require('path');
const mm = require('egg-mock');
const logDir = path.join(__dirname, '../logs');

process.setMaxListeners(0);

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

exports.app = function app(name, options) {
  options = formatOptions(name, options);
  // mm.consoleLevel(options.consoleLevel || 'NONE');
  const app = mm.app(options);
  app.close = () => {
    fs.rmdirSync(path.join(app.baseDir, 'run'));
    return app.close;
  };
  return app;
};

exports.cluster = function cluster(name, options) {
  options = formatOptions(name, options);
  return mm.cluster(options);
};

function formatOptions(name, options = {}) {
  return Object.assign(
    {},
    {
      baseDir: name,
      framework: path.join(__dirname, '../../midway'),
      // 默认关闭覆盖率，太慢
      coverage: false,
      cache: false,
    },
    options,
  );
}
