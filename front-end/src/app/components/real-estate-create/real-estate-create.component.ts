import { Component } from '@angular/core';
import {CheckList} from "../../models/check-list.model";
import {RealEstate} from "../../models/real-estate.model";
import {CheckListItem} from "../../models/check-list-item.model";
import {RealEstateService} from "../../services/real-estate/real-estate.service";

@Component({
  selector: 'real-estate-create',
  templateUrl: './real-estate-create.component.html',
  styleUrl: './real-estate-create.component.scss'
})
export class RealEstateCreateComponent {
  reTypes: string[] = ['apartment','villa','room'];
  realEstate: RealEstate = new RealEstate();
  newCheckListName: string;

  constructor(private realEstateService:RealEstateService) {
  }

  updateCheckListName() {
    this.newCheckListName = "CheckList " + this.realEstate.name
  }

  onSaveRealEstate() {
    this.realEstateService.save(this.realEstate)
      .subscribe({
        next: () => {

          this.realEstateService.toastr.success("Successfully saved!");
        },
        error: (err) =>{
            this.realEstateService.toastr.error("Error!");
          console.log(err);
        }
      });
  }
}
