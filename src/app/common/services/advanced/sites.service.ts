import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {OperationDataResult, OperationResult, SiteNameDto} from '../../models';
import {BaseService} from '../base.service';

const SitesMethods = {
  GetAll: '/api/sites/index',
  GetSingle: '/api/sites/edit',
  UpdateSingle: '/api/sites/update',
  DeleteSingle: '/api/sites/delete'
};

@Injectable()
export class SitesService extends BaseService {
  constructor(private _http: HttpClient, router: Router) {
    super(_http, router);
  }

  getAllSites(): Observable<OperationDataResult<Array<SiteNameDto>>> {
    return this.get<Array<SiteNameDto>>(SitesMethods.GetAll);
  }
}
