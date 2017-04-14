'use babel'
/** @flow */
/** @babel */
/** @jsx etch.dom */

const { resolve } = require('path')
const { readFileSync, writeFileSync, realpathSync } = require('fs')
const { path, markdownEmphasis } = require('./runtime')
const packjson = require('../package.json')
const p = d => `${path}/${d}`


function getDescription () {
  let readme = readFileSync(p('README.md'), 'utf8')
  console.log(markdownEmphasis)
  return markdownEmphasis.exec(readme)[1]
}


function overwritePackageProps (props={}) {

  // Replace the given properties for the package
  for (let prop in props) {
    if (packjson[prop]) {
      console.log(packjson[prop])
      if (packjson[prop].constructor.name === 'Array')
        packjson[prop] = packjson[prop].concat(props[prop])
      else if (packjson[prop].constructor.name === 'Object')
        packjson[prop] = Object.assign(packjson[prop], props[prop])
      else
        packjson[prop] = props[prop]
    }
    else
      packjson[prop] = props[prop]
  }

  // JSON encode
  let output = JSON.stringify(packjson, null, 4)

  // Print the content to be output
  console.log("output to package.json:", output)

  // Check that the output is valid json
  if(JSON.parse(output))
    writeFileSync(p('package.json'), output, 'utf8')

}


function __main() {

  let description = getDescription()
  let author = "Tuomas Hatakka"
  let repository = "https://github.com/tuomashatakka/panel-boss"
  let keywords = ["asd", "basd"]
  let properties = {
    author,
    repository,
    keywords,
    description }

  overwritePackageProps(properties)

}

__main()
