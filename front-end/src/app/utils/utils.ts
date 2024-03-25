import {User} from "../models/user.model";
import {FormControl, FormGroup} from "@angular/forms";
import {Task} from "../models/task.model";
import {TaskCheckListItem} from "../models/task-check-list-item.model";

export class Utils {
  public static getUserFromObject(obj: any): User {
    let updatedUser = new User();
    if (obj instanceof FormGroup) {
      updatedUser.userId = obj.get('userId')?.value;
      updatedUser.name = obj.get('name')?.value;
      updatedUser.email = obj.get('email')?.value;
      updatedUser.lastName = obj.get('lastName')?.value;
      updatedUser.phoneNumber = obj.get('phoneNumber')?.value;
      updatedUser.preferredArea = obj.get('preferredArea')?.value;
      updatedUser.role = obj.get('role')?.value;
      updatedUser.active = obj.get('active')?.value;
      updatedUser.isActive = obj.get('isActive')?.value;
    } else {
      updatedUser.userId = obj['userId'];
      updatedUser.name = obj['name'];
      updatedUser.email = obj['email'];
      updatedUser.lastName = obj['lastName'];
      updatedUser.phoneNumber = obj['phoneNumber'];
      updatedUser.preferredArea = obj['preferredArea'];
      updatedUser.role = obj['role'];
      updatedUser.active = obj['active'];
      updatedUser.isActive = obj['isActive'];
    }

    return updatedUser;
  }

  public static isUserDetailsChanged(updatedUser: User, user: User): boolean {
    return !(updatedUser.role === user.role
      && updatedUser.preferredArea === user.preferredArea
      && updatedUser.phoneNumber === user.phoneNumber
      && updatedUser.lastName === user.lastName);
  }

  public static initializeUserDetailForm(user: User, isEditMode: boolean): FormGroup {
    return new FormGroup({
      userId: new FormControl({value: user.userId, disabled: true}),
      name: new FormControl({value: user.name, disabled: true}),
      lastName: new FormControl({value: user.lastName, disabled: !isEditMode}),
      email: new FormControl({value: user.email, disabled: true}),
      phoneNumber: new FormControl({value: user.phoneNumber, disabled: !isEditMode}),
      preferredArea: new FormControl({value: user.preferredArea, disabled: !isEditMode})
    });
  }

  static jsonObjToInstance<T>(obj: T, jsonObj: object): T {

    for (var propName in jsonObj) {
      obj[propName] = jsonObj[propName]
    }

    return obj;
  }

  static getTaskSubmittedMessage(task: Task):string {
    let checkoutDateTime = this.formatDate(new Date(task.taskDate));
    let taskCompleteDateTime = this.formatDate(new Date());
    let message: string = "This is an automated message." +
      "\n\n\nFollowing task is completed:\n" +
      "\nProperty: " + task.realEstate.name
      + "\nAssignee: " + task.assignee.name + " " + task.assignee.lastName
      + "\nCheckout Date: " + checkoutDateTime
      + "\nTask Complete Date: " + taskCompleteDateTime
    +" \n\nChecklist Items:\n"
    task.taskCheckListItems.forEach((taskCheckListItem: TaskCheckListItem) => {
      message = message + "\n - " + taskCheckListItem.checklistItem.description + ": " + taskCheckListItem.status
    })
    return message;
  }

  static formatDate(date: Date): string {
    const pad = (num: number) => num.toString().padStart(2, '0');

    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1); // Note: Months are zero-indexed
    const year = date.getFullYear();
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }


}
