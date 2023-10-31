import { Component, Input, OnInit } from '@angular/core';
import { Tag } from 'src/app/models/tag';
import { FoodService } from 'src/app/services/food/food.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {
  @Input()
  foodPageTags?:string;
  tags?:Tag[];

  constructor(private foodService:FoodService) { }

  async ngOnInit(): Promise<void> {
    if(!this.foodPageTags)
     this.tags = await this.foodService.countTags();
  }
}
