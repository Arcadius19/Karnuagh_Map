import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { KmapComponent } from './playground/kmap/kmap.component';
import { FormComponent } from './playground/form/form.component';
import { ParserService } from './auxiliary/parser.service';
import { MathjaxDirective } from './auxiliary/mathjax-aux/mathjax.directive';
import { TypeFormComponent } from './playground/kmap/type-form/type-form.component';
import { GlobalVariablesService } from './auxiliary/global-variables.service';
import { AppRoutingModule } from './app-routing.module';
import { ExercisesComponent } from './quiz/exercises.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { PlaygroundComponent } from './playground/playground.component';
import { QuizExprToKmapComponent } from './quiz/expr-to-kmap/quiz-expr-to-kmap.component';
import { QuizIntroductionComponent } from './quiz/introduction/quiz-introduction.component';
import { InteractiveKmapComponent } from './interactive-kmap/interactive-kmap.component';
import { QuizFindBestGroupsComponent } from './quiz/find-best-groups/quiz-find-best-groups.component';
import { QuizNameGroupComponent } from './quiz/name-group/quiz-name-group.component';
import { QuizLabelSquaresComponent } from './quiz/label-squares/quiz-label-squares.component';
import { QuizKmapToExprComponent } from './quiz/kmap-to-expr/quiz-kmap-to-expr.component';
import { TutorialComponent } from './tutorial/tutorial.component';
import { UserProgressComponent } from './quiz/user-progress/user-progress.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PracticeComponent } from './practice/practice.component';
import { PracticeIntroductionComponent } from './practice/introduction/practice-introduction.component';
import { ExprToKmapComponent } from './exercises/exercise-types/expr-to-kmap/expr-to-kmap.component';
import { PracticeExprToKmapComponent } from './practice/expr-to-kmap/practice-expr-to-kmap.component';
import {ExNameGroupService} from './exercises/exercise-types/name-group/ex-name-group.service';
import {ExerciseService} from './exercises/exercise.service';
import {ExExprToKmapService} from './exercises/exercise-types/expr-to-kmap/ex-expr-to-kmap.service';
import {ExKmapToExprService} from './exercises/exercise-types/kmap-to-expr/ex-kmap-to-expr.service';
import {ExFindBestGroupsService} from './exercises/exercise-types/find-best-groups/ex-find-best-groups.service';
import {ExLabelSquaresService} from './quiz/label-squares/ex-label-squares.service';
import { KmapToExprComponent } from './exercises/exercise-types/kmap-to-expr/kmap-to-expr.component';
import { FindBestGroupsComponent } from './exercises/exercise-types/find-best-groups/find-best-groups.component';
import { NameGroupComponent } from './exercises/exercise-types/name-group/name-group.component';
import { PracticeFindBestGroupsComponent } from './practice/find-best-groups/practice-find-best-groups.component';
import { PracticeNameGroupComponent } from './practice/name-group/practice-name-group.component';
import { PracticeKmapToExprComponent } from './practice/kmap-to-expr/practice-kmap-to-expr.component';


@NgModule({
  entryComponents: [
    UserProgressComponent
  ],
  declarations: [
    AppComponent,
    KmapComponent,
    FormComponent,
    MathjaxDirective,
    TypeFormComponent,
    ExercisesComponent,
    PageNotFoundComponent,
    HomeComponent,
    PlaygroundComponent,
    QuizExprToKmapComponent,
    QuizIntroductionComponent,
    InteractiveKmapComponent,
    QuizFindBestGroupsComponent,
    QuizNameGroupComponent,
    QuizLabelSquaresComponent,
    QuizKmapToExprComponent,
    TutorialComponent,
    UserProgressComponent,
    PracticeComponent,
    PracticeIntroductionComponent,
    ExprToKmapComponent,
    PracticeExprToKmapComponent,
    KmapToExprComponent,
    FindBestGroupsComponent,
    NameGroupComponent,
    PracticeFindBestGroupsComponent,
    PracticeNameGroupComponent,
    PracticeKmapToExprComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ModalModule.forRoot()
  ],
  providers: [
    ParserService,
    GlobalVariablesService,
    BsModalService,
    ExerciseService,
    ExLabelSquaresService,
    ExExprToKmapService,
    ExFindBestGroupsService,
    ExNameGroupService,
    ExKmapToExprService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
