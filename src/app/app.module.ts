import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LanguageTranslationModule } from './shared/modules/language-translation/language-translation.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './shared';

// Angular fire
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { environment } from '../environments/environment';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule, // Firebase authentication
        AngularFirestoreModule, // Firebase firestore
        AngularFireStorageModule, // Firebase storage
        AngularFireFunctionsModule, // Firebase functions
        LanguageTranslationModule,
        AppRoutingModule
    ],
    declarations: [AppComponent],
    providers: [AuthGuard],
    bootstrap: [AppComponent]
})
export class AppModule {}
