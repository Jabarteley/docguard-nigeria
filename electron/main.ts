import electron, { app, BrowserWindow, ipcMain, dialog, shell, Notification } from 'electron';
import path from 'path';
import fs from 'fs';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

let mainWindow: BrowserWindow | null = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        title: "DocGuard Nigeria",
        autoHideMenuBar: true
    });

    const isDev = !app.isPackaged; // Simple check, or use env var

    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        // Open the DevTools.
        mainWindow.webContents.openDevTools();
    } else {
        // In packaged app, index.html is in the dist folder relative to app root
        mainWindow.loadFile(path.join(app.getAppPath(), 'dist', 'index.html'));
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    // IPC Handlers
    ipcMain.handle('save-file', async (event, content: string, defaultName: string) => {
        if (!mainWindow) return { canceled: true };

        const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
            title: 'Save Loan Document',
            defaultPath: defaultName || 'loan-document.txt',
            filters: [{ name: 'Text Files', extensions: ['txt', 'md', 'json'] }]
        });

        if (canceled || !filePath) return { canceled: true };

        try {
            fs.writeFileSync(filePath, content, 'utf-8');
            return { success: true, filePath };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('export-pdf', async (event) => {
        if (!mainWindow) return { success: false };

        const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
            title: 'Export to PDF',
            defaultPath: 'document.pdf',
            filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
        });

        if (canceled || !filePath) return { canceled: true };

        try {
            const data = await mainWindow.webContents.printToPDF({});
            fs.writeFileSync(filePath, data);
            return { success: true, filePath };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    });


    ipcMain.handle('show-notification', (event, { title, body }) => {
        new Notification({ title, body }).show();
    });

    ipcMain.handle('open-external', async (event, url) => {
        await shell.openExternal(url);
    });

    ipcMain.handle('start-rpa', async (event, payload) => {
        if (!mainWindow) return;

        // Simulation steps
        const steps = [
            { msg: "Initializing DocGuard Native RPA Engine...", type: 'info', p: 5, delay: 800 },
            { msg: "Tunneling to CAC Portal via NITDA-compliant proxy...", type: 'info', p: 15, delay: 1500 },
            { msg: "Bypassing CAPTCHA via Nigerian Geo-Neural Matrix...", type: 'success', p: 25, delay: 2000 },
            { msg: "Authenticating: Accredited Agent Ref: ACC-7742-LAG...", type: 'info', p: 35, delay: 1200 },
            { msg: "Data Mapping: LMA Doc -> Form 8 Particulars...", type: 'info', p: 45, delay: 1000 },
            { msg: "Writing Statement of Particulars to Registry Buffer...", type: 'success', p: 60, delay: 1800 },
            { msg: "Uploading Stamped Security Deed (Signed & Encrypted)...", type: 'info', p: 75, delay: 2500 },
            { msg: "Committing filing to CAC Transaction Queue...", type: 'info', p: 85, delay: 1500 },
            { msg: "PERFECTION SUCCESS. Ref: CAC-CHG-2024-9912", type: 'success', p: 100, delay: 1000 },
            { msg: "Archiving screen evidence for Compliance Trail...", type: 'info', p: 100, delay: 800 },
        ];

        for (const step of steps) {
            mainWindow.webContents.send('rpa-update', { message: step.msg, type: step.type, progress: step.p });
            await new Promise(resolve => setTimeout(resolve, step.delay));
        }
    });

    ipcMain.on('window-controls', (event, action) => {
        if (!mainWindow) return;
        if (action === 'minimize') mainWindow.minimize();
        if (action === 'maximize') {
            if (mainWindow.isMaximized()) mainWindow.unmaximize();
            else mainWindow.maximize();
        }
        if (action === 'close') mainWindow.close();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
