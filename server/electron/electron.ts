import Electron from "electron";
// import isDev from "electron-is-dev";
import http from "http";
import path from "path";

import server from "../express/server";

export default class Main {
  private static application: Electron.App;
  private static BrowserWindow: typeof Electron.BrowserWindow;
  private static mainWindow: Electron.BrowserWindow;
  private static port: string | number | boolean;
  private static server: http.Server;

  // if this variable is set to true in the main constructor, the app will quit when closing it in macOS
  private static quitOnCloseOSX: boolean;

  public static main(
    app: Electron.App,
    browserWindow: typeof Electron.BrowserWindow
  ) {
    Main.BrowserWindow = browserWindow;
    Main.application = app;
    Main.application.on("window-all-closed", Main.onWindowAllClosed);
    Main.application.on("ready", Main.onReady);
    Main.application.on("activate", Main.onActivate);
    Main.quitOnCloseOSX = true;
    Main.bootServer();
  }

  private static onReady() {
    Main.mainWindow = new Main.BrowserWindow({
      width: 1920,
      height: 1080,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, "Preload.js"),
      },
    });
    const startUrl =
      process.env.ELECTRON_START_URL ||
      `file://${path.join(__dirname, "../client/index.html")}`;
    Main.mainWindow.loadURL(startUrl);

    Main.mainWindow.removeMenu();
    // development
    // if (isDev) {
    //   Main.mainWindow.webContents.openDevTools();
    // }

    Main.mainWindow.on("closed", Main.onClose);
  }

  private static onWindowAllClosed() {
    if (process.platform !== "darwin" || Main.quitOnCloseOSX) {
      Main.application.quit();
    }
  }

  private static onActivate() {
    if (Main.mainWindow === null) {
      Main.onReady();
    }
  }

  private static onClose() {
    // Dereference the window object.
    Main.mainWindow = null;
  }

  private static bootServer() {
    Main.port = Main.normalizePort(process.env.PORT || 4000);
    server.set("port", Main.port);

    Main.server = http.createServer(server);
    Main.server.listen(Main.port);
    Main.server.on("error", Main.onError);
    Main.server.on("listening", Main.onListening);
  }

  private static normalizePort(
    val: number | string
  ): number | string | boolean {
    const port: number = typeof val === "string" ? parseInt(val, 10) : val;
    if (isNaN(port)) {
      return val;
    } else if (port >= 0) {
      return port;
    } else {
      return false;
    }
  }

  private static onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== "listen") {
      throw error;
    }
    const bind =
      typeof Main.port === "string" ? "Pipe " + Main.port : "Port " + Main.port;
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

  private static onListening(): void {
    const addr = Main.server.address();
    const bind =
      typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
    console.log(`Listening on ${bind}`);
  }
}

Main.main(Electron.app, Electron.BrowserWindow);
