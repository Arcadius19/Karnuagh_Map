import {GridGroup} from './grid-group';
import {MathJax} from './mathjax-aux/math-jax';
import {KarnaughMap} from './karnaugh-map';

export class ExpressionGroup {
  aVar: boolean;
  bVar: boolean;
  cVar: boolean;
  dVar: boolean;

  constructor(aVar: boolean, bVar: boolean, cVar: boolean, dVar: boolean) {
    this.aVar = aVar;
    this.bVar = bVar;
    this.cVar = cVar;
    this.dVar = dVar;
  }

  static findMinimal(expressions: ExpressionGroup[]): ExpressionGroup[] {
    let index = 0;
    indexLoop:
      while (index < expressions.length) {
        for (let i = 0; i < expressions.length; i++) {
          for (let j = i + 1; j < expressions.length; j++) {
            if (index != i && index != j) {
              if (expressions[index].equals(expressions[i].resolute(expressions[j]))) {
                expressions.splice(index, 1);
                continue indexLoop;
              }
            }
          }
        }
        index++;
      }

    return expressions;
  }

  static resoluteAux(var1: boolean, var2: boolean): boolean {
    if (var1 == null) {
      return var2;
    }
    if (var2 == null) {
      return var1;
    }
    // none of the variables is null
    if (var1 == var2) {
      return var1;
    } else {
      return null;
    }
  }

  // Compare arrays of ExpressionGroups
  static compareArrays(groups1: ExpressionGroup[], groups2: ExpressionGroup[]): boolean {
    if (groups1.length != groups2.length) { return false; }

    let found = 0;
    for (let group1 of groups1) {
      for (let group2 of groups2) {
        if (group1.equals(group2)) {
          found++;
          break;
        }
      }
    }

    return (found == groups1.length);
  }

  // TO-TEXT METHODS ======================

  static toMathJaxAux(variable: boolean, char: string, connector: string, notNegate = true): string {
    let resultString = '';
    if (variable == notNegate) {
      resultString = connector + char;
    } else if (variable == !notNegate) {
      resultString = connector + 'not ' + char;
    }

    return resultString;
  }

  static toComplexExpressionMathJax(groups: ExpressionGroup[], dnfType = true): string {
    if (groups == null || groups.length == 0) {
      return '';
    }

    if (groups.length == 1) {
      return (groups[0]).toMathJax(dnfType);
    }

    let connector = dnfType ? ' or ' : ' and ';

    let openBracket = (groups[0].isSingleValue()) ? '' : '(';
    let closeBracket = (groups[0].isSingleValue()) ? '' : ')';
    let result = openBracket + groups[0].prepareForMathJax(dnfType) + closeBracket;

    for (let i = 1; i < groups.length; i++) {
      openBracket = (groups[i].isSingleValue()) ? '' : '(';
      closeBracket = (groups[i].isSingleValue()) ? '' : ')';
      result = result + connector + openBracket + groups[i].prepareForMathJax(dnfType) + closeBracket;
    }

    return MathJax.toMathJax(result);
  }

  toString(): string {
    return ('A: ' + this.aVar + ', B: ' + this.bVar + ', C: ' + this.cVar + ', D: ' + this.dVar);
  }

  prepareForMathJax(product = true): string {
    let connector = product ? ' and ' : ' or ';
    let resultString =
      ExpressionGroup.toMathJaxAux(this.aVar, 'A', connector) +
      ExpressionGroup.toMathJaxAux(this.bVar, 'B', connector) +
      ExpressionGroup.toMathJaxAux(this.cVar, 'C', connector) +
      ExpressionGroup.toMathJaxAux(this.dVar, 'D', connector);

    if (resultString == '') {
      resultString = '1';
    } else {
      resultString = resultString.slice(connector.length);
    }

    return resultString;
  }

  toMathJax(product = true): string {
        return MathJax.toMathJax(this.prepareForMathJax());
  }

  // COMPARING METHODS ======================

  equals(expression: ExpressionGroup): boolean {
    if (this.aVar != expression.aVar) { return false; }
    if (this.bVar != expression.bVar) { return false; }
    if (this.cVar != expression.cVar) { return false; }
    if (this.dVar != expression.dVar) { return false; }

    return true;
  }

  containedIn(expression: ExpressionGroup): boolean {
    if (expression.aVar != null && this.aVar != expression.aVar) { return false; }
    if (expression.bVar != null && this.bVar != expression.bVar) { return false; }
    if (expression.cVar != null && this.cVar != expression.cVar) { return false; }
    if (expression.dVar != null && this.dVar != expression.dVar) { return false; }

    return true;
  }

  compareVariables(expression: ExpressionGroup): ExpressionGroup {
    let aVar = this.aVar == expression.aVar;
    let bVar = this.bVar == expression.bVar;
    let cVar = this.cVar == expression.cVar;
    let dVar = this.dVar == expression.dVar;

    return new ExpressionGroup(aVar, bVar, cVar, dVar);
  }

  // compareForScanning values of variables, if changes set ot null - does not matter when scanning squares
  compareForScanning(expression: ExpressionGroup): ExpressionGroup {
    let aVar = (this.aVar == expression.aVar) ? this.aVar : null;
    let bVar = (this.bVar == expression.bVar) ? this.bVar : null;
    let cVar = (this.cVar == expression.cVar) ? this.cVar : null;
    let dVar = (this.dVar == expression.dVar) ? this.dVar : null;

    return new ExpressionGroup(aVar, bVar, cVar, dVar);
  }

  resolute(expression: ExpressionGroup): ExpressionGroup {
    let result = new ExpressionGroup(null, null, null, null);

    result.aVar = ExpressionGroup.resoluteAux(this.aVar, expression.aVar);
    result.bVar = ExpressionGroup.resoluteAux(this.bVar, expression.bVar);
    result.cVar = ExpressionGroup.resoluteAux(this.cVar, expression.cVar);
    result.dVar = ExpressionGroup.resoluteAux(this.dVar, expression.dVar);

    return result;
  }

  isSingleValue(): boolean {
    let notNulls = 0;
    if (this.aVar != null) { notNulls++; }
    if (this.bVar != null) { notNulls++; }
    if (this.cVar != null) { notNulls++; }
    if (this.dVar != null) { notNulls++; }

    return notNulls == 1;
  }

  // CONVERTING METHODS ======================

  toGridGroup(nVars = 4): GridGroup {
    if (nVars != 3 && nVars != 4) { return null; }

    let kmap = new KarnaughMap(nVars);

    let nRow = kmap.cellIds.length;
    let nCol = kmap.cellIds[0].length;

    let candidate: GridGroup;

    // Check 16x
    if (nRow == 4) {
      candidate = new GridGroup(0, 0, 4, 4);
      if (this.equals(candidate.toExpressionGroup(nVars))) { return candidate; }
    }

    // Check 8x
    if (nRow == 2) {
      candidate = new GridGroup(0, 0, 2, 4);
      if (this.equals(candidate.toExpressionGroup(nVars))) { return candidate; }
    } else {
      for (let i = 0; i < nRow; i++) {
        candidate = new GridGroup(i, 0, 2, 4);
        if (this.equals(candidate.toExpressionGroup(nVars))) { return candidate; }
      }
      for (let j = 0; j < nCol; j++) {
        candidate = new GridGroup(0, j, 4, 2);
        if (this.equals(candidate.toExpressionGroup(nVars))) { return candidate; }
      }
    }

    // Check 4x
    for (let i = 0; i < nRow; i++) {
      candidate = new GridGroup(i, 0, 1, 4);
      if (this.equals(candidate.toExpressionGroup(nVars))) { return candidate; }
    }
    if (nRow == 2) {
      for (let j = 0; j < nCol; j++) {
        candidate = new GridGroup(0, j, 2, 2);
        if (this.equals(candidate.toExpressionGroup(nVars))) { return candidate; }
      }
    } else {
      for (let j = 0; j < nCol; j++) {
        candidate = new GridGroup(0, j, 4, 1);
        if (this.equals(candidate.toExpressionGroup(nVars))) { return candidate; }
      }
      for (let i = 0; i < nRow; i++) {
        for (let j = 0; j < nCol; j++) {
          candidate = new GridGroup(i, j, 2, 2);
          if (this.equals(candidate.toExpressionGroup(nVars))) { return candidate; }
        }
      }
    }

    // Check 2x
    if (nRow == 2) {
      for (let j = 0; j < nCol; j++) {
        candidate = new GridGroup(0, j, 2, 1);
        if (this.equals(candidate.toExpressionGroup(nVars))) { return candidate; }

        for (let i = 0; i < nRow; i++) {
          candidate = new GridGroup(i, j, 1, 2);
          if (this.equals(candidate.toExpressionGroup(nVars))) { return candidate; }
        }
      }
    } else {
      for (let i = 0; i < nRow; i++) {
        for (let j = 0; j < nCol; j++) {
          candidate = new GridGroup(i, j, 1, 2);
          if (this.equals(candidate.toExpressionGroup(nVars))) { return candidate; }

          candidate = new GridGroup(i, j, 2, 1);
          if (this.equals(candidate.toExpressionGroup(nVars))) { return candidate; }
        }
      }
    }

    // Check 1x
    for (let i = 0; i < nRow; i++) {
      for (let j = 0; j < nCol; j++) {
        candidate = new GridGroup(1, 1, 1, 1);
        if (this.equals(candidate.toExpressionGroup(nVars))) { return candidate; }
      }
    }

  }

}
