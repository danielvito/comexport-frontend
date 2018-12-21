import { TestBed, async } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ListComponent } from './list/list.component';
import { CardsComponent } from './cards/cards.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { StarWarsService } from './star-wars.service';
import { LogService } from './log.service';

const routes = [
  { path: 'characters', component: ListComponent},
  { path: 'movies', component: CardsComponent },
  { path: '**', redirectTo: '/characters' }
];

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        ListComponent,
        CardsComponent,
        HeaderComponent
      ],
      imports: [
        BrowserModule,
        FormsModule,
        RouterModule.forRoot(routes),
        HttpModule
      ],
      providers: [StarWarsService, LogService, {provide: APP_BASE_HREF, useValue: '/'}],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have a starwarsservice'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.swService).toBeTruthy();
  }));

  it('should render header', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.nav-link').textContent).toContain('Star Wars Characters');
  }));

});
