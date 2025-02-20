import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Location } from 'src/app/shared/models/location.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  constructor(private httpClient: HttpClient) { }

  getAutocompleteLocation(searchText: string): Observable<Location[]> {
    // const mockData: Location[] = [
    //   {
    //     Version: 1,
    //     Key: "123456",
    //     Type: "City",
    //     Rank: 10,
    //     LocalizedName: "Jerusalem",
    //     Country: {
    //       ID: "IL",
    //       LocalizedName: "Israel"
    //     },
    //     AdministrativeArea: {
    //       ID: "JM",
    //       LocalizedName: "Jerusalem"
    //     }
    //   },
    //   {
    //     Version: 1,
    //     Key: "654321",
    //     Type: "City",
    //     Rank: 20,
    //     LocalizedName: "Johannesburg",
    //     Country: {
    //       ID: "ZA",
    //       LocalizedName: "South Africa"
    //     },
    //     AdministrativeArea: {
    //       ID: "GT",
    //       LocalizedName: "Gauteng"
    //     }
    //   }
    // ];
    // return of(mockData);
    let params: HttpParams = new HttpParams();
    params = params.append('apikey', environment.apiKey);
    params = params.append('q', searchText);

    return this.httpClient.get<Location[]>('http://dataservice.accuweather.com/locations/v1/cities/autocomplete', { params });
  }

  getLocationByKey(locationKey: string): Observable<Location> {
   
    let params: HttpParams = new HttpParams();
    params = params.append('apikey', environment.apiKey);

    // const mockData: Location = {
    //   Version: 1,
    //   Key: locationKey, // שימוש ב-locationKey שהתקבל כפרמטר
    //   Type: "City",
    //   Rank: 10,
    //   LocalizedName: "Jerusalem",
    //   Country: {
    //     ID: "IL",
    //     LocalizedName: "Israel"
    //   },
    //   AdministrativeArea: {
    //     ID: "JM",
    //     LocalizedName: "Jerusalem"
    //   }
    // };
  
    // return of(mockData);
    return this.httpClient.get<Location>(`http://dataservice.accuweather.com/locations/v1/${locationKey}`, { params });
  }
}
