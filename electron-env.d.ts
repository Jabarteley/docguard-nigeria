export { };

declare global {
    interface Window {
        electron: {
            versions: {
                node: () => string;
                chrome: () => string;
                electron: () => string;
            };
            saveFile: (content: string, defaultName: string) => Promise<{ success: boolean; filePath?: string; error?: string; canceled?: boolean }>;
            exportPDF: () => Promise<{ success: boolean; filePath?: string; error?: string; canceled?: boolean }>;
            startRPA: (payload: any) => Promise<void>;
            onRPAUpdate: (callback: (event: any, data: any) => void) => void;
            offRPAUpdate: (callback: (event: any, data: any) => void) => void;
            showNotification: (title: string, body: string) => Promise<void>;
            openExternal: (url: string) => Promise<void>;
        };
    }
}
