import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HotToastService, Toast } from '@ngneat/hot-toast';
import { concatMap } from 'rxjs';
import { Food } from 'src/app/models/food';
import { FoodService } from 'src/app/services/food/food.service';
import { ImageUploadService } from 'src/app/services/image-upload.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {

  food!:Food;

  productEditForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl(''),
    price: new FormControl(''),
    cookTime: new FormControl(''),
    mealtime: new FormControl(''),
    tag: new FormControl(''),
    isVegetarian: new FormControl('')
  });

  constructor(private foodService:FoodService, private imageUploadService: ImageUploadService, private toast: HotToastService) {}

  async ngOnInit(): Promise<void> {
    this.food = await this.foodService.getFood();
    console.log(this.food);
    this.productEditForm.patchValue({
      name: this.food.name,
      price: this.food.price.toString(),
      cookTime: this.food.cookTime,
      mealtime: this.food.mealtime,
      tag: this.food.tag,
      isVegetarian: this.food.vegetarian.toString()
    });
  }

  updateFood() {
    const { name, price, cookTime, mealtime, tag, isVegetarian } = this.productEditForm.value;

    if(name && price && cookTime && mealtime && tag && isVegetarian) {
      console.log('2');
      this.foodService
        .updateFood({
          name: name,
          price: parseFloat(price),
          cookTime: cookTime,
          mealtime: mealtime,
          tag: tag, 
          vegetarian: this.convertToBoolean(isVegetarian),
          id: this.food.id
        }).pipe(
          this.toast.observe({
            loading: 'Saving food data...',
            success: 'Food updated successfully',
            error: 'There was an error in updating the food component'
          })
        )
        .subscribe();
      }
  }

  convertToBoolean(value: string): boolean {
    return value === 'true';
  }


  async uploadFoodImage(event: any, food:Food):Promise<void> {
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
