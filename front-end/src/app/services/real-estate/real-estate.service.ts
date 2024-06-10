import {Injectable} from '@angular/core';
import {DataService} from "../data/data.service";
import {RealEstate} from "../../models/real-estate.model";
import {CheckList} from "../../models/check-list.model";
import {HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class RealEstateService extends DataService {

  private serviceUrlSuffix: string = "realEstate"

  save(realEstate: RealEstate) {
    return this.http.post<RealEstate>(this.hostname + this.serviceUrlSuffix + "/save", realEstate)
  }

  getAllRealEstates() {
    return this.http.get<RealEstate[]>(this.hostname + this.serviceUrlSuffix + "/getAll")
  }

  getAllActiveRealEstates() {
    return this.http.get<RealEstate[]>(this.hostname + this.serviceUrlSuffix + "/getAllActive")
  }

  getRealEstate(realEstateId: string) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("id", realEstateId);
    return this.http.get<RealEstate>(this.hostname + this.serviceUrlSuffix + "/getRealEstate", { params: queryParams })
  }

  getRealEstateFromTask(taskId: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("taskId", taskId);
    return this.http.get<RealEstate>(this.hostname + this.serviceUrlSuffix + "/getRealEstateWithTaskId", { params: queryParams })
  }

  getCheckOutRealEstates(date: string) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("date", date);
    return this.http.get<RealEstate[]>(this.hostname + this.serviceUrlSuffix + "/checkOuts",{params: queryParams})
  }
}
