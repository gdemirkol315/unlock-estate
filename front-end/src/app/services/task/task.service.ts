import {Injectable} from '@angular/core';
import {DataService} from "../data/data.service";
import {HttpParams} from "@angular/common/http";
import {Task} from "../../models/task.model";
import {RealEstate} from "../../models/real-estate.model";

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
}
