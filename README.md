# Clip-Spy

clipboard api for Node.js & Electron via rust napi bindings.

## Install

```sh
npm i clip-spy -S
```

## API

### macOS

- `macClear` clear pasteboard
- `macGet(format) -> Buffer` get buffer via format string
- `macSet(format, Buffer)` set buffer via format string & buffer data
- `macGetText(format) -> string` get string via format
- `macSetText(format, string) -> string` set string via format

### windows / linux / ...

unimplemented. (cannot setup dev environment)
