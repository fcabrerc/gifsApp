import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interface/gifs.iterface';

@Injectable({
  /*p81: Hace que sea global */
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = 'au9RGrkUg5YBgsPIlLM1EWDuI6ZZqPbI';
  private servidorUrl: string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];

  public resultados: Gif[]  = [];

  get historial() {
    return [...this._historial];
  }

  //p84, Petición http.
  constructor (private http : HttpClient) {
    //p87
    // if (localStorage.getItem('historial')) {
    //   this._historial = JSON.parse( localStorage.getItem('historial')! );
    // }
    //p87. Lo anterior se puede resumir en una línea
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];

    this.resultados = JSON.parse(localStorage.getItem('resultados')! ) || [];
  }

  
  buscarGifs (query: string = '') {

    query = query.trim().toLocaleLowerCase();
    
    //p82. No repetidos
    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      //p82. Recoge los 10 primeros del array
      this._historial = this._historial.splice(0,10);
      //p87. Guardamos en le local storage del navegador
      localStorage.setItem('historial', JSON.stringify( this._historial));
    }

    //p84, Petición http. Lo hacemos de otra forma con http
    /*fetch('https://api.giphy.com/v1/gifs/search?api_key=au9RGrkUg5YBgsPIlLM1EWDuI6ZZqPbI&q=cheeseburgers&lang=es&limit=10')
      .then(resp => {
        resp.json().then( data => {
          console.log(data);
        })
      })*/ 

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit','10')
      .set('q',query);

    //p84, Petición http 2. http ofrece mucho más que fetch de js.
    //p86, Añadimos el tipado a la petición http. No se pone el resp, sinó en el get
    this.http.get<SearchGifsResponse>(`${this.servidorUrl}/search`, {params})
      .subscribe( (resp) => {
        console.log(resp.data);
        this.resultados = resp.data;
        localStorage.setItem('resultados', JSON.stringify( this.resultados));
      })


    console.log(this._historial);
  }


}
