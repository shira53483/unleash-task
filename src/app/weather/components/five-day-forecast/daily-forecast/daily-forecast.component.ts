import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { WeatherService } from 'src/app/core/services/weather.service';
import { DailyForecast } from 'src/app/shared/models/forecast.model';

@Component({
  selector: 'app-daily-forecast',
  templateUrl: './daily-forecast.component.html',
  styleUrls: ['./daily-forecast.component.scss']
})
export class DailyForecastComponent implements OnInit, OnDestroy{

  @Input() dailyForecast: DailyForecast;
  isMetric = false;
  private destroy$ = new Subject<void>();

  constructor(private weatherService: WeatherService) {
  }

  ngOnInit() {
    this.weatherService.temperatureUnitChanged
      .pipe(takeUntil(this.destroy$))
      .subscribe(isMetric => this.isMetric = isMetric);
  }

  fahrenheitToCelsius(fahrenheit: any): number {
    return Math.round((Number(fahrenheit) - 32) * 5 / 9);
  }
  
  getIconUrl(iconId: Number) {
    return this.weatherService.getIconUrl(iconId);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
