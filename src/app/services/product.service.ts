import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { Observable, from } from 'rxjs';
import { Firestore, doc, setDoc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private firestore: Firestore) { }

  addProduct(product: Product) : Observable<any> {
    const ref = doc(this.firestore, 'products', product?.name);
    return from(setDoc(ref, product));
  }

  updateProduct(product: Product) : Observable<any> {
    const ref = doc(this.firestore, 'products', product?.name);
    return from(updateDoc(ref, {...product}));
  }
}
