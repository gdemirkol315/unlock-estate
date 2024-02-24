import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastWarningComponent } from './last-warning.component';

describe('LastWarningComponent', () => {
  let component: LastWarningComponent;
  let fixture: ComponentFixture<LastWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LastWarningComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LastWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
