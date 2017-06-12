#!/usr/bin/env node
'use strict';

const path = require('path');
const remove = require('lodash.remove');
const execAsync = require('async-child-process').execAsync;
const shellEscape = require('shell-escape');
const epubcheck_path = path.resolve(__dirname, 'lib/epubcheck');


async function epubCheck(dir_path) {
  const args = ['java', '-jar', `${epubcheck_path}/epubcheck.jar`, dir_path, '--quiet', '--mode', 'exp', '-c', `${epubcheck_path}/custom-msg.txt`];
  const command = shellEscape(args);
  let result = await processExecData(command);
  return result;

  async function processExecData(command) {
    let output = await execAsync(command)
      .then(res => {return res;}).catch(err => {return err;});
    output = output.toString();
    let lines = output.split("\n");

    if (lines.length > 1) {
      lines = lines.map(line => {
        // Replace path in logs to make it cleaner
        line = line.replace(new RegExp(`${dir_path}.epub/`, 'g'), '');

        // Split err messages for object
        const parts = line.split(': ');
        const type = parts[0];
        const loc = parts[1];
        const loc_regex = /^(.*?)\(([^\,]+),([^\)]+)\)/;
        const loc_arr = loc_regex.exec(loc);
        let file = '',
            line_num = '',
            col = '';

        if (loc_arr) {
          file = loc_arr[1];
          line_num = loc_arr[2];
          col = loc_arr[3];
        }

        const msg = parts[2];

        return {
          'type': type,
          'file': file,
          'line': line_num,
          'col': col,
          'msg': msg
        };
      });

      remove(lines, l => {
        return !l.file;
      });

      return {
        pass: false,
        messages: lines
      };
    } else {
      return {
        pass: true,
        messages: []
      };
    }
  }
}

module.exports = epubCheck;