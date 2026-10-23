"""Add notifications and price alerts

Revision ID: f7d8c9b0a1e2
Revises: a1b2c3d4e5f6
Create Date: 2026-07-15 10:45:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f7d8c9b0a1e2'
down_revision = 'a1b2c3d4e5f6'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('notification',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('is_read', sa.Boolean(), nullable=False, default=False),
        sa.Column('type', sa.String(length=50), nullable=False, default='system'),
        sa.Column('link', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_notification_user_id'), 'notification', ['user_id'], unique=False)

    op.create_table('price_alert',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('commodity_id', sa.Integer(), nullable=False),
        sa.Column('target_price', sa.Float(), nullable=False),
        sa.Column('condition', sa.String(length=20), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, default=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(['commodity_id'], ['commodity.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_price_alert_commodity_id'), 'price_alert', ['commodity_id'], unique=False)
    op.create_index(op.f('ix_price_alert_user_id'), 'price_alert', ['user_id'], unique=False)


def downgrade():
    op.drop_index(op.f('ix_price_alert_user_id'), table_name='price_alert')
    op.drop_index(op.f('ix_price_alert_commodity_id'), table_name='price_alert')
    op.drop_table('price_alert')
    
    op.drop_index(op.f('ix_notification_user_id'), table_name='notification')
    op.drop_table('notification')
