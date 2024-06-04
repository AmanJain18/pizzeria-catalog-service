export interface FileStorage {
    uploadFile(fileData: UploadFileData): Promise<void>;
    downloadFile(
        bucketName: string,
        filePath: string,
        destinationPath: string,
    ): Promise<void>;
    deleteFile(filePath: string): Promise<void>;
    // getSignedUrl(filePath: string): Promise<string>;
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
