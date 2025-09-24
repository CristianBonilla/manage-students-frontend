import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateGradeComponent } from '@modules/grades/components/create-grade/create-grade.component';

describe('CreateGradeComponent', () => {
  let component: CreateGradeComponent;
  let fixture: ComponentFixture<CreateGradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateGradeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
