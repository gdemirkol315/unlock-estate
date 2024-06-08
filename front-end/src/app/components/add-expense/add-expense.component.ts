import {Component, Inject} from '@angular/core';
import {Expense} from "../../models/expense.model";
import {TaskService} from "../../services/task/task.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.scss'
})
export class AddExpenseComponent {
  expense: Expense = new Expense();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private taskService: TaskService,
              private dialogRef: MatDialogRef<AddExpenseComponent>) {
  }

  addExpense() {
    this.expense.task.id = this.data.taskId;
    this.expense.author.email = this.data.email;
    this.taskService.addExpense(this.expense)
      .subscribe({
        next: (expenseId) => {
          // @ts-ignore
          this.expense.id = expenseId;
          this.dialogRef.close(this.expense);
          this.taskService.toastr.success('Expense successfully added');
        },
        error: () => {
          this.taskService.toastr.error('There was an unexpected error while adding expense!');
        }
      });
  }
}
