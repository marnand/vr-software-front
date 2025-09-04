import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { of, Subject, throwError } from 'rxjs';
import { NotificacaoComponent } from './notificacao.component';
import { NotificacaoService } from '../services/notificacao.service';
import { HttpResponse } from '@angular/common/http';

describe('NotificacaoComponent', () => {
  let component: NotificacaoComponent;
  let fixture: ComponentFixture<NotificacaoComponent>;
  let notificacaoService: jasmine.SpyObj<NotificacaoService>;
  let mockWebSocketSubject: Subject<any>;

  beforeEach(async () => {
    mockWebSocketSubject = new Subject();
    
    const notificacaoServiceSpy = jasmine.createSpyObj('NotificacaoService', 
      ['enviarNotificacao', 'ouvirAtualizacoes', 'disconnect']
    );
    
    notificacaoServiceSpy.ouvirAtualizacoes.and.returnValue(mockWebSocketSubject.asObservable());

    await TestBed.configureTestingModule({
      imports: [
        NotificacaoComponent,
        HttpClientTestingModule,
        FormsModule
      ],
      providers: [
        { provide: NotificacaoService, useValue: notificacaoServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificacaoComponent);
    component = fixture.componentInstance;
    notificacaoService = TestBed.inject(NotificacaoService) as jasmine.SpyObj<NotificacaoService>;
  });

  afterEach(() => {
    if (mockWebSocketSubject && !mockWebSocketSubject.closed) {
      mockWebSocketSubject.complete();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Geração do mensagemId', () => {
    it('deve gerar um mensagemId único usando uuid v4', () => {
      // Arrange
      component.conteudoMensagem = 'Teste de mensagem';
      const mockResponse = new HttpResponse({
        status: 200,
        body: { mensagemId: 'test-uuid-123' }
      });
      notificacaoService.enviarNotificacao.and.returnValue(of(mockResponse));

      // Act
      component.enviar();

      // Assert
      expect(component.notificacoes[0].mensagemId).toBeDefined();
      expect(component.notificacoes[0].mensagemId.length).toBeGreaterThan(0);
      expect(notificacaoService.enviarNotificacao).toHaveBeenCalledWith(jasmine.objectContaining({
        conteudoMensagem: 'Teste de mensagem'
      }));
    });
  });

  describe('Envio da requisição POST', () => {
    it('deve enviar requisição POST com dados corretos', () => {
      // Arrange
      component.conteudoMensagem = 'Mensagem de teste';
      const mockResponse = new HttpResponse({
        status: 200,
        body: { mensagemId: 'test-uuid-123' }
      });
      notificacaoService.enviarNotificacao.and.returnValue(of(mockResponse));

      // Act
      component.enviar();

      // Assert
      expect(notificacaoService.enviarNotificacao).toHaveBeenCalledTimes(1);
      expect(notificacaoService.enviarNotificacao).toHaveBeenCalledWith(jasmine.objectContaining({
        conteudoMensagem: 'Mensagem de teste'
      }));
    });

    it('deve limpar o campo de mensagem após envio bem-sucedido', () => {
      // Arrange
      component.conteudoMensagem = 'Mensagem de teste';
      const mockResponse = new HttpResponse({
        status: 200,
        body: { mensagemId: 'test-uuid-123' }
      });
      notificacaoService.enviarNotificacao.and.returnValue(of(mockResponse));

      // Act
      component.enviar();

      // Assert
      expect(component.conteudoMensagem).toBe('');
    });

    it('deve atualizar status para ERRO ENVIO em caso de falha na requisição', () => {
      // Arrange
      component.conteudoMensagem = 'Mensagem de teste';
      const errorResponse = new Error('Erro de rede');
      notificacaoService.enviarNotificacao.and.returnValue(throwError(() => errorResponse));

      // Act
      component.enviar();

      // Assert
      expect(component.notificacoes[0].status).toBe('ERRO ENVIO');
    });
  });

  describe('Adição inicial da notificação', () => {
    it('deve adicionar notificação à lista com status AGUARDANDO PROCESSAMENTO', () => {
      // Arrange
      component.conteudoMensagem = 'Nova mensagem';
      const mockResponse = new HttpResponse({
        status: 200,
        body: { mensagemId: 'test-uuid-123' }
      });
      notificacaoService.enviarNotificacao.and.returnValue(of(mockResponse));
      const initialLength = component.notificacoes.length;

      // Act
      component.enviar();

      // Assert
      expect(component.notificacoes.length).toBe(initialLength + 1);
      expect(component.notificacoes[0]).toEqual(jasmine.objectContaining({
        conteudoMensagem: 'Nova mensagem',
        status: 'AGUARDANDO PROCESSAMENTO'
      }));
    });

    it('não deve enviar se conteúdo da mensagem estiver vazio', () => {
      // Arrange
      component.conteudoMensagem = '';
      const initialLength = component.notificacoes.length;

      // Act
      component.enviar();

      // Assert
      expect(component.notificacoes.length).toBe(initialLength);
      expect(notificacaoService.enviarNotificacao).not.toHaveBeenCalled();
    });

    it('não deve enviar se conteúdo da mensagem contiver apenas espaços', () => {
      // Arrange
      component.conteudoMensagem = '   ';
      const initialLength = component.notificacoes.length;

      // Act
      component.enviar();

      // Assert
      expect(component.notificacoes.length).toBe(initialLength);
      expect(notificacaoService.enviarNotificacao).not.toHaveBeenCalled();
    });
  });

  describe('Atualização de status via WebSocket', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('deve atualizar status da notificação quando receber dados do WebSocket', () => {
      // Arrange
      const notificacao = {
        mensagemId: 'test-id-123',
        conteudoMensagem: 'Teste WebSocket',
        status: 'AGUARDANDO PROCESSAMENTO'
      };
      component.notificacoes.push(notificacao);

      const webSocketData = {
        mensagemId: 'test-id-123',
        status: 'PROCESSADO'
      };

      // Act
      mockWebSocketSubject.next(webSocketData);

      // Assert
      expect(component.notificacoes[0].status).toBe('PROCESSADO');
    });

    it('deve fazer unsubscribe ao destruir o componente', () => {
      // Arrange
      spyOn(component['subscription'], 'unsubscribe');

      // Act
      component.ngOnDestroy();

      // Assert
      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });

  describe('Integração completa', () => {
    it('deve executar fluxo completo: envio -> status inicial -> atualização via WebSocket', () => {
      // Arrange
      component.ngOnInit();
      component.conteudoMensagem = 'Teste integração';
      const mockResponse = new HttpResponse({
        status: 200,
        body: { mensagemId: 'integration-test-id' }
      });
      notificacaoService.enviarNotificacao.and.returnValue(of(mockResponse));

      // Act 1: Enviar notificação
      component.enviar();

      // Assert 1: Verificar estado inicial
      expect(component.notificacoes.length).toBe(1);
      expect(component.notificacoes[0].status).toBe('AGUARDANDO PROCESSAMENTO');

      const generatedId = component.notificacoes[0].mensagemId;

      // Act 2: Simular atualização via WebSocket
      mockWebSocketSubject.next({
        mensagemId: generatedId,
        status: 'PROCESSADO'
      });

      // Assert 2: Verificar atualização
      expect(component.notificacoes[0].status).toBe('PROCESSADO');
    });
  });
});