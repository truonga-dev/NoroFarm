"""Add push subscriptions and payment transactions.

Revision ID: c842a9f13d77
Revises: 9d31c7b84f2a
Create Date: 2026-10-30 10:05:00
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "c842a9f13d77"
down_revision: Union[str, Sequence[str], None] = "9d31c7b84f2a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "web_push_subscription",
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("endpoint", sa.Text(), nullable=False),
        sa.Column("p256dh", sa.String(length=255), nullable=False),
        sa.Column("auth", sa.String(length=255), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["user.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("endpoint"),
    )
    op.create_index(
        "ix_web_push_subscription_user_id",
        "web_push_subscription",
        ["user_id"],
        unique=False,
    )

    op.create_table(
        "payment_transactions",
        sa.Column("order_id", sa.Integer(), nullable=False),
        sa.Column("stripe_session_id", sa.String(length=255), nullable=True),
        sa.Column("stripe_charge_id", sa.String(length=255), nullable=True),
        sa.Column("stripe_customer_id", sa.String(length=255), nullable=True),
        sa.Column("amount", sa.Float(), nullable=False),
        sa.Column("currency", sa.String(length=10), nullable=True),
        sa.Column("status", sa.String(length=50), nullable=False),
        sa.Column("payment_method_types", sa.JSON(), nullable=True),
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["order_id"], ["orders.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        "ix_payment_transactions_stripe_session_id",
        "payment_transactions",
        ["stripe_session_id"],
        unique=True,
    )
    op.create_index(
        "ix_payment_transactions_stripe_charge_id",
        "payment_transactions",
        ["stripe_charge_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        "ix_payment_transactions_stripe_charge_id",
        table_name="payment_transactions",
    )
    op.drop_index(
        "ix_payment_transactions_stripe_session_id",
        table_name="payment_transactions",
    )
    op.drop_table("payment_transactions")
    op.drop_index(
        "ix_web_push_subscription_user_id",
        table_name="web_push_subscription",
    )
    op.drop_table("web_push_subscription")
