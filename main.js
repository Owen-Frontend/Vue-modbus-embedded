const electron = require('electron')
const {
    app,
    protocol,
    BrowserWindow,
    ipcMain
} = require('electron')
const fs = require('fs');
const path = require('path')
const url = require('url')
const configPath = app.getPath('userData');
let mainWindow;
process.env.NODE_ENV = 'production'
const initConfig =
    '{ \
    "rules": []\
}';

const exec = require('child_process').exec

let cmdStr = '".\\resources\\bin\\backend.exe"'
// 执行cmd命令的目录，如果使用cd xx && 上面的命令，这种将会无法正常退出子进程
let cmdPath = ''
// 子进程名称
let workerProcess

if (process.env.NODE_ENV === 'production') {
    runExec();
}

function runExec() {
    // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
    workerProcess = exec(cmdStr, { cwd: cmdPath })
    // 不受child_process默认的缓冲区大小的使用方法，没参数也要写上{}：workerProcess = exec(cmdStr, {})
    // 打印正常的后台可执行程序输出
    workerProcess.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });
    // 打印错误的后台可执行程序输出
    workerProcess.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });
    // 退出之后的输出
    workerProcess.on('close', function (code) {
        console.log('out code：' + code);
    })
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 960,
        height: 720,
        icon: 'fav.ico',
        frame: false,
        webPreferences: {
            nodeIntegration: true
        },
        backgroundColor: '#ffffff'
    })

    // 加载index.html文件
    if (process.env.NODE_ENV === 'production') {
        const startUrl = url.format({
            pathname: path.join(__dirname, './frontend/dist/index.html'),
            protocol: 'file:',
            slashes: true
        });
        mainWindow.loadURL(startUrl)
    } else {
        console.log('develop env')
        mainWindow.loadURL('http://localhost:8080')
        mainWindow.openDevTools({
            mode: 'bottom'
        })
    }
    // mainWindow.loadURL('app://' + __dirname + '/frontend-old/dist/index.html')
    // mainWindow.loadFile('index.html')

    // 监听浏览器窗口对象是否关闭，关闭之后直接将mainWindow指向空引用，也就是回收对象内存空间
    mainWindow.on("closed", function () {
        mainWindow = null;
    })

    mainWindow.on('maximize', () => {
        mainWindow.webContents.send('windowMaximize', 'maximize')
    })

    mainWindow.on('unmaximize', () => {
        mainWindow.webContents.send('windowMaximize', 'unmaximize')
    })

    mainWindow.on('focus', () => {
        mainWindow.webContents.send('windowFocus', 'focus')
    })

    mainWindow.on('blur', () => {
        mainWindow.webContents.send('windowFocus', 'blur')
    })
}

app.on('ready', createWindow)

ipcMain.on('test_msg', (event, arg) => {
    console.log('rec msg')
})

ipcMain.on('controlBtn', (event, arg) => {
    if (arg === 'shutdown') {
        mainWindow.close();
    } else if (arg === 'mini') {
        mainWindow.minimize();
    } else if (arg === 'max') {
        if (mainWindow.isMaximized()) {
            mainWindow.restore();
        } else {
            mainWindow.maximize();
        }
    }
})

ipcMain.on('acquireData', (event, arg) => {

})

ipcMain.on('saveConfigs', (event, arg) => {
    fs.writeFile(configPath + '/userConfigs.json', arg, function (err) {
        if (err) {
            event.returnValue = 'fail'
            throw err;
        }
        event.returnValue = 'suc'
    });
});

ipcMain.on('loadConfigs', (event, arg) => {
    let data = '';
    try {
        data = fs.readFileSync(configPath + '/userConfigs.json', 'utf-8');
    } catch (err) {
        console.log(err);
        let initJsonContent = initConfig;
        fs.writeFileSync(configPath + '/userConfigs.json', initJsonContent);
        data = initJsonContent;
    }
    event.returnValue = data;
});