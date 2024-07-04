import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { Region, SmallCountry } from '../../interfaces/country.interface';
import { Observable, filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-pages',
  templateUrl: './selector-pages.component.html',
  styleUrl: './selector-pages.component.css'
})
export class SelectorPagesComponent implements OnInit{

  public countriesByRegion: SmallCountry[] = []
  public bordersByCountry: SmallCountry[] = []

  public myForm: FormGroup = this.fb.group({
    continents: ['', Validators.required],
    country: ['', Validators.required],
    borders: ['', Validators.required]
  })


  constructor(
    private fb: FormBuilder,
    private countryService: CountryService
  ){}

  ngOnInit(): void {
    this.onRegionChanged()
    this.onCountryChanged()
  }

  get regions(): Region[]{
    return this.countryService.regions
  }

  onRegionChanged(): void {
    this.myForm.get('continents')!.valueChanges
    .pipe(
      tap(() => this.myForm.get('country')!.setValue('')),
      tap(() => this.bordersByCountry = []),
      switchMap(region => this.countryService.getCountriesByRegion(region))
    )
    .subscribe( countries => {
      this.countriesByRegion = countries.sort((a,b) => a.name.localeCompare(b.name))
    })
  }

  onCountryChanged(): void {
    this.myForm.get('country')!.valueChanges
    .pipe(
      tap(() => this.myForm.get('borders')!.setValue('')),
      filter( (value:string) => value.length > 0),
      switchMap(alphaCode => this.countryService.getCountryByalphaCode(alphaCode)),
      switchMap(country => this.countryService.getCountryBorderByCode( country.borders))
    )
    .subscribe( countries => {
      this.bordersByCountry = countries
    })
  }

}
