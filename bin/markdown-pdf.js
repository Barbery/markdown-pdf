#!/usr/bin/env node

var fs = require('fs')
  , markdownpdf = require('../')
  , program = require('commander')

program.version(require('../package.json').version)
  .usage('[options] <markdown-file-path>')
  .option('<markdown-file-path>', "Path of the markdown file to convert")
  .option('-p, --phantom-path [path]', "Path to phantom binary")
  .option('-s, --css-path [path]', "Path to custom CSS file")
  .option('-f, --paper-format [format]', "'A3', 'A4', 'A5', 'Legal', 'Letter' or 'Tabloid'")
  .option('-r, --paper-orientation [orientation]', "'portrait' or 'landscape'")
  .option('-b, --paper-border [measurement]', "Supported dimension units are: 'mm', 'cm', 'in', 'px'")
  .option('-d, --render-delay [millis]', "Delay before rendering the PDF (give HTML and CSS a chance to load)")
  .option('-o, --out [path]', "Path of where to save the PDF")
  .parse(process.argv)

program.out = program.out || program.args[0].replace(/\.(markdown|md)/g, "") + ".pdf"

var opts = {phantomPath: program.phantomPath
  , cssPath: program.cssPath
  , paperFormat: program.paperFormat
  , paperOrientation: program.paperOrientation
  , paperBorder: program.paperBorder
  , renderDelay: program.renderDelay
}

markdownpdf(program.args[0], opts, function (er, pdf) {
  if (er) return console.error(er)
  
  // Move the pdf from the tmp path to where you want it
  fs.rename(pdf, program.out, function(er) {
    if (er) return console.error(er)
    
    fs.realpath(program.out, function(er, path) {
      if (er) return console.error(er)
      
      console.log("Created PDF file at ", path)
    })
  })
})