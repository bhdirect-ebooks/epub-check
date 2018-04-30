#!/usr/bin/env node
const path = require('path')
const spawnAsync = require('@expo/spawn-async')
const epubcheck_path = path.resolve(__dirname, 'lib/epubcheck')

function linesToMessages(dir_path, lines) {
  return lines
    .map(line => {
      // Replace path in logs to make it cleaner
      // Split err messages for object
      const parts = line
        .replace(new RegExp(`${dir_path}.epub/`, 'g'), '')
        .split(': ')
      const loc = parts[1]
      const loc_regex = /^(.*?)\(([^,]+),([^)]+)\)/
      const loc_arr = loc_regex.exec(loc)

      return {
        type: parts[0],
        file: loc_arr ? loc_arr[1] : '',
        line: loc_arr ? loc_arr[2] : '',
        col: loc_arr ? loc_arr[3] : '',
        msg: parts[2],
      }
    })
    .filter(l => !!l.file) // filter noise (errors always have a file property)
}

async function processExecData(dir_path, command, args) {
  const output = await spawnAsync(command, args)
    .then(({ stdout }) => {
      return stdout
    })
    .catch(({ stderr }) => {
      return stderr
    })

  const lines = output.toString().split('\n')

  return lines.length > 1
    ? {
        pass: false,
        messages: linesToMessages(dir_path, lines),
      }
    : {
        pass: true,
        messages: [],
      }
}

function epubCheck(dir_path) {
  const args = [
    '-jar',
    `${epubcheck_path}/epubcheck.jar`,
    dir_path,
    '--quiet',
    '--mode',
    'exp',
    '-c',
    `${epubcheck_path}/custom-msg.txt`,
  ]
  return processExecData(dir_path, 'java', args)
}

module.exports = epubCheck
