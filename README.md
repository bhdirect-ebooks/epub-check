# epub-check

Asychronously validate an expanded EPUB with Node ^7.6, using the most recent release of [epubcheck](https://github.com/IDPF/epubcheck), currently v4.0.2.

## Install

```
yarn add epub-check
```

## Usage

Require or import as `epubCheck`, then call `epubCheck('path/to/expanded/epub/directory')`.

`epubCheck` then returns a Promise which resolves with an object that includes pass/fail data, and an array of error and warning messages*, if any.

```
{ pass: true, messages: [] }
```

or

```
{ pass: false,
  messages: [{
    'type': '',  // epubcheck message type, e.g. 'ERROR(RSC-012)'
    'file': '',  // file path and name, relative to the given directory
    'line': '',  // line number
    'col': '',   // column number
    'msg': ''    // error or warning message, e.g. 'Fragment identifier is not defined.'
    }
  ]
}
```

*This package supresses warnings about any "non-standard font media type." So, feel free to use [standardized font media types](https://www.iana.org/assignments/media-types/media-types.xhtml#font) without [getting bugged about it](https://github.com/IDPF/epubcheck/issues/339).
