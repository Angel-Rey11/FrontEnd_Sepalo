import { Injectable } from '@angular/core';
import { Call } from '../model/Call';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private storageKey = 'LocalStorageItems';

  constructor() { }

  getUser() {
    const items = localStorage.getItem(this.storageKey);
    return JSON.parse(items);
  }

  create(user: any) {
    const userJSON = JSON.stringify(user);
    localStorage.setItem(this.storageKey, userJSON);
  }

  delete(id: any) {
    const items = this.getUser();
    const index = items.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      items.splice(index, 1);
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    }
  }
}
