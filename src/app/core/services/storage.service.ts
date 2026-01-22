// src/app/core/services/storage.service.ts
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { from, Observable } from 'rxjs';

/**
 * StorageService - Abstraction over Ionic Storage (IndexedDB)
 * Provides promise-based and observable-based APIs
 * Designed to be easily swappable for cloud sync later
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage: Storage | null = null;
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) return;

    const storage = new Storage();
    this.storage = await storage.create();
    this.initialized = true;
  }

  /**
   * Ensure storage is initialized before any operation
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
  }

  /**
   * Set a value in storage
   */
  async set<T>(key: string, value: T): Promise<void> {
    await this.ensureInitialized();
    await this.storage!.set(key, value);
  }

  /**
   * Get a value from storage
   */
  async get<T>(key: string): Promise<T | null> {
    await this.ensureInitialized();
    return await this.storage!.get(key);
  }

  /**
   * Remove a value from storage
   */
  async remove(key: string): Promise<void> {
    await this.ensureInitialized();
    await this.storage!.remove(key);
  }

  /**
   * Clear all storage
   */
  async clear(): Promise<void> {
    await this.ensureInitialized();
    await this.storage!.clear();
  }

  /**
   * Get all keys
   */
  async keys(): Promise<string[]> {
    await this.ensureInitialized();
    return await this.storage!.keys();
  }

  /**
   * Observable-based get (useful for RxJS chains)
   */
  get$<T>(key: string): Observable<T | null> {
    return from(this.get<T>(key));
  }

  /**
   * Observable-based set
   */
  set$<T>(key: string, value: T): Observable<void> {
    return from(this.set(key, value));
  }

  /**
   * Check if a key exists
   */
  async has(key: string): Promise<boolean> {
    await this.ensureInitialized();
    const value = await this.storage!.get(key);
    return value !== null;
  }

  /**
   * Get multiple keys at once
   */
  async getMany<T>(keys: string[]): Promise<Map<string, T | null>> {
    await this.ensureInitialized();
    const results = new Map<string, T | null>();

    for (const key of keys) {
      const value = await this.storage!.get(key);
      results.set(key, value);
    }

    return results;
  }

  /**
   * Set multiple keys at once
   */
  async setMany<T>(entries: Map<string, T>): Promise<void> {
    await this.ensureInitialized();

    for (const [key, value] of entries) {
      await this.storage!.set(key, value);
    }
  }
}
