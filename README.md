# epub-check

Asycronously validate an expanded EPUB with Node ^7.6 (uses `async` and `await`), using the most recent release of (epubcheck)[https://github.com/IDPF/epubcheck], currently v4.0.2.

## Install

```
yarn add epub-check
```

## Usage

Require or import as `epubCheck`, then call `epubCheck('path/to/expanded/epub/directory')`.

`epubCheck` then returns a promise which resolves with an object that includes pass/fail data, and an array of error and warning messages*, if any.

```
{ pass: true, messages: [] };
```

or

```
{ pass: false,
  messages: [{
    'type': type,
    'file': file,
    'line': line_num,
    'col': col,
    'msg': msg
    },
  ]
}
```

*This package supresses warnings about any "non-standard font media type." So, feel free to use [standardized font media types](https://www.iana.org/assignments/media-types/media-types.xhtml#font) without [getting bugged about it](https://github.com/IDPF/epubcheck/issues/339).