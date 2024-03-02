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
    this.activeRealEstate.filterPredicate = (data:RealEstate, filter:string) => {
      return this.displayedColumns.some(ele => {
        return ele != 'actions' && typeof data[ele]==="string" &&
          data[ele]?.toLowerCase().indexOf(filter) != -1;
      });
    }
    this.deActivatedRealEstate.filterPredicate = (data, filter) => {
      return this.displayedColumns.some(name => {
        return name != 'actions' && typeof data[name]==="string" &&
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
    let realEstatesActive:RealEstate[] = new Array();
    let realEstatesDeactivated:RealEstate[] = new Array();
    this.realEstateService.getAllRealEstates()
      .subscribe({
        next: (realEstates: RealEstate[]) => {
          realEstates.forEach( (realEstate:RealEstate) => {
            if (realEstate.active){
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

  onChangeRealEstateStatus(element: RealEstate, status: boolean) {

  }
}
