# Sistema de Agendamento e Avaliação de Barbeiros

## Visão Geral

Este aplicativo gerencia agendamentos de barbeiros e avaliações de clientes. Ele suporta:

* **Agendamento de consultas** com disponibilidade de barbeiros e horários
* **Verificação de disponibilidade** para evitar reservas conflitantes
* **Avaliações de clientes** para agendamentos concluídos com notas de estrelas
* Validação robusta garantindo integridade de dados entre barbeiros, clientes e agendamentos

---

## Principais Funcionalidades

* Criar e gerenciar barbeiros, clientes, dias disponíveis e horários
* Agendar consultas respeitando tempos de buffer e disponibilidade dos barbeiros
* Permitir que clientes avaliem agendamentos (1 a 5 estrelas) após a conclusão
* Impedir avaliações duplicadas e garantir correspondência entre participantes do agendamento

---

## Destaques da Arquitetura

* **Entidades de domínio limpas** para Agendamento, Barbeiro, Avaliação, etc.
* **Casos de Uso** encapsulam a lógica de negócios (ex.: `RateAppointment`)
* **Repositórios** abstraem o armazenamento de dados (em memória ou persistente)
* **Serviços** gerenciam regras de negócios complexas, como verificações de disponibilidade
* Escrito em TypeScript com tipagem forte e validação
