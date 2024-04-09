import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {RealEstate} from "../../models/real-estate.model";
import {RealEstateService} from "../../services/real-estate/real-estate.service";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {LastWarningComponent} from "../last-warning/last-warning.component";
import {MatSort} from "@angular/material/sort";
import {first} from "rxjs";

@Component({
  selector: 'real-estate-management',
  templateUrl: './real-estate-management.component.html',
  styleUrl: './real-estate-management.component.scss'
})

export class RealEstateManagementComponent implements OnInit, AfterViewInit {
  searchKey: string;
  activeRealEstate: MatTableDataSource<RealEstate> = new MatTableDataSource<RealEstate>();
  deActivatedRealEstate: MatTableDataSource<RealEstate> = new MatTableDataSource<RealEstate>();
  displayedColumns: string[] = ['id', 'name', 'country', 'city', 'zipCode', 'type', 'actions'];

  @ViewChild(MatSort) sort: MatSort;
  isLoading: boolean = true;

  ngAfterViewInit() {
    this.activeRealEstate.sort = this.sort;
    this.deActivatedRealEstate.sort = this.sort;
  }

  ngOnInit() {
    this.getRealEstates()
    this.activeRealEstate.sort = this.sort;
    this.deActivatedRealEstate.sort = this.sort;
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


  constructor(private realEstateService: RealEstateService,
              public matDialog: MatDialog) {
  }

  applyFilter() {
    this.activeRealEstate.filter = this.searchKey.trim().toLowerCase();
    this.deActivatedRealEstate.filter = this.searchKey.trim().toLowerCase();
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  getRealEstates() {
    this.isLoading = true;
    let realEstatesActive: RealEstate[] = new Array();
    let realEstatesDeactivated: RealEstate[] = new Array();
    this.realEstateService.getAllRealEstates().pipe(first())
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
        }, complete: () => {
          this.isLoading = false
        }
      });
  }

  onChangeRealEstateStatus(realEstate: RealEstate, status: boolean) {
    let messagePart: string;
    if (status) {
      messagePart = "activate"
    } else {
      messagePart = "deactivate"
    }
    let dialogRefLastWarn: MatDialogRef<LastWarningComponent> = this.matDialog.open(LastWarningComponent, {
      data: {
        message: "Do you really want to " + messagePart + " this real estate: " +
          "\n\t " + realEstate.name
      }
    });
    dialogRefLastWarn.afterClosed().subscribe({
      next: (changeRequested: boolean) => {
        if (changeRequested) {
          this.changeRealEstateStatus(realEstate, status);
        }
      }, error: (err) => {
        console.log(err)
      }
    });
  }

  changeRealEstateStatus(realEstate: RealEstate, status: boolean) {
    realEstate.active = status;
    this.realEstateService.save(realEstate).subscribe({
      next: (updatedRealEstate: RealEstate) => {
        //this approach implemented to avoid unnecessary get server request
        let deactivatedRealEstate: RealEstate[] = new Array();
        let activatedRealEstate: RealEstate[] = new Array();

        if (updatedRealEstate.active) {
          this.deActivatedRealEstate.data.forEach((deactivedRealEstate: RealEstate) => {
            if (deactivedRealEstate.id != updatedRealEstate.id) {
              deactivatedRealEstate.push(deactivedRealEstate);
            }
          })
          activatedRealEstate = this.activeRealEstate.data
          activatedRealEstate.push(updatedRealEstate)

        } else {
          this.activeRealEstate.data.forEach((realEstateActivated: RealEstate) => {
            if (realEstateActivated.id != updatedRealEstate.id) {
              activatedRealEstate.push(realEstateActivated);
            }
          })
          deactivatedRealEstate = this.deActivatedRealEstate.data
          deactivatedRealEstate.push(updatedRealEstate)
        }

        this.activeRealEstate.data = activatedRealEstate;
        this.deActivatedRealEstate.data = deactivatedRealEstate;

        this.realEstateService.toastr.success("Real estate " + updatedRealEstate.name + " successfully updated!");
      },
      error: (err) => {
        this.realEstateService.toastr.error("An unexpected error occurred while changing the status of real estate!");
        console.log(err);
      }
    });
  }
}
