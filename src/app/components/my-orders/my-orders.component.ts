import { Component } from '@angular/core';
import { Order } from 'src/app/models/order';
import { OrdersService } from 'src/app/services/orders/orders.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent {
  user$ = this.usersService.currentUserProfile$;
  customerOrder!:Order[];
  
  constructor(private usersService: UsersService, private ordersService: OrdersService) {
    this.getCustomerOrders();
   }

  async getCustomerOrders() {
    this.user$.subscribe( async (user) => {
      if(user) {
        this.customerOrder = await this.ordersService.getAllCustomerOrders(user.uid);
        console.log(this.customerOrder);
      }
      return this.customerOrder;
    });
  }
}
