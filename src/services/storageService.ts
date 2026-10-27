import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../config/firebase';

export async function uploadPaperFile(
  blob: Blob,
  storagePath: string,
  savePaperRecord: (fileUrl: string) => Promise<void>,
): Promise<string> {
  const fileRef = ref(storage, storagePath);
  let uploaded = false;

  try {
    await uploadBytes(fileRef, blob);
    uploaded = true;
    const fileUrl = await getDownloadURL(fileRef);
    await savePaperRecord(fileUrl);
    return fileUrl;
  } catch (error) {
    if (uploaded) {
      await deleteObject(fileRef).catch((cleanupError) => {
        throw new Error(
          `Paper save failed and uploaded-file cleanup also failed: ${String(cleanupError)}`,
          { cause: error },
        );
      });
    }
    throw error;
  }
}
