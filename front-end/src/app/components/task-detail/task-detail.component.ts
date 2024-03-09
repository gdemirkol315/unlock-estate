import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {TaskService} from "../../services/task/task.service";
import {Task} from "../../models/task.model";
import {Utils} from "../../utils/utils";
import {first} from "rxjs";
import {RealEstateService} from "../../services/real-estate/real-estate.service";
import {RealEstate} from "../../models/real-estate.model";
import {AuthService} from "../../services/auth/auth.service";
import {User} from "../../models/user.model";

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss'
})
export class TaskDetailComponent implements OnInit {

  task: Task;
  isLoading: boolean = true;
  errorOccurred: boolean = false;

  constructor(private route: ActivatedRoute,
              private taskService: TaskService,
              private realEstateService: RealEstateService,
              private userService: AuthService) {

  }

  ngOnInit(): void {
    let taskId: string | null = this.route.snapshot.paramMap.get('id');
    if (taskId == null) {
      this.taskService.toastr.error("An unexpected error occured while routing!");
    } else {
      this.taskService.getTask(+taskId).pipe(first()).subscribe({
        next: (task: Task) => {
          this.task = Utils.jsonObjToInstance(new Task(), task);
        }, error: (err) => {
          console.log(err);
          this.errorOccurred = true;
        }
      });
      this.realEstateService.getRealEstateFromTask(+taskId).pipe(first()).subscribe({
        next: (realEstate: RealEstate) => {
          console.log(realEstate)
          this.task.realEstate = Utils.jsonObjToInstance(new RealEstate(), realEstate);
        }, error: (err) => {
          console.log(err);
          this.errorOccurred = true;
        }
      });
      this.userService.getAssigneeUser(+taskId).subscribe({
        next: (assignee:User) => {
          this.task.assignee = Utils.jsonObjToInstance(new User(),assignee);
        }, error: (err)=>{
          console.log(err);
          this.errorOccurred = true;
        }
      });

      this.userService.getCreatorUser(+taskId).subscribe({
        next: (creator:User) => {
          this.task.creator = Utils.jsonObjToInstance(new User(),creator);
        }, error: (err)=>{
          console.log(err);
          this.errorOccurred = true;
        }
      });
    }
  }


}
