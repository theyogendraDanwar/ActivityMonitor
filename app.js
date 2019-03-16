const {
  app, 
  BrowserWindow, 
  Menu,
} = require('electron');
let window = null;
let DevMode = 0;

var windowDefaults = {
	windowType: 'desktop',
	x: 10,
	y: 10,
  transparent: true,
	height: 1000,
	width: 200,
};

let menuTemplate = [
  {
    label: 'Quit',
    accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
    click() {
      app.quit();
    }
  }
]

if(process.env.NODE_ENV !== 'production') {
  menuTemplate.push({
    label: 'Developer',
    submenu:[
      {
        label: 'DevTools',
        click(item, window) {
          window.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  });
}

// Wait until the app is ready
app.once('ready', () => {
  const {screen} = require('electron');
  let displays = screen.getAllDisplays();
  let externalDisplay = displays.find((display) => {
    return display.bounds.x !== 0 || display.bounds.y !== 0
  });
  let primaryDisplay = displays.map((singleDisplay) => {
     return singleDisplay.bounds
  });

  if(externalDisplay) {
    windowDefaults.x = externalDisplay.bounds.x + 50
    windowDefaults.y = externalDisplay.bounds.y + 50
  } else {
    windowDefaults.x = primaryDisplay[0].width - windowDefaults.width;
    windowDefaults.y = 0
    windowDefaults.height = primaryDisplay[0].height;
  }

  // Create a new window
  if(process.platform !== 'production' && DevMode) {
    window = new BrowserWindow({
      // Set the initial width to 500px
      width: 400,
      webPreferences: {
        nodeIntegration: true
      },
      alwaysOnTop: true,
      // Set the initial height to 400px
      height: windowDefaults.height,
      // set the title bar style
      titleBarStyle: 'hiddenInset',
      resizable: true,
      transparent: false,
      frame: true,
      x: windowDefaults.x, 
      y: windowDefaults.y,
      // Don't show the window until it's ready, this prevents any white flickering
      show: false
    })
  } else {
    window = new BrowserWindow({
       // Set the initial width to 500px
       width: windowDefaults.width,
       skipTaskbar: true,
       webPreferences: {
         nodeIntegration: true
       },
       alwaysOnTop: true,
       // Set the initial height to 400px
       height: windowDefaults.height,
       // set the title bar style
       titleBarStyle: 'hidden',
       resizable: false,
       transparent: true,
       frame: false,
       x: windowDefaults.x, 
       y: windowDefaults.y,
       // Don't show the window until it's ready, this prevents any white flickering
       show: false
    })
  }

  window.loadFile(`${__dirname}/index.html`);

  window.once('ready-to-show', () => {
    window.show()
  })

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
})
