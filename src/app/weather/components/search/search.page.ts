import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { catchError, debounceTime, of, switchMap } from 'rxjs';

import { LocationService } from 'src/app/core/services/location.service';
import { FavoritesService } from 'src/app/core/services/favorites.service';
import { Location } from 'src/app/shared/models/location.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],

})
export class SearchPage implements OnInit {

  searchControl = new FormControl('Tel Aviv');
  @Output() searchCompleted = new EventEmitter<string>();

  locations: Location[] = [];
  favorites: Location[] = [];
  private currentQuery: string = '';

  constructor(private favoritesService: FavoritesService, private locationService: LocationService, private toastr: ToastrService) { }

  ngOnInit() {
    this.onCitySelected();
    this.loadFavorites();
    this.subscribeToSearch();
  }

  private subscribeToSearch() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        switchMap((query) => this.handleSearch(query))
      )
      .subscribe(
        (locations) => this.handleLocationResults(locations),
        (error) => this.handleSearchError(error)
      );
  }

  private handleSearch(query: string) {
    if (!this.isEnglishLettersOnly(query)) {
      this.toastr.error('Please enter English letters only', 'Error');
      this.searchControl.setValue(query.replace(/[^A-Za-z\s]/g, ''), { emitEvent: false });
      return of([]);
    }

    this.currentQuery = query;
    return this.locationService.getAutocompleteLocation(query).pipe(
      catchError(() => {
        this.toastr.error('Error loading data', 'Error');
        return of([]);
      })
    );
  }

  private handleLocationResults(locations: Location[]) {
    if (this.currentQuery === this.searchControl.value) {
      this.locations = locations;
      this.loadFavorites();
    }
  }

  private handleSearchError(error: any) {
    this.toastr.error('Error loading data', 'Error');
  }

  private isEnglishLettersOnly(input: string): boolean {
    return /^[A-Za-z\s]*$/.test(input);
  }

  private async loadFavorites() {
    try {
      this.favorites = await this.favoritesService.getFavorites();
    } catch (error) {
      console.error('Error loading favorites', error);
    }
  }
  
  onCitySelected(event?: any) {    
    let selectedLocationKey: string = '215854';
    const selectedLocation = this.locations.find(location => location.LocalizedName === event?.option?.value);
    if (selectedLocation) {
      selectedLocationKey = selectedLocation.Key;
    }
    this.searchCompleted.emit(selectedLocationKey);
  }

  isFavorite(locationKey: string): boolean {
    return this.favorites.some((fav) => fav.Key === locationKey);
  }

  async toggleFavorite(location: Location) {
    try {
      if (this.isFavorite(location.Key)) {
        await this.favoritesService.removeFromFavorites(location.Key);
      } else {
        await this.favoritesService.addToFavorites(location);
      }
      this.loadFavorites();
    } catch (error) {
      this.toastr.error('Failed to update favorites', 'Error');
    }
  }  
}