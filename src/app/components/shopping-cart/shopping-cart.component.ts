import { Component, OnInit } from '@angular/core';
import { Cart } from 'src/app/models/cart';
import { CartItem } from 'src/app/models/cart-item';
import { CartServiceService } from 'src/app/services/cart/cart-service.service';
import { Firestore, collection, deleteDoc, doc, getDocs } from '@angular/fire/firestore';
import { from } from 'rxjs';
import { setDoc } from '@firebase/firestore';
import { Order } from 'src/app/models/order';
import { UsersService } from 'src/app/services/users.service';
import { ProfileUser } from 'src/app/models/user-profile';
import { OrdersService } from 'src/app/services/orders/orders.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent {
  cart!:Cart;
  orders!:Order[];
  cartItems:CartItem[] = []
  priceItem!:number;

  user$ = this.usersService.currentUserProfile$;

  constructor(private cartService: CartServiceService, 
              private firestore: Firestore,      
              private usersService: UsersService,
              private ordersService: OrdersService) {
                this.setCart();
              }

  async setCart() {
    this.cart = await this.cartService.getCart();
  }

  async removeFromCart(cartItem:CartItem) {
    this.cart = await this.cartService.removeFromCart(cartItem.food.id);
  }

  async changeQuantity(cartItem:CartItem, quantityInString:string) {
    const quantity = parseInt(quantityInString);
    this.cart = await this.cartService.changeQuantity(cartItem.food.id, quantity);
  }

  async getAllOrders():Promise<void> {
    this.orders = await this.ordersService.getAllOrders();
    // console.log(this.orders.length);
  }

  async addOrder() {
    let currentUser: ProfileUser | null = null;
  
    this.user$.subscribe(async (user) => {
      if (user) {
        currentUser = user;
        await this.getAllOrders();
        console.log(this.orders.length);
        let maxId = parseInt(this.orders.length.toString(), 10) + 1;
        let cartItems = this.cart.items.map((item) => `${item.quantity}x ${item.food.name}`).join(', ');
        const order = {
          id: maxId,
          customer: currentUser.uid,
          cart: cartItems,
          price: this.cart.totalPrice,
          status: 'new'
        };
        const ref = doc(this.firestore, 'orders', order.id.toString());
  
        from(setDoc(ref, order)).subscribe(async () => {
          await this.clearShoppingCart(user.uid);
        }, (error) => {
          console.error('Error adding order:', error);
        });
      } else {
        console.error('User data not available.');
      }
    });
  }

  async clearShoppingCart(userId: string): Promise<void> {
    const cartCollection = collection(this.firestore, `shopping-cart/${userId}/items`);
    const querySnapshot = await getDocs(cartCollection);
    
    querySnapshot.forEach(async (doc) => {
      const docRef = doc.ref;
      await deleteDoc(docRef);
    });
  
    console.log('Shopping cart cleared.');
  }
  
}
