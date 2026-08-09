import '@testing-library/jest-dom/vitest';

// jsdom 27 + Node no exponen localStorage/sessionStorage a menos que el runtime
// los provea (Node los oculta detrás de --localstorage-file). Sin este polyfill
// cualquier test que llame localStorage.clear()/setItem() rompe con
// "Cannot read properties of undefined".
class MemoryStorage {
  #store = new Map();

  get length() {
    return this.#store.size;
  }

  clear() {
    this.#store.clear();
  }

  getItem(key) {
    return this.#store.has(key) ? this.#store.get(key) : null;
  }

  setItem(key, value) {
    this.#store.set(key, String(value));
  }

  removeItem(key) {
    this.#store.delete(key);
  }

  key(index) {
    return Array.from(this.#store.keys())[index] ?? null;
  }
}

for (const prop of ['localStorage', 'sessionStorage']) {
  if (typeof globalThis[prop] === 'undefined' || globalThis[prop] === null) {
    const storage = new MemoryStorage();
    Object.defineProperty(globalThis, prop, { value: storage, configurable: true });
    if (typeof window !== 'undefined') {
      Object.defineProperty(window, prop, { value: storage, configurable: true });
    }
  }
}
