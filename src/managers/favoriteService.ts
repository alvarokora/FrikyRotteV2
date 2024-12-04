import { Injectable } from '@angular/core';

export interface FavoriteItem {
  id: number; // Puedes cambiar `any` por un tipo específico (ej. `number | string`)
  type: string; // Ejemplo: 'anime', 'manga', etc.
  [key: string]: any; // Permite atributos adicionales
}

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly storageKey = 'favorites';

  constructor() {}

  addFavorite(item: FavoriteItem): void {
    const favorites = this.getFavorites();
    // Verificar si ya existe en favoritos
    if (!this.isFavorite(item.id)) {
      favorites.push(item);
      this.saveFavorites(favorites); // Guardar la lista actualizada
      console.log('Favorito añadido:', item);
    } else {
      console.log('Este elemento ya está en favoritos:', item);
    }
  }

  getFavorites(): FavoriteItem[] {
    const favorites = localStorage.getItem(this.storageKey);
    return favorites ? JSON.parse(favorites) : [];
  }

  removeFavorite(itemId: any): void {
    let favorites = this.getFavorites();
    favorites = favorites.filter(item => item.id !== itemId);
    this.saveFavorites(favorites);
  }

  isFavorite(itemId: any): boolean {
    const favorites = this.getFavorites();
    return favorites.some(item => item.id === itemId);
  }

  /**
   * Guarda la lista de favoritos en localStorage.
   * @param favorites Lista de elementos favoritos
   */
  private saveFavorites(favorites: FavoriteItem[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(favorites));
  }
}
