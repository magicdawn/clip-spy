#!/usr/bin/env ts-node

import addon from '../addon'

console.log(addon.macGet('public.utf8-plain-text'))

console.log(addon.macSet('some.custom.type', Buffer.from('Hello World')))
console.log(addon.macGet('some.custom.type'))

