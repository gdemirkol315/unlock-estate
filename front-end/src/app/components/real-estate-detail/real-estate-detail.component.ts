import {Component, OnInit} from '@angular/core';
import {RealEstate} from "../../models/real-estate.model";
import {CheckList} from "../../models/check-list.model";
import {ActivatedRoute} from "@angular/router";
import {RealEstateService} from "../../services/real-estate/real-estate.service";

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
          this.realEstate = realEstate;
          console.log(realEstate);
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
  }
}
