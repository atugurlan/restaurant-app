import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { HomeComponent } from './components/home/home.component';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo, AuthGuard } from '@angular/fire/auth-guard';
import { ProfileComponent } from './components/profile/profile.component';
import { CheckOutComponent } from './components/check-out/check-out.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { AdminProductsComponent } from './components/admin/products/products.component';
import { AdminOrdersComponent } from './components/admin/orders/orders.component';
import { AdminProductFormComponent } from './components/admin/product-form/product-form.component';
import { FoodPageComponent } from './components/food-page/food-page.component';
import { EditProductComponent } from './components/admin/edit-product/edit-product.component';

const redirectToLogin = () => redirectUnauthorizedTo(['login']);
const redirectToLanding = () => redirectLoggedInTo(['landing']);

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LandingComponent
  },
  {
    path: 'food/:id',
    component: FoodPageComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    ...canActivate(redirectToLanding)
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
    ...canActivate(redirectToLanding)
  },

  {
    path: 'home',
    component: HomeComponent,
    ...canActivate(redirectToLogin)
  },
  {
    path: 'profile',
    component: ProfileComponent,
    ...canActivate(redirectToLogin)
  },
  {
    path: 'check-out',
    component: CheckOutComponent,
    ...canActivate(redirectToLogin)
  },
  {
    path: 'shopping-cart',
    component: ShoppingCartComponent,
    ...canActivate(redirectToLogin)
  },
  {
    path: 'order-success',
    component: OrderSuccessComponent,
    ...canActivate(redirectToLogin)
  },
  {
    path: 'my-orders',
    component: MyOrdersComponent,
    ...canActivate(redirectToLogin)
  },

  {
    path: 'admin/products',
    component: AdminProductsComponent,
    ...canActivate(redirectToLogin)
  },
  {
    path: 'admin/product-form',
    component: AdminProductFormComponent,
    ...canActivate(redirectToLogin)
  },
  {
    path: 'admin/edit-product-form',
    component: EditProductComponent,
    ...canActivate(redirectToLogin)
  },
  {
    path: 'admin/orders',
    component: AdminOrdersComponent,
    ...canActivate(redirectToLogin)
  },
  {
    path: 'search/:searchTerm', 
    component: LandingComponent
  },
  {
    path: 'tag/:tag',
    component: LandingComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
