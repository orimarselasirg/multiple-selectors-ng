import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, combineLatest, map, of, tap } from 'rxjs';
import { Country, Region, SmallCountry } from '../interfaces/country.interface';

@Injectable({providedIn: 'root'})
export class CountryService {

  private baseUrl: string = 'https://restcountries.com/v3.1'

  private _region: Region[] = [Region.Africa, Region.Americas, Region.Asia, Region.Europe, Region.Oceania]

  constructor(private http: HttpClient) { }

  get regions():Region[] {
    return [...this._region]
  }

  getCountriesByRegion(region: Region): Observable<SmallCountry[]>{
    if(!region) return of([])

      const url: string = `${this.baseUrl}/region/${region}?fields=cca3,name,borders`
      return this.http.get<Country[]>(url)
      .pipe(
        map( countries => countries.map(country => ({
          name: country.name.common,
          cca3: country.cca3,
          borders: country.borders ?? []
        })))
      )
  }

  getCountryByalphaCode(alphaCode: string): Observable<SmallCountry> {
    // if(!alphaCode) return of([])
    const url: string = `${this.baseUrl}/alpha/${alphaCode}?fields=cca3,name,borders`
    return this.http.get<Country>(url)
    .pipe(
      map( country => ({
        name: country.name.common,
        cca3: country.cca3,
        borders: country.borders ?? []
      }))
    )
  }

  getCountryBorderByCode (borders: string[]): Observable<SmallCountry[]>{
    if(!borders || borders.length === 0) return of([])

      const countriesRequest: Observable<SmallCountry>[] = []
      borders.forEach(border => {
        const req = this.getCountryByalphaCode(border)
        countriesRequest.push(req)
      })

      return combineLatest(countriesRequest)


  }

}
