import {Injectable} from '@angular/core';
import {DataService} from "../data/data.service";
import {RealEstate} from "../../models/real-estate.model";

@Injectable({
  providedIn: 'root'
})

export class RealEstateService extends DataService {


  save(realEstate: RealEstate) {
    this.http.post(this.hostname + "realEstate/register", realEstate).subscribe({

    });
  }
}
