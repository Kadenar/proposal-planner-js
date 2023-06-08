"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = __importDefault(require("electron"));
// import isDev from "electron-is-dev";
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const server_1 = __importDefault(require("../express/server"));
class Main {
    static main(app, browserWindow) {
        Main.BrowserWindow = browserWindow;
        Main.application = app;
        Main.application.on("window-all-closed", Main.onWindowAllClosed);
        Main.application.on("ready", Main.onReady);
        Main.application.on("activate", Main.onActivate);
        Main.quitOnCloseOSX = true;
        Main.bootServer();
    }
    static onReady() {
        Main.mainWindow = new Main.BrowserWindow({
            width: 1920,
            height: 1080,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: true,
                preload: path_1.default.join(__dirname, "Preload.js"),
            },
        });
        const startUrl = process.env.ELECTRON_START_URL ||
            `file://${path_1.default.join(__dirname, "../client/index.html")}`;
        Main.mainWindow.loadURL(startUrl);
        Main.mainWindow.removeMenu();
        // development
        // if (isDev) {
        //   Main.mainWindow.webContents.openDevTools();
        // }
        Main.mainWindow.on("closed", Main.onClose);
    }
    static onWindowAllClosed() {
        if (process.platform !== "darwin" || Main.quitOnCloseOSX) {
            Main.application.quit();
        }
    }
    static onActivate() {
        if (Main.mainWindow === null) {
            Main.onReady();
        }
    }
    static onClose() {
        // Dereference the window object.
        Main.mainWindow = null;
    }
    static bootServer() {
        Main.port = Main.normalizePort(process.env.PORT || 4000);
        server_1.default.set("port", Main.port);
        Main.server = http_1.default.createServer(server_1.default);
        Main.server.listen(Main.port);
        Main.server.on("error", Main.onError);
        Main.server.on("listening", Main.onListening);
    }
    static normalizePort(val) {
        const port = typeof val === "string" ? parseInt(val, 10) : val;
        if (isNaN(port)) {
            return val;
        }
        else if (port >= 0) {
            return port;
        }
        else {
            return false;
        }
    }
    static onError(error) {
        if (error.syscall !== "listen") {
            throw error;
        }
        const bind = typeof Main.port === "string" ? "Pipe " + Main.port : "Port " + Main.port;
        switch (error.code) {
            case "EACCES":
                // tslint:disable-next-line:no-console
                console.error(`${bind} requires elevated privileges`);
                process.exit(1);
                break;
            case "EADDRINUSE":
                // tslint:disable-next-line:no-console
                console.error(`${bind} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
    static onListening() {
        const addr = Main.server.address();
        const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
        console.log(`Listening on ${bind}`);
    }
}
exports.default = Main;
Main.main(electron_1.default.app, electron_1.default.BrowserWindow);
