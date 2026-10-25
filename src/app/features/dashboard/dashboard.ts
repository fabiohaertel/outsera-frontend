import { Component } from '@angular/core';
import { ProducerIntervals } from './producer-intervals/producer-intervals';
import { TopStudios } from './top-studios/top-studios';
import { WinnersByYear } from './winners-by-year/winners-by-year';
import { YearsWithMultipleWinners } from './years-with-multiple-winners/years-with-multiple-winners';

@Component({
  selector: 'app-dashboard',
  imports: [ProducerIntervals, TopStudios, WinnersByYear, YearsWithMultipleWinners],
  templateUrl: './dashboard.html',
})
export class Dashboard {}
