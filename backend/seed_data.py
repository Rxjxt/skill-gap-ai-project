import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def seed_career_roles():
    """Seed sample career roles with required skills"""
    
    existing = await db.career_roles.count_documents({})
    if existing > 0:
        print("Career roles already seeded")
        return
    
    roles = [
        {
            "id": "role_001",
            "title": "Full Stack Developer",
            "description": "Build end-to-end web applications with modern technologies. Handle both frontend and backend development.",
            "required_skills": [
                {"name": "HTML/CSS", "category": "Frontend", "level": "Intermediate"},
                {"name": "JavaScript", "category": "Frontend", "level": "Advanced"},
                {"name": "React", "category": "Frontend", "level": "Intermediate"},
                {"name": "Node.js", "category": "Backend", "level": "Intermediate"},
                {"name": "REST APIs", "category": "Backend", "level": "Intermediate"},
                {"name": "MongoDB", "category": "Database", "level": "Beginner"},
                {"name": "Git", "category": "Tools", "level": "Intermediate"},
            ],
            "average_salary": "$75,000 - $120,000",
            "growth_rate": "22% (Much faster than average)"
        },
        {
            "id": "role_002",
            "title": "Data Scientist",
            "description": "Analyze complex data to help companies make better decisions using statistical analysis and machine learning.",
            "required_skills": [
                {"name": "Python", "category": "Programming", "level": "Advanced"},
                {"name": "Statistics", "category": "Mathematics", "level": "Advanced"},
                {"name": "Machine Learning", "category": "AI/ML", "level": "Intermediate"},
                {"name": "SQL", "category": "Database", "level": "Intermediate"},
                {"name": "Data Visualization", "category": "Analytics", "level": "Intermediate"},
                {"name": "Pandas/NumPy", "category": "Libraries", "level": "Intermediate"},
                {"name": "Deep Learning", "category": "AI/ML", "level": "Beginner"},
            ],
            "average_salary": "$95,000 - $150,000",
            "growth_rate": "36% (Much faster than average)"
        },
        {
            "id": "role_003",
            "title": "UI/UX Designer",
            "description": "Create user-friendly and visually appealing digital experiences. Focus on user research and interface design.",
            "required_skills": [
                {"name": "Figma", "category": "Design Tools", "level": "Advanced"},
                {"name": "User Research", "category": "Research", "level": "Intermediate"},
                {"name": "Wireframing", "category": "Design", "level": "Intermediate"},
                {"name": "Prototyping", "category": "Design", "level": "Intermediate"},
                {"name": "Visual Design", "category": "Design", "level": "Advanced"},
                {"name": "HTML/CSS", "category": "Frontend", "level": "Beginner"},
                {"name": "Design Systems", "category": "Design", "level": "Intermediate"},
            ],
            "average_salary": "$70,000 - $110,000",
            "growth_rate": "16% (Much faster than average)"
        },
        {
            "id": "role_004",
            "title": "Cloud Engineer",
            "description": "Design and manage cloud infrastructure. Ensure scalability, security, and reliability of cloud systems.",
            "required_skills": [
                {"name": "AWS/Azure/GCP", "category": "Cloud Platforms", "level": "Intermediate"},
                {"name": "Linux", "category": "Operating Systems", "level": "Intermediate"},
                {"name": "Docker", "category": "DevOps", "level": "Intermediate"},
                {"name": "Kubernetes", "category": "DevOps", "level": "Intermediate"},
                {"name": "CI/CD", "category": "DevOps", "level": "Intermediate"},
                {"name": "Networking", "category": "Infrastructure", "level": "Beginner"},
                {"name": "Security", "category": "Infrastructure", "level": "Beginner"},
            ],
            "average_salary": "$85,000 - $140,000",
            "growth_rate": "32% (Much faster than average)"
        },
        {
            "id": "role_005",
            "title": "Mobile App Developer",
            "description": "Create native or cross-platform mobile applications for iOS and Android. Focus on performance and UX.",
            "required_skills": [
                {"name": "React Native/Flutter", "category": "Mobile", "level": "Intermediate"},
                {"name": "JavaScript/Dart", "category": "Programming", "level": "Intermediate"},
                {"name": "Mobile UI/UX", "category": "Design", "level": "Intermediate"},
                {"name": "REST APIs", "category": "Backend", "level": "Intermediate"},
                {"name": "State Management", "category": "Architecture", "level": "Intermediate"},
                {"name": "App Store Publishing", "category": "Deployment", "level": "Beginner"},
                {"name": "Mobile Testing", "category": "Testing", "level": "Beginner"},
            ],
            "average_salary": "$80,000 - $130,000",
            "growth_rate": "22% (Much faster than average)"
        },
        {
            "id": "role_006",
            "title": "Cybersecurity Analyst",
            "description": "Protect organizations from cyber threats. Monitor security systems and respond to incidents.",
            "required_skills": [
                {"name": "Network Security", "category": "Security", "level": "Intermediate"},
                {"name": "Ethical Hacking", "category": "Security", "level": "Intermediate"},
                {"name": "Security Tools", "category": "Tools", "level": "Intermediate"},
                {"name": "Incident Response", "category": "Security", "level": "Intermediate"},
                {"name": "Risk Assessment", "category": "Security", "level": "Intermediate"},
                {"name": "Cryptography", "category": "Security", "level": "Beginner"},
                {"name": "Compliance", "category": "Security", "level": "Beginner"},
            ],
            "average_salary": "$85,000 - $135,000",
            "growth_rate": "35% (Much faster than average)"
        }
    ]
    
    await db.career_roles.insert_many(roles)
    print(f"Seeded {len(roles)} career roles")

async def seed_learning_resources():
    """Seed sample learning resources"""
    
    existing = await db.resources.count_documents({})
    if existing > 0:
        print("Learning resources already seeded")
        return
    
    resources = [
        {
            "id": "res_001",
            "title": "JavaScript Fundamentals Course",
            "description": "Master JavaScript basics including variables, functions, and DOM manipulation",
            "url": "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
            "type": "Course",
            "difficulty": "Beginner",
            "skills": ["JavaScript"],
            "duration": "300 hours"
        },
        {
            "id": "res_002",
            "title": "React Complete Guide",
            "description": "Learn React from scratch including hooks, context, and modern patterns",
            "url": "https://react.dev/learn",
            "type": "Tutorial",
            "difficulty": "Intermediate",
            "skills": ["React", "JavaScript"],
            "duration": "40 hours"
        },
        {
            "id": "res_003",
            "title": "Python for Data Science",
            "description": "Complete Python course focused on data analysis and visualization",
            "url": "https://www.kaggle.com/learn/python",
            "type": "Course",
            "difficulty": "Beginner",
            "skills": ["Python", "Pandas/NumPy"],
            "duration": "20 hours"
        },
        {
            "id": "res_004",
            "title": "Machine Learning Specialization",
            "description": "Andrew Ng's comprehensive machine learning course",
            "url": "https://www.coursera.org/specializations/machine-learning",
            "type": "Course",
            "difficulty": "Intermediate",
            "skills": ["Machine Learning", "Python"],
            "duration": "3 months"
        },
        {
            "id": "res_005",
            "title": "Figma UI Design Tutorial",
            "description": "Learn professional UI design with Figma from basics to advanced",
            "url": "https://www.youtube.com/watch?v=FTFaQWZBqQ8",
            "type": "Video",
            "difficulty": "Beginner",
            "skills": ["Figma", "Visual Design"],
            "duration": "5 hours"
        },
        {
            "id": "res_006",
            "title": "AWS Cloud Practitioner",
            "description": "Get started with AWS cloud services and architecture",
            "url": "https://aws.amazon.com/training/",
            "type": "Course",
            "difficulty": "Beginner",
            "skills": ["AWS/Azure/GCP"],
            "duration": "20 hours"
        },
        {
            "id": "res_007",
            "title": "Docker Mastery",
            "description": "Complete Docker guide for containerization and deployment",
            "url": "https://docs.docker.com/get-started/",
            "type": "Tutorial",
            "difficulty": "Intermediate",
            "skills": ["Docker"],
            "duration": "15 hours"
        },
        {
            "id": "res_008",
            "title": "SQL for Beginners",
            "description": "Learn database queries and data manipulation with SQL",
            "url": "https://www.khanacademy.org/computing/computer-programming/sql",
            "type": "Course",
            "difficulty": "Beginner",
            "skills": ["SQL", "MongoDB"],
            "duration": "10 hours"
        }
    ]
    
    await db.resources.insert_many(resources)
    print(f"Seeded {len(resources)} learning resources")

async def main():
    print("Starting database seeding...")
    await seed_career_roles()
    await seed_learning_resources()
    print("Database seeding completed!")
    client.close()

if __name__ == "__main__":
    asyncio.run(main())