import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createS3Client, getBucketConfig } from './aws-config';

const s3Client = createS3Client();
const { bucketName, folderPrefix } = getBucketConfig();

export async function uploadFile(buffer: Buffer, fileName: string): Promise<string> {
  try {
    const key = `${folderPrefix}uploads/${Date.now()}-${fileName}`;
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: 'application/octet-stream',
    });

    await s3Client.send(command);
    return key;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new Error('Failed to upload file');
  }
}

export async function downloadFile(key: string): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new Error('Failed to generate download URL');
  }
}

export async function deleteFile(key: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw new Error('Failed to delete file');
  }
}
