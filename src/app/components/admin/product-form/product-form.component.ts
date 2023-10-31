import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { FoodService } from 'src/app/services/food/food.service';
import { concatMap } from 'rxjs';
import { Food } from 'src/app/models/food';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class AdminProductFormComponent {

  productForm = new FormGroup({
    name: new FormControl(''),
    price: new FormControl(''),
    cookTime: new FormControl(''),
    mealtime: new FormControl(''),
    tag: new FormControl(''),
    isVegetarian: new FormControl('')
  });

  imageURL: any;

  constructor(
    private toast: HotToastService,
    private foodService: FoodService,
    private imageUploadService: ImageUploadService
  ) {}

  async saveDetailsProduct() {
    const { name, price, cookTime, mealtime, tag, isVegetarian } = this.productForm.value;

    if (!name) {
      return;
    }

    if(name && price && cookTime && mealtime && tag && isVegetarian) {
      this.foodService.addFood({
        name, 
        price: parseFloat(price), 
        cookTime: cookTime, 
        mealtime: mealtime, tag: tag, vegetarian: this.convertToBoolean(isVegetarian),
        id: await this.foodService.getNumberOfFoods() + 1,
        imageURL: ''
      })
      .pipe(
        this.toast.observe({
          loading: 'Saving product data...',
          success: 'Product saved successfully',
          error: 'There was an error in adding the product'
        })
      )
      .subscribe();
    }
  }

  convertToBoolean(value: string): boolean {
    return value === 'true';
  }

  async uploadFoodImage(event: any):Promise<void> {
    let food = await this.foodService.getLastFood();
    
    this.imageUploadService
      .uploadImage(event.target.files[0], `images/food/${food.name}`)
      .pipe(
        this.toast.observe({
          loading: 'Uploading food image...',
          success: 'Image uploaded successfully',
          error: 'There was an error in uploading the image',
        }),
        concatMap((photoURL) =>
          this.foodService.updateFood({
            id: food.id,
            name: food.name,
            price: food.price,
            tag: food.tag,
            mealtime: food.mealtime,
            vegetarian: food.vegetarian,
            imageURL: photoURL,
            cookTime: food.cookTime
          })
        )
      )
      .subscribe();
  }
}


