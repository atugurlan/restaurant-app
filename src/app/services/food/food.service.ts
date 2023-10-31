import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDocs } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { setDoc, updateDoc } from '@firebase/firestore';
import { Food } from 'src/app/models/food';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  food!:Food;
  
  constructor(private firestore: Firestore) {  }

  setFood(food: any) {
    this.food = food;
  }

  async getFood() {
    return this.food;
  }

  addFood(food: Food) : Observable<any> {
    const ref = doc(this.firestore, 'foods', food?.id.toString());
    return from(setDoc(ref, food));
  }

  updateFood(food: Food) : Observable<any> {
    const ref = doc(this.firestore, 'foods', food?.id.toString());
    return from(updateDoc(ref, {...food}));
  }

  async getNumberOfFoods():Promise<number> {
    let foods:Food[] = [];
    foods = await this.allFoods();

    return foods.length;
  }

  async getLastFood():Promise<Food> {
    let foods:Food[] = [];
    foods = await this.allFoods();

    if (foods.length > 0) {
      return foods[foods.length - 1];
    } 
    else {
      throw new Error("No food found");
    }
  }

  async allFoods():Promise<Food[]> {
    const foods:Food[] = [];
    const querySnapshot = getDocs(collection(this.firestore, "foods"));
    (await querySnapshot).forEach( (doc: { data: () => any; id: any; }) => {
      const foodData: any = doc.data(); 
      const food: Food = {
        id: doc.id,
        name: foodData.name,
        price: foodData.price,
        tag: foodData.tag,
        mealtime: foodData.mealtime,
        imageURL: foodData.imageURL,
        vegetarian: foodData.vegetarian,
        cookTime: foodData.cookTime
      }
      foods.push(food);
    });
    return foods;
  }

  async countTags(): Promise<{ name: string; count: number }[]> {
    const foods = await this.allFoods();
    
    const tagsCountsMap: { [key: string]: number } = {
      'All': foods.length,
      'soup': 0,
      'pizza': 0,
      'pasta': 0,
      'fry': 0,
      'lunch': 0,
      'breakfast': 0,
      'vegetarian': 0
    }

    foods.forEach( (food) => {
      const tag = food.tag;
      const mealtime = food.mealtime;
      const vegetarian = food.vegetarian;
      if(tag) {
        tagsCountsMap[tag] += 1;
      }

      if(mealtime) {
        tagsCountsMap[mealtime] += 1;
      }

      if(vegetarian) {
        tagsCountsMap['vegetarian'] += 1;
      }
    })
  
    const tagsCount: { name: string; count: number }[] = Object.entries(tagsCountsMap).map(
      ([name, count]) => ({ name, count })
    );
  
    return tagsCount;
  }

  async getFoodById(id:number):Promise<Food> {
    const foods = await this.allFoods();
    return foods.find(food => food.id==id)!;   
  }
  
  async getAllFoodsBySearchTerm(searchTerm:string):Promise<Food[]> {
    const foods = await this.allFoods();

    return foods.filter(food => 
            food.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  async getAllFoodsByTag(tag:string):Promise<Food[]> {
    const foods = await this.allFoods();

    if(tag == "vegetarian")
      return foods.filter(food => food.vegetarian == true)

    return tag=="All" ? 
            foods :
            foods.filter(food => food.tag?.includes(tag));
  }

  // getAll():Food[] {
  //   return [
  //     {
  //       id: 1,
  //       name: "Pasta arabiata",
  //       price: 10,
  //       tag: 'pasta',
  //       mealtime: 'lunch',
  //       vegetarian: true, 
  //       imageURL: 'assets/images/foods/pasta-arabiata.jpg',
  //       cookTime: '15 - 20',

  //     },
  //     {
  //       id: 2,
  //       name: "Pasta Carbonara",
  //       price: 10,
  //       tag: 'pasta',
  //       mealtime: 'lunch',
  //       vegetarian: false,
  //       imageURL: 'assets/images/foods/pasta-carbonara.jpg',
  //       cookTime: '15 - 20',
  //     },
  //     {
  //       id: 3,
  //       name: "Pizza Prosciutto",
  //       price: 10,
  //       tag: 'pizza',
  //       mealtime: 'lunch',
  //       vegetarian: false,
  //       imageURL: 'assets/images/foods/pizza-prosciutto.jpg',
  //       cookTime: '15 - 20',
  //     },
  //     {
  //       id: 4,
  //       name: "Pizza Quattro Formaggi",
  //       price: 10,
  //       tag: 'pizza', 
  //       mealtime: 'lunch',
  //       vegetarian: false,
  //       imageURL: 'assets/images/foods/pizza-quattro-formaggi.jpg',
  //       cookTime: '15 - 20',
  //     },
  //     {
  //       id: 5,
  //       name: "Vegetable Soup",
  //       price: 10,
  //       tag: 'soup',
  //       mealtime: 'lunch',
  //       vegetarian: true,
  //       imageURL: 'assets/images/foods/soup.jpg',
  //       cookTime: '15 - 20',
  //     },
  //     {
  //       id: 6,
  //       name: "Fries",
  //       price: 10,
  //       tag: 'fry',
  //       mealtime: 'lunch',
  //       vegetarian: true,
  //       imageURL: 'assets/images/foods/fries.jpg',
  //       cookTime: '15 - 20',
  //     }
  //   ]
  // }
}
