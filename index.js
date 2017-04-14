'use babel'
import { CompositeDisposable } from 'atom'

let change
let statusbar
let subscriptions

const MUTED = ['source', 'html', 'js', 'meta']
const SEPARATOR = `<span class='sep ion ion-ios-arrow-right'></span>`
const getItem = () => {

  let el = document.querySelector('.cursor-scope') ||
           document.createElement('div')
  el.setAttribute('class', 'cursor-scope')
  el.innerHTML = ""
  return el }

let item = getItem()

export default {

  activate: () => {
    subscriptions = new CompositeDisposable()
    atom.commands.add('atom-text-editor', {
      // 'alerion-syntax:display-cursor-scope': () => subscriptions.add(devtools()),
      'alerion-syntax:display-cursor-scope': () => devtools(),
    })
    if (atom.devMode)
      devtools()
  },

  deactivate: () => {
    subscriptions.dispose()
  },

}

function devtools () {

  let args = { item, priority: 0 }
  // statusbar = atom.views.getView(document.querySelector('.status-bar'))
  // statusbar.addLeftTile(args)
  // if (!statusbar)
  //   return setTimeout(devtools, 500)
  let sub = atom.workspace.addFooterPanel(args)
  let handler = (sub => {

    if (change) change.dispose()
    let editor = atom.workspace.getActiveTextEditor()

    if (!editor) return
    change = editor.onDidChangeCursorPosition(() => {
      let { scopes } = editor.getCursorScope()

      scopes = scopes
        .map(o => o.split('.').filter(o => MUTED.indexOf(o) === -1))
        .map(O => O.map(o => `<div class="badge syntax--${o}">${o}</div>`).join(' '))
        .join(SEPARATOR)

      item.innerHTML = `<div class="full-scope"><strong>scope</strong> ${scopes}</div>`
      item.querySelectorAll('.badge').forEach(scope => {
        let action = txt => editor.insertText(txt) // atom.clipboard.write
        console.info(action, scope, scope.textContent)
        scope.addEventListener('click', () => action(`.syntax--${scope.textContent.trim()} {\n  }`))
      })
    })
  })

  atom.workspace.onDidChangeActivePaneItem(handler)
  handler()
  return sub
}

function devtools2 () {

  // statusbar = atom.views.getView(document.querySelector('.status-bar'))
  // statusbar.addLeftTile(args)
  // if (!statusbar)
  //   return setTimeout(devtools, 500)
  let args = { item, priority: 0 }
  let subs = new CompositeDisposable()

  // subs.add({ dispose: () => p.destroy() })
  let p = atom.workspace.addFooterPanel(args)

  let handler = () => {

    let editor = atom.workspace.getActiveTextEditor()
    if (!editor)
      return

    subs.add(editor.onDidChangeCursorPosition(() => {

      let { scopes } = editor.getCursorScope()
      scopes = parseScopesHtml(scopes)

      item.innerHTML =
        `<div class="full-scope"><strong>scope</strong> ${scopes}</div> `
    }))
  }

  subs.add(atom.workspace.onDidChangeActivePaneItem(handler))
  handler()
  return subs
}

function getClassNameForScope (scopeName) {
  return 'syntax--' + scopeName
}

function parseScopesHtml (scopes) {
  const make = (o) => {
    let el = document.createElement(`div`)
    el.innerHTML = o
    el.classList.add('badge', `syntax--${o}`)
    el.addEventListener('click', () => getClassNameForScope(o))
  }
  return scopes
    .map(o => o.split('.').filter(o => MUTED.indexOf(o) === -1))
    .map(O => O.map(o => make(o)).join(' '))
    .join(SEPARATOR)
}
