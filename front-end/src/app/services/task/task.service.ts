import {Injectable} from '@angular/core';
import {DataService} from "../data/data.service";
import {HttpParams} from "@angular/common/http";
import {Task} from "../../models/task.model";
import {User} from "../../models/user.model";
import {TaskCheckListItem} from "../../models/task-check-list-item.model";

@Injectable({
  providedIn: 'root'
})
export class TaskService extends DataService {

  private serviceUrlSuffix: string = "task"

  getTasks() {
    return this.http.get<Task[]>(this.hostname + this.serviceUrlSuffix + "/tasks")
  }

  getTask(taskId: number) {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("id", taskId);
    return this.http.get<Task>(this.hostname + this.serviceUrlSuffix + "/task", {params: queryParams});
  }

  saveTask(task: Task) {
    return this.http.post<Task>(this.hostname + this.serviceUrlSuffix + "/saveTask", task)
  }

  findAssignee(users: User[], taskId: number) {
    for (const user of users) {
      for (const task of user.assignedTasks) {
        if (task.id == taskId) {
          return user;
        }
      }
    }
    return new User();
  }

  findCreator(users: User[], taskId: number) {
    for (const user of users) {
      for (const task of user.createdTasks) {
        if (task.id == taskId) {
          return user;
        }
      }
    }
    return new User();
  }


  updateTaskCheckListItemStatus(item: TaskCheckListItem) {
    return this.http.post(this.hostname + this.serviceUrlSuffix + "/updateTaskChecklistItem", item)
  }
}
