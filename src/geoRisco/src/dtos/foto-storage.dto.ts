export interface CreateFotoUploadUrlDto {
    fileName: string;
    contentType: string;
    upsert?: boolean;
}

export interface FotoUploadUrlDto {
    bucket: string;
    path: string;
    signedUrl: string;
    token: string;
    expiresIn: number;
}

export interface FotoSignedUrlDto {
    bucket: string;
    path: string;
    signedUrl: string;
    expiresIn: number;
}
