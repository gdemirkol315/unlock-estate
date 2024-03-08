import {Component, OnInit} from '@angular/core';
import {Task} from "../../models/task.model";
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth/auth.service";
import {MatDialogRef} from "@angular/material/dialog";
import {RealEstate} from "../../models/real-estate.model";
import {RealEstateService} from "../../services/real-estate/real-estate.service";
import {TaskService} from "../../services/task/task.service";
import {log} from "node:util";

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

  ngOnInit(): void {
    this.getServiceStaff();
    this.getRealEstates();
  }


  constructor(private userService: AuthService,
              private taskService: TaskService,
              private realEstateService: RealEstateService,
              private matDialogRef: MatDialogRef<TaskCreateComponent>) {
  }

  onCreateTask() {
    this.task.createdDate = new Date();
    this.taskService.saveTask(this.task)
      .subscribe({
        next: (task: Task) =>{
          this.taskService.toastr.success("Task created successfully! Task id: " + task.id);
        }, error: err => {
          console.log(err);
          this.taskService.toastr.error("There was an unexpected error while creating task!");
        }
      });
  }

  onCancel() {
    this.matDialogRef.close();
  }

  private getServiceStaff() {
    this.userService.getServiceStaff().subscribe({
      next: (users: User[]) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
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

}
