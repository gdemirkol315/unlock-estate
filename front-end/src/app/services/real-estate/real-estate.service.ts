import {Injectable} from '@angular/core';
import {DataService} from "../data/data.service";
import {RealEstate} from "../../models/real-estate.model";
import {CheckList} from "../../models/check-list.model";

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
}
