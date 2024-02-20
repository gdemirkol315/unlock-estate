import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistTemplatesComponent } from './checklist-templates.component';

describe('ChecklistTemplatesComponent', () => {
  let component: ChecklistTemplatesComponent;
  let fixture: ComponentFixture<ChecklistTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChecklistTemplatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChecklistTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
