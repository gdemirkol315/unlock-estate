import {Component, OnInit} from '@angular/core';
import {JwtToken} from "../../models/jwt-token.model";
import {TaskService} from "../../services/task/task.service";
import {MatTableDataSource} from "@angular/material/table";
import {Task} from "../../models/task.model";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {TaskCreateComponent} from "../task-create/task-create.component";

@Component({
  selector: 'app-task-overview',
  templateUrl: './task-overview.component.html',
  styleUrl: './task-overview.component.scss'
})
export class TaskOverviewComponent implements OnInit{
  searchKey: string;
  currentTasks: MatTableDataSource<Task> = new MatTableDataSource<Task>();
  closedTasks: MatTableDataSource<Task> = new MatTableDataSource<Task>();
  displayedColumns:string[] =  ['id', 'taskDate', 'realEstateName','realEstateCountry','realEstateCity', 'realEstateZip', 'assignee', 'creator'];
  private dialogRefTaskCreate: MatDialogRef<TaskCreateComponent>;

  constructor(protected jwtToken: JwtToken,
              private taskService: TaskService,
              private matDialog: MatDialog) {
  }

  ngOnInit() {
    this.getTasks();
    this.currentTasks.filterPredicate = (data: Task, filter: string) => {
      return this.displayedColumns.some(ele => {
        return ele != 'actions' && typeof data[ele] === "string" &&
          data[ele]?.toLowerCase().indexOf(filter) != -1;
      });
    }
    this.closedTasks.filterPredicate = (data:Task, filter) => {
      return this.displayedColumns.some(name => {
        return name != 'actions' && typeof data[name] === "string" &&
          data[name]?.toLowerCase().indexOf(filter) != -1;
      });
    }
  }

  addTask() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialogRefTaskCreate = this.matDialog.open(TaskCreateComponent, dialogConfig);
    this.dialogRefTaskCreate.afterClosed().subscribe(() => {
      this.getTasks();
    })
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter() {
    this.currentTasks.filter = this.searchKey.trim().toLowerCase();
    this.closedTasks.filter = this.searchKey.trim().toLowerCase();
  }

  getTasks() {
    this.taskService.getTasks().subscribe({
      next: (tasks: Task[]) => {
        let currentTasks: Task[] = [];
        let closedTasks: Task[] = [];
        for (const task of tasks) {

          if (task.active) {
            currentTasks.push(task);
          } else {
            closedTasks.push(task);
          }
          this.currentTasks.data = currentTasks;
          this.closedTasks.data = closedTasks;
        }
      },
      error: (err) => {
        this.taskService.toastr.error("An unexpected error occurred while getting tasks!")
        console.log(err);
      }
    });
  }
}
