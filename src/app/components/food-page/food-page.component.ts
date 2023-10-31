import { Component, OnInit } from '@angular/core';
import { Firestore, addDoc, collection, doc, setDoc } from '@angular/fire/firestore';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { from } from 'rxjs';
import { CartItem } from 'src/app/models/cart-item';
import { Food } from 'src/app/models/food';
import { ProfileUser } from 'src/app/models/user-profile';
import { CartServiceService } from 'src/app/services/cart/cart-service.service';
import { FoodService } from 'src/app/services/food/food.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-food-page',
  templateUrl: './food-page.component.html',
  styleUrls: ['./food-page.component.css']
})
export class FoodPageComponent implements OnInit {
  food!:Food;
  user$ = this.usersService.currentUserProfile$;

  constructor(private activatedRoute: ActivatedRoute, 
              private foodService: FoodService, 
              private cartService: CartServiceService,
              private firestore: Firestore,      
              private usersService: UsersService,
              private router:Router) { }

  async ngOnInit(): Promise<void> {
    this.activatedRoute.params.subscribe(async (params) => {
      if(params['id']) 
        this.food = await this.foodService.getFoodById(params['id']);
    })
  }

  async addToCart(food:Food) {
    let currentUser: ProfileUser | null = null;

    this.user$.subscribe(async (user) => {
      if (user) {
        try {
          currentUser = user;
          const cartItem: CartItem = {
            food: food,
            price: food.price,
            quantity: 1
          }
          const cartDoc = doc(this.firestore,`shopping-cart/${user.uid}/items/${food.name}`);
          await setDoc(cartDoc, cartItem);
          console.log('Food item added to the cart successfully!');
        }catch (error) {
          console.error('Error adding food item to the cart:', error);
        }
      } else {
        console.error('User data not available.');
      }
    });

    // this.cartService.addToCart(this.food);
    // this.router.navigateByUrl('/shopping-cart');
  }
}
