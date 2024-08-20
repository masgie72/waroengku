const electron = require('electron')
const {ipcRenderer} = electron
const db = require('../config/database/db_config')
const {dialog} = require('@electron/remote')
// const {PosPrinter} = require("electron-pos-printer");
let imask = require('imask')