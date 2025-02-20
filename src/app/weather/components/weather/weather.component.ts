import { Component, OnDestroy, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { Location } from 'src/app/shared/models/location.model';
import { LoaderService } from 'src/app/core/services/loader.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        animate('1000ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class WeatherComponent implements OnInit, OnDestroy {

  locations: Location[] = [];
  selectedLocationKey: string = null;
  isLoading = false;
  error: string | null = null;
  private destroy$ = new Subject<void>();
  
  constructor(private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.loaderService.stateChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => this.isLoading = state);
  }

  onSearchCompleted = (event: string) => this.selectedLocationKey = event;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}