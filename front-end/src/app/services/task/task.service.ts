import {Injectable} from '@angular/core';
import {DataService} from "../data/data.service";
import {HttpParams} from "@angular/common/http";
import {Task} from "../../models/task.model";
import {RealEstate} from "../../models/real-estate.model";
import {User} from "../../models/user.model";

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

  findRealEstate(realEstates: RealEstate[], taskId: number) {
    for (const realEstate of realEstates) {
      for (const task of realEstate.tasks) {
        if (task.id == taskId) {
          return realEstate;
        }
      }
    }
    return new RealEstate();
  }
}
