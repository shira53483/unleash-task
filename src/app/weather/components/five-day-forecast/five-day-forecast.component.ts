import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

import { WeatherService } from 'src/app/core/services/weather.service';
import { Forecast } from 'src/app/shared/models/forecast.model';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-five-day-forecast',
  templateUrl: './five-day-forecast.component.html',
  styleUrls: ['./five-day-forecast.component.scss']
})
export class FiveDayForecastComponent implements OnChanges, OnDestroy {

  @Input() selectedLocationKey: string;
  fiveDayForecast: Forecast;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private weatherService: WeatherService,
    private toastr: ToastrService,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    this.weatherService.temperatureUnitChanged
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      this.getForecast();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedLocationKey) {
      this.getForecast();
    }
  }
  
  private getForecast() {
    this.loaderService.addRequest();
    this.weatherService.getForecast(this.selectedLocationKey)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (forecast) => {
          this.fiveDayForecast = forecast;
          this.error = null;
          this.loaderService.removeRequest();
        },
        error: (err) => this.handleError('Failed to load forecast', err)
      });
  }

  private handleError(message: string, err: any) {
    this.error = message;
    this.toastr.error(message, 'Error');
    this.loaderService.removeRequest();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}