import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {

  constructor() {}

  addFavorite(item: any) {
    const favorites = this.getFavorites();
    favorites.push(item);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  getFavorites() {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
  }

  removeFavorite(itemId: any) {
    let favorites = this.getFavorites();
    favorites = favorites.filter(item => item.id !== itemId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}
