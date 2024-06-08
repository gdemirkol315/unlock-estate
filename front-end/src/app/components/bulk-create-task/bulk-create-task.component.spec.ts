import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkCreateTaskComponent } from './bulk-create-task.component';

describe('BulkCreateTaskComponent', () => {
  let component: BulkCreateTaskComponent;
  let fixture: ComponentFixture<BulkCreateTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BulkCreateTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkCreateTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
