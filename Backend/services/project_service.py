import logging
from models.project import Project
from schemas.project import ProjectCreate
from utils.database import db_connection

logger = logging.getLogger(__name__)

class ProjectService:
    @staticmethod
    async def create_project(project_data: ProjectCreate) -> Project:
        project_dict = project_data.model_dump()
        logger.info(f"Attempting to insert project: {project_dict}")
        result = await db_connection.db.get_collection("projects").insert_one(project_dict)
        project = await db_connection.db.get_collection("projects").find_one({"_id": result.inserted_id})
        return Project(**project)

    @staticmethod
    async def get_approved_projects():
        projects = await db_connection.db.get_collection("projects").find({"status": "approved"}).to_list(100)
        return [Project(**project) for project in projects]

    @staticmethod
    async def get_pending_projects():
        projects = await db_connection.db.get_collection("projects").find({"status": "pending"}).to_list(100)
        return [Project(**project) for project in projects]

    @staticmethod
    async def approve_project(project_id: str):
        from bson import ObjectId
        await db_connection.db.get_collection("projects").update_one(
            {"_id": ObjectId(project_id)},
            {"$set": {"status": "approved"}}
        )

    @staticmethod
    async def update_project_impact_score(project_id: str, impact_score: int):
        from bson import ObjectId
        await db_connection.db.get_collection("projects").update_one(
            {"_id": ObjectId(project_id)},
            {"$set": {"impactScore": impact_score}}
        )

    @staticmethod
    async def get_donor_count_for_project(project_id: str) -> int:
        """Get the number of unique donors for a project"""
        donations_collection = db_connection.db.get_collection("donations")
        donor_count = await donations_collection.count_documents({"project_id": project_id})
        return donor_count
