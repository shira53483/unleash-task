import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

import { WeatherService } from 'src/app/core/services/weather.service';
import { CurrentWeather } from 'src/app/shared/models/currentWeather.model';
import { LoaderService } from 'src/app/core/services/loader.service';
import { LocationService } from 'src/app/core/services/location.service';
import { Location } from 'src/app/shared/models/location.model';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.scss'],
})
export class CurrentWeatherComponent implements OnChanges, OnDestroy {

  @Input() selectedLocationKey: string;
  currentConditions: CurrentWeather = null;
  selectedLocationDetails: Location;
  error: string | null = null;
  isMetric = false;
  private destroy$ = new Subject<void>();

  constructor(
    private weatherService: WeatherService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private locationService: LocationService
  ) {}

  ngOnInit() {
    this.weatherService.temperatureUnitChanged
      .pipe(takeUntil(this.destroy$))
      .subscribe((isMetric) => {
        this.isMetric = isMetric;
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedLocationKey && this.selectedLocationKey) {
      this.loadLocationDetails();
      this.loadCurrentWeather();
    }
  }

  private loadLocationDetails() {
    this.loaderService.addRequest();
    this.locationService
      .getLocationByKey(this.selectedLocationKey)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (details) => {
          this.selectedLocationDetails = details;
          this.error = null;
        },
        error: (err) => this.handleError('Error loading city details', err),
      });
  }

  private loadCurrentWeather() {
    this.weatherService
      .getCurrentWeather(this.selectedLocationKey)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (conditions) => {
          this.currentConditions = conditions[0];
          this.error = null;
          this.loaderService.removeRequest();
        },
        error: (err) =>
          this.handleError('Error loading current conditions', err),
      });
  }

  private handleError(message: string, err: any) {
    this.error = message;
    this.toastr.error(message, 'Error');
    this.loaderService.removeRequest();
  }

  getIconUrl(iconId: Number) {
    return this.weatherService.getIconUrl(iconId);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
