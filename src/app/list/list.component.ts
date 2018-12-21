import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StarWarsService } from 'app/star-wars.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {
  characters = [];
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
        this.characters = this.swService.getCharacters();
      }
    );
    this.subscription = this.swService.charactersChanged.subscribe(
      (params) => {
        this.characters = this.swService.getCharacters();
      }
    );
  }

  isLoaded() {
    return this.swService.charactersLoaded;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
