import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

declare const Office: any;

@Injectable()
export class IdentityService {

  identity: string
  calluerUrl: string

  constructor() {}

  getIdentity(): Observable<string> {
    return of(this.identity);
  }

  getCalluerURL() :Observable<string> {
    return of(this.calluerUrl);
  }

  readIdentity() {
    console.log('getAuthToken called');
    const __this = this;
    Office.context.mailbox.getUserIdentityTokenAsync(function(result) {
      console.log('this.window.location.hostname is : ' + window.location.hostname);
      __this.calluerUrl = 'https://' + window.location.hostname + '/';
      // localStorage.setItem('callerUrl', 'https://' + window.location.hostname + '/');
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        console.log('success result for getting new token : ' + result.value);
        __this.identity = result.value;
        // localStorage.setItem('userIdentityToken', result.value);
      } else {
        console.log('Error on trying to get new token, error was : ' + result.error.message);
      }
    });
  }
}
