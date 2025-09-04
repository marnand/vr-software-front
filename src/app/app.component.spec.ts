import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NotificacaoComponent } from './notificacao/notificacao.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { NotificacaoService } from './services/notificacao.service';
import { of, Subject } from 'rxjs';

describe('AppComponent', () => {
  let mockWebSocketSubject: Subject<any>;

  beforeEach(async () => {
    mockWebSocketSubject = new Subject();
    
    const notificacaoServiceSpy = jasmine.createSpyObj('NotificacaoService', 
      ['enviarNotificacao', 'ouvirAtualizacoes', 'disconnect']
    );
    
    notificacaoServiceSpy.ouvirAtualizacoes.and.returnValue(mockWebSocketSubject.asObservable());

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        NotificacaoComponent,
        HttpClientTestingModule,
        FormsModule
      ],
      providers: [
        { provide: NotificacaoService, useValue: notificacaoServiceSpy }
      ]
    }).compileComponents();
  });

  afterEach(() => {
    if (mockWebSocketSubject && !mockWebSocketSubject.closed) {
      mockWebSocketSubject.complete();
    }
  });

  it('deve criar o app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`deve ter o título 'front-end'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('front-end');
  });

  it('deve renderizar o componente de notificação', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-notificacao')).toBeTruthy();
  });
});
