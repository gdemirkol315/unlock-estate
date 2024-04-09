import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {JwtToken} from "../../models/jwt-token.model";
import {TaskService} from "../../services/task/task.service";
import {MatTableDataSource} from "@angular/material/table";
import {Task} from "../../models/task.model";
import {RealEstateService} from "../../services/real-estate/real-estate.service";
import {RealEstate} from "../../models/real-estate.model";
import {AuthService} from "../../services/auth/auth.service";
import {User} from "../../models/user.model";
import {firstValueFrom} from "rxjs";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-task-overview',
  templateUrl: './task-overview.component.html',
  styleUrl: './task-overview.component.scss'
})
export class TaskOverviewComponent implements OnInit, AfterViewInit {
  searchKey: string;
  currentTasks: MatTableDataSource<Task> = new MatTableDataSource<Task>();
  closedTasks: MatTableDataSource<Task> = new MatTableDataSource<Task>();
  displayedColumns:string[] =  ['taskDate', 'realEstateName','realEstateCountry','realEstateCity', 'realEstateZip', 'assignee', 'creator', 'status','actions'];

  @ViewChild(MatSort) sort: MatSort;

  constructor(protected jwtToken: JwtToken,
              private taskService: TaskService,
              private realEstateService: RealEstateService,
              private userService:AuthService) {
  }
  ngAfterViewInit() {
    this.currentTasks.sort = this.sort;
    this.closedTasks.sort = this.sort;
  }
  ngOnInit() {
    this.getTasks();
    this.currentTasks.sort = this.sort;
    this.currentTasks.filterPredicate = (data: Task, filter: string) => {
      return this.displayedColumns.some(ele => {
        return ele != 'actions' && typeof data[ele] === "string" &&
          data[ele]?.toLowerCase().indexOf(filter) != -1;
      });
    }
    this.closedTasks.sort = this.sort;
    this.closedTasks.filterPredicate = (data:Task, filter) => {
      return this.displayedColumns.some(name => {
        return name != 'actions' && typeof data[name] === "string" &&
          data[name]?.toLowerCase().indexOf(filter) != -1;
      });
    }
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter() {
    this.currentTasks.filter = this.searchKey.trim().toLowerCase();
    this.closedTasks.filter = this.searchKey.trim().toLowerCase();
  }

  async getTasks() {

    let currentTasks: Task[] = [];
    let closedTasks: Task[] = [];



    if (this.jwtToken.getRole().includes('ADMIN')) {
      let realEstates:RealEstate[] = await firstValueFrom(this.realEstateService.getAllRealEstates());
      let users:User[] = await firstValueFrom(this.userService.getUsers());
      for (const realEstate of realEstates) {
        for (const task of realEstate.tasks) {
          task.realEstate = realEstate;
          task.assignee = this.taskService.findAssignee(users,task.id);
          task.creator = this.taskService.findCreator(users,task.id);
          if (task.status == "DONE") {
            closedTasks.push(task);
          } else {
            currentTasks.push(task);
          }
        }
      }
    } else {
      let user = await firstValueFrom(this.userService.getUser(this.jwtToken.getUserEmail()));
      for (const task of user.assignedTasks) {
        task.realEstate = await firstValueFrom(this.realEstateService.getRealEstateFromTask(task.id));
        task.assignee = await firstValueFrom(this.userService.getAssigneeUser(task.id));
        task.creator =  await firstValueFrom(this.userService.getCreatorUser(task.id));
        if (task.status == "DONE") {
          closedTasks.push(task);
        } else {
          currentTasks.push(task);
        }
      }
    }

    this.currentTasks.data = currentTasks;
    this.closedTasks.data = closedTasks;
  }

}
