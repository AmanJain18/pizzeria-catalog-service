export interface FileStorage {
    uploadFile(fileData: UploadFileData): Promise<void>;
    deleteFile(fileName: string): Promise<void>;
    getFileUrl(fileName: string): string;
    listFiles(): Promise<string[]>;
}

export interface GoogleCloudStorageConfig {
    projectId: string;
    keyFilename: string;
}

export interface UploadFileData {
    fileName: string;
    fileData: Blob | Buffer; // Accept both Blob and Buffer types
    mimeType: string;
}
