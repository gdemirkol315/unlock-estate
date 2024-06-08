import { Component } from '@angular/core';
import {Expense} from "../../models/expense.model";

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrl: './add-expense.component.scss'
})
export class AddExpenseComponent {
  expense: Expense = new Expense();

  addExpense() {
    //todo do backend implementation and add backend call
  }
}
