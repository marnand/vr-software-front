import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

export interface Notificacao {
  mensagemId: string;
  conteudoMensagem: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class NotificacaoService {
  private apiUrl = 'http://localhost:3000/api/notificar';
  private socket: Socket;

  constructor(private http: HttpClient, private ngZone: NgZone) {
    this.socket = io('http://localhost:3000', {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });
    
    this.socket.on('connect', () => {
      console.log('WebSocket conectado');
    });
    
    this.socket.on('disconnect', () => {
      console.log('WebSocket desconectado');
    });
    
    this.socket.on('connect_error', (error) => {
      console.error('Erro de conexão WebSocket:', error);
    });
  }

  enviarNotificacao(payload: { mensagemId: string; conteudoMensagem: string }) {
    return this.http.post<{ mensagemId: string }>(this.apiUrl, payload, {
      observe: 'response',
    });
  }

  ouvirAtualizacoes(): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on('statusAtualizado', (data) => {
        this.ngZone.run(() => {
          console.log('Status atualizado recebido:', data);
          subscriber.next(data);
        });
      });
      
      return () => {
        this.socket.off('statusAtualizado');
      };
    });
  }
  
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
