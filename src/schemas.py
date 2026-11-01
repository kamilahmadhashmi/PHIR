"""Pydantic v2 schemas for request validation and response serialization.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


# Profiles
class ProfileBase(BaseModel):
    role: str
    name: str
    locality: str = "Delhi"
    contact: Optional[str] = None


class ProfileCreate(ProfileBase):
    id: Optional[str] = None
    latitude: Optional[float] = 28.6139
    longitude: Optional[float] = 77.2090
    supportedMaterials: Optional[List[str]] = None


class ProfileResponse(ProfileBase):
    id: str
    latitude: float
    longitude: float
    radiusKm: float = 25.0
    supportedMaterials: List[str] = []
    rating: float = 4.8
    priceFactor: float = 1.0
    isDemo: bool = True
    createdAt: Optional[str] = None


# Materials
class MaterialCreate(BaseModel):
    userId: str
    materialType: str
    quantityKg: float = Field(..., gt=0)


class MaterialUpdate(BaseModel):
    userId: str
    quantityKg: float = Field(..., gt=0)


class MaterialDelete(BaseModel):
    userId: str


class MaterialResponse(BaseModel):
    id: str
    materialType: str
    quantityKg: float
    actualQuantityKg: Optional[float] = None
    estimatedValueInr: float
    actualValueInr: Optional[float] = None
    status: str
    sourceId: Optional[str] = None
    currentHolderId: Optional[str] = None
    createdAt: Optional[str] = None


# Collection Requests
class CollectionRequestCreate(BaseModel):
    householdId: str
    materialIds: Optional[List[str]] = None


class CollectionRequestResponse(BaseModel):
    id: str
    householdId: str
    assignedKabadiwalaId: Optional[str] = None
    status: str
    isDemo: bool = True
    latitude: float
    longitude: float
    quantityByType: Dict[str, float] = {}
    materialIds: List[str] = []
    estimatedValueInr: float
    actualValueInr: Optional[float] = None
    region: str = "Delhi"
    regionId: Optional[str] = None
    createdAt: Optional[str] = None


class CollectionAccept(BaseModel):
    kabadiwalaId: str


class CollectionComplete(BaseModel):
    kabadiwalaId: str
    actualKg: Optional[float] = None
    contaminationPct: Optional[float] = Field(0.0, ge=0.0, le=100.0)
    notes: Optional[str] = None


# Recycler Requirements
class RequirementCreate(BaseModel):
    recyclerId: str
    materialType: str
    requiredQuantityKg: float = Field(..., gt=0)
    minimumQuantityKg: float = Field(0.0, ge=0)


class RequirementResponse(BaseModel):
    id: str
    recyclerId: str
    materialType: str
    requiredQuantityKg: float
    minimumQuantityKg: float
    fulfilledQuantityKg: float
    status: str
    createdAt: Optional[str] = None


# Bookings
class BookingCreate(BaseModel):
    recyclerId: str
    kabadiwalaId: str
    materialType: str
    quantityKg: float = Field(..., gt=0)
    requirementId: Optional[str] = None


class BookingResponse(BaseModel):
    id: str
    recyclerId: str
    kabadiwalaId: str
    requirementId: Optional[str] = None
    materialType: str
    quantityKg: float
    materialIds: List[str] = []
    status: str
    createdAt: Optional[str] = None


class BookingConfirm(BaseModel):
    recyclerId: str


# Dashboards
class HouseholdDashboardResponse(BaseModel):
    profile: ProfileResponse
    inventory: List[MaterialResponse]
    activeRequest: Optional[CollectionRequestResponse] = None
    metrics: Dict[str, Any]
    rateCards: Dict[str, float]


class CollectorDashboardResponse(BaseModel):
    profile: ProfileResponse
    inventory: List[Dict[str, Any]]
    activeRequests: List[CollectionRequestResponse]
    metrics: Dict[str, Any]
    areas: List[Dict[str, Any]]


class RecyclerDashboardResponse(BaseModel):
    profile: ProfileResponse
    requirements: List[RequirementResponse]
    bookings: List[BookingResponse]
    availableMaterial: List[Dict[str, Any]]
    metrics: Dict[str, Any]


# Image Classification
class ImageDetection(BaseModel):
    materialType: str
    confidence: float = 0.95
    requiresConfirmation: bool = True


class ClassifyImageResponse(BaseModel):
    detections: List[ImageDetection]
    mode: str = "demo"
