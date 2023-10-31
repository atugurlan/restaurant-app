import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductsComponent } from './products.component';

describe('ProductsComponent', () => {
  let component: AdminProductsComponent;
  let fixture: ComponentFixture<AdminProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminProductsComponent]
    });
    fixture = TestBed.createComponent(AdminProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
