'use babel'

import filesystem from 'fs'
import { join as d } from 'path'
import { CompositeDisposable } from 'atom'

import devtools from './src/dev'

let subscriptions
let pack = 'alerion-syntax'
let path = atom.packages.getLoadedPackage(pack).path
let fp = d(path, 'styles', 'user.less')

let settings = [
  {
    key: `intensity`,
    cmd: writeLessVariable,
  },
  {
    key: `color_scheme`,
    cmd: writeLessVariable,
  }
]


export default {

  activate: () => {
    subscriptions = new CompositeDisposable()
    atom.commands.add('atom-text-editor', {
      // 'alerion-syntax:display-cursor-scope': () => subscriptions.add(devtools()),
      'alerion-syntax:display-cursor-scope': () => devtools(),
    })
    // if (atom.devMode)
    //   devtools()

    // settings.forEach(
    //   ({ key, cmd }) =>
    let cmd = writeLessVariable
      subscriptions.add(
        atom.config.observe(`${pack}`, (...conf) => cmd(...conf)
      // )
    ))
  },

  deactivate: () =>
    subscriptions.dispose(),

}
// "Hope":     [ 211, 338, 164],
// "Cold":     [ 211, 338, 164],
// "Autumn":   [ 211, 338, 164 ]


function writeLessVariable (config) {

  try {
    let stream = Object
      .keys(config)
      .map(key => `@${key}:${Array(30-key.length).join(' ')}${config[key]};`)
      .join('\n')

    filesystem
      .readFileSync(fp)
    filesystem
      .writeFile(fp, stream + '\n', 'utf8',
      err => {
        let { themes } = atom
        themes.applyStylesheet('alerion',
        themes.loadLessStylesheet( fp ))
        // themes.refreshLessCache()
      })
  }

  catch(e) {
    console.warn(e)
    try {
    let error = (`
      Error: ${e.message}
      ${Object.keys(e).map(p => p + ': ' + e[p] )}
      <h3>Writing new colors failed</h3>
      Please restart Atom and try again :(
        Sorry for any inconvenience
    `)
    console.warn(e, error)
    atom.notifications.addError(error, {
      html: true,
      dismissable: true,
    })
    }
    catch (e2) {
      console.error(e2)
      console.error({...e2})
    }
  }
}
