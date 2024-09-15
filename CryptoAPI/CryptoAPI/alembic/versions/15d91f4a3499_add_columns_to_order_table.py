"""add columns to order_table

Revision ID: 15d91f4a3499
Revises: 0dc2d412a26b
Create Date: 2024-09-15 21:10:02.413371

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '15d91f4a3499'
down_revision: Union[str, None] = '0dc2d412a26b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('orders', sa.Column('pnl_value', sa.Float(), nullable=True))
    op.add_column('orders', sa.Column('pnl_percentage', sa.Float(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('orders', 'pnl_percentage')
    op.drop_column('orders', 'pnl_value')
    # ### end Alembic commands ###