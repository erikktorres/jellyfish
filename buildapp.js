/* global rm, mkdir, exec, ls*/
require('shelljs/global');
var fs = require('fs');
var ms = require('ms');

var start = new Date();

console.log('Cleaning output directory "dist/"...');
rm('-rf', 'dist');
mkdir('-p', 'dist');

console.log('Building app...');
exec('webpack --entry \'./client/main.prod.js\' --output-file \'bundle.[hash].js\' --devtool source-map --colors --progress');

function getBundleFilename() {
  var matches = ls('dist/bundle.*.js');
  if (!(matches && matches.length)) {
    throw new Error('Expected to find "dist/bundle.[hash].js"');
  }
  return matches[0].replace('dist/', '');
}

console.log('Copying "index.html"...');
var indexHtml = fs.readFileSync('client/index.html', 'utf8');
indexHtml = indexHtml.replace('bundle.js', getBundleFilename());
indexHtml.to('dist/index.html');

var end = new Date();
console.log('App built in ' + ms(end - start));
