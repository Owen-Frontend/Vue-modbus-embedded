import store from '../store'

const { ipcRenderer } = window.require("electron")

ipcRenderer.on('windowMaximize', (event, message) => {
    store.commit('setMaximized', message === 'maximize')
})

ipcRenderer.on('windowFocus', (event, message) => {
    store.commit('setFocus', message === 'focus')
})

let settingsStore = {
    settings: {
        rules: []
    },

    saveConfig: function () {
        return ipcRenderer.sendSync('saveConfigs', JSON.stringify(this.settings))
    },

    setRules: function (rules) {
        this.settings.func = rules
        this.saveConfig()
    },

    loadConfig: function () {
        this.settings = JSON.parse(ipcRenderer.sendSync('loadConfigs', ''))
    },

    loadRules: function () {
        this.loadConfig()
        return this.settings.rules
    }
}

const clientCommand = {
    systemButton(type) {
        ipcRenderer.send("controlBtn", type);
    }
}

export {
    settingsStore,
    clientCommand
}