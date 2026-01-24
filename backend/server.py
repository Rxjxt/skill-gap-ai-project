from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 720

# Security
security = HTTPBearer()

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TokenResponse(BaseModel):
    token: str
    user: User

class Skill(BaseModel):
    name: str
    category: str
    level: str = "Beginner"  # Beginner, Intermediate, Advanced

class CareerRole(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    required_skills: List[Skill]
    average_salary: str
    growth_rate: str

class SkillAssessment(BaseModel):
    skill_name: str
    current_level: int  # 1-5

class SkillAssessmentCreate(BaseModel):
    career_role_id: str
    skills: List[SkillAssessment]

class SkillAssessmentResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    career_role_id: str
    skills: List[SkillAssessment]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class GapAnalysis(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    career_role_id: str
    skill_gaps: List[dict]
    readiness_score: float
    ai_insights: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LearningResource(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    url: str
    type: str  # Video, Article, Course, Tutorial
    difficulty: str  # Beginner, Intermediate, Advanced
    skills: List[str]
    duration: str

class RoadmapItem(BaseModel):
    skill: str
    priority: str  # High, Medium, Low
    estimated_time: str
    resources: List[str]
    milestones: List[str]

class LearningRoadmap(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    career_role_id: str
    roadmap_items: List[RoadmapItem]
    total_duration: str
    ai_recommendations: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ProgressUpdate(BaseModel):
    skill: str
    progress: int  # 0-100
    notes: str = ""

class Progress(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    career_role_id: str
    skill_progress: List[dict]
    overall_progress: int
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Auth Helpers
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str) -> str:
    expiration = datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    payload = {"user_id": user_id, "exp": expiration}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_token(token: str) -> str:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload["user_id"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    token = credentials.credentials
    return decode_token(token)

# Auth Endpoints
@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserRegister):
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_dict = {
        "id": str(uuid.uuid4()),
        "name": user_data.name,
        "email": user_data.email,
        "password": hash_password(user_data.password),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user_dict)
    user = User(id=user_dict["id"], name=user_dict["name"], email=user_dict["email"])
    token = create_token(user_dict["id"])
    
    return TokenResponse(token=token, user=user)

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user_doc = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user_doc or not verify_password(credentials.password, user_doc["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user = User(id=user_doc["id"], name=user_doc["name"], email=user_doc["email"])
    token = create_token(user_doc["id"])
    
    return TokenResponse(token=token, user=user)

@api_router.get("/auth/me", response_model=User)
async def get_me(user_id: str = Depends(get_current_user)):
    user_doc = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**user_doc)

# Career Roles Endpoints
@api_router.get("/roles", response_model=List[CareerRole])
async def get_roles():
    roles = await db.career_roles.find({}, {"_id": 0}).to_list(100)
    return roles

@api_router.get("/roles/{role_id}", response_model=CareerRole)
async def get_role(role_id: str):
    role = await db.career_roles.find_one({"id": role_id}, {"_id": 0})
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    return role

# Skill Assessment Endpoints
@api_router.post("/assessments", response_model=SkillAssessmentResponse)
async def create_assessment(assessment: SkillAssessmentCreate, user_id: str = Depends(get_current_user)):
    assessment_dict = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "career_role_id": assessment.career_role_id,
        "skills": [s.model_dump() for s in assessment.skills],
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.assessments.insert_one(assessment_dict)
    return SkillAssessmentResponse(**assessment_dict)

@api_router.get("/assessments", response_model=List[SkillAssessmentResponse])
async def get_assessments(user_id: str = Depends(get_current_user)):
    assessments = await db.assessments.find({"user_id": user_id}, {"_id": 0}).to_list(100)
    return assessments

# Gap Analysis Endpoint (AI-Powered)
@api_router.post("/analysis/gap", response_model=GapAnalysis)
async def analyze_gap(assessment_id: str, user_id: str = Depends(get_current_user)):
    assessment = await db.assessments.find_one({"id": assessment_id, "user_id": user_id}, {"_id": 0})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    role = await db.career_roles.find_one({"id": assessment["career_role_id"]}, {"_id": 0})
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    
    # AI Analysis
    api_key = os.environ.get('EMERGENT_LLM_KEY')
    chat = LlmChat(
        api_key=api_key,
        session_id=f"gap_analysis_{assessment_id}",
        system_message="You are an expert career advisor and skill gap analyst. Provide detailed, actionable insights."
    ).with_model("openai", "gpt-5.2")
    
    prompt = f"""Analyze the skill gap for a student targeting the {role['title']} role.

Required Skills for {role['title']}:
{chr(10).join([f"- {s['name']} ({s['level']}): {s['category']}" for s in role['required_skills']])}

Student's Current Skills:
{chr(10).join([f"- {s['skill_name']}: Level {s['current_level']}/5" for s in assessment['skills']])}

Provide:
1. Detailed skill gap analysis
2. Priority areas for improvement
3. Realistic timeline estimate
4. Specific actionable advice

Keep response under 300 words."""
    
    user_message = UserMessage(text=prompt)
    ai_response = await chat.send_message(user_message)
    
    # Calculate gaps and readiness
    skill_gaps = []
    total_required = len(role['required_skills'])
    skills_dict = {s['skill_name']: s['current_level'] for s in assessment['skills']}
    
    readiness_sum = 0
    for req_skill in role['required_skills']:
        current = skills_dict.get(req_skill['name'], 0)
        required = 3 if req_skill['level'] == 'Beginner' else 4 if req_skill['level'] == 'Intermediate' else 5
        gap = max(0, required - current)
        readiness_sum += min(current / required * 100, 100)
        
        if gap > 0:
            skill_gaps.append({
                "skill": req_skill['name'],
                "category": req_skill['category'],
                "current_level": current,
                "required_level": required,
                "gap": gap,
                "priority": "High" if gap >= 3 else "Medium" if gap >= 2 else "Low"
            })
    
    readiness_score = round(readiness_sum / total_required, 1)
    
    analysis_dict = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "career_role_id": assessment["career_role_id"],
        "skill_gaps": skill_gaps,
        "readiness_score": readiness_score,
        "ai_insights": ai_response,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.gap_analyses.insert_one(analysis_dict)
    return GapAnalysis(**analysis_dict)

# Roadmap Generation Endpoint (AI-Powered)
@api_router.post("/roadmap/generate", response_model=LearningRoadmap)
async def generate_roadmap(analysis_id: str, user_id: str = Depends(get_current_user)):
    analysis = await db.gap_analyses.find_one({"id": analysis_id, "user_id": user_id}, {"_id": 0})
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    
    role = await db.career_roles.find_one({"id": analysis["career_role_id"]}, {"_id": 0})
    
    # AI Roadmap Generation
    api_key = os.environ.get('EMERGENT_LLM_KEY')
    chat = LlmChat(
        api_key=api_key,
        session_id=f"roadmap_{analysis_id}",
        system_message="You are an expert learning path designer. Create structured, realistic learning roadmaps."
    ).with_model("openai", "gpt-5.2")
    
    gaps_text = chr(10).join([f"- {g['skill']} (Gap: {g['gap']}, Priority: {g['priority']})" for g in analysis['skill_gaps']])
    
    prompt = f"""Create a detailed learning roadmap for a student targeting {role['title']}.

Skill Gaps to Address:
{gaps_text}

For each skill gap, provide:
1. Estimated learning time (be realistic)
2. Key milestones (3-4 specific achievements)
3. Learning approach recommendation

Format your response as a structured learning plan. Keep it actionable and motivating."""
    
    user_message = UserMessage(text=prompt)
    ai_recommendations = await chat.send_message(user_message)
    
    # Generate roadmap items
    roadmap_items = []
    total_weeks = 0
    
    for gap in sorted(analysis['skill_gaps'], key=lambda x: 0 if x['priority'] == 'High' else 1 if x['priority'] == 'Medium' else 2):
        weeks = gap['gap'] * 2  # 2 weeks per gap level
        total_weeks += weeks
        
        roadmap_items.append({
            "skill": gap['skill'],
            "priority": gap['priority'],
            "estimated_time": f"{weeks} weeks",
            "resources": [],
            "milestones": [
                f"Complete beginner tutorials for {gap['skill']}",
                f"Build 2-3 practice projects using {gap['skill']}",
                f"Achieve intermediate proficiency in {gap['skill']}"
            ]
        })
    
    roadmap_dict = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "career_role_id": analysis["career_role_id"],
        "roadmap_items": roadmap_items,
        "total_duration": f"{total_weeks} weeks (~{total_weeks//4} months)",
        "ai_recommendations": ai_recommendations,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.roadmaps.insert_one(roadmap_dict)
    return LearningRoadmap(**roadmap_dict)

@api_router.get("/roadmap", response_model=List[LearningRoadmap])
async def get_roadmaps(user_id: str = Depends(get_current_user)):
    roadmaps = await db.roadmaps.find({"user_id": user_id}, {"_id": 0}).to_list(100)
    return roadmaps

# Resources Endpoints
@api_router.get("/resources", response_model=List[LearningResource])
async def get_resources(skill: Optional[str] = None, difficulty: Optional[str] = None):
    query = {}
    if skill:
        query["skills"] = skill
    if difficulty:
        query["difficulty"] = difficulty
    
    resources = await db.resources.find(query, {"_id": 0}).to_list(100)
    return resources

# Progress Endpoints
@api_router.post("/progress", response_model=Progress)
async def update_progress(progress_data: ProgressUpdate, career_role_id: str, user_id: str = Depends(get_current_user)):
    existing = await db.progress.find_one({"user_id": user_id, "career_role_id": career_role_id}, {"_id": 0})
    
    if existing:
        # Update existing progress
        skill_progress = existing.get('skill_progress', [])
        found = False
        for sp in skill_progress:
            if sp['skill'] == progress_data.skill:
                sp['progress'] = progress_data.progress
                sp['notes'] = progress_data.notes
                sp['updated_at'] = datetime.now(timezone.utc).isoformat()
                found = True
                break
        
        if not found:
            skill_progress.append({
                "skill": progress_data.skill,
                "progress": progress_data.progress,
                "notes": progress_data.notes,
                "updated_at": datetime.now(timezone.utc).isoformat()
            })
        
        overall = sum(sp['progress'] for sp in skill_progress) // len(skill_progress) if skill_progress else 0
        
        await db.progress.update_one(
            {"user_id": user_id, "career_role_id": career_role_id},
            {"$set": {"skill_progress": skill_progress, "overall_progress": overall, "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
        
        updated = await db.progress.find_one({"user_id": user_id, "career_role_id": career_role_id}, {"_id": 0})
        return Progress(**updated)
    else:
        # Create new progress
        progress_dict = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "career_role_id": career_role_id,
            "skill_progress": [{
                "skill": progress_data.skill,
                "progress": progress_data.progress,
                "notes": progress_data.notes,
                "updated_at": datetime.now(timezone.utc).isoformat()
            }],
            "overall_progress": progress_data.progress,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }
        
        await db.progress.insert_one(progress_dict)
        return Progress(**progress_dict)

@api_router.get("/progress", response_model=List[Progress])
async def get_progress(user_id: str = Depends(get_current_user)):
    progress = await db.progress.find({"user_id": user_id}, {"_id": 0}).to_list(100)
    return progress

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()