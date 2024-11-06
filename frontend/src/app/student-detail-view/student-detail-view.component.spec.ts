import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentDetailViewComponent } from './student-detail-view.component';

describe('StudentDetailViewComponent', () => {
  let component: StudentDetailViewComponent;
  let fixture: ComponentFixture<StudentDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentDetailViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
