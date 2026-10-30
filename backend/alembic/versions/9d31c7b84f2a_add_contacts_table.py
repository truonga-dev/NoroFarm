"""Add contacts table.

Revision ID: 9d31c7b84f2a
Revises: 7b4a949bb1eb
Create Date: 2026-10-30 09:55:00
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "9d31c7b84f2a"
down_revision: Union[str, Sequence[str], None] = "7b4a949bb1eb"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "contacts",
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("phone", sa.String(length=20), nullable=True),
        sa.Column("subject", sa.String(length=255), nullable=False),
        sa.Column("message", sa.Text(), nullable=False),
        sa.Column("reply_content", sa.Text(), nullable=True),
        sa.Column("is_replied", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("replied_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("contacts")
