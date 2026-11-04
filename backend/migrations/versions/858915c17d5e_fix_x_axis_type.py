"""fix_x_axis_type

Revision ID: 858915c17d5e
Revises: ea2261a2fe8f
Create Date: 2026-11-04 20:15:23.477424

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '858915c17d5e'
down_revision: Union[str, Sequence[str], None] = 'ea2261a2fe8f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        'graphs',
        'x_axis',
        existing_type=postgresql.ARRAY(sa.VARCHAR()),
        type_=sa.String(),
        existing_nullable=False,
        postgresql_using='x_axis[1]::varchar'
    )


def downgrade() -> None:
    op.alter_column(
        'graphs',
        'x_axis',
        existing_type=sa.String(),
        type_=postgresql.ARRAY(sa.VARCHAR()),
        existing_nullable=False,
        postgresql_using='ARRAY[x_axis]'
    )
