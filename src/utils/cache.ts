export interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export class Cache<T> {
  private cache: { [key: string]: CacheItem<T> } = {};
  private maxSaveTime: number;
  private dbName: string;
  private cleanupInterval: number | null = null;

  constructor(dbName: string, maxSaveTime: number = 30) {
    this.dbName = "cache_" + dbName;
    this.maxSaveTime = maxSaveTime * 60 * 1000; // 分钟为单位
    this.loadFromLocalStorage();
    this.setupCleanup();
  }

  private setupCleanup() {
    // 如果已经存在 interval，先清理
    if (this.cleanupInterval !== null) {
      clearInterval(this.cleanupInterval);
    }
    this.cleanupInterval = window.setInterval(() => this.cleanup(), this.maxSaveTime);
  }

  /**
   * 清理定时器（用于组件卸载时调用）
   */
  destroy() {
    if (this.cleanupInterval !== null) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  private cleanup() {
    const now = Date.now();
    Object.entries(this.cache).forEach(([key, value]: [string, CacheItem<T>]) => {
      if (now - value.timestamp > this.maxSaveTime) {
        delete this.cache[key];
      }
    });
    this.saveToLocalStorage();
  }

  private saveToLocalStorage() {
    localStorage.setItem(this.dbName, JSON.stringify(this.cache));
  }

  private loadFromLocalStorage() {
    const storedCache = localStorage.getItem(this.dbName);
    if (storedCache) {
      this.cache = JSON.parse(storedCache);
    }
  }

  set(key: string, value: T) {
      this.cache[key] = {
        data: value,
        timestamp: Date.now(),
      };
      this.saveToLocalStorage();
    }

  /**
   * 更新已存在的缓存项
   */
  update(key: string, value: T): boolean {
    if (this.cache[key]) {
      this.set(key, value);
      return true;
    }
    return false;
  }

  get(key: string): T | null {
    const item = this.cache[key];
    if (!item) return null;

    if (Date.now() - item.timestamp > this.maxSaveTime) {
      delete this.cache[key];
      this.saveToLocalStorage();
      return null;
    }

    return item.data;
  }

  /**
   * 获取所有有效的缓存项
   */
  getAll(): T[] {
    const now = Date.now();
    const validItems: T[] = [];
    
    Object.entries(this.cache).forEach(([key, value]: [string, CacheItem<T>]) => {
      if (now - value.timestamp <= this.maxSaveTime) {
        validItems.push(value.data);
      } else {
        // 清理过期项
        delete this.cache[key];
      }
    });
    
    if (Object.keys(this.cache).length !== Object.keys(this.cache).length) {
      this.saveToLocalStorage();
    }
    
    return validItems;
  }

  clear() {
    this.cache = {};
    this.saveToLocalStorage();
  }
}
