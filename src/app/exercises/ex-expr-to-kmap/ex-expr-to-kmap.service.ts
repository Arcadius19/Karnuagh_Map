import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

export class ExExprToKmap {
  id: number;
  expression: string;
  points: number;

  constructor(id: number, expression: string, points: number) {
    this.id = id;
    this.expression = expression;
    this.points = points;
  }
}

let EXERCISES = [
  new ExExprToKmap(1, 'A', 1),
  new ExExprToKmap(2, 'A or B', 2),
  new ExExprToKmap(3, 'A and C', 2)
];

@Injectable()
export class ExExprToKmapService {

  constructor() { }

  getExercises() {
    return Observable.of(EXERCISES);
  }

  getExercise(id: number | string) {
    return this.getExercises().map(exercises => exercises.find(exercise => exercise.id == +id));
  }
}
