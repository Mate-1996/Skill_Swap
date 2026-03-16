import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPostingsComponent } from './my-postings';

describe('MyPostings', () => {
  let component: MyPostingsComponent;
  let fixture: ComponentFixture<MyPostingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyPostingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyPostingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
