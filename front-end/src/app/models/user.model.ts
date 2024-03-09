import {Task} from "./task.model";

export class User {
  userId: string;
  name:string;
  lastName:string;
  email:string;
  password:string;
  role:string;
  phoneNumber:string;
  preferredArea: string;
  isActive:boolean;
  active:boolean;
  assignedTasks: Task[];
  createdTasks: Task[]

  [key: string]: any;

  cloneUser(user:User) {
    this.userId = user.userId
    this.name = user.name
    this.lastName = user.lastName
    this.email = user.email
    this.password = user.password
    this.role = user.role
    this.phoneNumber = user.phoneNumber
    this.preferredArea = user.preferredArea
    this.isActive = user.isActive
    this.active = user.active
  }

  setActiveStatus(isActive: boolean) {
    this.isActive = isActive
    this.active = isActive
  }
}
