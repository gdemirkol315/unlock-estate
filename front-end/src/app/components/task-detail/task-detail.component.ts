import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {TaskService} from "../../services/task/task.service";
import {Task} from "../../models/task.model";
import {Utils} from "../../utils/utils";
import {first, firstValueFrom} from "rxjs";
import {RealEstateService} from "../../services/real-estate/real-estate.service";
import {RealEstate} from "../../models/real-estate.model";
import {AuthService} from "../../services/auth/auth.service";
import {User} from "../../models/user.model";
import {CheckList} from "../../models/check-list.model";
import {TaskCheckListItem} from "../../models/task-check-list-item.model";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {Comment} from "../../models/comment.model"
import {JwtToken} from "../../models/jwt-token.model";

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss'
})
export class TaskDetailComponent implements OnInit {

  task: Task;
  taskLoading: boolean = true;
  realEstateLoading: boolean = true;
  assigneeLoading: boolean = true;
  creatorLoading: boolean = true;
  currentComment: Comment = new Comment();
  comments: Comment[] = new Array();

  constructor(private route: ActivatedRoute,
              private taskService: TaskService,
              private realEstateService: RealEstateService,
              private userService: AuthService,
              private jwtToken: JwtToken) {

  }

  ngOnInit(): void {
    let taskId: string | null = this.route.snapshot.paramMap.get('id');
    if (taskId == null) {
      this.taskService.toastr.error("An unexpected error occured while routing!");
    } else {
      this.taskService.getTask(+taskId).pipe(first()).subscribe({
        next: async (task: Task) => {
          this.task = Utils.jsonObjToInstance(new Task(), task);
          await this.getComments();
        }, error: (err) => {
          this.errorToastr(err);
        }, complete: () => {
          this.taskLoading = false
        }
      });
      this.realEstateService.getRealEstateFromTask(+taskId).pipe(first()).subscribe({
        next: (realEstate: RealEstate) => {
          this.task.realEstate = Utils.jsonObjToInstance(new RealEstate(), realEstate);
        }, error: (err) => {
          this.errorToastr(err);
        }, complete: () => {
          this.realEstateLoading = false
        }
      });
      this.userService.getAssigneeUser(+taskId).pipe(first()).subscribe({
        next: (assignee: User) => {
          this.task.assignee.cloneUser(assignee)
          this.assigneeLoading = false
        }, error: (err) => {
          this.errorToastr(err);
        }, complete: () => {
          this.assigneeLoading = false
        }
      });

      this.userService.getCreatorUser(+taskId).pipe(first()).subscribe({
        next: (creator: User) => {
          this.task.creator.cloneUser(creator)
        }, error: (err) => {
          this.errorToastr(err);
        }, complete: () => {
          this.creatorLoading = false
        }
      });
    }
  }


  submitTask() {

  }

  reportProblem() {

  }

  getTaskCheckListItems(checkList: CheckList) {
    let currentTaskCheckListItems: TaskCheckListItem[] = new Array();
    this.task.taskCheckListItems.forEach(
      (taskCheckListItem: TaskCheckListItem) => {
        for (const checkListItem of checkList.checkListItems) {
          if (taskCheckListItem.checklistItem.id == checkListItem.id) {
            currentTaskCheckListItems.push(taskCheckListItem);
          }
        }
      }
    )
    return currentTaskCheckListItems;
  }

  toggleCheck(event: MatCheckboxChange, item: TaskCheckListItem) {
    if (event.checked) {
      item.status = "DONE"
    } else {
      item.status = "PENDING"
    }
    this.updateCheckListItemStatus(item);
  }

  private errorToastr(err: any) {
    console.log(err)
    this.taskService.toastr.error("Unexpected error occured while loading task details!")
  }

  markProblematic(item: TaskCheckListItem) {
    if (item.status == 'ISSUE') {
      item.status = ''
    } else {
      item.status = 'ISSUE'
    }
    this.updateCheckListItemStatus(item);
  }

  updateCheckListItemStatus(item: TaskCheckListItem) {
    this.taskService.updateTaskCheckListItemStatus(item).subscribe({
      next: () => {
        this.taskService.toastr.success("Updated item status")
      }, error: (err) => {
        console.log(err);
        this.taskService.toastr.error("Error updating item status!")
      }
    });
  }

  addComment() {
    this.currentComment.date = new Date();
    this.currentComment.task.id = this.task.id;
    this.currentComment.author = this.userService.userProfile;
    this.taskService.addComment(this.currentComment)
      .subscribe({
        next: (comment: Comment) => {
          comment.author = this.userService.userProfile
          this.comments.push(Utils.jsonObjToInstance(new Comment(),comment))
        }, error: (err) => {
          console.log(err)
        }
      });

    this.currentComment = new Comment();
  }

  private async getComments() {
    let commentObjs = await firstValueFrom(this.taskService.getComments(this.task.id));
    for (const commentObj of commentObjs) {
      let comment:Comment = Utils.jsonObjToInstance(new Comment(), commentObj);
      comment.author = await firstValueFrom(this.taskService.getCommentAuthorDetails(comment.id))
      this.comments.push(comment)
    }
  }
}
