import requests
from Database.models import Order
from good_guard import COINMARKETCAP_API_KEY, coin_to_usdt_rate

addresses = {
    'EQARK5MKz_MK51U5AZjK3hxhLg1SmQG2Z-4Pb7Zapi_xwmrN': 'ton',
    'EQA-X_yo3fzzbDbJ_0bzFWKqtRuZFIRa1sJsveZJ1YpViO3r': 'ton',
    '0xc7bbec68d12a0d1830360f8ec58fa599ba1b0e9b': 'ethereum',
    'EQAyOzOJYwzrXNdhQkskblthpYmm6iL_XeXEcaDuQmV0vxQQ': 'ton',
    '0x6aa9c4eda3bf8ac038ad5c243133d6d25aa9cc73': 'bsc',
    'DSUvc5qf5LJHHV5e2tD184ixotSnCnwj7i4jJa4Xsrmt': 'solana'
}


def get_current_rate(contract_address: str) -> float:
    network = addresses.get(contract_address)
    if network is None:
        print("Network not found")
        return ValueError("Network not found")

    url = f"https://pro-api.coinmarketcap.com/v4/dex/pairs/quotes/latest?network_slug={network}&contract_address={contract_address}"
    headers = {
        'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY
    }

    response = requests.get(url, headers=headers)
    data = response.json()

    if contract_address == '0xa43fe16908251ee70ef74718545e4fe6c5ccec9f' or 'DSUvc5qf5LJHHV5e2tD184ixotSnCnwj7i4jJa4Xsrmt':
        price_by_quote_asset = data['data'][0]['quote'][0]['price']
    else:
        price_by_quote_asset = data['data'][0]['quote'][0]['price_by_quote_asset']

    return price_by_quote_asset


def calculate_pnl(order: Order, exit_rate: float):
    """
    Расчет PnL для ордера.

    Args:
        order: Объект ордера.
        exit_rate: Цена выхода из сделки.

    Returns:
        PnL в USDT.
    """
    if order.direction == "long":
        pnl_in_usdt = (exit_rate - order.entry_rate) * order.amount * order.leverage
    else:  # short
        pnl_in_usdt = (order.entry_rate - exit_rate) * order.amount * order.leverage

    return pnl_in_usdt


# Функция для расчета P&L (%) в реальном времени
def calculate_pnl_percent(order: Order, current_rate: float):
    """
    Расчет P&L (%) в реальном времени для ордера.

    Args:
        order: Объект ордера.
        current_rate: Текущая цена актива.

    Returns:
        P&L в процентах.
    """
    if order.direction == "long":
        pnl_percent = ((current_rate - order.entry_rate) / order.entry_rate) * 100 * order.leverage
    else:
        pnl_percent = ((order.entry_rate - current_rate) / order.entry_rate) * 100 * order.leverage
    return pnl_percent


# Функция для расчета P&L в валюте сделки
def calculate_pnl_value(order: Order, current_rate: float):
    """
    Расчет P&L в валюте сделки для ордера.

    Args:
        order: Объект ордера.
        current_rate: Текущая цена актива.

    Returns:
        P&L в валюте сделки (USDT).
    """
    if order.direction == "long":
        pnl_in_usdt = (current_rate - order.entry_rate) * order.amount * order.leverage
    else:
        pnl_in_usdt = (order.entry_rate - current_rate) * order.amount * order.leverage
    return pnl_in_usdt