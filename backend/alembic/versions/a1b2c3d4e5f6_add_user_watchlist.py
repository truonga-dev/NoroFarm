"""Add user_watchlist

Revision ID: a1b2c3d4e5f6
Revises: 719291ea2d5e
Create Date: 2026-07-15 10:42:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a1b2c3d4e5f6'
down_revision = '719291ea2d5e'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('user_watchlist',
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('commodity_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['commodity_id'], ['commodity.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('user_id', 'commodity_id')
    )


def downgrade():
    op.drop_table('user_watchlist')
