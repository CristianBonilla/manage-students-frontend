import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteTeacherComponent } from '@modules/teachers/components/delete-teacher/delete-teacher.component';

describe('DeleteTeacherComponent', () => {
  let component: DeleteTeacherComponent;
  let fixture: ComponentFixture<DeleteTeacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteTeacherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
