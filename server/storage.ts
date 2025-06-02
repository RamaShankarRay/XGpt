// Firebase will handle all storage operations on the client side
// This file is kept minimal since we're using Firebase instead of database

export interface IStorage {
  // Placeholder interface - all storage operations will be handled by Firebase
  healthCheck(): Promise<boolean>;
}

export class FirebaseStorage implements IStorage {
  async healthCheck(): Promise<boolean> {
    return true;
  }
}

export const storage = new FirebaseStorage();
