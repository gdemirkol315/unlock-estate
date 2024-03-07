import {Component, OnInit} from '@angular/core';
import {RealEstate} from "../../models/real-estate.model";
import {CheckList} from "../../models/check-list.model";
import {ActivatedRoute} from "@angular/router";
import {RealEstateService} from "../../services/real-estate/real-estate.service";
import {Utils} from "../../utils/utils";

@Component({
  selector: 'app-real-estate-detail',
  templateUrl: './real-estate-detail.component.html',
  styleUrl: './real-estate-detail.component.scss'
})
export class RealEstateDetailComponent implements OnInit {

  isEditMode: boolean = false;
  realEstate: RealEstate = new RealEstate();
  reTypes: string[];
  newCheckListName: string;
  isLoading: boolean = true;

  constructor(private route: ActivatedRoute,
              private realEstateService: RealEstateService) {
  }

  ngOnInit() {
    let reId: string | null = this.route.snapshot.paramMap.get('id')
    if (reId != null) {
      this.realEstateService.getRealEstate(reId).subscribe({
        next: (realEstate: RealEstate) => {
          this.realEstate = Utils.jsonObjToInstance(new RealEstate(), realEstate);
          this.isLoading = false;
        }, error: (err) => {
          console.log(err)
          this.realEstateService.toastr.error("An unexpected error occurred while getting real estate details!");
          this.isLoading = false;
        }
      });
    } else {
      this.realEstateService.toastr.error("Real Estate id parameter not defined!");
    }
  }

  addChecklist() {
    let newChecklist = new CheckList(this.newCheckListName);
    this.realEstate.checkLists.push(newChecklist);
  }

  onEditMode() {
    this.isEditMode = true;
  }

  onSave() {
    this.isEditMode = false
    this.realEstateService.save(this.realEstate).subscribe({
        next: (realEstate: RealEstate) => {
          this.realEstateService.toastr.success("Real Estate " + realEstate.name + " details has been saved successfully.");
        },
        error: (err) => {
          console.log(err);
          this.realEstateService.toastr.error("An unexpected error occurred while saving real estate details!")
        }
      }
    )
  }

  onDeleteCheckListItem(iList: number, iListItem: number) {
    this.realEstate.deleteCheckListItem(iList, iListItem)
  }
}
