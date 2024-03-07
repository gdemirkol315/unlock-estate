import {Component, OnInit} from '@angular/core';
import {Task} from "../../models/task.model";
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth/auth.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrl: './task-create.component.scss'
})
export class TaskCreateComponent implements OnInit {
  task: Task = new Task();
  users: User[];
  isLoading: boolean = true;

  ngOnInit(): void {
    this.getServiceStaff();
    this.getRealEstates();
  }


  constructor(private userService: AuthService,
              private matDialogRef: MatDialogRef<TaskCreateComponent>) {
  }

  onCreateTask() {

  }

  onCancel() {
    this.matDialogRef.close();
  }

  private getServiceStaff() {
    this.userService.getServiceStaff().subscribe({
      next: (users:User[])=>{
        this.users = users;
        this.isLoading = false;
      },
      error: (err) =>{
        this.isLoading = false;
        console.log(err);
        this.userService.toastr.error("There was an unexpected error connecting to server! Please refresh the page!")
      }
    });
  }

  private getRealEstates() {

  }
}
