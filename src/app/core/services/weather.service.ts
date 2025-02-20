import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

import { CurrentWeather } from 'src/app/shared/models/currentWeather.model';
import { Forecast } from 'src/app/shared/models/forecast.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {

  isMetric = false;
  private temperatureUnitChangedSubject = new BehaviorSubject<boolean>(
    this.isMetric
  );
  temperatureUnitChanged = this.temperatureUnitChangedSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

  setTemperatureUnit() {
    this.temperatureUnitChangedSubject.next(this.isMetric);
  }

  getForecast(locationKey: string): Observable<Forecast> {
    // const forecast: Forecast = {
    //   "Headline": {
    //     "EffectiveDate": "2025-02-20T07:00:00+02:00",
    //     "EffectiveEpochDate": 1740027600,
    //     "Severity": 5,
    //     "Text": "Expect showers Thursday morning",
    //     "Category": "rain",
    //     "EndDate": "2025-02-20T13:00:00+02:00",
    //     "EndEpochDate": 1740049200,
    //     "MobileLink": "http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?lang=en-us",
    //     "Link": "http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?lang=en-us"
    //   },
    //   "DailyForecasts": [
    //     {
    //       "Date": "2025-02-19T07:00:00+02:00",
    //       "EpochDate": 1739941200,
    //       "Temperature": {
    //         "Minimum": {
    //           "Value": 12,
    //           "Unit": "C",
    //           "UnitType": 18
    //         },
    //         "Maximum": {
    //           "Value": 18,
    //           "Unit": "C",
    //           "UnitType": 18
    //         }
    //       },
    //       "Day": {
    //         "Icon": 12,
    //         "IconPhrase": "Rain",
    //         "HasPrecipitation": true
    //       },
    //       "Night": {
    //         "Icon": 35,
    //         "IconPhrase": "Mostly cloudy",
    //         "HasPrecipitation": false
    //       },
    //       "Sources": ["AccuWeather"],
    //       "MobileLink": "http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?lang=en-us",
    //       "Link": "http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?lang=en-us"
    //     },
    //     {
    //       "Date": "2025-02-20T07:00:00+02:00",
    //       "EpochDate": 1740027600,
    //       "Temperature": {
    //         "Minimum": {
    //           "Value": 13,
    //           "Unit": "C",
    //           "UnitType": 18
    //         },
    //         "Maximum": {
    //           "Value": 19,
    //           "Unit": "C",
    //           "UnitType": 18
    //         }
    //       },
    //       "Day": {
    //         "Icon": 2,
    //         "IconPhrase": "Partly cloudy",
    //         "HasPrecipitation": false
    //       },
    //       "Night": {
    //         "Icon": 30,
    //         "IconPhrase": "Clear",
    //         "HasPrecipitation": false
    //       },
    //       "Sources": ["AccuWeather"],
    //       "MobileLink": "http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?lang=en-us",
    //       "Link": "http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?lang=en-us"
    //     },
    //     {
    //       "Date": "2025-02-21T07:00:00+02:00",
    //       "EpochDate": 1740114000,
    //       "Temperature": {
    //         "Minimum": {
    //           "Value": 14,
    //           "Unit": "C",
    //           "UnitType": 18
    //         },
    //         "Maximum": {
    //           "Value": 20,
    //           "Unit": "C",
    //           "UnitType": 18
    //         }
    //       },
    //       "Day": {
    //         "Icon": 15,
    //         "IconPhrase": "Cloudy",
    //         "HasPrecipitation": false
    //       },
    //       "Night": {
    //         "Icon": 45,
    //         "IconPhrase": "Mostly cloudy",
    //         "HasPrecipitation": false
    //       },
    //       "Sources": ["AccuWeather"],
    //       "MobileLink": "http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?lang=en-us",
    //       "Link": "http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?lang=en-us"
    //     },
    //     {
    //       "Date": "2025-02-22T07:00:00+02:00",
    //       "EpochDate": 1740200400,
    //       "Temperature": {
    //         "Minimum": {
    //           "Value": 15,
    //           "Unit": "C",
    //           "UnitType": 18
    //         },
    //         "Maximum": {
    //           "Value": 21,
    //           "Unit": "C",
    //           "UnitType": 18
    //         }
    //       },
    //       "Day": {
    //         "Icon": 18,
    //         "IconPhrase": "Light snow",
    //         "HasPrecipitation": true
    //       },
    //       "Night": {
    //         "Icon": 34,
    //         "IconPhrase": "Partly cloudy",
    //         "HasPrecipitation": false
    //       },
    //       "Sources": ["AccuWeather"],
    //       "MobileLink": "http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?lang=en-us",
    //       "Link": "http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?lang=en-us"
    //     },
    //     {
    //       "Date": "2025-02-23T07:00:00+02:00",
    //       "EpochDate": 1740286800,
    //       "Temperature": {
    //         "Minimum": {
    //           "Value": 16,
    //           "Unit": "C",
    //           "UnitType": 18
    //         },
    //         "Maximum": {
    //           "Value": 22,
    //           "Unit": "C",
    //           "UnitType": 18
    //         }
    //       },
    //       "Day": {
    //         "Icon": 19,
    //         "IconPhrase": "Snow",
    //         "HasPrecipitation": true
    //       },
    //       "Night": {
    //         "Icon": 40,
    //         "IconPhrase": "Cloudy",
    //         "HasPrecipitation": false
    //       },
    //       "Sources": ["AccuWeather"],
    //       "MobileLink": "http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?lang=en-us",
    //       "Link": "http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?lang=en-us"
    //     }
    //   ]
    // }
    
    //return of(forecast);
    const isMetric = this.isMetric ? 'true' : 'false';

    let params: HttpParams = new HttpParams();
    params = params.append('apikey', environment.apiKey);
    params = params.append('metric', isMetric);

    return this.httpClient.get<Forecast>(
      `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}`,
      { params }
    );
  }

  getCurrentWeather(locationKey: string): Observable<CurrentWeather[]> {
    // const mockCurrentWeather = [
    //   {
    //     "LocalObservationDateTime": "2025-02-20T00:57:00+02:00",
    //     "EpochTime": 1740005820,
    //     "WeatherText": "Some clouds",
    //     "WeatherIcon": 36,
    //     "HasPrecipitation": false,
    //     "IsDayTime": false,
    //     "Temperature": {
    //       "Metric": {
    //         "Value": 18,
    //         "Unit": "C",
    //         "UnitType": 17
    //       },
    //       "Imperial": {
    //         "Value": 64,
    //         "Unit": "F",
    //         "UnitType": 18
    //       }
    //     },
    //     "MobileLink": "http://www.accuweather.com/en/il/tel-aviv/215854/current-weather/215854?lang=en-us",
    //     "Link": "http://www.accuweather.com/en/il/tel-aviv/215854/current-weather/215854?lang=en-us"
    //   }
    // ];
    // return of(mockCurrentWeather);

    let params: HttpParams = new HttpParams();
    params = params.append('apikey', environment.apiKey);

    return this.httpClient.get<CurrentWeather[]>(`http://dataservice.accuweather.com/currentconditions/v1/${locationKey}`, { params });
  }

  getIconUrl(iconId: Number): string {
    return `https://developer.accuweather.com/sites/default/files/${iconId
      .toString()
      .padStart(2, '0')}-s.png`;
  }
}
