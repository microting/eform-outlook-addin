import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
// import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {
  AdvEntitySelectableGroupListModel,
  AdvEntitySelectableGroupModel, CommonDictionaryTextModel,
  OperationDataResult, OperationResult
} from '../..//models';
import {AdvEntitySelectableGroupListRequestModel} from '../..//models/advanced';
import {BaseService} from '../../services/base.service';

const AdvSelectableEntityMethods = {
  GetAll: '/api/selectable-groups',
  GetSingle: '/api/selectable-groups/get',
  DeleteSingle: '/api/selectable-groups/delete',
  CreateSingle: '/api/selectable-groups/create',
  UpdateSingle: '/api/selectable-groups/update',
  ImportGroup: '/api/selectable-groups/import'
};

@Injectable()
export class EntitySelectService extends BaseService {
  constructor(private _http: HttpClient, router: Router) {
    super(_http, router);
  }

  getEntitySelectableGroupOutlook(id: string, token: string): Observable<OperationDataResult<AdvEntitySelectableGroupModel>> {
    return this.get<AdvEntitySelectableGroupModel>(AdvSelectableEntityMethods.GetSingle + '/' + id + '&token=' + token);
  }
}

