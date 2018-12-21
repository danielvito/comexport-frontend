import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StarWarsService } from 'app/star-wars.service';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.css']
})
export class CardsComponent implements OnInit, OnDestroy {
  movies = [];
  activatedRoute: ActivatedRoute;
  swService: StarWarsService;
  subscription;

  constructor(activatedRoute: ActivatedRoute, swService: StarWarsService) {
    this.activatedRoute = activatedRoute;
    this.swService = swService;
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (params) => {
        this.movies = this.swService.getMovies();
      }
    );
    this.subscription = this.swService.moviesChanged.subscribe(
      (params) => {
        this.movies = this.swService.getMovies();
      }
    );
  }

  isLoaded() {
    return this.swService.moviesLoaded;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
