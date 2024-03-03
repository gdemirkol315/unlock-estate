import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {RealEstate} from "../../models/real-estate.model";
import {RealEstateService} from "../../services/real-estate/real-estate.service";

@Component({
  selector: 'real-estate-management',
  templateUrl: './real-estate-management.component.html',
  styleUrl: './real-estate-management.component.scss'
})

export class RealEstateManagementComponent implements OnInit {
  searchKey: string;
  activeRealEstate: MatTableDataSource<RealEstate> = new MatTableDataSource<RealEstate>();
  deActivatedRealEstate: MatTableDataSource<RealEstate> = new MatTableDataSource<RealEstate>();
  displayedColumns: string[] = ['id', 'name', 'country', 'city', 'zipCode', 'type', 'actions'];

  ngOnInit() {
    this.getRealEstates()
    this.activeRealEstate.filterPredicate = (data: RealEstate, filter: string) => {
      return this.displayedColumns.some(ele => {
        return ele != 'actions' && typeof data[ele] === "string" &&
          data[ele]?.toLowerCase().indexOf(filter) != -1;
      });
    }
    this.deActivatedRealEstate.filterPredicate = (data, filter) => {
      return this.displayedColumns.some(name => {
        return name != 'actions' && typeof data[name] === "string" &&
          data[name]?.toLowerCase().indexOf(filter) != -1;
      });
    }
  }


  constructor(private realEstateService: RealEstateService) {
  }

  applyFilter() {

  }

  onSearchClear() {

  }

  getRealEstates() {
    let realEstatesActive: RealEstate[] = new Array();
    let realEstatesDeactivated: RealEstate[] = new Array();
    this.realEstateService.getAllRealEstates()
      .subscribe({
        next: (realEstates: RealEstate[]) => {
          realEstates.forEach((realEstate: RealEstate) => {
            if (realEstate.active) {
              realEstatesActive.push(realEstate);
            } else {
              realEstatesDeactivated.push(realEstate);
            }
            this.activeRealEstate.data = realEstatesActive
            this.deActivatedRealEstate.data = realEstatesDeactivated
          });
        }
      });
  }

  onChangeRealEstateStatus(realEstate: RealEstate, status: boolean) {
    realEstate.active = status;
    this.realEstateService.save(realEstate).subscribe({
      next: (realEstateUpdated: RealEstate) => {
        let activatedRealEstate:  RealEstate [] = new Array();
        let deactivatedRealEstate:  RealEstate [] = new Array();

        //this approach implemented to avoid unnecessary get server request
        if (realEstateUpdated.active) {
            this.deActivatedRealEstate.data.forEach((realEstateDeactived: RealEstate) => {
              if (realEstateDeactived.id != realEstateUpdated.id){
                deactivatedRealEstate.push(realEstateDeactived);
              }
            })
          this.deActivatedRealEstate.data = deactivatedRealEstate;
          let activatedRealEstate:RealEstate[] = this.deActivatedRealEstate.data
          activatedRealEstate.push(realEstateUpdated)
        } else {
          this.activeRealEstate.data.forEach((realEstateActivated: RealEstate) => {
            if (realEstateActivated.id != realEstateUpdated.id){
              activatedRealEstate.push(realEstateActivated);
            }
          })
          this.activeRealEstate.data = activatedRealEstate;
          let deactivatedRealEstate:RealEstate[] = this.deActivatedRealEstate.data
          deactivatedRealEstate.push(realEstateUpdated)
        }

        this.deActivatedRealEstate.data = deactivatedRealEstate
        this.activeRealEstate.data = activatedRealEstate

        this.realEstateService.toastr.success("Real estate " + realEstateUpdated.name + " successfully updated!");
      },
      error: (err) => {
        this.realEstateService.toastr.error("An unexpected error occurred while changing the status of real estate!");
        console.log(err);
      }
    })
  }
}
