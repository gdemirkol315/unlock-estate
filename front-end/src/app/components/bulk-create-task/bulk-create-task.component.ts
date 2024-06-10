import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth/auth.service";
import {RealEstateService} from "../../services/real-estate/real-estate.service";
import {RealEstate} from "../../models/real-estate.model";
import { firstValueFrom} from "rxjs";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TaskService} from "../../services/task/task.service";
import { Task } from '../../models/task.model';
import {Utils} from "../../utils/utils";

@Component({
  selector: 'app-bulk-create-task',
  templateUrl: './bulk-create-task.component.html',
  styleUrl: './bulk-create-task.component.scss'
})
export class BulkCreateTaskComponent implements OnInit{
  realEstates: RealEstate[] = new Array();
  checkOutDate: Date = new Date();
  users: User[] = new Array();
  realEstateForm: FormGroup;
  isLoading: boolean = true;

  constructor(private fb: FormBuilder,
              private userService:AuthService,
              protected realEstateService: RealEstateService,
              private taskService: TaskService) {
    this.realEstateForm = this.fb.group({
      realEstates: this.fb.array([])
    });
  }

  async ngOnInit(){
    this.setDefaultDate();
    this.realEstates = await firstValueFrom(this.realEstateService.getCheckOutRealEstates(this.checkOutDate.toDateString()));
    await this.getServiceStaff();
    this.populateFields();
    this.isLoading = false;
  }

  private setDefaultDate() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    this.checkOutDate = tomorrow;
  }

  populateFields(): void {
    const realEstatesArray = this.realEstateForm.get('realEstates') as FormArray;
    if (realEstatesArray.length > 0) {
      realEstatesArray.clear();
    }
    this.realEstates.forEach(realEstate => {
      realEstatesArray.push(this.fb.group({
        propertyName: [realEstate.name, Validators.required],
        assignee: ['', Validators.required]
      }));
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

  get tasksFormArray(): FormArray {
    return this.realEstateForm.get('realEstates') as FormArray;
  }

  submit() {
    const tasksFormArray:FormArray = this.realEstateForm.get('realEstates') as FormArray;
    let taskArray: Task[] = new Array();
    tasksFormArray.controls.forEach((control)=>{
      let realEstate:RealEstate|undefined = this.realEstates.find((realEstate:RealEstate)=> realEstate.name == control.value["propertyName"]);
      let assignee:User|undefined = this.users.find((user:User)=> user.userId == control.value["assignee"]);
      if(realEstate != undefined && assignee != undefined){
        let task: Task = new Task();
        task.realEstate = realEstate;
        task.assignee = Utils.getUserFromObject(assignee);
        task.createdDate = new Date();
        task.taskDate = this.checkOutDate;
        taskArray.push(task);
      }
    });
    this.taskService.bulkCreateTask(taskArray)
  }

  updateFields(date: Date) {
    this.isLoading = true
    this.realEstateService.getCheckOutRealEstates(date.toDateString())
      .subscribe({
        next:(realEstates:RealEstate[])=>{
          this.realEstates = realEstates;
          this.populateFields();
        }, error: (err)=>{
          this.realEstateService.toastr.error("Could not load checkouts!! Please contact system administrator!");
          console.log(err);
        }, complete: ()=>{
          this.isLoading = false;
        }
      })
  }
}
