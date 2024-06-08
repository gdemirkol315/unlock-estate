import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-bulk-create-task',
  templateUrl: './bulk-create-task.component.html',
  styleUrl: './bulk-create-task.component.scss'
})
export class BulkCreateTaskComponent implements OnInit{
  realEstate1: string = "Meltem 5 Paris";
  realEstate2: string = "Osman 5 Rue Malar Paris";
  realEstate3: string = "Cinarin Ev";
  checkOutDate: Date = new Date();
  assignee: User;
  users: User[] = new Array();
  assignee2: User;
  assignee3: User;

  constructor(private userService:AuthService) {
  }

  async ngOnInit(){
    await this.getServiceStaff();
    this.setDefaultDate();
  }

  private setDefaultDate() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    this.checkOutDate = tomorrow;
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

}
