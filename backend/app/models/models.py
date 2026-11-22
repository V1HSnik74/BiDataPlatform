from datetime import datetime

from sqlalchemy import BigInteger, String, ARRAY, ForeignKey, Integer, DateTime, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, relationship, mapped_column
from typing import List, Optional

from app.db.base import Base

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    login: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String, nullable=False)
    role: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    phone_num: Mapped[Optional[str]] = mapped_column(String, unique=True)
    scope: Mapped[str] = mapped_column(String, nullable=False)
    department: Mapped[Optional[str]] = mapped_column(String)
    uploads = relationship("Upload", back_populates="user", cascade="all, delete-orphan")
    graphs = relationship("Graph", back_populates="user", cascade="all, delete-orphan")
    custom_chart_types = relationship("CustomChartType", back_populates="user", cascade="all, delete-orphan")

class Upload(Base):
    __tablename__ = "uploads"
    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    filename: Mapped[str] = mapped_column(String, nullable=False)
    filepath: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    dimensions: Mapped[List[str]] = mapped_column(ARRAY(String), nullable=False)
    measures: Mapped[List[str]] = mapped_column(ARRAY(String), nullable=False)
    department: Mapped[Optional[str]] = mapped_column(String)
    user_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone = True), nullable=False, server_default=func.now())

    user = relationship("User", back_populates="uploads")
    graphs = relationship("Graph", back_populates="upload", cascade="all, delete-orphan")

class Graph(Base):
    __tablename__ = "graphs"
    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    chart_type: Mapped[str] = mapped_column(String, nullable=False)
    x_axis: Mapped[str] = mapped_column(String, nullable=False)
    y_axis: Mapped[List[str]] = mapped_column(ARRAY(String), nullable=False)
    aggregation_func: Mapped[Optional[str]] = mapped_column(String)
    limit: Mapped[Optional[int]] = mapped_column(Integer)
    user_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    constraints: Mapped[Optional[dict]] = mapped_column(JSONB)
    upload_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("uploads.id", ondelete="CASCADE"), nullable=False, index=True)

    user = relationship("User", back_populates="graphs")
    upload = relationship("Upload", back_populates="graphs")


class CustomChartType(Base):
    __tablename__ = "custom_chart_types"
    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    icon: Mapped[str] = mapped_column(String, nullable=False)
    blueprint: Mapped[dict] = mapped_column(JSONB, nullable=False)

    user = relationship("User", back_populates="custom_chart_types")

