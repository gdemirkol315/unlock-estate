import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {TaskService} from "../../services/task/task.service";
import {Task} from "../../models/task.model";
import {Utils} from "../../utils/utils";
import {first, firstValueFrom, forkJoin, Observable} from "rxjs";
import {RealEstateService} from "../../services/real-estate/real-estate.service";
import {RealEstate} from "../../models/real-estate.model";
import {AuthService} from "../../services/auth/auth.service";
import {User} from "../../models/user.model";
import {CheckList} from "../../models/check-list.model";
import {TaskCheckListItem} from "../../models/task-check-list-item.model";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {Comment} from "../../models/comment.model"
import {Image} from "../../models/image.model";
import {FileUploadService} from "../../services/file-upload/file-upload.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {map} from "rxjs/operators";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FullSizeImageDialogComponent} from "../full-size-image-dialog/full-size-image-dialog.component";
import {EmailService} from "../../services/email/email.service";
import {Email} from "../../models/email.model";
import {LastWarningComponent} from "../last-warning/last-warning.component";
import {JwtToken} from "../../models/jwt-token.model";
import {TaskStatus} from "../../models/enum/task-status";

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss'
})
export class TaskDetailComponent implements OnInit {

  task: Task = new Task();
  taskLoading: boolean = true;
  realEstateLoading: boolean = true;
  assigneeLoading: boolean = true;
  creatorLoading: boolean = true;
  currentComment: Comment = new Comment();
  comments: Comment[] = new Array();
  commentsLoading: boolean = true;

  constructor(private route: ActivatedRoute,
              private taskService: TaskService,
              private realEstateService: RealEstateService,
              private userService: AuthService,
              private fileService: FileUploadService,
              private sanitizer: DomSanitizer,
              private matDialog: MatDialog,
              private emailService: EmailService,
              protected jwtToken: JwtToken) {

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


  async submitTask() {
    let dialogRefLastWarn: MatDialogRef<LastWarningComponent> = this.matDialog.open(LastWarningComponent, {
      data: {
        message:"Are you sure to submit this task?"
      }
    });
    let answer = await firstValueFrom(dialogRefLastWarn.afterClosed());
    if (answer) {
      let issueExist = false;
      this.task.taskCheckListItems.forEach((taskChecklistItem: TaskCheckListItem) => {
        if (taskChecklistItem.status == 'ISSUE') {
          issueExist = true
        }
      });
      if (issueExist){
        this.task.status = "SUBMITTED"
      } else {
        this.task.status = "DONE"
      }

      this.taskService.updateTask(this.task,"Task submitted successfully.")
    }
  }


  async closeTask() {
    let dialogRefLastWarn: MatDialogRef<LastWarningComponent> = this.matDialog.open(LastWarningComponent, {
      data: {
        message: "Are you sure to close this task?"
      }
    });
    let answer = await firstValueFrom(dialogRefLastWarn.afterClosed());
    if (answer){
      this.task.status = "DONE";
      this.taskService.updateTask(this.task,"Task closed successfully.");
    }
  }

  async reopenTask() {
    let dialogRefLastWarn: MatDialogRef<LastWarningComponent> = this.matDialog.open(LastWarningComponent, {
      data: {
        message: "Are you sure to reopen this task?"
      }
    });
    let answer = await firstValueFrom(dialogRefLastWarn.afterClosed());
    if (answer){
      this.task.status = TaskStatus.PENDING;
      this.taskService.updateTask(this.task,"Task reopened successfully.");
    }
  }

  reportProblem(item?: TaskCheckListItem) {
    let dialogRefLastWarn: MatDialogRef<LastWarningComponent> = this.matDialog.open(LastWarningComponent, {
      data: {
        message: "Do you really want to report a problem to notify dispatchers?"
      }
    });
    dialogRefLastWarn.afterClosed().subscribe({
      next: (dialogAnswer: boolean) => {
        if (dialogAnswer) {
          let email: Email = new Email();
          email.header = "Problem Reported: " + this.task.realEstate.name + "!"
          email.content = "There is a problem with the task number " + this.task.id + "\nuser " + this.task.assignee.name
            +" " + this.task.assignee.lastName + " reports a problem with real estate: " + this.task.realEstate.name + "\nplease check: \n" +
            window.location.protocol + "//" + window.location.host + this.taskService.router.url;
          email.to = this.task.creator.email;
          this.emailService.send(email).subscribe({
            next: () => {
              this.emailService.toastr.success("Dispatchers has been notified.");
            }, error: (err) => {
              console.log(err);
              this.emailService.toastr.error("There was an error on the server side while sending notification!")
            }
          });
          ;
        }
        if (item) {
          if (dialogAnswer) {
            item.status = "ISSUE"
          } else {
            item.status = "PENDING"
          }
          this.updateCheckListItemStatus(item);
        }
      }, error: (err) => {
        console.log(err);
        this.emailService.toastr.error("An unexpected error occurred while notifying the dispatchers");
      }
    });
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
    });
    currentTaskCheckListItems.sort((a,b)=> a.checklistItem.id - b.checklistItem.id);
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
      item.status = 'PENDING'
      this.updateCheckListItemStatus(item);
    } else {
      this.reportProblem(item);
    }
  }

  updateCheckListItemStatus(item: TaskCheckListItem) {
    this.taskService.updateTaskCheckListItemStatus(item, "" + this.task.id).subscribe({
      next: () => {
        this.taskService.toastr.success("Updated item status")
      }, error: (err) => {
        console.log(err);
        this.taskService.toastr.error("Error updating item status!")
      }
    });
  }

  onAddComment() {
    this.currentComment.author = this.userService.userProfile;
    this.postComment(this.currentComment);
    this.currentComment = new Comment();
  }

  postComment(comment: Comment) {
    comment.date = new Date();
    comment.task.id = this.task.id;
    this.taskService.addComment(comment)
      .subscribe({
        next: async (commentResponse: Comment) => {
          let i: number = 0;
          for (let image of commentResponse.images) {
            await firstValueFrom(this.fileService.uploadImage(comment.images[i].dataFile,
              "images/task_" + comment.task.id + "/comment_" + commentResponse.id,
              '' + image.id));
            i++;
          }
          if (commentResponse.images.length > 0) {
            this.loadImages(commentResponse);
          }
          let commentResponseInstance: Comment = Utils.jsonObjToInstance(new Comment(), commentResponse);
          commentResponseInstance.author = comment.author;
          this.comments.push(commentResponseInstance);
        }, error: (err) => {
          console.log(err)
          this.taskService.toastr.error("There was an error posting the comment");
        }
      });
  }

  private async getComments() {
    let commentObjs = await firstValueFrom(this.taskService.getComments(this.task.id));
    for (const commentObj of commentObjs) {
      let comment: Comment = Utils.jsonObjToInstance(new Comment(), commentObj);
      this.loadImages(comment);
      comment.author = await firstValueFrom(this.taskService.getCommentAuthorDetails(comment.id)).catch(error => {
        this.errorToastr(error);
        return new User();
      });
      this.comments.push(comment)
    }
    this.commentsLoading = false;
  }

  loadImages(comment: Comment) {
    // Convert each image path to an Observable<Blob>, then fetch all images concurrently
    const imageFetchObservables: Observable<Blob>[] = comment.images.map(image =>
      this.fileService.fetchImage(image.id + '')
    );

    comment.imageUrls$ = forkJoin(imageFetchObservables).pipe(
      map(blobs => blobs.map(blob => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob))))
    );
  }


  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        let image: Image = new Image();
        image.encodedImg = e?.target?.result as string;
        image.dataFile = this.fileService.dataURLtoFile(e?.target?.result as string, "img_" + this.currentComment.images.length + ".jpg");
        this.currentComment.images.push(image);
      };
      reader.readAsDataURL(file);
    }
  }

  deleteImage(index: number) {
    this.currentComment.images.splice(index, 1);
  }

  openImageInFullSize(imageUrl): void {
    this.matDialog.open(FullSizeImageDialogComponent, {
      data: {secureImageUrl: imageUrl}
    });
  }

  disableSubmitButton(): boolean {
    return !this.isAllCheckListItemsMarked() || this.task.status=="SUBMITTED" || this.task.status=="DONE";
  }

  isAllCheckListItemsMarked(): boolean {
    let isAllCheckListItemsMarked: boolean = true;

    this.task.taskCheckListItems.forEach((taskChecklistItem: TaskCheckListItem) => {
      if (taskChecklistItem.status == '' || taskChecklistItem.status == 'PENDING') {
        isAllCheckListItemsMarked = false
      }
    });
    return isAllCheckListItemsMarked;
  }

  protected readonly TaskStatus = TaskStatus;
}
