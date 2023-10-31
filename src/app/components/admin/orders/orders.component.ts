import { Component } from '@angular/core';
import { Order } from 'src/app/models/order';
import { Firestore, collection, doc, getDocs } from '@angular/fire/firestore'
import { Observable, from } from 'rxjs';
import { setDoc, updateDoc } from '@firebase/firestore';
import { OrdersService } from 'src/app/services/orders/orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class AdminOrdersComponent {
  orders!:Order[];
  newOrders!:Order[];
  pendingOrders!:Order[];
  rejectedOrders!:Order[];
  completedOrders!:Order[];

  constructor(private ordersService: OrdersService) {
    this.getOrders();
    this.getOrdersByStatus();
  }

  async getOrders():Promise<void> {
    this.orders = await this.ordersService.getAllOrders();
    this.orders.forEach(order => order.isEditable = false);
    // console.log(this.orders);
  }  

  toggleEdit(order:Order) {
    order.isEditable = !order.isEditable;
  }

  async updateOrder(order: Order) {
      this.toggleEdit(order);
      this.ordersService.updateOrder(order);

      await this.getOrdersByStatus();
  }

  async getOrdersByStatus() {
    this.newOrders = await this.ordersService.getAllOrdersByStatus("new");
    this.pendingOrders = await this.ordersService.getAllOrdersByStatus("pending");
    this.rejectedOrders = await this.ordersService.getAllOrdersByStatus("rejected");
    this.completedOrders = await this.ordersService.getAllOrdersByStatus("completed");
  }
}
