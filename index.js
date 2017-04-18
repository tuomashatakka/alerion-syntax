'use babel'
import { CompositeDisposable } from 'atom'
import devtools from './src/dev'

let subscriptions
let pack = 'alerion-syntax'

export default {

  activate: () => {
    subscriptions = new CompositeDisposable()
    atom.commands.add('atom-text-editor', {
      // 'alerion-syntax:display-cursor-scope': () => subscriptions.add(devtools()),
      'alerion-syntax:display-cursor-scope': () => devtools(),
    })
    if (atom.devMode)
      devtools()

    subscriptions.add(atom.config.observe(`${pack}.intensity`, (...args) => writeLessVariable('intensity', ...args)))
  },

  deactivate: () => {
    subscriptions.dispose()
  },

}


function writeLessVariable (key, val, ...args) {
  const filesystem = require('fs')
  const { join: d } = require('path')
  const path = atom.packages.getLoadedPackage(pack).path
  let fp = d(path, 'styles', 'user.less')
  let c = filesystem.readFileSync(fp, 'utf8')
  let w = filesystem.writeFileSync(fp, `@${key}: ${val};`)
  console.info(c, w)
}
