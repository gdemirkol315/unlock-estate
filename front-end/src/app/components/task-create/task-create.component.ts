import {Component, OnInit} from '@angular/core';
import {Task} from "../../models/task.model";
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth/auth.service";
import {RealEstate} from "../../models/real-estate.model";
import {RealEstateService} from "../../services/real-estate/real-estate.service";
import {TaskService} from "../../services/task/task.service";
import {first} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {SpinnerDialogComponent} from "../spinner-dialog/spinner-dialog.component";

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrl: './task-create.component.scss'
})
export class TaskCreateComponent implements OnInit {
  task: Task = new Task();
  users: User[] = new Array();
  isLoading: boolean = true;
  realEstates: RealEstate[] = new Array();
  fullTime: string;

  async ngOnInit() {
    await this.getServiceStaff();
    await this.getRealEstates();
    this.isLoading = false;
  }


  constructor(private userService: AuthService,
              private taskService: TaskService,
              private realEstateService: RealEstateService,
              private matDialog: MatDialog) {
  }

  onCreateTask() {
    this.task.createdDate = new Date();
    this.setTime();
    this.matDialog.open(SpinnerDialogComponent);
    this.taskService.saveTask(this.task).pipe(first())
      .subscribe({
        next: (task: Task) =>{
          this.taskService.toastr.success("Task created successfully! Task id: " + task.id);
          this.resetForm();
        }, error: err => {
          console.log(err);
          this.taskService.toastr.error("There was an unexpected error while creating task!");
        }, complete: () =>{
          this.matDialog.closeAll();
        }
      });
  }

  private getServiceStaff() {
    this.userService.getServiceStaff().subscribe({
      next: (users: User[]) => {
        this.users = users;
      },
      error: (err) => {
        console.log(err);
        this.userService.toastr.error("There was an unexpected error connecting to server! Please refresh the page!")
      }
    });
  }

  private getRealEstates() {
    this.realEstateService.getAllActiveRealEstates()
      .subscribe({
        next: (realEstates: RealEstate[]) => {
          realEstates.forEach((realEstate: RealEstate) => {
            this.realEstates.push(realEstate);
          });
        }
      });
  }

  private resetForm() {
    this.task = new Task();
  }

  private setTime() {
    const timeParts = this.fullTime.split(":");
    const hours = +timeParts[0];
    const minutes = +timeParts[1];

    this.task.taskDate.setHours(hours, minutes, 0, 0);
  }

}
