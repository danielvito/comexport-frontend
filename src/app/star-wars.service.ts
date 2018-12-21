import { LogService } from './log.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

@Injectable()
export class StarWarsService {
  private characters = [];
  private movies = [];
  private logService: LogService;
  charactersChanged = new Subject<void>();
  moviesChanged = new Subject<void>();
  http: Http;
  private link_homeworld = 'https://swapi.co/api/planets/?page=1';
  private link_specie = 'https://swapi.co/api/species/?page=1';
  private link_people = 'https://swapi.co/api/people/?page=1';
  private link_movies = 'https://swapi.co/api/films/';
  private next_link: string;
  private homeworlds = new Map();
  private species = new Map();

  constructor(logService: LogService, http: Http) {
    this.logService = logService;
    this.http = http;
  }

  fetchHomeworld(_page: string) {
    this.http.get(_page)
    .map((response: Response) => {
      const data = response.json();
      const extracted = data.results;
      this.next_link = data.next;
      const homeworld = extracted.map((planet) => {
        return { name: planet.name, url: planet.url }
      });
      return homeworld;
    })
    .subscribe(
      (data) => {
        for (let i = 0; i < data.length; i++) {
          this.homeworlds.set(data[i].url, data[i].name);
        }
        if (this.next_link) {
          this.fetchHomeworld(this.next_link);
        } else {
          this.fetchSpecie(this.link_specie);
        }
      }
    );
  }

  fetchSpecie(_page: string) {
    this.http.get(_page)
    .map((response: Response) => {
      const data = response.json();
      const extracted = data.results;
      this.next_link = data.next;
      const specie = extracted.map((spc) => {
        return { name: spc.name, url: spc.url }
      });
      return specie;
    })
    .subscribe(
      (data) => {
        for (let i = 0; i < data.length; i++) {
          this.species.set(data[i].url, data[i].name);
        }
        if (this.next_link) {
          this.fetchSpecie(this.next_link);
        } else {
          this.fetchPage(this.link_people);
        }
      }
    );
  }

  fetchPage(_page: string) {
    this.http.get(_page)
    .map((response: Response) => {
      const data = response.json();
      const extractedChars = data.results;
      this.next_link = data.next;
      const chars = extractedChars.map((char) => {
        return {
          name: char.name,
          side: '',
          height: char.height,
          gender: char.gender,
          birth_year: char.birth_year,
          homeworld: this.homeworlds.get(char.homeworld),
          species: char.species.map((spc) => {
            return this.species.get(spc);
          })
        }
      });
      return chars;
    })
    .subscribe(
      (data) => {
        // console.log(data);
        for (let i = 0; i < data.length; i++) {
          this.characters.push(data[i]);
        }

        this.charactersChanged.next();
        if (this.next_link) {
          this.fetchPage(this.next_link);
        }
      }
    );
  }

  fetchCharacters() {
    this.fetchHomeworld(this.link_homeworld);
  }

  fetchMovies() {
    this.http.get(this.link_movies).map((response: Response) => {
      const data = response.json();
      const extractedMovies = data.results;
      const movies = extractedMovies.map((movie) => {
        return {
          title: movie.title,
          episode_id: movie.episode_id,
          opening_crawl: movie.opening_crawl,
          director: movie.director,
          producer: movie.producer,
          release_date: movie.release_date,
          characters_count: movie.characters.length,
          planets_count: movie.planets.length,
          starships_count: movie.starships.length
        }
      });
      return movies;
    }).subscribe(
      (data) => {
        // console.log(data);
        this.movies.push(...data);
        this.moviesChanged.next();
      }
    );
  }

  getCharacters() {
    return this.characters.slice();
  }

  getMovies() {
    return this.movies.slice();
  }

}
