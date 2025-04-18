import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private canLoadLocalStorage = signal(false);
  constructor() {
    if (typeof window === "undefined" && !(window as Window).localStorage) {
      console.error("Can't access the local storage")
    }else{
      this.canLoadLocalStorage.set(true);
    }
  }

  public saveObject<T>(key: string, value: T) {
    if (this.canLoadLocalStorage())
      localStorage.setItem(key, JSON.stringify(value));
    else
      console.error("Can't access the local storage")
  }

  public getObject<T>(key: string): T | null {
    if(this.canLoadLocalStorage()){
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data) as T;
      }
      return null;
    } else
      console.error("Can't access the local storage")
    return null;
  }

  public deleteObject(key: string){
    if (this.canLoadLocalStorage())
      localStorage.removeItem(key);
    else
      console.error("Can't access the local storage")
  }
}
