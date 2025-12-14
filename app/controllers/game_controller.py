from sqlalchemy.orm import Session
from app.infra.sqlalchemy.repositorios.bottle_repository import BottleRepository
import random
from datetime import date


class GameController:
    def __init__(self, db: Session):
        self.repo = BottleRepository(db)

    def distribute_daily_bottles(self):
        # 1. Busca todas as garrafas pendentes
        bottles = self.repo.get_pending_bottles()
        n = len(bottles)

        if n < 2:
            return {"message": "Garrafas insuficientes para troca (mínimo 2).", "count": n}

        # 2. A MÁGICA DA ALEATORIEDADE
        # Embaralhamos a lista de garrafas.
        # Isso garante que a ordem "quem manda pra quem" seja caótica e imprevisível a cada dia.
        random.shuffle(bottles)

        # 3. APLICAÇÃO DO CICLO (Garantia de entrega e não-recebimento próprio)
        # A garrafa na posição [i] vai para o autor da garrafa na posição [i+1]
        # O último da lista manda para o autor da primeira garrafa (Fechando o anel)

        for i in range(n):
            current_bottle = bottles[i]

            # Define o índice do destinatário no anel
            # Se for o último item da lista, (i+1) % n vira 0 (o primeiro da lista)
            next_index = (i + 1) % n
            target_bottle = bottles[next_index]

            # O destinatário da garrafa atual é o REMETENTE da próxima garrafa
            current_bottle.recipient_id = target_bottle.sender_id

            # Marca como distribuída
            current_bottle.is_distributed = True
            current_bottle.distribution_date = date.today()

        # 4. Persiste no MySQL
        self.repo.save_distribution(bottles)

        return {"message": "Distribuição realizada com sucesso!", "pairs_created": n}
