from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo


def get_db_cycle_range():
    """
    Retorna o intervalo de tempo (start, end) em UTC (para o banco de dados)
    que corresponde ao "Dia de Jogo" atual do Brasil (Ciclo das 22h às 22h).
    """

    br_tz = ZoneInfo("America/Sao_Paulo")
    now_br = datetime.now(br_tz)

    if now_br.hour < 22:
        cycle_end_br = now_br.replace(
            hour=22, minute=0, second=0, microsecond=0)
        cycle_start_br = cycle_end_br - timedelta(days=1)
    else:
        cycle_start_br = now_br.replace(
            hour=22, minute=0, second=0, microsecond=0)
        cycle_end_br = cycle_start_br + timedelta(days=1)

    start_utc = cycle_start_br.astimezone(timezone.utc).replace(tzinfo=None)
    end_utc = cycle_end_br.astimezone(timezone.utc).replace(tzinfo=None)

    return start_utc, end_utc
