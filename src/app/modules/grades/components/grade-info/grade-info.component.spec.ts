import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GradeInfoComponent } from '@modules/grades/components/grade-info/grade-info.component';

describe('GradeInfoComponent', () => {
  let component: GradeInfoComponent;
  let fixture: ComponentFixture<GradeInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GradeInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
