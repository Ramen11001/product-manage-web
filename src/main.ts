import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { HttpClientModule } from '@angular/common/http';
import { routes } from './app/app.routes';
bootstrapApplication(AppComponent, {
    providers: [HttpClientModule, provideRouter(routes)]
  });
