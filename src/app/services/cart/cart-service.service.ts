import { Injectable } from '@angular/core';
import { Cart } from 'src/app/models/cart';
import { Food } from 'src/app/models/food';
import { Firestore, collection, deleteDoc, doc, getDocs, updateDoc } from '@angular/fire/firestore';
import { setDoc } from '@firebase/firestore';
import { Observable, from } from 'rxjs';
import { UserProfile } from '@angular/fire/auth';
import { CartItem } from 'src/app/models/cart-item';
import { UsersService } from '../users.service';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {
  cart!:Cart;
  user$ = this.usersService.currentUserProfile$;

  constructor(private firestore: Firestore, private usersService: UsersService) { }

  async getCart(): Promise<Cart> {
    return new Promise<Cart>((resolve, reject) => {
      this.user$.subscribe(async (user) => {
        if (user) {
          const cartCollection = collection(this.firestore, `shopping-cart/${user.uid}/items`);
          let cartItems: CartItem[] = [];
  
          await getDocs(cartCollection)
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const cartItem = doc.data() as CartItem;
                cartItems.push(cartItem);
              });
            })
            .then(() => {
              this.cart = {
                items: cartItems,
                totalPrice: this.calculateTotalPrice(cartItems)
              };
              resolve(this.cart);
            })
            .catch((error) => {
              reject(error);
            });
        }
      });
    });
  }
  
  calculateTotalPrice(items: CartItem[]): number {
    let totalPrice = 0;
    items.forEach(item => {
      totalPrice += item.price * item.quantity;
    });
    return totalPrice;
  }

  async removeFromCart(foodId: number): Promise<Cart> {
    return new Promise<Cart>((resolve, reject) => {
      this.user$.subscribe(async (user) => {
        if (user) {
          const cartCollection = collection(this.firestore, `shopping-cart/${user.uid}/items`);
          const querySnapshot = await getDocs(cartCollection);
      
          querySnapshot.forEach(async (doc) => {
            const cartItem = doc.data() as CartItem;
      
            if (cartItem.food.id === foodId) {
              const docRef = doc.ref;
              await deleteDoc(docRef);
              // console.log('Item deleted');
  
              this.cart.items = this.cart.items.filter(item => item.food.id !== foodId);
              // console.log(this.cart);
            }
          });
  
          resolve(this.cart); 
        } else {
          reject(new Error('User data not available.')); 
        }
      });
    });
  }
  

  async changeQuantity(foodId: number, quantity: number): Promise<Cart> {
    return new Promise<Cart>((resolve, reject) => {
      this.user$.subscribe(async (user) => {
        if (user) {
          const cartCollection = collection(this.firestore, `shopping-cart/${user.uid}/items`);
          const querySnapshot = await getDocs(cartCollection);
    
          querySnapshot.forEach(async (doc) => {
            const cartItem = doc.data() as CartItem;
    
            if (cartItem.food.id === foodId) {
              const docRef = doc.ref;
    
              await updateDoc(docRef, { quantity: quantity });
              console.log('Quantity updated in Firestore for item with ID:', foodId, 'New quantity:', quantity);
    
              let foundItem = this.cart.items.find(item => item.food.id === foodId);
              if (foundItem) {
                foundItem.quantity = quantity;
                console.log('Local cart updated with new quantity:', this.cart);
              }
            }
          });
    
          // Fetch the updated cart after the quantity changes
          const updatedCart = await this.fetchUpdatedCart(user.uid);
          this.cart = updatedCart; // Update the local cart
          resolve(this.cart); // Resolve with the updated cart after changing the quantity and fetching the updated cart
        } else {
          reject(new Error('User data not available.'));
        }
      });
    });
  }
  
  async fetchUpdatedCart(userId: string): Promise<Cart> {
    const cartCollection = collection(this.firestore, `shopping-cart/${userId}/items`);
    const querySnapshot = await getDocs(cartCollection);
    
    let totalPrice = 0;
    const items: CartItem[] = [];
    
    querySnapshot.forEach(doc => {
      const cartItem = doc.data() as CartItem;
      totalPrice += cartItem.price * cartItem.quantity;
      items.push(cartItem);
    });

    console.log('Compute new price' + totalPrice);
    
    return { items, totalPrice };
  }
  
}
