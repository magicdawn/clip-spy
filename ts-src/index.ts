#!/usr/bin/env ts-node

import addon from '../addon'

console.log(addon.get('public.utf8-plain-text'))

console.log(addon.set('some.custom.type', Buffer.from('Hello World')))
console.log(addon.get('some.custom.type'))

