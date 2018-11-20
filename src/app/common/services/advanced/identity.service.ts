import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

declare const Office: any;

@Injectable()
export class IdentityService {

  id: {
    userIdentityToken: string
    callerUrl: string
  }

  constructor() {}

  getIdentity(): Observable<{userIdentityToken: string, callerUrl: string}> {
    return of(this.id);
  }

  readIdentity() {
    console.log('idService - getAuthToken called');
    const __this = this;
    Office.context.mailbox.getUserIdentityTokenAsync(function(result) {
      console.log('idService - this.window.location.hostname is : ' + window.location.hostname);
      // localStorage.setItem('callerUrl', 'https://' + window.location.hostname + '/');
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        console.log('idService - success result for getting new token : ' + result.value);
        __this.id = {
          callerUrl: 'https://' + window.location.hostname + '/',
          userIdentityToken: result.value
        }
        // localStorage.setItem('userIdentityToken', result.value);
      } else {
        console.log('idService - Error on trying to get new token, error was : ' + result.error.message);
      }
    });
  }
}
