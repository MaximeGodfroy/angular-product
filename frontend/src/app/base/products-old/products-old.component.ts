import { Component, OnInit } from '@angular/core';
import { Product } from './products-old.model';
import { ProductService } from './products-old.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-products',
  templateUrl: './products-old.component.html',
  styleUrls: ['./products-old.component.scss']
})
export class ProductsOldComponent implements OnInit {
  
  //products!: Product[];
  products$!: Observable<Product[]>;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
   // this.products = this.productService.getAllProducts();
    this.products$ = this.productService.getAllProducts();

  }

    first: number = 0;

    rows: number = 10;

    onPageChange(event) {
        this.first = event.first;
        this.rows = event.rows;
    }

}
