import { Component, OnInit } from '@angular/core';
import { Food } from 'src/app/models/food';
import { FoodService } from 'src/app/services/food/food.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  user$ = this.usersService.currentUserProfile$;

  foods:Food[] = [];

  constructor(private foodService: FoodService, 
              private route: ActivatedRoute,
              private router: Router,
              private usersService: UsersService) { }  
  
  async ngOnInit(): Promise<void> {
    this.route.params.subscribe( async params => {
      const searchTerm = params['searchTerm'];

      if(searchTerm)
        this.foods = await this.foodService.getAllFoodsBySearchTerm(searchTerm);
      else if(params['tag']) 
        this.foods = await this.foodService.getAllFoodsByTag(params['tag']);
      else
        this.foods = await this.foodService.allFoods();
    });
  }

  goToProductForm(food: Food) {
    this.foodService.setFood(food);
    this.router.navigate(['/admin/edit-product-form']);
  }

}
