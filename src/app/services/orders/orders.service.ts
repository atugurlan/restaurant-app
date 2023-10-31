import { Order } from 'src/app/models/order';
import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs, updateDoc } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private firestore: Firestore) { }

  async getAllOrders():Promise<Order[]> {
    const orders:Order[] = [];
    const querySnapshot = getDocs(collection(this.firestore, "orders"));

    (await querySnapshot).forEach( (doc: { data: () => any; id: any; }) => {
      const orderData: any = doc.data(); 
      const order: Order = {
        id: doc.id,
        customer: orderData.customer, 
        cart: orderData.cart,
        price: orderData.price,
        status: orderData.status
      }
      orders.push(order);
    });

    return orders;
  }

  updateOrder(order:Order) : Observable<any> {
    const ref = doc(this.firestore, 'orders', order?.id.toString());
    return from(updateDoc(ref, {...order}));
  }

  async getAllOrdersByStatus(status:string):Promise<Order[]> {
    const orders = await this.getAllOrders();

    return orders.filter(order => order.status?.includes(status));
  }

  async getAllCustomerOrders(id:string):Promise<Order[]> {
    const orders = await this.getAllOrders();
    let customerOrders = orders.filter(order => order.customer == id);
    console.log(customerOrders);
    return customerOrders;
  }
}
