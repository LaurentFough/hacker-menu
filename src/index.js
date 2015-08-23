import Menubar from 'menubar'
import Shell from 'shell'
import Server from 'electron-rpc/server'
import Path from 'path'
import nslog from 'nslog'
import _ from 'underscore'

var server = new Server()

var opts = { dir: __dirname, icon: Path.join(__dirname, '..', 'images', 'Icon.png'), preloadWindow: true }
var menu = Menubar(opts)

process.on('uncaughtException', function (error) {
  if (!_.isEmpty(error.message)) {
    nslog(error.message)
  }

  if (!_.isEmpty(error.stack)) {
    nslog(error.stack)
  }
})

menu.on('after-create-window', function () {
  server.configure(menu.window.webContents)
  menu.window.webContents.on('new-window', function (e, url, frameName, disposition) {
    e.preventDefault()
    Shell.openExternal(url)
  })
})

menu.on('ready', function () {
  menu.tray.setToolTip('Hacker Menu')

  server.on('terminate', function (e) {
    server.destroy()
    menu.app.terminate()
  })

  server.on('open-url', function (req) {
    Shell.openExternal(req.body.url)
  })
})
