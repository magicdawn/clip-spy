#!/usr/bin/env ts-node

import {macClear, macGet, macSet} from '../addon'

// convenient
// format is the first parameter & required
export const macGetText = (format: string) => macGet(format).toString('utf8')
export const macSetText = (format: string, text: string) => macSet(format, Buffer.from(text))

// format
export const FORMAT_PLAIN_TEXT = 'public.utf8-plain-text'
export const FORMAT_FILE_URL = 'public.file-url'

export {macClear, macGet, macSet}
