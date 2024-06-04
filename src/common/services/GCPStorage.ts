import { Storage } from '@google-cloud/storage';
import {
    UploadFileData,
    FileStorage,
    GoogleCloudStorageConfig,
} from '../types/storage';
import config from 'config';

export class GCPStorage implements FileStorage {
    private readonly storage: Storage;
    private readonly bucketName: string;

    constructor() {
        const storageConfig: GoogleCloudStorageConfig = {
            projectId: config.get('storage.projectId'),
            keyFilename: config.get('storage.keyFilename'),
        };
        this.storage = new Storage(storageConfig);
        this.bucketName = config.get('storage.bucketName');
    }

    async uploadFile(fileData: UploadFileData): Promise<void> {
        const file = this.storage
            .bucket(this.bucketName)
            .file(fileData.fileName);

        const stream = file.createWriteStream({
            metadata: {
                contentType: fileData.mimeType,
            },
        });

        return new Promise<void>((resolve, reject) => {
            stream.on('error', (err) => reject(err));
            stream.on('finish', () => resolve());
            stream.end(fileData.fileData);
        });
    }

    async downloadFile(filePath: string, destinationPath: string) {
        await this.storage
            .bucket(this.bucketName)
            .file(filePath)
            .download({ destination: destinationPath });
    }

    async deleteFile(fileName: string): Promise<void> {
        await this.storage.bucket(this.bucketName).file(fileName).delete();
    }

    // async getSignedUrl(
    //     filePath: string,
    //     expirationTime?: number,
    // ): Promise<string> {
    //     const options = {
    //         action: 'read',
    //         expires: expirationTime || Date.now() + 1000 * 60 * 60, // Default to 1 hour
    //     };
    //     return await this.storage
    //         .bucket(this.bucketName)
    //         .file(filePath)
    //         .getSignedUrl(options);
    // }

    async listFiles(): Promise<string[]> {
        const [files] = await this.storage.bucket(this.bucketName).getFiles();
        return files.map((file) => file.name);
    }
}
