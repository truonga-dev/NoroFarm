"""Alter article thumbnail_url to text

Revision ID: e1f2a3b4c5d6
Revises: c842a9f13d77
Create Date: 2026-10-30 11:30:00
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "e1f2a3b4c5d6"
down_revision: Union[str, Sequence[str], None] = "c842a9f13d77"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column(
        "article",
        "thumbnail_url",
        existing_type=sa.String(length=255),
        type_=sa.Text(),
        existing_nullable=True
    )


def downgrade() -> None:
    op.alter_column(
        "article",
        "thumbnail_url",
        existing_type=sa.Text(),
        type_=sa.String(length=255),
        existing_nullable=True
    )
