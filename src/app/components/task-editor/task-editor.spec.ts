import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskEditor } from './task-editor';

describe('TaskEditor', () => {
  let component: TaskEditor;
  let fixture: ComponentFixture<TaskEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
