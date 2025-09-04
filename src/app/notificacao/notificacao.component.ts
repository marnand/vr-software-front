import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';
import { Subscription } from 'rxjs';
import { NotificacaoService, Notificacao } from '../services/notificacao.service';

@Component({
  selector: 'app-notificacao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notificacao.component.html',
  styleUrls: ['./notificacao.component.css'],
})
export class NotificacaoComponent implements OnInit, OnDestroy {
  conteudoMensagem: string = '';
  notificacoes: Notificacao[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    private notificacaoService: NotificacaoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const statusSubscription = this.notificacaoService.ouvirAtualizacoes().subscribe({
      next: (data) => {
        console.log('Dados recebidos do WebSocket:', data);
        const notificacao = this.notificacoes.find((n) => n.mensagemId === data.mensagemId);
        if (notificacao) {
          notificacao.status = data.status;
          this.cdr.detectChanges(); // Força a detecção de mudanças
          console.log('Status atualizado para:', data.status);
        } else {
          console.warn('Notificação não encontrada para ID:', data.mensagemId);
        }
      },
      error: (error) => {
        console.error('Erro ao ouvir atualizações:', error);
      }
    });
    
    this.subscription.add(statusSubscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  enviar(): void {
    if (!this.conteudoMensagem.trim()) return;

    const mensagemId = uuidv4();
    const novaNotificacao: Notificacao = {
      mensagemId,
      conteudoMensagem: this.conteudoMensagem,
      status: 'AGUARDANDO PROCESSAMENTO',
    };

    this.notificacoes.push(novaNotificacao);
    console.log('Nova notificação criada:', novaNotificacao);

    this.notificacaoService
      .enviarNotificacao({ mensagemId, conteudoMensagem: this.conteudoMensagem })
      .subscribe({
        next: (res) => {
          console.log('Notificação enviada com sucesso:', res.body);
        },
        error: (err) => {
          console.error('Erro ao enviar notificação:', err);
          novaNotificacao.status = 'ERRO ENVIO';
          this.cdr.detectChanges();
        },
      });

    this.conteudoMensagem = '';
  }
}
