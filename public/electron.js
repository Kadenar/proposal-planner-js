const { app, BrowserWindow, session } = require("electron");
const isDev = require("electron-is-dev");

require("../backend/server");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true,
      worldSafeExecution: true,
      contextIsolation: true,
    },
    icon: __dirname + "/proposal-planner-icon.png",
  });

  win.removeMenu();

  if (isDev) {
    win.loadURL("http://127.0.0.1:3000");
  } else {
    win.loadFile("src/build/index.html");
  }
};

app.whenReady().then(() => {
  // Then start the client
  createWindow();

  // session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  //   callback({
  //     responseHeaders: {
  //       ...details.responseHeaders,
  //       "Content-Security-Policy": ["default-src 'none'"],
  //     },
  //   });
  // });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
